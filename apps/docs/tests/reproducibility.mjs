import assert from 'node:assert/strict';
import { readdir, readFile, rename, stat, mkdir, writeFile, rm } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '../../..');
const site = resolve(root, 'apps/docs');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
async function inventory(directory) {
  const result = {};
  async function visit(path) {
    for (const entry of (await readdir(path, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
      const file = resolve(path, entry.name);
      if (entry.isDirectory()) await visit(file);
      else result[relative(directory, file)] = hash(await readFile(file));
    }
  }
  await visit(directory);
  return result;
}
function run(script) {
  const result = spawnSync(process.execPath, script, { cwd: site, stdio: 'inherit', env: process.env });
  assert.equal(result.status, 0, `Documentation producer failed: ${script.join(' ')}`);
}
// Both compared deployments are clean, complete builds (build:local assembles all eight native
// preview artifacts with complete=true) from these same current inputs.
const cleanBuild = async () => { await rm(resolve(site, 'dist'), { recursive: true, force: true }); run([resolve(root, 'tools/yarn.mjs'), 'workspace', '@unofficial-krds/docs', 'build:local']); };
await cleanBuild();
const before = await inventory(resolve(site, 'dist'));
const metadata = await readFile(resolve(site, 'public/docs-metadata.json'));
// Public generation must work with every optional adapter declaration and
// Storybook build absent. Keep those local outputs intact and restore on failure.
const hidden = [];
try {
  for (const framework of ['react', 'solid', 'svelte', 'vue', 'lit', 'qwik', 'angular', 'solid-next']) {
    for (const path of [`packages/${framework}/dist`, `apps/storybook-${framework}/dist`]) {
      const from = resolve(root, path);
      try { await stat(from); } catch (error) { if (error.code === 'ENOENT') continue; throw error; }
      const to = `${from}.docs-reproducibility`;
      await rename(from, to);
      hidden.push([from, to]);
    }
  }
  run(['scripts/generate.mjs']);
  assert.deepEqual(await readFile(resolve(site, 'public/docs-metadata.json')), metadata, 'Optional local dist cannot change metadata or download inputs');
} finally {
  for (const [from, to] of hidden.reverse()) await rename(to, from);
}
await cleanBuild();
const after = await inventory(resolve(site, 'dist'));
const differences = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(path => before[path] !== after[path]);
assert.deepEqual(differences, [], 'Same explicit inputs produce the same deployment filenames and bytes');
// Complete assembled bytes: registry, every native artifact file and every source download are
// deployed exactly as the validated fixture outputs/sources, and the matrix is complete.
const registry = JSON.parse(await readFile(resolve(site, 'dist/demo-registry.json')));
assert.deepEqual(await readFile(resolve(site, 'dist/demo-registry.json')), await readFile(resolve(site, 'public/demo-registry.json')), 'deployed registry equals assembled registry');
const playableDefaults = registry.filter(r => r.status === 'playable' && r.exampleId === 'default');
const matrix = { stableDefaults: playableDefaults.filter(r => r.framework !== 'solid-next').length, solid2Pilots: playableDefaults.filter(r => r.framework === 'solid-next').length, unavailable: registry.filter(r => r.status === 'unavailable').length, rows: registry.length };
assert.deepEqual([matrix.stableDefaults, matrix.solid2Pilots, matrix.unavailable], [378, 6, 48], 'complete native matrix assembled');
const nativeFiles = {};
for (const framework of [...new Set(registry.filter(r => r.status === 'playable').map(r => r.framework))].sort()) {
  const manifestBytes = await readFile(resolve(site, 'dist/previews', framework, 'artifact-manifest.json'));
  assert.deepEqual(manifestBytes, await readFile(resolve(root, `apps/fixture-${framework}/dist/docs-preview/artifact-manifest.json`)), `${framework}: deployed manifest equals fixture output`);
  for (const row of registry.filter(r => r.framework === framework && r.status === 'playable')) assert.equal(row.artifactSha256, hash(manifestBytes), `${framework}: registry artifact hash`);
  const manifest = JSON.parse(manifestBytes);
  for (const file of manifest.files) {
    const deployed = after[`previews/${framework}/${file.path}`];
    assert.equal(deployed, file.sha256, `${framework}/${file.path}: deployed bytes equal manifest`);
    nativeFiles[`previews/${framework}/${file.path}`] = deployed;
  }
  const extra = Object.keys(after).filter(path => path.startsWith(`previews/${framework}/`) && path !== `previews/${framework}/artifact-manifest.json` && !nativeFiles[path]);
  assert.deepEqual(extra, [], `${framework}: no undeclared deployed preview files`);
}
for (const row of registry.filter(r => r.status === 'playable')) for (const source of row.sources) {
  assert.equal(after[source.downloadUrl.replace(/^\/krds\//, '')], source.sha256, `${source.path}: deployed source download`);
  assert.equal(hash(await readFile(resolve(root, source.path))), source.sha256, `${source.path}: current source bytes`);
}
// Runtime tokens are minted per session in the browser; none may be baked into any deployed byte.
const tokenLeaks = [];
for (const path of Object.keys(after)) {
  if (!/\.(html|js|mjs|css|json|txt|svg|xml|map)$/.test(path)) continue;
  const text = (await readFile(resolve(site, 'dist', path))).toString();
  if (/[?&]token=[0-9a-f]{32}\b|"token"\s*:\s*"[0-9a-f]{32}"/.test(text)) tokenLeaks.push(path);
}
assert.deepEqual(tokenLeaks, [], 'runtime tokens never enter artifacts');
const evidence = resolve(root, 'test-results/docs-pages');
await mkdir(evidence, { recursive: true });
await writeFile(resolve(evidence, 'reproducibility.json'), JSON.stringify({ schemaVersion: 1, status: 'passed', optionalOutputsHidden: hidden.length, fullBuilds: 2, cleanBuilds: true, matrix, nativeFiles: Object.keys(nativeFiles).length, tokenLeaks: 0, deploymentFiles: after }, null, 2) + '\n');
console.log(`Reproducible deployment: ${Object.keys(after).length} identical files (${Object.keys(nativeFiles).length} native preview files, ${matrix.stableDefaults}+${matrix.solid2Pilots} playable defaults, ${matrix.unavailable} unavailable); ${hidden.length} optional dist outputs hidden during generation.`);
