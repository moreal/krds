// Qwik docs preview builder: optimizer client build, SSR build, then build-time prerender of every (component, example) document.
import { spawnSync } from 'node:child_process';
import { readFileSync, rmSync, mkdirSync, writeFileSync, readdirSync, renameSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { writeArtifactManifest } from '../../../../tools/docs-previews/manifest.mjs';
import { normalizeClientManifest } from '../../../../tools/docs-previews/qwik-manifest.mjs';

// Source ranges are derived from the live example file before anything reads definitions.json.
if (spawnSync(process.execPath, ['src/docs-preview/write-definitions.mjs'], { stdio: 'inherit' }).status !== 0) process.exit(1);
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const root = resolve('../..');
const sourceRoot = 'apps/fixture-qwik/src/docs-preview';
const prefix = '/krds/previews/qwik/';
const definitions = JSON.parse(readFileSync('src/docs-preview/definitions.json', 'utf8'));
const qwikVersion = JSON.parse(readFileSync('node_modules/@builder.io/qwik/package.json', 'utf8')).version;
const packageVersion = JSON.parse(readFileSync('../../packages/qwik/package.json', 'utf8')).version;

for (const path of ['dist/docs-preview', 'dist/docs-preview-server', 'dist/docs-preview-capture']) rmSync(path, { recursive: true, force: true });
// The client manifest is normalized before the SSR stage reads it (see tools/docs-previews/qwik-manifest.mjs),
// and handed over explicitly: the optimizer's fallback is a shared file in os.tmpdir() that any
// other Qwik build on the machine may have overwritten.
const findManifest = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? findManifest(`${dir}/${entry.name}`) : entry.name === 'q-manifest.json' ? [`${dir}/${entry.name}`] : []);
let clientManifestPath;
for (const stage of ['client', 'server']) {
  const args = ['../../tools/yarn.mjs', 'exec', 'vite', 'build', '--config', 'vite.docs-preview.config.ts', ...(stage === 'server' ? ['--ssr', 'src/docs-preview/entry.ssr.tsx'] : [])];
  const env = { ...process.env, QWIK_DOCS_STAGE: stage, ...(clientManifestPath ? { QWIK_DOCS_CLIENT_MANIFEST: resolve(clientManifestPath) } : {}) };
  const result = spawnSync(process.execPath, args, { stdio: 'inherit', env });
  if (result.status !== 0) process.exit(result.status ?? 1);
  if (stage === 'client') {
    const found = findManifest('dist/docs-preview');
    if (found.length !== 1) throw new Error(`Expected one client q-manifest.json, found ${found.length}`);
    clientManifestPath = found[0];
    writeFileSync(clientManifestPath, JSON.stringify(normalizeClientManifest(JSON.parse(readFileSync(clientManifestPath, 'utf8')))));
  }
}
// The optimizer writes client output beneath its Vite base; the artifact root is that base.
for (const entry of readdirSync('dist/docs-preview/krds/previews/qwik')) renameSync(`dist/docs-preview/krds/previews/qwik/${entry}`, `dist/docs-preview/${entry}`);
rmSync('dist/docs-preview/krds', { recursive: true });

const { render } = await import(pathToFileURL(resolve('dist/docs-preview-server/entry.ssr.js')).href);
for (const demo of definitions.demos.filter(d => d.status === 'playable')) {
  const dir = `dist/docs-preview/${demo.componentId}/${demo.exampleId}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/index.html`, (await render(demo.componentId, demo.exampleId)).html);
}

// Deployed inventory = modules with code in emitted client chunks/stylesheets. SSR modules only produced HTML at build time.
const client = JSON.parse(readFileSync('dist/docs-preview-capture/client.json', 'utf8'));
const server = JSON.parse(readFileSync('dist/docs-preview-capture/server.json', 'utf8'));
for (const chunk of client.chunks) if (!existsSync(`dist/docs-preview/${chunk.fileName.replace(/^krds\/previews\/qwik\//, '')}`)) throw new Error(`Inventory chunk ${chunk.fileName} not deployed`);
const ids = new Set();
for (const module of client.modules) { if (ids.has(module.id)) throw new Error(`Duplicate deployed module ${module.id}`); ids.add(module.id); }
const inputs = client.modules.map(({ id, sha256, originals, package: name, version }) => ({ id, sha256, originals, package: name, version }));
// The prerender host (entry.ssr.tsx, symbol `render`) produced every deployed HTML document; its server-graph module is the compiled input of that host binding.
const ssrHost = `${sourceRoot}/entry.ssr.tsx`;
const hostModules = server.modules.filter(m => m.originals.some(o => o.path === ssrHost));
if (!hostModules.length) throw new Error(`${ssrHost} not found in the SSR module graph`);
for (const { id, sha256, originals, package: name, version } of hostModules) if (!ids.has(id)) { ids.add(id); inputs.push({ id, sha256, originals, package: name, version }); }
const originals = new Map(inputs.flatMap(input => input.originals).map(input => [input.path, input.sha256]));
writeFileSync('dist/docs-preview-server/ssr-module-inventory.json', JSON.stringify({ note: 'Build-time SSR prerender modules; not deployed.', modules: server.modules.map(({ id, sha256, originals: o, package: name, version }) => ({ id, sha256, originals: o, package: name, version })) }, null, 2) + '\n');

const bindings = definitions.demos.filter(d => d.status === 'playable').flatMap(d => d.sources.map(s => ({
  componentId: d.componentId, exampleId: d.exampleId, hostPath: `${sourceRoot}/host.tsx`, sourcePath: s.path, symbolOrBranch: s.symbolOrBranch,
  sha256: originals.get(s.path) ?? sha256(readFileSync(resolve(root, s.path))), ...(s.ranges ? { ranges: s.ranges } : {}), entryUrl: `${prefix}${d.componentId}/${d.exampleId}/index.html`,
})));
const manifest = writeArtifactManifest({
  framework: 'qwik', root, outputDir: resolve('dist/docs-preview'), definitions, bindings,
  modules: { identity: { package: '@unofficial-krds/qwik', version: packageVersion, renderer: `@builder.io/qwik@${qwikVersion}`, compiler: `@builder.io/qwik/optimizer@${qwikVersion}` }, inputs },
});
console.log(`Qwik docs preview: ${definitions.demos.length} documents, ${manifest.files.length} files, ${inputs.length} deployed modules (${server.modules.length} SSR-only recorded separately).`);
