import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync, existsSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';
const api = await import('./process-runner.mjs').catch(() => ({}));
function temp(t) { const dir = mkdtempSync(join(tmpdir(), 'krds-process-')); t.after(() => rmSync(dir, {recursive: true, force: true})); return dir; }
test('real child output reaches the live timestamped prefixed log before completion', async t => {
  assert.equal(typeof api.runCommand, 'function'); const dir = temp(t); const logPath = join(dir, 'live.log');
  const pending = api.runCommand({command: process.execPath, args: ['-e', "console.log('early');setTimeout(()=>console.error('late'),400)"], cwd: dir, env: process.env, timeoutMs: 3000, logPath, label: 'live'});
  for (let i = 0; i < 40 && !(existsSync(logPath) && readFileSync(logPath, 'utf8').includes('[live] early')); i++) await delay(20);
  const live = readFileSync(logPath, 'utf8'); assert.match(live, /\d{4}-.*\[live\].*early/); assert.doesNotMatch(live, /\[live\] late/);
  const out = await pending; assert.equal(out.status, 'passed'); assert.equal(out.exitCode, 0); assert.ok(out.durationMs >= 300); assert.match(readFileSync(logPath, 'utf8'), /completed.*passed/);
});
test('timeout collects process diagnostics and kills a TERM-resistant real grandchild process group', async t => {
  assert.equal(typeof api.runCommand, 'function'); const dir = temp(t); const pidFile = join(dir, 'grandchild.pid');
  const grandchild = `require('node:fs').writeFileSync(${JSON.stringify(pidFile)},String(process.pid));process.on('SIGTERM',()=>{});setInterval(()=>{},100)`;
  const script = `require('node:child_process').spawn(process.execPath,['-e',${JSON.stringify(grandchild)}],{stdio:'inherit'});process.on('SIGTERM',()=>{});setInterval(()=>{},100)`;
  const out = await api.runCommand({command: process.execPath, args: ['-e', script], cwd: dir, timeoutMs: 500, graceMs: 100, logPath: join(dir, 'timeout.log'), label: 'timeout'});
  assert.equal(out.status, 'timed-out'); assert.ok(out.durationMs < 3000); assert.ok(out.diagnostics.processTree.includes('PID')); assert.ok(out.diagnostics.signals.includes('SIGKILL'));
  const pid = Number(readFileSync(pidFile, 'utf8')); let alive = true;
  for (let i = 0; i < 40 && alive; i++) { try { process.kill(pid, 0); await delay(20); } catch { alive = false; } }
  assert.equal(alive, false, `grandchild ${pid} survived timeout cleanup`);
});
test('spawn failures and nonzero exits produce failing diagnostics without rejecting or hanging', async t => {
  assert.equal(typeof api.runCommand, 'function'); const dir = temp(t);
  const missing = await api.runCommand({command: join(dir, 'not-a-command'), args: [], cwd: dir, timeoutMs: 1000, logPath: join(dir, 'missing.log'), label: 'missing'});
  assert.equal(missing.status, 'failed'); assert.match(missing.error, /ENOENT/);
  const failed = await api.runCommand({command: process.execPath, args: ['-e', 'process.exit(7)'], cwd: dir, timeoutMs: 1000, logPath: join(dir, 'failed.log'), label: 'failed'});
  assert.equal(failed.status, 'failed'); assert.equal(failed.exitCode, 7);
});

test('Lit reporter exposes file/subtest start and completion using real Node test events', async t => {
  const {writeFileSync} = await import('node:fs');
  const {resolve} = await import('node:path');
  const dir = temp(t); const file = join(dir, 'sample.test.mjs');
  writeFileSync(file, "import test from 'node:test'; test('lit diagnostic sample',()=>{});");
  const out = await api.runCommand({command: process.execPath, args: ['--test', `--test-reporter=${resolve('tools/ci/lit-test-reporter.mjs')}`, file], env: Object.fromEntries(Object.entries(process.env).filter(([key]) => key !== 'NODE_TEST_CONTEXT')), cwd: dir, timeoutMs: 3000, logPath: join(dir, 'reporter.log'), label: 'reporter'});
  assert.equal(out.status, 'passed');
  const log = readFileSync(join(dir, 'reporter.log'), 'utf8');
  assert.match(log, /START.*lit diagnostic sample/); assert.match(log, /PASS.*lit diagnostic sample/); assert.match(log, /sample.test.mjs/);
});

test('cache verification runs exactly scoped cold/restored builds through bounded real streaming processes', async t => {
  const {writeFileSync} = await import('node:fs');
  const cache = await import('./verify-cache.mjs');
  assert.equal(typeof cache.verifyCache, 'function');
  const dir = temp(t); const reportPath = join(dir, 'cache-restoration.json');
  const graph = {nodes: {'krds-tokens': {data: {root: 'packages/tokens', targets: {build: {cache: true, outputs: ['{projectRoot}/dist']}}}}}};
  let calls = 0;
  const report = await cache.verifyCache({projects: ['krds-tokens'], graph, rootDir: dir, reportPath, timeoutMs: 3000, runner: command => {
    assert.ok(command.timeoutMs > 0 && command.timeoutMs <= 3000);
    assert.ok(command.args.includes('--projects=krds-tokens')); assert.ok(command.args.includes('--parallel=2')); assert.ok(command.args.includes('--outputStyle=stream'));
    calls++;
    const script = `const f=require('node:fs');f.mkdirSync('packages/tokens/dist',{recursive:true});f.writeFileSync('packages/tokens/dist/token.txt','same bytes');console.log('nx run krds-tokens:build ${calls === 2 ? '[local cache]' : ''}');`;
    return api.runCommand({...command, command: process.execPath, args: ['-e', script]});
  }});
  assert.equal(calls, 2); assert.equal(report.status, 'passed'); assert.deepEqual(report.first, report.restored);
  assert.equal(JSON.parse(readFileSync(reportPath)).status, 'passed');
  await assert.rejects(() => cache.verifyCache({projects: [], graph, rootDir: dir, reportPath, timeoutMs: 1000}), /zero/i);
  await assert.rejects(() => cache.verifyCache({projects: ['krds-tokens', 'krds-tokens'], graph, rootDir: dir, reportPath, timeoutMs: 1000}), /duplicate/i);
});

test('cache verification scopes to named dist entries and leaves a sibling docs-preview artifact untouched', async t => {
  const {mkdirSync, writeFileSync, existsSync} = await import('node:fs');
  const {verifyCache} = await import('./verify-cache.mjs');
  const dir = temp(t); const reportPath = join(dir, 'cache-restoration.json');
  // Fixture builds name their own dist entries because dist/docs-preview belongs to another target.
  const graph = {nodes: {'fixture-x': {data: {root: 'apps/fixture-x', targets: {build: {cache: true, outputs: ['{projectRoot}/dist/index.html', '{projectRoot}/dist/assets']}}}}}};
  mkdirSync(join(dir, 'apps/fixture-x/dist/docs-preview'), {recursive: true});
  writeFileSync(join(dir, 'apps/fixture-x/dist/docs-preview/artifact-manifest.json'), '{}');
  let calls = 0;
  const report = await verifyCache({projects: ['fixture-x'], graph, rootDir: dir, reportPath, timeoutMs: 3000, runner: async ({logPath}) => {
    calls++;
    if (calls === 2) assert.ok(existsSync(join(dir, 'apps/fixture-x/dist/docs-preview/artifact-manifest.json')), 'only declared outputs are removed');
    mkdirSync(join(dir, 'apps/fixture-x/dist/assets'), {recursive: true});
    writeFileSync(join(dir, 'apps/fixture-x/dist/index.html'), '<p>ordinary</p>');
    writeFileSync(join(dir, 'apps/fixture-x/dist/assets/main.js'), 'export {}');
    writeFileSync(logPath, calls === 2 ? 'nx run fixture-x:build  [local cache]\n' : 'nx run fixture-x:build\n');
    return {status: 'passed'};
  }});
  assert.equal(report.status, 'passed');
  assert.deepEqual(report.first.map(entry => entry.project), ['fixture-x'], 'one entry per project, as the worker coverage check requires');
  assert.deepEqual(report.first[0].outputs, ['apps/fixture-x/dist/index.html', 'apps/fixture-x/dist/assets']);
  assert.deepEqual(report.first[0].files.map(file => file.path), ['dist/index.html', 'dist/assets/main.js']);
  assert.deepEqual(report.first, report.restored);
  assert.ok(existsSync(join(dir, 'apps/fixture-x/dist/docs-preview/artifact-manifest.json')));
  const outside = {nodes: {'fixture-x': {data: {root: 'apps/fixture-x', targets: {build: {cache: true, outputs: ['{projectRoot}/dist/index.html', '{workspaceRoot}/apps/other/dist']}}}}}};
  await assert.rejects(() => verifyCache({projects: ['fixture-x'], graph: outside, rootDir: dir, reportPath, timeoutMs: 1000}), /lacks its own declared dist output/);
  const self = {nodes: {'fixture-x': {data: {root: 'apps/fixture-x', targets: {build: {cache: true, outputs: ['{projectRoot}']}}}}}};
  await assert.rejects(() => verifyCache({projects: ['fixture-x'], graph: self, rootDir: dir, reportPath, timeoutMs: 1000}), /lacks its own declared dist output/);
  const none = {nodes: {'fixture-x': {data: {root: 'apps/fixture-x', targets: {build: {cache: true, outputs: []}}}}}};
  await assert.rejects(() => verifyCache({projects: ['fixture-x'], graph: none, rootDir: dir, reportPath, timeoutMs: 1000}), /lacks its own declared dist output/);
});

test('cache semantics accept hosted ANSI headers while preserving raw logs and exact project/byte/mode guards', async t => {
  const {mkdirSync, writeFileSync, chmodSync} = await import('node:fs');
  const {verifyCache} = await import('./verify-cache.mjs');
  // Exact target-header shape from hosted run 41188558471, shared worker.
  const header = project => `2026-10-31T09:29:19.557Z [cache:second] ::group::🔁 \x1b[2m> \x1b[22m\x1b[2mnx run\x1b[22m ${project}:build  \x1b[2m[local cache]\x1b[22m\n`;
  for (const scenario of ['hosted', 'wrong-project', 'project-suffix', 'cold-local', 'cold-remote', 'bytes', 'mode']) {
    await t.test(scenario, async t => {
      const dir = temp(t); const reportPath = join(dir, 'cache-restoration.json');
      const graph = {nodes: {'krds-tokens': {data: {root: 'packages/tokens', targets: {build: {cache: true, outputs: ['{projectRoot}/dist']}}}}}};
      const logs = []; let calls = 0;
      const pending = verifyCache({projects: ['krds-tokens'], graph, rootDir: dir, reportPath, timeoutMs: 3000, runner: async ({logPath}) => {
        calls++;
        mkdirSync(join(dir, 'packages/tokens/dist'), {recursive: true});
        const file = join(dir, 'packages/tokens/dist/token.txt');
        writeFileSync(file, scenario === 'bytes' && calls === 2 ? 'different bytes' : 'same bytes');
        chmodSync(file, scenario === 'mode' && calls === 2 ? 0o600 : 0o644);
        const log = calls === 1
          ? (scenario.startsWith('cold-') ? `nx run krds-tokens:build [${scenario === 'cold-local' ? 'local' : 'remote'} \x1b[2mcache\x1b[22m]\n` : 'cold build\n')
          : header(scenario === 'wrong-project' ? 'krds-styles' : scenario === 'project-suffix' ? 'krds-tokens-extra' : 'krds-tokens');
        logs.push({logPath, log}); writeFileSync(logPath, log);
        return {status: 'passed', exitCode: 0};
      }});
      if (scenario === 'hosted') {
        const report = await pending;
        assert.equal(report.status, 'passed'); assert.deepEqual(report.restored, report.first);
      } else {
        await assert.rejects(pending, scenario.startsWith('cold-') ? /first build unexpectedly used a cache/ : ['bytes', 'mode'].includes(scenario) ? /changed emitted files, bytes or permissions/ : /krds-tokens:build did not restore/);
        assert.equal(JSON.parse(readFileSync(reportPath)).status, 'failed');
      }
      for (const {logPath, log} of logs) assert.equal(readFileSync(logPath, 'utf8'), log, 'Semantic normalization must not rewrite raw evidence');
    });
  }
});

test('outer timeout also cleans up nested runners with their own detached grandchildren', async t => {
  const {resolve} = await import('node:path');
  const {pathToFileURL} = await import('node:url');
  const dir = temp(t); const pidFile = join(dir, 'nested.pid');
  const leaf = `require('node:fs').writeFileSync(${JSON.stringify(pidFile)},String(process.pid));process.on('SIGTERM',()=>{});setInterval(()=>{},100)`;
  const nested = `import {runCommand} from ${JSON.stringify(pathToFileURL(resolve('tools/ci/process-runner.mjs')).href)};await runCommand({command:process.execPath,args:['-e',${JSON.stringify(leaf)}],cwd:${JSON.stringify(dir)},timeoutMs:60000,logPath:${JSON.stringify(join(dir, 'inner.log'))},label:'inner'});`;
  const out = await api.runCommand({command: process.execPath, args: ['--input-type=module', '-e', nested], cwd: dir, timeoutMs: 500, graceMs: 150, logPath: join(dir, 'outer.log'), label: 'outer'});
  const pid = Number(readFileSync(pidFile, 'utf8'));
  t.after(() => { try { process.kill(pid, 'SIGKILL'); } catch {} });
  assert.equal(out.status, 'timed-out');
  let alive = true;
  for (let i = 0; i < 30 && alive; i++) { try { process.kill(pid, 0); await delay(20); } catch { alive = false; } }
  assert.equal(alive, false, `nested detached process ${pid} survived outer worker timeout`);
});

test('timeout tracks independent detached TERM-resistant children before their noncooperating parent exits', async t => {
  for (const parentIgnoresTerm of [true, false]) {
    const dir = temp(t); const pidFile = join(dir, 'detached.pid');
    const leaf = `require('node:fs').writeFileSync(${JSON.stringify(pidFile)},String(process.pid));process.on('SIGTERM',()=>{});setInterval(()=>{},100)`;
    const parent = `require('node:child_process').spawn(process.execPath,['-e',${JSON.stringify(leaf)}],{detached:true,stdio:'ignore'}).unref();${parentIgnoresTerm ? "process.on('SIGTERM',()=>{});" : ''}setInterval(()=>{},100)`;
    let pid;
    try {
      const out = await api.runCommand({command: process.execPath, args: ['-e', parent], cwd: dir, timeoutMs: 500, graceMs: 100, logPath: join(dir, 'detached.log'), label: `detached-${parentIgnoresTerm ? 'resistant' : 'exiting'}-parent`});
      pid = Number(readFileSync(pidFile, 'utf8'));
      assert.equal(out.status, 'timed-out'); assert.ok(out.durationMs < 5000);
      if (process.env.CI_REQUIRE_PROCESS_DISCOVERY === '1') assert.equal(out.diagnostics.discovery?.status, 'available', 'this proof requires successful process discovery');
      if (out.diagnostics.discovery?.status === 'available') {
        assert.ok(out.diagnostics.trackedProcesses.some(p => p.pid === pid && p.group === pid), 'independently detached group must be retained');
        assert.ok(out.diagnostics.signalTargets.some(p => p.id === pid && p.signal === 'SIGKILL'), 'must force-kill detached descendant, not only root PGID');
        let alive = true;
        for (let i = 0; i < 40 && alive; i++) { try { process.kill(pid, 0); await delay(20); } catch { alive = false; } }
        assert.equal(alive, false, `noncooperating detached leaf ${pid} survived timeout cleanup`);
        assert.equal(out.diagnostics.cleanup, 'tracked-processes-terminated');
      } else {
        assert.equal(out.diagnostics.discovery?.status, 'unavailable');
        assert.match(out.diagnostics.cleanup, /^partial-/);
        assert.match(out.diagnostics.cleanupWarning, /cannot verify.*detached/i);
      }
    } finally {
      if (!pid && existsSync(pidFile)) pid = Number(readFileSync(pidFile, 'utf8'));
      if (pid) { try { process.kill(-pid, 'SIGKILL'); } catch {} }
    }
  }
});
