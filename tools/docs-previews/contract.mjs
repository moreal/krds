import { readFileSync, lstatSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
export const frameworks = ['react', 'solid', 'svelte', 'vue', 'angular', 'lit', 'qwik', 'solid-next'];
export const pilots = ['button', 'tabs', 'native-select', 'modal', 'date-input', 'calendar'];
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const fail = (p, m) => { throw new Error(`${p}: ${m}`); };
export function keys(value, allowed, path) {
    if (!value || typeof value !== 'object' || Array.isArray(value))
        fail(path, 'expected object');
    for (const k of Object.keys(value))
        if (!allowed.includes(k))
            fail(path, `unknown key ${k}`);
}
export function safePath(path) {
    if (typeof path !== 'string' || !path || path.startsWith('/') || path.includes('\\') || path.split('/').some(x => !x || x === '.' || x === '..') || path.includes(':') || /[?#\0]/.test(path))
        fail(String(path), 'unsafe relative path');
    return path;
}
export function readContained(root, path) {
    safePath(path);
    let current = resolve(root);
    for (const part of path.split('/')) {
        current = resolve(current, part);
        if (lstatSync(current).isSymbolicLink())
            fail(path, 'symlink rejected');
    }
    if (!current.startsWith(resolve(root) + sep))
        fail(path, 'outside root');
    return readFileSync(current);
}
export function validateRanges(bytes, ranges, path) {
    for (const r of ranges ?? []) {
        keys(r, ['start', 'end', 'sha256', 'startLine', 'endLine'], path);
        if (!Number.isInteger(r.start) || !Number.isInteger(r.end) || r.start < 0 || r.end <= r.start || r.end > bytes.length)
            fail(path, 'invalid UTF-8 byte range');
        try {
            new TextDecoder('utf-8', { fatal: true }).decode(bytes.subarray(0, r.start));
            new TextDecoder('utf-8', { fatal: true }).decode(bytes.subarray(r.start, r.end));
        }
        catch {
            fail(path, 'split UTF-8 range');
        }
        const startLine = bytes.subarray(0, r.start).toString().split('\n').length;
        const endLine = bytes.subarray(0, r.end - 1).toString().split('\n').length;
        if (r.sha256 !== sha256(bytes.subarray(r.start, r.end)) || r.startLine !== startLine || r.endLine !== endLine)
            fail(path, 'forged range hash/line span');
    }
}
export function validateDefinitions(definitions, catalog, { complete = false } = {}) {
    keys(definitions, ['schemaVersion', 'demos'], 'definitions');
    if (definitions.schemaVersion !== 1 || !Array.isArray(definitions.demos))
        fail('definitions', 'invalid schema');
    const ids = new Set(Array.isArray(catalog) ? catalog : catalog.items.map(x => x.id));
    for (const p of pilots)
        ids.add(p);
    ids.delete('splash-screen');
    const seen = new Set();
    for (const d of definitions.demos) {
        const pair = `${d.framework}/${d.componentId}/${d.exampleId}`;
        keys(d, ['framework', 'componentId', 'exampleId', 'status', 'acceptanceId', 'classification', 'reason', 'sources', 'minHeight', 'layout'], pair);
        if (!frameworks.includes(d.framework) || !ids.has(d.componentId) || (typeof d.exampleId !== 'string' || !/^([a-z][a-z0-9-]*)$/.test(d.exampleId)))
            fail(pair, 'invalid identity');
        if (seen.has(pair))
            fail(pair, 'duplicate');
        seen.add(pair);
        if (d.status === 'unavailable') {
            if (d.framework !== 'solid-next' || pilots.includes(d.componentId) || typeof d.reason !== 'string' || !d.reason)
                fail(pair, 'invalid unavailable');
        }
        else if (d.status === 'playable') {
            if (d.framework === 'solid-next' && !pilots.includes(d.componentId))
                fail(pair, 'not exported');
            if (d.acceptanceId !== d.componentId + '-default' || !['interactive', 'static'].includes(d.classification))
                fail(pair, 'missing acceptance');
            if (!Array.isArray(d.sources) || !d.sources.length)
                fail(pair, 'missing source binding');
            const sourcePaths = new Set();
            for (const s of d.sources) {
                if (sourcePaths.has(s.path))
                    fail(pair, 'duplicate authoring source path');
                sourcePaths.add(s.path);
                keys(s, ['path', 'role', 'language', 'symbolOrBranch', 'ranges'], pair);
                safePath(s.path);
                rangeSchema(s.ranges, pair);
                if (typeof s.language !== 'string' || !s.language || typeof s.symbolOrBranch !== 'string' || !s.symbolOrBranch || !['example', 'host', 'data', 'style', 'asset'].includes(s.role))
                    fail(pair, 'invalid source');
            }
        }
        else
            fail(pair, 'invalid status');
    }
    if (complete) {
        for (const f of frameworks)
            for (const id of ids)
                if (!seen.has(`${f}/${id}/default`))
                    fail(`${f}/${id}/default`, 'missing default');
        if (ids.size !== 54)
            fail('catalog', 'expected 54');
    }
    return { complete, defaultCount: definitions.demos.filter(x => x.exampleId === 'default' && x.status === 'playable').length, unavailableCount: definitions.demos.filter(x => x.status === 'unavailable').length };
}
const catalogIds = [...new Set([...JSON.parse(readFileSync(new URL('../../catalog/full-catalog-contracts.json', import.meta.url))).items.map(x => x.id), ...pilots])];
const text = value => typeof value === 'string' && value.length > 0;
const digest = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const identifier = value => typeof value === 'string' && /^[a-z][a-z0-9-]*$/.test(value);
const pairOf = d => `${d.framework}/${d.componentId}/${d.exampleId}`;
function rangeSchema(ranges, path) {
    if (ranges === undefined)
        return;
    if (!Array.isArray(ranges) || !ranges.length)
        fail(path, 'invalid ranges array');
    for (const r of ranges) {
        keys(r, ['start', 'end', 'sha256', 'startLine', 'endLine'], path);
        if (!Number.isInteger(r.start) || !Number.isInteger(r.end) || r.start < 0 || r.end <= r.start || !digest(r.sha256) || !Number.isInteger(r.startLine) || !Number.isInteger(r.endLine) || r.startLine < 1 || r.endLine < r.startLine)
            fail(path, 'invalid range schema');
    }
}
/** Registry excerpts are index-aligned with `ranges`: one published extract per range, never without ranges. */
function excerptSchema(source, pair) {
    if (source.ranges === undefined) {
        if (source.excerpts !== undefined)
            fail(pair, 'source excerpts without ranges');
        return;
    }
    if (!Array.isArray(source.excerpts) || source.excerpts.length !== source.ranges.length)
        fail(pair, 'missing or misaligned source excerpts');
    source.excerpts.forEach((excerpt, index) => {
        keys(excerpt, ['startLine', 'endLine', 'sha256', 'downloadUrl'], `${pair} excerpt`);
        const range = source.ranges[index];
        if (excerpt.startLine !== range.startLine || excerpt.endLine !== range.endLine || excerpt.sha256 !== range.sha256)
            fail(pair, 'source excerpt differs from its range');
        const prefix = '/krds/demo-sources/';
        if (!text(excerpt.downloadUrl) || !excerpt.downloadUrl.startsWith(prefix) || excerpt.downloadUrl.includes('%') || excerpt.downloadUrl === source.downloadUrl)
            fail(pair, 'invalid source excerpt download');
        try {
            safePath(excerpt.downloadUrl.slice(prefix.length));
        }
        catch {
            fail(pair, 'unsafe source excerpt download');
        }
    });
}
function entryDocument(url, d) {
    const prefix = `/krds/previews/${d.framework}/`;
    if (!text(url) || !url.startsWith(prefix) || url.includes('%') || url.includes('#'))
        fail(pairOf(d), 'invalid entry URL');
    const relative = url.slice(prefix.length);
    if (relative.split('?').length > 2)
        fail(pairOf(d), 'extra entry URL separator');
    const [path, query] = relative.split('?');
    safePath(path);
    if (d.framework === 'qwik') {
        if (path !== `${d.componentId}/${d.exampleId}/index.html` || query !== undefined)
            fail(pairOf(d), 'incorrect Qwik entry identity');
    }
    else if (path !== 'index.html' || query !== `component=${d.componentId}&example=${d.exampleId}`)
        fail(pairOf(d), 'incorrect CSR entry identity');
    return path;
}
export function validateArtifact(m, definitions, { root = process.cwd(), outputDir } = {}) {
    validateDefinitions(definitions, catalogIds);
    keys(m, ['schemaVersion', 'framework', 'identity', 'files', 'modules', 'bindings'], 'manifest');
    if (m.schemaVersion !== 1 || !frameworks.includes(m.framework))
        fail('manifest', 'invalid identity');
    keys(m.identity, ['package', 'version', 'renderer', 'compiler'], 'identity');
    for (const k of ['package', 'version', 'renderer', 'compiler'])
        if (!text(m.identity[k]))
            fail('identity', `invalid ${k}`);
    for (const k of ['files', 'modules', 'bindings'])
        if (!Array.isArray(m[k]) || !m[k].length)
            fail(m.framework, `missing ${k}`);
    const files = new Set();
    for (const f of m.files) {
        keys(f, ['path', 'sha256', 'size'], f.path);
        safePath(f.path);
        if (files.has(f.path))
            fail(f.path, 'duplicate file');
        files.add(f.path);
        if (!digest(f.sha256) || !Number.isInteger(f.size) || f.size < 0)
            fail(f.path, 'invalid file digest');
        if (outputDir) {
            const b = readContained(outputDir, f.path);
            if (sha256(b) !== f.sha256 || b.length !== f.size)
                fail(f.path, 'forged file hash');
        }
    }
    const originals = new Map();
    const moduleIds = new Set();
    for (const mod of m.modules) {
        keys(mod, ['id', 'package', 'version', 'sha256', 'originals'], 'module');
        if (!text(mod.id) || !text(mod.package) || !text(mod.version) || !digest(mod.sha256) || !Array.isArray(mod.originals) || moduleIds.has(mod.id))
            fail('module', 'invalid/duplicate captured module');
        moduleIds.add(mod.id);
        // id is the normalized native graph identity; virtual/transformed modules are legal.
        // sha256 hashes the module bytes at compile time; original inputs retain authoritative filesystem bytes.
        for (const input of mod.originals) {
            keys(input, ['path', 'sha256'], 'original input');
            safePath(input.path);
            if (!digest(input.sha256))
                fail(input.path, 'invalid captured digest');
            if (sha256(readContained(root, input.path)) !== input.sha256)
                fail(input.path, 'stale compiled input');
            if (originals.has(input.path) && originals.get(input.path) !== input.sha256)
                fail(input.path, 'conflicting captured input');
            originals.set(input.path, input.sha256);
        }
    }
    const expected = new Map();
    for (const d of definitions.demos.filter(d => d.framework === m.framework && d.status === 'playable'))
        for (const source of d.sources)
            expected.set(`${pairOf(d)}/${source.path}`, { d, source });
    const seen = new Set();
    for (const b of m.bindings) {
        const pair = pairOf({ ...b, framework: m.framework });
        keys(b, ['componentId', 'exampleId', 'hostPath', 'sourcePath', 'symbolOrBranch', 'sha256', 'ranges', 'entryUrl'], pair);
        const key = `${pair}/${b.sourcePath}`;
        const matched = expected.get(key);
        if (!matched || seen.has(key))
            fail(pair, 'unknown/duplicate binding');
        seen.add(key);
        safePath(b.hostPath);
        safePath(b.sourcePath);
        if (!originals.has(b.sourcePath) || !originals.has(b.hostPath))
            fail(pair, 'source/host missing compiled input');
        if (b.sha256 !== originals.get(b.sourcePath) || b.symbolOrBranch !== matched.source.symbolOrBranch)
            fail(pair, 'forged source hash/symbol');
        if (!files.has(entryDocument(b.entryUrl, { ...b, framework: m.framework })))
            fail(pair, 'entry document missing from deployable files');
        const bytes = readContained(root, b.sourcePath);
        rangeSchema(b.ranges, pair);
        validateRanges(bytes, b.ranges, pair);
        rangeSchema(matched.source.ranges, pair);
        validateRanges(bytes, matched.source.ranges, pair);
        if (JSON.stringify(b.ranges ?? null) !== JSON.stringify(matched.source.ranges ?? null))
            fail(pair, 'definition ranges differ from binding');
    }
    for (const key of expected.keys())
        if (!seen.has(key))
            fail(key, 'missing binding');
    return m;
}
/**
 * Intentionally absent local references, derived only from the acceptance inventory: an item whose
 * `initialState.failureSpecimen.src` names an `intentional-missing-*` local asset allows exactly
 * /krds/previews/<framework>/local-assets/<basename> for that component. The loaded `initialState.src`
 * (and every other initial value) is a required, deployed reference and is never tolerated as absent.
 */
export function intentionalAbsentReferences(acceptance, framework) {
    const result = new Map();
    for (const item of acceptance?.items ?? []) {
        const value = item.initialState?.failureSpecimen?.src;
        const match = typeof value === 'string' ? /^\/local-assets\/(intentional-missing-[A-Za-z0-9._-]+)$/.exec(value) : null;
        if (match && item.initialState.src !== value)
            result.set(item.componentId, [...(result.get(item.componentId) ?? []), `/krds/previews/${framework}/local-assets/${match[1]}`]);
    }
    return result;
}
export function loadAcceptance(root = fileURLToPath(new URL('../..', import.meta.url))) {
    try {
        return JSON.parse(readFileSync(resolve(root, 'apps/docs/demo-acceptance.json'), 'utf8'));
    }
    catch {
        return { items: [] };
    }
}
/**
 * `readSource(downloadUrl) -> Buffer`, when given, re-reads each published full-file download and
 * excerpt: the full bytes must hash to `sha256`, the ranges must validate against them, and each
 * excerpt must be exactly the bytes of its range.
 */
export function validateRegistry(entries, definitions, { acceptance = loadAcceptance(), readSource } = {}) {
    if (!Array.isArray(entries))
        fail('registry', 'expected array');
    if (definitions)
        validateDefinitions(definitions, catalogIds);
    const permitted = definitions ? new Map(definitions.demos.map(d => [pairOf(d), d])) : null;
    const seen = new Set();
    for (const d of entries) {
        const pair = pairOf(d);
        const base = ['status', 'framework', 'componentId', 'exampleId', 'label', 'channel', 'package', 'packageVersion'];
        keys(d, [...base, ...(d.status === 'playable' ? ['entryUrl', 'artifactSha256', 'minHeight', 'layout', 'sources', 'acceptanceId', 'classification', ...(d.absentReferences === undefined ? [] : ['absentReferences'])] : ['reason'])], pair);
        if (!frameworks.includes(d.framework) || !catalogIds.includes(d.componentId) || !identifier(d.exampleId) || !text(d.label) || !text(d.package) || !text(d.packageVersion) || d.channel !== (d.framework === 'solid-next' ? 'preview' : 'stable') || seen.has(pair))
            fail(pair, 'invalid registry identity');
        seen.add(pair);
        const definition = permitted?.get(pair);
        if (permitted && (!definition || definition.status !== d.status))
            fail(pair, 'not a promised definition');
        if (d.status === 'unavailable') {
            if (d.framework !== 'solid-next' || pilots.includes(d.componentId) || d.exampleId !== 'default' || !text(d.reason))
                fail(pair, 'invalid unavailable');
            continue;
        }
        if (d.status !== 'playable' || (d.framework === 'solid-next' && !pilots.includes(d.componentId)) || !digest(d.artifactSha256) || !Number.isFinite(d.minHeight) || d.minHeight < 240 || d.minHeight > 1200 || !['inline', 'overlay'].includes(d.layout) || (d.layout === 'overlay' && d.minHeight < 640) || !Array.isArray(d.sources) || !d.sources.length || d.acceptanceId !== `${d.componentId}-default` || !['interactive', 'static'].includes(d.classification))
            fail(pair, 'invalid playable registry');
        entryDocument(d.entryUrl, d);
        if (d.absentReferences !== undefined) {
            const allowed = intentionalAbsentReferences(acceptance, d.framework).get(d.componentId) ?? [];
            if (!Array.isArray(d.absentReferences) || !d.absentReferences.length || new Set(d.absentReferences).size !== d.absentReferences.length || d.absentReferences.some(r => !allowed.includes(r)))
                fail(pair, 'absent reference not derived from acceptance inventory');
        }
        const sourcePaths = new Set();
        for (const source of d.sources) {
            if (sourcePaths.has(source.path))
                fail(pair, 'duplicate registry source path');
            sourcePaths.add(source.path);
            keys(source, ['path', 'role', 'language', 'symbolOrBranch', 'ranges', 'excerpts', 'sha256', 'downloadUrl'], pair);
            safePath(source.path);
            if (!text(source.language) || !text(source.symbolOrBranch) || !['example', 'host', 'data', 'style', 'asset'].includes(source.role) || !digest(source.sha256))
                fail(pair, 'invalid source metadata');
            rangeSchema(source.ranges, pair);
            const prefix = '/krds/demo-sources/';
            if (!text(source.downloadUrl) || !source.downloadUrl.startsWith(prefix))
                fail(pair, 'invalid source download');
            safePath(source.downloadUrl.slice(prefix.length));
            if (source.downloadUrl.includes('%'))
                fail(pair, 'encoded source URL');
            excerptSchema(source, pair);
            if (readSource) {
                const full = readSource(source.downloadUrl);
                if (sha256(full) !== source.sha256)
                    fail(pair, `stale source download ${source.path}`);
                validateRanges(full, source.ranges, pair);
                source.excerpts?.forEach((excerpt, index) => {
                    const range = source.ranges[index], bytes = readSource(excerpt.downloadUrl);
                    if (sha256(bytes) !== excerpt.sha256 || !Buffer.from(bytes).equals(full.subarray(range.start, range.end)))
                        fail(pair, `forged source excerpt ${excerpt.downloadUrl}`);
                });
            }
            if (definition) {
                const match = definition.sources.find(s => s.path === source.path);
                if (!match || ['role', 'language', 'symbolOrBranch'].some(k => source[k] !== match[k]) || JSON.stringify(source.ranges ?? null) !== JSON.stringify(match.ranges ?? null))
                    fail(pair, 'source differs from definition');
            }
        }
        if (definition && (sourcePaths.size !== definition.sources.length || definition.sources.some(source => !sourcePaths.has(source.path))))
            fail(pair, 'source count differs from definition');
    }
    return entries;
}
if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file://').href) {
    const definitions = JSON.parse(readFileSync('apps/docs/demo-definitions.json'));
    const catalog = JSON.parse(readFileSync('catalog/full-catalog-contracts.json'));
    console.log(JSON.stringify(validateDefinitions(definitions, catalog, { complete: process.argv.includes('--complete') })));
}
