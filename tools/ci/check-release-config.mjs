import assert from 'node:assert/strict';
import {assertNode, readJson, writeJson, yarn} from './common.mjs';
import {loadGraph} from './selection.mjs';
import {initialCandidate, previewChannel} from './release-policy.mjs';
assertNode();
const args = process.argv.slice(2);
if (args.some(arg => !['--expect-initial-candidate', '--expect-initial-source'].includes(arg)) || args.length > 1) throw new Error('Usage: check-release-config.mjs [--expect-initial-candidate|--expect-initial-source]');
const config = readJson('nx.json');
assert.deepEqual(config.release, readJson('tools/ci/release-config.expected.json'), 'Nx Release preparation safety contract changed');
assert.equal(config.nxCloudId, undefined, 'Nx Cloud must not be required');
assert.equal(readJson('package.json').resolutions, undefined, 'Root runtime/compiler resolutions are prohibited');
// Exercise the installed Nx CLI, which rejects some combinations its JSON schema permits.
yarn(['nx', 'release', '--printConfig']);
const graph = loadGraph();
const stable = config.release.groups.stable.projects;
const preview = config.release.groups['solid2-preview'].projects;
const projects = [...stable, ...preview];
assert.equal(projects.length, 13);
assert.equal(new Set(projects).size, 13);
assert.deepEqual(Object.values(graph.nodes).filter(node => node.data.tags?.includes('npm-public')).map(node => node.name).sort(), [...projects].sort());
const previewManifest = readJson('packages/solid-next/package.json');
const runtime = readJson('compatibility/toolchain.json').environments['solid2-preview'].pins;
for (const name of ['solid-js', '@solidjs/web']) {
  assert.equal(previewManifest.peerDependencies[name], runtime[name]);
  assert.equal(previewManifest.devDependencies[name], runtime[name]);
}
for (const name of ['@solidjs/compiler', '@solidjs/babel-plugin', '@solidjs/vite-plugin']) assert.equal(previewManifest.devDependencies[name], runtime[name]);
const channel = previewChannel(previewManifest.version);
const rows = projects.map(project => {
  const manifest = readJson(`${graph.nodes[project].data.root}/package.json`);
  assert.match(manifest.name, /^@unofficial-krds\//);
  assert.notEqual(manifest.private, true);
  if (stable.includes(project)) {
    assert.match(manifest.version, /^\d+\.\d+\.\d+$/, `${project} must not inherit the preview version channel`);
    for (const field of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) assert.equal(manifest[field]?.[previewManifest.name], undefined, `${project} depends on the Solid 2 preview`);
  }
  if (args.includes('--expect-initial-candidate')) assert.equal(manifest.version, stable.includes(project) ? initialCandidate.stable.version : initialCandidate.preview.version, `${project} did not reach the proposed initial candidate version`);
  if (args.includes('--expect-initial-source')) assert.equal(manifest.version, stable.includes(project) ? initialCandidate.stable.sourceVersion : initialCandidate.preview.sourceVersion, `${project} is not at its initial source version; do not replay the initial version plans`);
  return {project, name: manifest.name, version: manifest.version, channel: stable.includes(project) ? 'stable' : channel, peerDependencies: manifest.peerDependencies ?? {}, dependencies: manifest.dependencies ?? {}};
});
writeJson('test-results/ci/release-packages.json', {status: 'configuration-checked-only', packages: rows, previewRuntime: runtime, publicationAuthorized: false});
console.log('Nx Release configuration and all 13 actual public manifest identities/channels checked; checker performed no version writes');
