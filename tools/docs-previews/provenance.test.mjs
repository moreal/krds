import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { sha256 } from './contract.mjs';
import { nativePreviewInventory, validateNativeDestinations, verifyNativeInventory, nativeDistributionDiff } from './provenance.mjs';

const repo = resolve(import.meta.dirname, '../..');
const fontBytes = Buffer.from('wOF2 original recorded font bytes');
const svgBytes = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1"/></svg>\n');
const license = 'MIT License\n\nCopyright (c) original runtime holder\n';

function fixture({ frameworks = ['react', 'vue'] } = {}) {
 const root = mkdtempSync(join(tmpdir(), 'native-provenance-'));
 const put = (path, bytes) => { mkdirSync(join(root, path, '..'), { recursive: true }); writeFileSync(join(root, path), bytes); };
 const json = (path, value) => put(path, JSON.stringify(value, null, 2));
 put('packages/fonts/fonts/Recorded.woff2', fontBytes);
 put('LICENSES/OFL.txt', 'font terms');
 put('LICENSES/MIT.txt', 'independent terms');
 put('LICENSES/dependencies/runtime_1.0.0/LICENSE', license);
 put('compliance/provenance-dependency-manifests/runtime.json', '{"name":"runtime","version":"1.0.0"}');
 put('node_modules/runtime/index.js', 'export const runtime = 1;');
 const sources = [{ id: 'font-recorded', sha256: sha256(fontBytes), localPaths: ['packages/fonts/fonts/Recorded.woff2'], licenseTextPath: 'LICENSES/OFL.txt', rightsStatus: 'verified', modified: false, distributedIn: ['@unofficial-krds/fonts'] }];
 const dependency = { name: 'runtime', version: '1.0.0', manifestPath: 'compliance/provenance-dependency-manifests/runtime.json', manifestSha256: sha256('{"name":"runtime","version":"1.0.0"}'), licenseDocuments: [{ localPath: 'LICENSES/dependencies/runtime_1.0.0/LICENSE', sha256: sha256(license) }] };
 const dependencies = { packages: { 'runtime@1.0.0': dependency } };
 const assets = [];
 for (const framework of frameworks) {
  put(`apps/fixture-${framework}/public/local-assets/specimen.svg`, svgBytes);
  assets.push({ sourcePath: `apps/fixture-${framework}/public/local-assets/specimen.svg`, sha256: sha256(svgBytes), bytes: svgBytes.length, rights: 'independent', rightsStatus: 'verified', evidence: ['generator'], destinations: [`apps/fixture-${framework}/public/local-assets/specimen.svg`] });
 }
 const distribution = { schemaVersion: 1, assets };
 json('compliance/provenance.json', sources);
 json('compliance/provenance-dependencies.json', dependencies);
 json('compliance/distribution-provenance.json', distribution);
 const manifests = {};
 const writeArtifact = framework => {
  const out = `apps/fixture-${framework}/dist/docs-preview`;
  const host = `apps/fixture-${framework}/src/docs-preview/main.ts`;
  put(host, `mount(${framework})`);
  put(`${out}/index.html`, `<script type="module" src="/krds/previews/${framework}/assets/main.js"></script>`);
  put(`${out}/assets/main.js`, 'export const mounted = true;');
  put(`${out}/assets/Recorded.woff2`, fontBytes);
  put(`${out}/local-assets/specimen.svg`, svgBytes);
  const file = path => { const bytes = readFileSync(join(root, out, path)); return { path, sha256: sha256(bytes), size: bytes.length }; };
  const original = path => ({ path, sha256: sha256(readFileSync(join(root, path))) });
  const manifest = {
   schemaVersion: 1, framework,
   identity: { package: `@unofficial-krds/${framework}`, version: '0.1.0', renderer: `${framework}@1`, compiler: 'vite@8' },
   files: ['assets/Recorded.woff2', 'assets/main.js', 'index.html', 'local-assets/specimen.svg'].map(file),
   modules: [
    { id: `apps/fixture-${framework}/src/docs-preview/main.ts`, package: `@unofficial-krds/fixture-${framework}`, version: '0.0.0', sha256: sha256('compiled host'), originals: [original(host), original('packages/fonts/fonts/Recorded.woff2')] },
    { id: 'node_modules/runtime/index.js', package: 'runtime', version: '1.0.0', sha256: sha256('compiled runtime'), originals: [original('node_modules/runtime/index.js')] },
   ],
   bindings: [],
  };
  json(`${out}/artifact-manifest.json`, manifest);
  manifests[framework] = manifest;
  return manifest;
 };
 for (const framework of frameworks) writeArtifact(framework);
 const rewrite = framework => json(`apps/fixture-${framework}/dist/docs-preview/artifact-manifest.json`, manifests[framework]);
 const inventory = () => nativePreviewInventory({ root, frameworks });
 const deploy = inv => {
  for (const artifact of inv.artifacts) {
   const out = `apps/fixture-${artifact.framework}/dist/docs-preview`;
   for (const file of artifact.files) for (const destination of file.destinations.filter(path => path.startsWith('apps/docs/public/'))) put(destination, readFileSync(join(root, out, file.path)));
   put(`apps/docs/public/previews/${artifact.framework}/artifact-manifest.json`, readFileSync(join(root, out, 'artifact-manifest.json')));
  }
 };
 return { root, put, json, manifests, rewrite, inventory, deploy, sources, dependencies, distribution, cleanup: () => rmSync(root, { recursive: true, force: true }) };
}
const withFixture = (name, body, options) => test(name, t => { const f = fixture(options); t.after(f.cleanup); return body(f); });

withFixture('records a separate nativePreviews inventory with every additional destination', f => {
 const inventory = f.inventory();
 assert.match(inventory.scope, /547 legacy downloads and three legacy font records remain separate/);
 assert.deepEqual(inventory.artifacts.map(artifact => artifact.framework), ['react', 'vue']);
 for (const artifact of inventory.artifacts) {
  for (const file of artifact.files) assert.deepEqual(file.destinations, [`apps/docs/public/previews/${artifact.framework}/${file.path}`, `apps/docs/dist/previews/${artifact.framework}/${file.path}`]);
  assert.equal(artifact.files.find(file => file.path === 'assets/Recorded.woff2').rights, 'font-original');
  assert.equal(artifact.files.find(file => file.path === 'local-assets/specimen.svg').rights, 'independent-specimen');
  assert.equal(artifact.files.find(file => file.path === 'assets/main.js').rights, 'compiled-code');
  assert.deepEqual(artifact.bundledDependencies.map(record => record.name), ['runtime']);
  assert.equal(artifact.artifactSha256, sha256(readFileSync(join(f.root, `apps/fixture-${artifact.framework}/dist/docs-preview/artifact-manifest.json`))));
 }
 // One recorded font may now have several preview destinations; each is explicit.
 assert.deepEqual(inventory.fontAssets, [{ sourceId: 'font-recorded', sourcePath: 'packages/fonts/fonts/Recorded.woff2', sha256: sha256(fontBytes), bytes: fontBytes.length, modified: false, destinations: ['react', 'vue'].flatMap(framework => [`apps/docs/public/previews/${framework}/assets/Recorded.woff2`, `apps/docs/dist/previews/${framework}/assets/Recorded.woff2`]) }]);
 assert.ok(!('documentation' in inventory) && !('records' in inventory), 'legacy 547-source inventory is never extended');
});

withFixture('rejects a bundled module without original notice evidence', f => {
 f.dependencies.packages['runtime@1.0.0'].licenseDocuments = [];
 f.json('compliance/provenance-dependencies.json', f.dependencies);
 assert.throws(() => f.inventory(), /lacks original notice\/module identity: runtime@1\.0\.0/);
});

withFixture('rejects missing or non-package module identity', f => {
 delete f.manifests.react.modules[1].id; f.rewrite('react');
 assert.throws(() => f.inventory(), /Missing native module identity: react/);
 f.manifests.react.modules[1].id = 'node_modules/runtime/index.js';
 f.manifests.react.modules[1].package = 'runtime/subpath'; f.manifests.react.modules[1].version = '0.0.0'; f.rewrite('react');
 assert.throws(() => f.inventory(), /lacks original notice\/module identity: runtime\/subpath@0\.0\.0/);
});

withFixture('rejects unclassified native source', f => {
 f.put('apps/other/unknown.ts', 'foreign');
 f.manifests.react.modules[0].originals.push({ path: 'apps/other/unknown.ts', sha256: sha256('foreign') }); f.rewrite('react');
 assert.throws(() => f.inventory(), /Unclassified native source: apps\/other\/unknown\.ts/);
});

withFixture('rejects unclassified native media and unregistered copied public files', f => {
 const other = Buffer.from('<svg>unregistered</svg>');
 f.put('apps/fixture-react/dist/docs-preview/local-assets/other.svg', other);
 f.manifests.react.files.push({ path: 'local-assets/other.svg', sha256: sha256(other), size: other.length }); f.rewrite('react');
 assert.throws(() => f.inventory(), /Unclassified native output media\/font: react\/local-assets\/other\.svg/);
 const notice = Buffer.from('<p>fixture notice copy</p>');
 f.manifests.react.files.pop();
 f.put('apps/fixture-react/public/_legal/index.html', notice);
 f.put('apps/fixture-react/dist/docs-preview/_legal/index.html', notice);
 f.manifests.react.files.push({ path: '_legal/index.html', sha256: sha256(notice), size: notice.length }); f.rewrite('react');
 assert.throws(() => f.inventory(), /Unclassified copied public file: react\/_legal\/index\.html/);
});

withFixture('rejects unverified specimen copies', f => {
 f.distribution.assets[0].rightsStatus = 'unresolved';
 f.json('compliance/distribution-provenance.json', f.distribution);
 assert.throws(() => f.inventory(), /Unclassified|Unverified/);
});

withFixture('rejects an emitted font absent from recorded font sources', f => {
 const sources = [];
 f.json('compliance/provenance.json', sources);
 assert.throws(() => f.inventory(), /Unclassified native media\/font: packages\/fonts\/fonts\/Recorded\.woff2/);
});

withFixture('rejects modified recorded font bytes', f => {
 // Source changed on disk and the manifest was rebuilt from it: provenance no longer matches.
 const changed = Buffer.from('wOF2 subset or altered');
 f.put('packages/fonts/fonts/Recorded.woff2', changed);
 f.manifests.react.modules[0].originals[1].sha256 = sha256(changed); f.rewrite('react');
 assert.throws(() => f.inventory(), /Modified\/unverified recorded source: packages\/fonts\/fonts\/Recorded\.woff2/);
});

withFixture('rejects an emitted font whose bytes differ from the recorded original', f => {
 const subset = Buffer.from('wOF2 builder subset');
 f.put('apps/fixture-vue/dist/docs-preview/assets/Recorded.woff2', subset);
 Object.assign(f.manifests.vue.files[0], { sha256: sha256(subset), size: subset.length }); f.rewrite('vue');
 assert.throws(() => f.inventory(), /Unclassified native output media\/font: vue\/assets\/Recorded\.woff2/);
});

withFixture('rejects stale artifact input and output hashes', f => {
 f.put('apps/fixture-react/src/docs-preview/main.ts', 'changed after build');
 assert.throws(() => f.inventory(), /Stale native source: apps\/fixture-react\/src\/docs-preview\/main\.ts/);
 f.put('apps/fixture-react/src/docs-preview/main.ts', 'mount(react)');
 f.put('node_modules/runtime/index.js', 'changed dependency');
 assert.throws(() => f.inventory(), /Stale native dependency source: node_modules\/runtime\/index\.js/);
 f.put('node_modules/runtime/index.js', 'export const runtime = 1;');
 f.put('apps/fixture-vue/dist/docs-preview/assets/main.js', 'tampered');
 assert.throws(() => f.inventory(), /Stale native output: vue\/assets\/main\.js/);
});

withFixture('detects deleted, untracked, modified and re-manifested deployed destinations', f => {
 const inventory = f.inventory();
 f.deploy(inventory);
 validateNativeDestinations(f.root, inventory);
 rmSync(join(f.root, 'apps/docs/public/previews/vue/assets/main.js'));
 assert.throws(() => validateNativeDestinations(f.root, inventory), /Missing\/modified native destination: apps\/docs\/public\/previews\/vue\/assets\/main\.js/);
 f.deploy(inventory);
 f.put('apps/docs/public/previews/react/stray.js', 'stray');
 assert.throws(() => validateNativeDestinations(f.root, inventory), /Untracked\/modified native destination: apps\/docs\/public\/previews\/react\/stray\.js/);
 rmSync(join(f.root, 'apps/docs/public/previews/react/stray.js'));
 f.put('apps/docs/public/previews/react/artifact-manifest.json', '{"forged":true}');
 assert.throws(() => validateNativeDestinations(f.root, inventory), /Native artifact manifest drift: react/);
});

withFixture('re-verifies recorded rights evidence when loading a committed inventory', f => {
 const inventory = f.inventory();
 const context = { sourceEntries: f.sources, dependencies: f.dependencies, distribution: f.distribution };
 verifyNativeInventory(f.root, inventory, context);
 f.put('LICENSES/dependencies/runtime_1.0.0/LICENSE', 'altered grant');
 assert.throws(() => verifyNativeInventory(f.root, inventory, context), /Native dependency notice drift: runtime/);
 f.put('LICENSES/dependencies/runtime_1.0.0/LICENSE', license);
 const drifted = structuredClone(f.dependencies); drifted.packages['runtime@1.0.0'].manifestSha256 = sha256('other');
 assert.throws(() => verifyNativeInventory(f.root, inventory, { ...context, dependencies: drifted }), /Native dependency original provenance drift: runtime/);
 f.put('apps/docs/dist/previews/react/assets/main.js', 'modified built copy');
 assert.throws(() => verifyNativeInventory(f.root, inventory, context), /native destination: apps\/docs\/dist\/previews\/react\/assets\/main\.js/);
});

test('re-verification rejects unverified fonts, escaped destinations and legacy collisions', t => {
 const f = fixture(); t.after(f.cleanup);
 const inventory = f.inventory();
 const context = { sourceEntries: f.sources, dependencies: f.dependencies, distribution: f.distribution };
 assert.throws(() => verifyNativeInventory(f.root, inventory, { ...context, sourceEntries: [{ ...f.sources[0], rightsStatus: 'unresolved' }] }), /Invalid native font source provenance: packages\/fonts\/fonts\/Recorded\.woff2/);
 const escaped = structuredClone(inventory); escaped.artifacts[0].files[0].destinations = ['apps/docs/dist/_astro/Recorded.woff2'];
 assert.throws(() => verifyNativeInventory(f.root, escaped, context), /Invalid native preview destination: apps\/docs\/dist\/_astro\/Recorded\.woff2/);
 const legacy = structuredClone(inventory); legacy.artifacts[0].files[0].destinations = ['apps/docs/public/sources/Recorded.woff2'];
 assert.throws(() => verifyNativeInventory(f.root, legacy, context), /Invalid native preview destination/);
 const unaccounted = structuredClone(inventory); unaccounted.fontAssets = [];
 assert.throws(() => verifyNativeInventory(f.root, unaccounted, context), /Unaccounted native font destination/);
});

test('legacy 547-source and three-font assertions remain exact and separate', () => {
 const refresh = readFileSync(join(repo, 'tools/refresh-docs-distribution.mjs'), 'utf8');
 assert.match(refresh, /assert\.equal\(current\.size,547\)/);
 assert.match(refresh, /assert\.equal\(fonts\.length,3\)/);
 assert.match(refresh, /assert\.equal\(destinations\.length,1,`Exactly one original emitted font: \$\{source\.id\}`\)/);
 assert.match(refresh, /readdir\(resolve\(root,'apps\/docs\/dist\/_astro'\)\)/);
 assert.match(refresh, /inventory\.nativePreviews=nativePreviews/);
 const distribution = readFileSync(join(repo, 'tools/distribution-provenance.mjs'), 'utf8');
 assert.match(distribution, /\^apps\\\/docs\\\/dist\\\/_astro\\\/\[\^\/\]\+\\\.woff2\$/);
 assert.match(distribution, /verifyNativeInventory\(root, inventory\.nativePreviews/);
});

withFixture('produces a reviewable per-destination distribution diff', f => {
 const before = f.inventory();
 assert.deepEqual(nativeDistributionDiff(before, before), { schemaVersion: 1, added: [], removed: [], changed: [], dependencies: { added: [], removed: [] } });
 const code = Buffer.from('export const mounted = "changed";');
 f.put('apps/fixture-vue/dist/docs-preview/assets/main.js', code);
 Object.assign(f.manifests.vue.files[1], { sha256: sha256(code), size: code.length });
 f.manifests.vue.files.splice(0, 1); f.manifests.vue.modules.pop(); f.rewrite('vue');
 const after = f.inventory();
 const diff = nativeDistributionDiff(before, after);
 assert.deepEqual(diff.removed.map(entry => entry.destination), ['apps/docs/dist/previews/vue/assets/Recorded.woff2', 'apps/docs/public/previews/vue/assets/Recorded.woff2']);
 assert.deepEqual(diff.changed.map(entry => [entry.destination, entry.before, entry.after]), ['dist', 'public'].map(tree => [`apps/docs/${tree}/previews/vue/assets/main.js`, before.artifacts[1].files[1].sha256, sha256(code)]));
 assert.deepEqual(diff.added, []);
 assert.deepEqual(diff.dependencies, { added: [], removed: [] });
 assert.deepEqual(nativeDistributionDiff(undefined, after).added.length, after.artifacts.flatMap(artifact => artifact.files.flatMap(file => file.destinations)).length);
});
