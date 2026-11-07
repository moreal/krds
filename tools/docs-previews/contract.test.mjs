import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, symlinkSync, mkdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateDefinitions, validateArtifact, validateRanges, validateRegistry, frameworks, pilots, sha256, readContained } from './contract.mjs';
import { writeArtifactManifest } from './manifest.mjs';
const acceptance = JSON.parse(readFileSync('apps/docs/demo-acceptance.json'));
const ids = acceptance.items.map(x => x.componentId);
const expectedIds = [...JSON.parse(readFileSync('catalog/full-catalog-contracts.json')).items.map(x => x.id), ...pilots].sort();
const source = { path: 'example.ts', role: 'example', language: 'typescript', symbolOrBranch: 'Example' };
const all = { schemaVersion: 1, demos: frameworks.flatMap(framework => ids.map(componentId => ({ framework, componentId, exampleId: 'default', ...(framework === 'solid-next' && !pilots.includes(componentId) ? { status: 'unavailable', reason: 'Not exported' } : { status: 'playable', acceptanceId: componentId + '-default', classification: 'interactive', sources: [source] }) }))) };
test('54 explicit acceptance contracts with local state, action, outcome and reset', () => {
    assert.deepEqual([...ids].sort(), expectedIds);
    assert.equal(ids.length, 54);
    assert.equal(new Set(ids).size, 54);
    for (const r of acceptance.items) {
        assert.ok(r.initialState && r.host && r.actions.length && r.observableOutcome && r.resetBaseline, r.componentId);
    }
    assert.match(JSON.stringify(acceptance.items.find(x => x.componentId === 'tts')), /simulation/);
});
test('378 stable + six preview + 48 unavailable defaults', () => { assert.deepEqual(validateDefinitions(all, ids, { complete: true }), { complete: true, defaultCount: 384, unavailableCount: 48 }); });
test('partial never claims completeness and complete rejects missing defaults', () => { const partial = { schemaVersion: 1, demos: [] }; assert.equal(validateDefinitions(partial, ids).complete, false); assert.throws(() => validateDefinitions(partial, ids, { complete: true }), /missing default/); });
test('reject duplicate, splash, unknown keys and unavailable URL', () => {
    for (const change of [d => d.demos.push(d.demos[0]), d => d.demos[0].componentId = 'splash-screen', d => d.demos[0].surprise = true, d => { d.demos.at(-1).entryUrl = '/krds/previews/solid-next/'; }]) {
        const d = structuredClone(all);
        change(d);
        assert.throws(() => validateDefinitions(d, ids));
    }
});
function artifactFixture() {
    const root = mkdtempSync(join(tmpdir(), 'docs-contract-'));
    mkdirSync(join(root, 'out'));
    writeFileSync(join(root, 'example.ts'), 'export const Example = "한";\n');
    writeFileSync(join(root, 'host.ts'), 'Example();');
    writeFileSync(join(root, 'out/index.html'), '<main>Example</main>');
    const definitions = { schemaVersion: 1, demos: [{ framework: 'react', componentId: 'button', exampleId: 'default', status: 'playable', acceptanceId: 'button-default', classification: 'interactive', sources: [source] }] };
    const original = path => ({ path, sha256: sha256(readFileSync(join(root, path))) });
    const bindings = [{ componentId: 'button', exampleId: 'default', entryUrl: '/krds/previews/react/index.html?component=button&example=default', hostPath: 'host.ts', sourcePath: 'example.ts', symbolOrBranch: 'Example', sha256: original('example.ts').sha256 }];
    const modules = { identity: { package: '@unofficial-krds/react', version: '0.1.0', renderer: 'react-dom@19', compiler: 'vite@8' }, inputs: [{ id: 'virtual:compiled-example', package: 'fixture-react', version: '0.0.0', sha256: sha256('transformed code'), originals: [original('example.ts'), original('host.ts')] }] };
    const manifest = writeArtifactManifest({ root, framework: 'react', outputDir: join(root, 'out'), bindings, modules, definitions });
    return { root, definitions, manifest };
}
test('captured original source/host membership and compile-time freshness', () => {
    const { root, definitions, manifest } = artifactFixture();
    validateArtifact(manifest, definitions, { root, outputDir: join(root, 'out') });
    for (const remove of ['example.ts', 'host.ts']) {
        const bad = structuredClone(manifest);
        bad.modules[0].originals = bad.modules[0].originals.filter(x => x.path !== remove);
        assert.throws(() => validateArtifact(bad, definitions, { root }), /missing compiled input/);
    }
    writeFileSync(join(root, 'example.ts'), 'changed after compilation');
    assert.throws(() => validateArtifact(manifest, definitions, { root }), /stale compiled input/);
});
test('reject unknown/duplicate bindings, missing entry HTML and mismatched entry identity', () => {
    const { root, definitions, manifest } = artifactFixture();
    const cases = { unknown: m => m.bindings[0].componentId = 'unknown', duplicate: m => m.bindings.push({ ...m.bindings[0] }), missingHtml: m => m.files[0].path = 'not-an-entry.txt', wrongPair: m => m.bindings[0].entryUrl = '/krds/previews/react/index.html?component=tabs&example=default', wrongDocument: m => m.bindings[0].entryUrl = '/krds/previews/react/missing.html', badIdentity: m => m.identity.version = [] };
    for (const [name, mutate] of Object.entries(cases)) {
        const bad = structuredClone(manifest);
        mutate(bad);
        assert.throws(() => validateArtifact(bad, definitions, { root }), undefined, name);
    }
    symlinkSync('example.ts', join(root, 'linked'));
    assert.throws(() => readContained(root, 'linked'), /symlink/);
});
test('definition and artifact ranges must match exactly and validate bytes', () => {
    const { root, definitions, manifest } = artifactFixture();
    const bytes = readFileSync(join(root, 'example.ts'));
    const range = { start: 0, end: 6, sha256: sha256(bytes.subarray(0, 6)), startLine: 1, endLine: 1 };
    for (const variant of ['omittedBinding', 'omittedDefinition', 'forgedDefinition', 'differentDefinition', 'invalidBinding']) {
        const m = structuredClone(manifest), d = structuredClone(definitions);
        m.bindings[0].ranges = [range];
        d.demos[0].sources[0].ranges = [range];
        if (variant === 'omittedBinding')
            delete m.bindings[0].ranges;
        if (variant === 'omittedDefinition')
            delete d.demos[0].sources[0].ranges;
        if (variant === 'forgedDefinition')
            d.demos[0].sources[0].ranges = [{ ...range, sha256: '0'.repeat(64) }];
        if (variant === 'differentDefinition')
            d.demos[0].sources[0].ranges = [{ ...range, end: 5, sha256: sha256(bytes.subarray(0, 5)) }];
        if (variant === 'invalidBinding')
            m.bindings[0].ranges = [{ ...range, end: 999 }];
        assert.throws(() => validateArtifact(m, d, { root }), undefined, variant);
    }
});
test('UTF-8 ranges bind exact byte boundaries, hashes and line spans', () => {
    const b = Buffer.from('한\nx');
    const range = { start: 0, end: 3, sha256: sha256(b.subarray(0, 3)), startLine: 1, endLine: 1 };
    validateRanges(b, [range], 'example');
    for (const r of [{ ...range, start: 1 }, { ...range, end: 2 }, { ...range, sha256: '0'.repeat(64) }, { ...range, endLine: 2 }])
        assert.throws(() => validateRanges(b, [r], 'example'));
});
test('registry rejects unavailable URLs and arbitrary entry URLs', () => {
    const d = { status: 'unavailable', framework: 'solid-next', componentId: 'badge', exampleId: 'default', label: 'Solid 2', channel: 'preview', package: '@unofficial-krds/solid-next', packageVersion: '0.1.0', reason: 'Not exported' };
    validateRegistry([d]);
    assert.throws(() => validateRegistry([{ ...d, framework: 'react', channel: 'stable' }]), /invalid unavailable/);
    assert.throws(() => validateRegistry([{ ...d, componentId: 'button' }]), /invalid unavailable/);
    assert.throws(() => validateRegistry([{ ...d, entryUrl: 'https://example.com' }]), /unknown key/);
});
test('browser protocol strict messages and transport identity', async () => {
    const { parsePreviewMessage, parsePreviewInit, matchesPreviewEvent } = await import('./protocol.ts');
    const identity = { version: 1, framework: 'react', componentId: 'button', exampleId: 'default', token: '0123456789abcdef' };
    const ready = { ...identity, type: 'ready' };
    assert.deepEqual(parsePreviewMessage(ready), ready);
    for (const v of [{ ...ready, url: 'https://x' }, { ...ready, type: 'size', height: NaN }, { ...ready, type: 'size', height: Infinity }, { ...ready, framework: 'foreign' }, { ...ready, token: 'x' }])
        assert.equal(parsePreviewMessage(v), null);
    const source = {};
    assert.deepEqual(matchesPreviewEvent({ origin: 'https://local', source, data: ready }, 'https://local', source, identity), ready);
    assert.equal(matchesPreviewEvent({ origin: 'https://other', source, data: ready }, 'https://local', source, identity), null);
    assert.equal(matchesPreviewEvent({ origin: 'https://local', source, data: { ...ready, token: 'fedcba9876543210' } }, 'https://local', source, identity), null);
    assert.ok(parsePreviewInit({ ...identity, type: 'init', presentation: { colorMode: 'light', reducedMotion: true } }));
    assert.equal(parsePreviewInit({ ...identity, type: 'init', presentation: { colorMode: 'dark', reducedMotion: true } }), null);
});
test('registry rejects malformed identity, unknown catalog and unsafe source ranges/URLs', () => {
    const base = { status: 'unavailable', framework: 'solid-next', componentId: 'badge', exampleId: 'default', label: 'Solid 2', channel: 'preview', package: '@unofficial-krds/solid-next', packageVersion: '0.1.0', reason: 'Not exported' };
    for (const [key, value] of Object.entries({ componentId: 'not-in-catalog', exampleId: 2, label: true, package: {}, packageVersion: [], reason: {} }))
        assert.throws(() => validateRegistry([{ ...base, [key]: value }]), undefined, key);
    const playable = { ...base, status: 'playable', framework: 'react', channel: 'stable', componentId: 'button', entryUrl: '/krds/previews/react/index.html?component=button&example=default', artifactSha256: 'a'.repeat(64), minHeight: 240, layout: 'inline', acceptanceId: 'button-default', classification: 'interactive', sources: [{ ...source, sha256: 'a'.repeat(64), downloadUrl: '/krds/demo-sources/example.ts.txt' }] };
    delete playable.reason;
    validateRegistry([playable]);
    for (const sourceChange of [{ downloadUrl: '/krds/demo-sources/../outside' }, { ranges: {} }, { ranges: [{ start: 4, end: 2, sha256: 'a'.repeat(64), startLine: 1, endLine: 1 }] }])
        assert.throws(() => validateRegistry([{ ...playable, sources: [{ ...playable.sources[0], ...sourceChange }] }]));
});
test('exact unique registry and authoring source sets preserve required host/data files', () => {
    const example = { ...source, sha256: 'a'.repeat(64), downloadUrl: '/krds/demo-sources/example.ts.txt' };
    const base = { status: 'playable', framework: 'react', componentId: 'button', exampleId: 'default', label: 'React', channel: 'stable', package: '@unofficial-krds/react', packageVersion: '0.1.0', entryUrl: '/krds/previews/react/index.html?component=button&example=default', artifactSha256: 'a'.repeat(64), minHeight: 240, layout: 'inline', acceptanceId: 'button-default', classification: 'interactive' };
    for (const role of ['host', 'data']) {
        const required = { path: role === 'host' ? 'host.ts' : 'data.json', role, language: role === 'host' ? 'typescript' : 'json', symbolOrBranch: role };
        const definitions = { schemaVersion: 1, demos: [{ framework: 'react', componentId: 'button', exampleId: 'default', status: 'playable', acceptanceId: 'button-default', classification: 'interactive', sources: [source, required] }] };
        const requiredRegistry = { ...required, sha256: 'a'.repeat(64), downloadUrl: '/krds/demo-sources/' + required.path + '.txt' };
        validateRegistry([{ ...base, sources: [example, requiredRegistry] }], definitions);
        assert.throws(() => validateRegistry([{ ...base, sources: [example, example] }], definitions), /duplicate registry source path/, role);
        const duplicated = structuredClone(definitions);
        duplicated.demos[0].sources = [source, source];
        assert.throws(() => validateDefinitions(duplicated, ids), /duplicate authoring source path/, role);
        assert.throws(() => validateRegistry([{ ...base, entryUrl: base.entryUrl + '?ignored', sources: [example, requiredRegistry] }], definitions), /extra entry URL separator/);
    }
});

test('registry absentReferences must be derived from the acceptance inventory', () => {
    const row = componentId => ({ status: 'playable', framework: 'qwik', componentId, exampleId: 'default', label: 'Qwik', channel: 'stable', package: '@unofficial-krds/qwik', packageVersion: '0.1.0', entryUrl: `/krds/previews/qwik/${componentId}/default/index.html`, artifactSha256: '0'.repeat(64), minHeight: 240, layout: 'inline', acceptanceId: `${componentId}-default`, classification: 'static', sources: [{ ...source, sha256: '1'.repeat(64), downloadUrl: '/krds/demo-sources/example.ts.txt' }] });
    const good = '/krds/previews/qwik/local-assets/intentional-missing-image.svg';
    assert.doesNotThrow(() => validateRegistry([{ ...row('image'), absentReferences: [good] }]));
    for (const bad of [[], ['/krds/previews/qwik/local-assets/other.svg'], ['/krds/previews/react/local-assets/intentional-missing-image.svg'], [good, good], good])
        assert.throws(() => validateRegistry([{ ...row('image'), absentReferences: bad }]), /absent reference/);
    assert.throws(() => validateRegistry([{ ...row('button'), absentReferences: [good] }]), /absent reference/);
});

test('absent reference derives from initialState.failureSpecimen.src; the loaded initialState.src stays required', async () => {
    const { intentionalAbsentReferences } = await import('./contract.mjs');
    const derived = intentionalAbsentReferences(acceptance, 'react');
    assert.deepEqual(derived.get('image'), ['/krds/previews/react/local-assets/intentional-missing-image.svg']);
    assert.ok(![...derived.values()].flat().some(url => url.endsWith('/example-landscape.svg')), 'loaded image must be deployed');
    assert.deepEqual([...derived.keys()], ['image']);
    // A loaded src that is (wrongly) named intentional-missing is never tolerated: only failure specimens are.
    const forged = { items: [{ componentId: 'image', initialState: { src: '/local-assets/intentional-missing-image.svg' } }] };
    assert.equal(intentionalAbsentReferences(forged, 'react').size, 0);
});

test('registry excerpts are index-aligned with ranges and their bytes are hash-checked when sources are readable', () => {
    const full = Buffer.from('import x;\nexport function Tabs() {\n  return 1;\n}\n');
    const start = full.indexOf('export'), end = full.length;
    const range = { start, end, sha256: sha256(full.subarray(start, end)), startLine: 2, endLine: 4 };
    const excerpt = { startLine: 2, endLine: 4, sha256: range.sha256, downloadUrl: `/krds/demo-sources/example.ts.excerpt-${start}-${end}.txt` };
    const files = new Map([['/krds/demo-sources/example.ts.txt', full], [excerpt.downloadUrl, full.subarray(start, end)]]);
    const readSource = url => { if (!files.has(url)) throw new Error('missing ' + url); return files.get(url); };
    const row = sources => ({ status: 'playable', framework: 'react', componentId: 'tabs', exampleId: 'default', label: 'React', channel: 'stable', package: '@unofficial-krds/react', packageVersion: '0.1.0', entryUrl: '/krds/previews/react/index.html?component=tabs&example=default', artifactSha256: 'a'.repeat(64), minHeight: 240, layout: 'inline', acceptanceId: 'tabs-default', classification: 'interactive', sources });
    const good = { ...source, symbolOrBranch: 'Tabs', sha256: sha256(full), downloadUrl: '/krds/demo-sources/example.ts.txt', ranges: [range], excerpts: [excerpt] };
    validateRegistry([row([good])]);
    validateRegistry([row([good])], undefined, { readSource });
    for (const [name, change] of Object.entries({ missingExcerpts: s => delete s.excerpts, excerptsWithoutRanges: s => delete s.ranges, wrongLines: s => s.excerpts = [{ ...excerpt, endLine: 3 }], wrongHash: s => s.excerpts = [{ ...excerpt, sha256: '0'.repeat(64) }], extraKey: s => s.excerpts = [{ ...excerpt, value: 'x' }], unsafeUrl: s => s.excerpts = [{ ...excerpt, downloadUrl: '/krds/demo-sources/../x.txt' }], count: s => s.excerpts = [excerpt, excerpt] })) {
        const bad = structuredClone(good);
        change(bad);
        assert.throws(() => validateRegistry([row([bad])]), /excerpt/, name);
    }
    files.set(excerpt.downloadUrl, Buffer.from('tampered'));
    assert.throws(() => validateRegistry([row([good])], undefined, { readSource }), /excerpt/);
    files.set(excerpt.downloadUrl, full.subarray(start, end));
    files.set('/krds/demo-sources/example.ts.txt', Buffer.from('changed full file'));
    assert.throws(() => validateRegistry([row([good])], undefined, { readSource }), /source download/);
});
