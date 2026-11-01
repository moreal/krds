import assert from 'node:assert/strict';
import { readdir, readFile, rename, stat, mkdir, writeFile } from 'node:fs/promises';
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
// Both compared deployments are complete builds from these same current inputs.
run([resolve(root, 'tools/yarn.mjs'), 'workspace', '@unofficial-krds/docs', 'build:local']);
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
run([resolve(root, 'tools/yarn.mjs'), 'workspace', '@unofficial-krds/docs', 'build:local']);
const after = await inventory(resolve(site, 'dist'));
const differences = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(path => before[path] !== after[path]);
assert.deepEqual(differences, [], 'Same explicit inputs produce the same deployment filenames and bytes');
const evidence = resolve(root, 'test-results/docs-pages');
await mkdir(evidence, { recursive: true });
await writeFile(resolve(evidence, 'reproducibility.json'), JSON.stringify({ schemaVersion: 1, status: 'passed', optionalOutputsHidden: hidden.length, fullBuilds: 2, deploymentFiles: after }, null, 2) + '\n');
console.log(`Reproducible deployment: ${Object.keys(after).length} identical files; ${hidden.length} optional dist outputs hidden during generation.`);
