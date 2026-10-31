import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {existsSync, lstatSync, mkdtempSync, readFileSync, readdirSync, readlinkSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join, relative, resolve, sep} from 'node:path';
import {pathToFileURL} from 'node:url';
import {stripVTControlCharacters} from 'node:util';
import {assertNode, env, readJson, root, writeJson} from './common.mjs';
import {loadGraph} from './selection.mjs';
import {runCommand} from './process-runner.mjs';
function inventory(directory) {
  const files = [];
  function visit(path) {
    for (const entry of readdirSync(path).sort()) {
      const file = join(path, entry); const stat = lstatSync(file);
      if (stat.isDirectory()) visit(file);
      else files.push({path: relative(directory, file), mode: stat.mode & 0o777, sha256: createHash('sha256').update(stat.isSymbolicLink() ? readlinkSync(file) : readFileSync(file)).digest('hex')});
    }
  }
  assert.ok(existsSync(directory), `Missing build output ${directory}`); visit(directory);
  assert.ok(files.length, `Empty build output ${directory}`); return files;
}
export async function verifyCache({projects, graph, rootDir = root, reportPath = resolve(rootDir, 'test-results/ci/cache-restoration.json'), timeoutMs = 20 * 60_000, runner = runCommand}) {
  const started = Date.now();
  const report = {projects, cache: 'isolated local cache; no remote cache', status: 'running', first: [], restored: [], commands: []};
  writeJson(reportPath, report);
  let cache;
  try {
    assert.ok(Array.isArray(projects) && projects.length, 'Zero cache verification projects selected');
    assert.equal(new Set(projects).size, projects.length, 'Duplicate cache verification projects');
    assert.ok(Number.isFinite(timeoutMs) && timeoutMs > 0, 'Positive cache timeout required');
    const outputs = projects.map(project => {
      const data = graph.nodes[project]?.data;
      assert.equal(data?.targets?.build?.cache, true, `${project}:build is missing a real cacheable build`);
      const path = resolve(rootDir, data.root, 'dist');
      assert.ok(path.startsWith(`${rootDir}${sep}`) && data.targets.build.outputs?.includes('{projectRoot}/dist'), `${project} lacks its own declared dist output`);
      return {project, path};
    });
    assert.equal(new Set(outputs.map(o => o.path)).size, outputs.length, 'Duplicate cache output paths');
    cache = mkdtempSync(join(tmpdir(), 'krds-ci-cache-'));
    const command = ['tools/yarn.mjs', 'nx', 'run-many', '-t', 'build', `--projects=${projects.join(',')}`, '--parallel=2', '--outputStyle=stream'];
    const build = async phase => {
      // Leave cleanup time inside the outer worker command timeout.
      const remaining = timeoutMs - (Date.now() - started) - Math.min(10_000, timeoutMs / 10);
      assert.ok(remaining > 0, 'Cache verification budget exhausted');
      const logPath = join(dirname(reportPath), `cache-${phase}.log`);
      const outcome = await runner({command: process.execPath, args: command, cwd: rootDir, env: {...env, NX_CACHE_DIRECTORY: cache}, timeoutMs: remaining, logPath, label: `cache:${phase}`});
      report.commands.push(outcome); writeJson(reportPath, report);
      assert.equal(outcome.status, 'passed', `Cache ${phase} build ${outcome.status}`);
      return readFileSync(logPath, 'utf8');
    };
    const firstLog = stripVTControlCharacters(await build('first'));
    assert.ok(!firstLog.includes('[local cache]') && !firstLog.includes('[remote cache]'), 'The isolated first build unexpectedly used a cache');
    report.first = outputs.map(({project, path}) => ({project, files: inventory(path)})); writeJson(reportPath, report);
    // Only the explicitly selected own dist outputs are removed in this worker checkout.
    for (const output of outputs) rmSync(output.path, {recursive: true, force: true});
    const secondLog = stripVTControlCharacters(await build('second'));
    for (const {project} of outputs) assert.ok(secondLog.split('\n').some(line => line.includes(`nx run ${project}:build `) && line.includes('[local cache]')), `${project}:build did not restore from local cache`);
    report.restored = outputs.map(({project, path}) => ({project, files: inventory(path)}));
    assert.deepEqual(report.restored, report.first, 'Cache restoration changed emitted files, bytes or permissions');
    report.status = 'passed'; writeJson(reportPath, report);
    console.log(`Verified cold build, local-cache hit and exact restoration for ${projects.length} real build target(s)`);
    return report;
  } catch (error) {
    report.status = 'failed'; report.error = error.message; writeJson(reportPath, report); throw error;
  } finally { if (cache) rmSync(cache, {recursive: true, force: true}); }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  assertNode();
  const args = process.argv.slice(2); const options = {};
  for (let i = 0; i < args.length; i += 2) {
    if (!['--projects', '--timeout-ms', '--report'].includes(args[i]) || args[i + 1] === undefined || Object.hasOwn(options, args[i])) throw new Error('Usage: verify-cache.mjs [--projects project,...] [--timeout-ms N] [--report PATH]');
    options[args[i]] = args[i + 1];
  }
  const reportPath = resolve(options['--report'] ?? 'test-results/ci/cache-restoration.json');
  writeJson(reportPath, {status: 'running', projects: [], first: [], restored: []});
  try {
    const projects = options['--projects'] !== undefined ? options['--projects'].split(',').filter(Boolean) : readJson('test-results/ci/selection.json').targets.build;
    if (!projects.length) throw new Error('Zero cache verification projects selected');
    await verifyCache({projects, graph: loadGraph(), reportPath, ...(options['--timeout-ms'] !== undefined ? {timeoutMs: Number(options['--timeout-ms'])} : {})});
  } catch (error) { writeJson(reportPath, {...readJson(reportPath), status: 'failed', error: error.message}); console.error(error.message); process.exitCode = 1; }
}
