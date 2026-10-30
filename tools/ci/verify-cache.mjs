import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {existsSync, lstatSync, mkdtempSync, readFileSync, readdirSync, readlinkSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, relative, resolve, sep} from 'node:path';
import {assertNode, env, readJson, root, writeJson, yarn} from './common.mjs';
import {loadGraph} from './selection.mjs';
assertNode();
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--projects')) throw new Error('Usage: verify-cache.mjs [--projects project,...]');
const graph = loadGraph();
const projects = args.length ? args[1].split(',') : readJson('test-results/ci/selection.json').targets.build;
if (!projects.length) throw new Error('Zero cache verification projects selected');
const outputs = projects.map(project => {
  const data = graph.nodes[project]?.data;
  if (data?.targets.build?.cache !== true) throw new Error(`${project}:build is missing a real cacheable build`);
  const path = resolve(root, data.root, 'dist');
  if (!path.startsWith(`${root}${sep}`) || !data.targets.build.outputs?.includes('{projectRoot}/dist')) throw new Error(`${project} lacks its own declared dist output`);
  return {project, path};
});
function inventory(directory) {
  const files = [];
  function visit(path) {
    for (const entry of readdirSync(path).sort()) {
      const file = join(path, entry);
      const stat = lstatSync(file);
      if (stat.isDirectory()) visit(file);
      else files.push({path: relative(directory, file), mode: stat.mode & 0o777, sha256: createHash('sha256').update(stat.isSymbolicLink() ? readlinkSync(file) : readFileSync(file)).digest('hex')});
    }
  }
  if (!existsSync(directory)) throw new Error(`Missing build output ${directory}`);
  visit(directory);
  if (!files.length) throw new Error(`Empty build output ${directory}`);
  return files;
}
const cache = mkdtempSync(join(tmpdir(), 'krds-ci-cache-'));
const report = {projects, cache: 'isolated local cache; no remote cache', first: [], restored: []};
try {
  const command = ['nx', 'run-many', '-t', 'build', `--projects=${projects.join(',')}`, '--parallel=2', '--outputStyle=static'];
  const options = {env: {...env, NX_CACHE_DIRECTORY: cache}};
  const firstLog = yarn(command, options);
  assert.ok(!firstLog.includes('[local cache]') && !firstLog.includes('[remote cache]'), 'The isolated first build unexpectedly used a cache');
  writeFileSync(join(cache, 'first.log'), firstLog);
  report.first = outputs.map(({project, path}) => ({project, files: inventory(path)}));
  // The workflow owns this checkout. Local agents use cache-snapshot.mjs to avoid deleting shared outputs.
  for (const output of outputs) rmSync(output.path, {recursive: true, force: true});
  const secondLog = yarn(command, options);
  for (const {project} of outputs) {
    const line = secondLog.split('\n').find(line => line.includes(`nx run ${project}:build `));
    assert.ok(line?.includes('[local cache]'), `${project}:build did not restore from its local cache\n${secondLog}`);
  }
  report.restored = outputs.map(({project, path}) => ({project, files: inventory(path)}));
  assert.deepEqual(report.restored, report.first, 'Cache restoration changed emitted files, bytes or permissions');
  report.status = 'passed';
  writeJson('test-results/ci/cache-restoration.json', report);
  writeFileSync(resolve(root, 'test-results/ci/cache-first.log'), firstLog);
  writeFileSync(resolve(root, 'test-results/ci/cache-second.log'), secondLog);
  console.log(`Verified cold build, local-cache hit and exact restoration for ${projects.length} real build target(s)`);
} catch (error) {
  writeJson('test-results/ci/cache-restoration.json', {...report, status: 'failed', error: error.message});
  throw error;
} finally { rmSync(cache, {recursive: true, force: true}); }
