import test from 'node:test';
import assert from 'node:assert/strict';
import {readYamlFile} from 'nx/src/utils/fileutils.js';
import {assertNode, root, git} from './common.mjs';
import {mkdtemp, mkdir, copyFile, writeFile, readFile, access, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {createManifest} from './partition.mjs';
import {requiredJobs} from './aggregate.mjs';
import {dirname, join} from 'node:path';

// Nx is a direct, exactly pinned root dependency; use its installed YAML reader
// rather than importing an undeclared transitive parser or approximating YAML.
const workflow = readYamlFile(join(root, '.github/workflows/ci.yml'));
const stable = ['react', 'solid', 'svelte', 'vue', 'lit', 'qwik', 'angular'];
const families = ['native-stable', 'native-shared', 'native-docs', 'native-preview'];
const timeouts = {'select-and-check': 20, 'native-stable': 60, 'native-shared': 40, 'native-docs': 60, 'native-preview': 45, 'native-ci-result': 10};
const steps = id => workflow.jobs[id].steps;
const runs = id => steps(id).map(s => s.run ?? '').join('\n');
const action = (id, name) => steps(id).find(s => s.uses === name);
const expr = value => '${{ ' + value + ' }}';

test('retains triggers, least permissions, cancellation, exact job boundaries and Nx environment', () => {
  assert.deepEqual(workflow.on, {pull_request: null, push: {branches: ['main']}, workflow_dispatch: null});
  assert.deepEqual(workflow.permissions, {contents: 'read'});
  assert.deepEqual(workflow.concurrency, {group: 'native-ci-'+expr('github.event.pull_request.number || github.ref'), 'cancel-in-progress': true});
  assert.deepEqual(Object.keys(workflow.jobs).sort(), Object.keys(timeouts).sort());
  for (const [id, timeout] of Object.entries(timeouts)) {
    assert.equal(workflow.jobs[id]['timeout-minutes'], timeout, id);
    assert.equal(workflow.jobs[id]['runs-on'], 'ubuntu-latest');
    assert.equal(workflow.jobs[id]['continue-on-error'], undefined);
    assert.match(steps(id)[0].run, /RUNNER_TEMP/);
    assert.match(steps(id)[0].run, /CI_JOB_STARTED_MS/);
    assert.match(steps(id)[0].run, /diagnostic/);
    assert.ok(steps(id)[0].run.includes('echo "PLAYWRIGHT_BROWSERS_PATH=$RUNNER_TEMP/krds-playwright-1.64.1" >> "$GITHUB_ENV"'));
    assert.equal(workflow.jobs[id].env?.PLAYWRIGHT_BROWSERS_PATH, undefined);
    const upload = action(id, 'actions/upload-artifact@v4');
    assert.equal(upload.if, 'always()');
    assert.equal(upload.with['retention-days'], 14);
    assert.equal(upload.with['if-no-files-found'], 'error');
    assert.equal(steps(id).find(s => s.name === 'Collect diagnostic fallback').if, 'always()');
  }
  for (const key of ['NX_DAEMON', 'NX_ISOLATE_PLUGINS', 'NX_TUI', 'NX_INTERACTIVE']) assert.equal(workflow.env[key], 'false');
  assert.equal(workflow.env.NX_NO_CLOUD, 'true');
  assert.equal(workflow.env.PLAYWRIGHT_BROWSERS_PATH, undefined, 'runner context is unavailable in workflow-level env');
});

test('common checks explicitly cover new suites and preserve release, catalog, propagation and PR plans', () => {
  const commands = runs('select-and-check');
  for (const name of ['selection', 'release-integration', 'release-phases', 'parallel-ci', 'process-runner', 'portability', 'workflow']) assert.ok(commands.includes(`tools/ci/${name}.test.mjs`), name);
  for (const command of ['verify:workspace', 'verify:catalog', 'tools/ci/check-affected.mjs', 'tools/ci/check-release-config.mjs', 'tools/ci/check-plans.mjs', 'tools/ci/selection.mjs', 'tools/ci/partition.mjs']) assert.ok(commands.includes(command), command);
  assert.equal(steps('select-and-check').find(s => s.run?.includes('check-plans.mjs')).if, expr("github.event_name == 'pull_request'"));
  assert.deepEqual(workflow.jobs['select-and-check'].outputs, {source_sha: expr('steps.source.outputs.sha')});
  const common = steps('select-and-check');
  assert.ok(common.findIndex(s => s.run?.includes('tools/ci/selection.mjs')) < common.findIndex(s => s.run?.includes('check-plans.mjs')), 'PR plans consume the resolved selection');
  assert.equal(common.find(s => s.run?.includes('process-runner.test.mjs')).env.CI_REQUIRE_PROCESS_DISCOVERY, '1');
  const selection = steps('select-and-check').find(s => s.run?.includes('tools/ci/selection.mjs'));
  assert.deepEqual(selection.env, {PR_BASE_SHA: expr('github.event.pull_request.base.sha'), PR_HEAD_SHA: expr('github.event.pull_request.head.sha')});
  const artifact = steps('select-and-check').find(s => s.with?.name?.startsWith('native-selection-'));
  assert.equal(artifact.with.path, 'test-results/ci/manifest.json');
  assert.equal(artifact.if, 'always()');
});

test('workers have independent fresh exact-SHA checkout, immutable setup and unique always artifacts', () => {
  const matrix = workflow.jobs['native-stable'].strategy;
  assert.deepEqual(matrix, {'fail-fast': false, 'max-parallel': 7, matrix: {framework: stable}});
  const names = new Set();
  for (const id of families) {
    assert.equal(workflow.jobs[id].needs, 'select-and-check');
    const checkout = action(id, 'actions/checkout@v4');
    assert.deepEqual(checkout.with, {ref: expr('needs.select-and-check.outputs.source_sha'), 'fetch-depth': 0, 'persist-credentials': false});
    assert.ok(action(id, 'actions/setup-node@v4'));
    const download = action(id, 'actions/download-artifact@v4');
    assert.equal(download.with.name, 'native-selection-'+expr('github.run_id')+'-'+expr('github.run_attempt'));
    assert.equal(download.with.path, 'test-results/ci');
    const command = steps(id).find(s => s.run?.includes('tools/ci/run-targets.mjs'));
    assert.ok(command.run.includes('--manifest test-results/ci/manifest.json --worker "$CI_WORKER_ID" --budget-ms "$budget_ms"'));
    assert.match(command.run, /CI_JOB_STARTED_MS/);
    assert.match(command.run, /180000/);
    assert.match(command.run, /budget_ms.*-gt 60000/);
    assert.ok(command['timeout-minutes'] > 0 && command['timeout-minutes'] < timeouts[id]);
    assert.ok(!runs(id).includes('selection.mjs'));
    const browsers = steps(id).find(s => s.run?.includes('playwright install'));
    assert.equal(browsers.run.trim(), 'node tools/yarn.mjs exec playwright install --with-deps chromium firefox webkit');
    assert.equal(browsers['timeout-minutes'], 12);
    assert.equal(browsers.env, undefined, 'Browser cache must inherit the one workflow path');
    const upload = action(id, 'actions/upload-artifact@v4');
    assert.ok(upload.with.name.startsWith('native-worker-'));
    assert.ok(!names.has(upload.with.name)); names.add(upload.with.name);
    assert.equal(upload.with.path, 'test-results/');
  }
  assert.equal(workflow.jobs['native-stable'].env.CI_WORKER_ID, 'stable-'+expr('matrix.framework'));
  for (const id of families.slice(1)) assert.equal(workflow.jobs[id].env.CI_WORKER_ID, id.slice(7));
  assert.equal(action('native-stable', 'actions/setup-node@v4').with['node-version'], '24.18.0');
  const commands = runs('native-stable');
  assert.ok(commands.includes('node tools/yarn.mjs install --immutable'));
  for (const id of ['select-and-check', ...families]) {
    assert.equal(action(id, 'actions/setup-node@v4').with['node-version'], '24.18.0');
    assert.ok(runs(id).includes('node tools/yarn.mjs install --immutable'));
    assert.ok(runs(id).includes('check-toolchain.mjs --installed'));
    assert.equal(action(id, 'actions/cache@v4').with.path, '.yarn/cache');
    const check = steps(id).find(s => s.name === 'Check exact Node and vendored Yarn');
    assert.equal(check.run.trim(), 'node tools/ci/check-toolchain.mjs', 'Version check must run before installation state exists');
    assert.ok(steps(id).indexOf(check) < steps(id).findIndex(s => s.run?.includes('install --immutable')));
  }
  assert.ok(commands.includes('check-toolchain.mjs --installed'));
  const cache = action('native-stable', 'actions/cache@v4');
  assert.equal(cache.with.path, '.yarn/cache');
  assert.match(cache.with.key, /node24\.18\.0-yarn4\.14\.1/);
  for (const id of Object.keys(timeouts)) for (const step of steps(id)) assert.ok(step['timeout-minutes'] > 0, id+':'+(step.name ?? step.uses));
});

test('mandatory final job collects only worker artifacts and passes exact needs evidence to aggregator', () => {
  const job = workflow.jobs['native-ci-result'];
  assert.equal(job.if, 'always()');
  assert.deepEqual(job.needs, ['select-and-check', ...families]);
  const downloads = steps('native-ci-result').filter(s => s.uses === 'actions/download-artifact@v4');
  assert.equal(downloads.length, 2);
  assert.equal(downloads[0]['continue-on-error'], undefined);
  assert.equal(downloads[1].with.pattern, 'native-worker-*-'+expr('github.run_id')+'-'+expr('github.run_attempt'));
  assert.equal(downloads[1].with['merge-multiple'], false);
  const aggregate = steps('native-ci-result').find(s => s.run?.includes('tools/ci/aggregate.mjs'));
  assert.equal(aggregate.if, 'always()');
  assert.equal(aggregate.env.NEEDS_JSON, expr('toJSON(needs)'));
  assert.ok(aggregate.run.includes('node tools/ci/aggregate.mjs'), 'Builtin-only final job must work without installation');
  assert.ok(!runs('native-ci-result').includes('tools/yarn.mjs'));
  assert.ok(aggregate.run.includes('--manifest test-results/ci/manifest.json --results worker-results --needs test-results/ci/needs.json'));
  assert.ok(action('native-ci-result', 'actions/upload-artifact@v4').with.name.startsWith('native-final-'));
});


test('preinstall toolchain check and final aggregation run in a source fixture without dependency install state', async () => {
  assertNode();
  const directory = await mkdtemp(join(tmpdir(), 'krds-ci-no-install-'));
  try {
    for (const file of ['package.json', 'compatibility/toolchain.json', '.yarn/releases/yarn-4.14.1.cjs', 'tools/yarn.mjs', ...['common', 'check-toolchain', 'aggregate', 'partition', 'selection', 'capabilities'].map(name => `tools/ci/${name}.mjs`)]) {
      await mkdir(join(directory, dirname(file)), {recursive: true});
      await copyFile(join(root, file), join(directory, file));
    }
    const sourceSha = git(['rev-parse', 'HEAD']);
    const projects = ['krds-react'];
    const manifest = createManifest({projects, stableProjects: projects, previewProjects: [], targets: {test: projects, build: projects}, scope: {mode: 'full', reason: 'controlled CLI fixture'}, omittedProjects: [], unsupported: []}, {'krds-react': {data: {tags: ['layer:adapter', 'framework:react'], targets: {test: {}, build: {}}}}}, sourceSha);
    await mkdir(join(directory, 'test-results/ci'), {recursive: true});
    await writeFile(join(directory, 'test-results/ci/manifest.json'), JSON.stringify(manifest));
    await writeFile(join(directory, 'test-results/ci/needs.json'), JSON.stringify(Object.fromEntries(requiredJobs.map(id => [id, {result: 'success'}]))));
    for (const worker of manifest.workers) {
      await mkdir(join(directory, 'worker-results', worker.id), {recursive: true});
      await writeFile(join(directory, 'worker-results', worker.id, 'worker-result.json'), JSON.stringify({schemaVersion: 1, sourceSha, selectionDigest: manifest.selectionDigest, workerId: worker.id, status: worker.pairs.length ? 'passed' : 'not-selected', pairs: worker.pairs.map(pair => ({...pair, status: 'passed'})), cache: {status: worker.cacheProjects.length ? 'passed' : 'not-selected', projects: worker.cacheProjects.map(project => ({project, status: 'passed'}))}, omittedProjects: [], unsupported: []}));
    }
    const environment = {...process.env, GIT_DIR: join(root, '.git'), GIT_WORK_TREE: directory};
    for (const args of [['tools/ci/check-toolchain.mjs'], ['tools/ci/aggregate.mjs', '--manifest', 'test-results/ci/manifest.json', '--results', 'worker-results', '--needs', 'test-results/ci/needs.json']]) {
      const result = spawnSync(process.execPath, args, {cwd: directory, env: environment, encoding: 'utf8', timeout: 20000});
      assert.ifError(result.error);
      assert.equal(result.status, 0, result.stdout + result.stderr);
    }
    const final = JSON.parse(await readFile(join(directory, 'test-results/ci/final-result.json'), 'utf8'));
    assert.equal(final.status, 'passed');
    for (const path of ['node_modules', '.yarn/install-state.gz']) await assert.rejects(access(join(directory, path)), {code: 'ENOENT'});
  } finally { await rm(directory, {recursive: true, force: true}); }
});


test('pre-checkout diagnostics survive setup failure and collection preserves an existing worker ledger', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'krds-ci-failed-setup-'));
  try {
    for (const id of Object.keys(timeouts)) {
      const working = join(directory, id);
      await mkdir(working, {recursive: true});
      const environment = {...process.env, RUNNER_TEMP: join(working, 'runner'), GITHUB_ENV: join(working, 'github-env'), GITHUB_SHA: 'a'.repeat(40), CI_WORKER_ID: id === 'native-stable' ? 'stable-react' : id.slice(7)};
      const execute = command => {
        const result = spawnSync('bash', ['-e', '-o', 'pipefail', '-c', command], {cwd: working, env: environment, encoding: 'utf8', timeout: 10000});
        assert.ifError(result.error); assert.equal(result.status, 0, result.stdout + result.stderr);
      };
      execute(steps(id)[0].run);
      const fallback = steps(id).find(s => s.name === 'Collect diagnostic fallback').run;
      execute(fallback);
      assert.ok((await readFile(environment.GITHUB_ENV, 'utf8')).includes(`PLAYWRIGHT_BROWSERS_PATH=${environment.RUNNER_TEMP}/krds-playwright-1.64.1`));
      const diagnostic = JSON.parse(await readFile(join(working, 'test-results/ci/job-diagnostic.json'), 'utf8'));
      assert.equal(diagnostic.status, 'failed');
      if (families.includes(id)) {
        const ledger = join(working, 'test-results/ci/worker-result.json');
        assert.deepEqual(JSON.parse(await readFile(ledger, 'utf8')), diagnostic);
        await writeFile(ledger, '{"existing":"incremental worker ledger"}');
        execute(fallback);
        assert.deepEqual(JSON.parse(await readFile(ledger, 'utf8')), {existing: 'incremental worker ledger'});
      }
    }
  } finally { await rm(directory, {recursive: true, force: true}); }
});
