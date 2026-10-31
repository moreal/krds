import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const partition = await import('./partition.mjs').catch(() => ({}));
const aggregation = await import('./aggregate.mjs').catch(() => ({}));
const worker = await import('./run-targets.mjs');
const sha = 'a'.repeat(40);
const frameworks = ['react', 'solid', 'svelte', 'vue', 'lit', 'qwik', 'angular'];
function fixture() {
  const nodes = {};
  for (const framework of [...frameworks, 'solid-next']) for (const prefix of ['krds', 'fixture', ...(framework === 'solid-next' ? [] : ['storybook'])]) {
    const name = `${prefix}-${framework}`;
    nodes[name] = {data: {tags: [prefix === 'krds' ? 'layer:adapter' : 'layer:app', `framework:${framework}`], targets: {test: {}, build: {}}}};
  }
  for (const name of ['contracts', 'tokens', 'styles', 'assets', 'fonts', 'test-contracts']) nodes[`krds-${name}`] = {data: {tags: [`layer:${name === 'test-contracts' ? 'test' : 'shared'}`], targets: {test: {}, build: {}}}};
  nodes['krds-docs'] = {data: {tags: ['layer:app'], targets: {test: {}, build: {}}}};
  const projects = Object.keys(nodes).sort();
  return {nodes, selection: {projects, stableProjects: projects.filter(p => !p.endsWith('solid-next')), previewProjects: projects.filter(p => p.endsWith('solid-next')), targets: {test: projects, build: projects}, scope: {mode: 'full', reason: 'test full scope'}, omittedProjects: [], unsupported: []}};
}
function manifest() { const {nodes, selection} = fixture(); assert.equal(typeof partition.createManifest, 'function'); return partition.createManifest(selection, nodes, sha); }
function results(m) { return m.workers.map(w => ({schemaVersion: 1, sourceSha: sha, selectionDigest: m.selectionDigest, workerId: w.id, status: w.pairs.length ? 'passed' : 'not-selected', pairs: w.pairs.map(p => ({...p, status: 'passed'})), cache: {status: w.cacheProjects.length ? 'passed' : 'not-selected', projects: w.cacheProjects.map(project => ({project, status: 'passed'}))}, omittedProjects: m.omittedProjects, unsupported: m.unsupported})); }
const needs = () => Object.fromEntries(['select-and-check', 'native-stable', 'native-shared', 'native-docs', 'native-preview'].map(id => [id, {result: 'success'}]));

test('graph tags assign every selected pair exactly once across seven stable lanes, shared, docs and preview', () => {
  const m = manifest();
  assert.deepEqual(m.workers.map(w => w.id), ['stable-react', 'stable-solid', 'stable-svelte', 'stable-vue', 'stable-lit', 'stable-qwik', 'stable-angular', 'shared', 'docs', 'preview']);
  assert.equal(m.expectedPairs.length, 60);
  assert.deepEqual(m.workers.find(w => w.id === 'preview').cacheProjects, ['fixture-solid-next', 'krds-solid-next']);
  assert.deepEqual(m.workers.find(w => w.id === 'docs').pairs, [{channel: 'stable', project: 'krds-docs', target: 'test'}, {channel: 'stable', project: 'krds-docs', target: 'build'}]);
  assert.equal(partition.validateManifest(m, sha), m);
  const {nodes, selection} = fixture();
  assert.deepEqual(partition.createManifest({...selection, projects: [...selection.projects].reverse()}, nodes, sha), m);
});

test('unknown names, framework tags, duplicate ownership and inconsistent graph target selection are rejected', () => {
  assert.equal(typeof partition.createManifest, 'function');
  for (const mutate of [
    ({nodes}) => { nodes['krds-react'].data.tags = ['layer:adapter', 'framework:vue']; },
    ({nodes}) => { nodes['krds-react'].data.tags.push('framework:solid'); },
    ({nodes}) => { nodes['krds-react'].data.tags.push('framework:future'); },
    ({nodes}) => { nodes['krds-tokens'].data.tags = ['layer:app']; },
    ({nodes}) => { delete nodes['krds-react'].data.targets.test; },
    ({selection}) => { selection.targets.test.push('krds-react'); },
    ({selection}) => { selection.targets.test.pop(); },
    ({selection}) => { selection.stableProjects.push('krds-solid-next'); },
    ({nodes, selection}) => { nodes.mystery = {data: {tags: ['layer:shared'], targets: {test: {}}}}; selection.projects.push('mystery'); selection.stableProjects.push('mystery'); selection.targets.test.push('mystery'); },
  ]) { const f = fixture(); mutate(f); assert.throws(() => partition.createManifest(f.selection, f.nodes, sha)); }
});

test('workers reject source SHA, digest, malformed records, duplicate pair, worker ownership and cache coverage tampering', () => {
  const m = manifest();
  assert.throws(() => partition.validateManifest(m, 'b'.repeat(40)), /sha/i);
  for (const mutate of [
    x => { x.scope.reason = 'changed'; },
    x => { x.expectedPairs.push(x.expectedPairs[0]); },
    x => { x.workers[0].pairs.pop(); },
    x => { x.workers[0].id = 'stable-wrong'; },
    x => { x.workers[0].cacheProjects = []; },
    x => { x.expectedPairs[0].target = 'invented'; },
  ]) { const x = structuredClone(m); mutate(x); assert.throws(() => partition.validateManifest(x, sha)); }
});

test('supported quarantine metadata and required alternatives survive partition, invented omissions fail', () => {
  const f = fixture();
  const ci = {status: 'quarantined-unsupported-preview', project: 'storybook-solid-next', reason: 'upstream preview unavailable', requiredAlternativeTargets: {'krds-solid-next': ['build', 'typecheck'], 'fixture-solid-next': ['build', 'typecheck', 'contract']}};
  f.selection.unsupported = [{framework: 'solid-next', storybook: {status: 'pending-preview-validation', ci}}];
  f.selection.omittedProjects = [{project: ci.project, capability: 'storybook', status: ci.status, reason: ci.reason}];
  f.nodes[ci.project] = {data: {tags: ['layer:app', 'framework:solid-next'], targets: {}, metadata: {capabilityStatus: ci.status}}};
  for (const [project, targets] of Object.entries(ci.requiredAlternativeTargets)) for (const target of targets) { f.nodes[project].data.targets[target] = {}; (f.selection.targets[target] ??= []).push(...(f.selection.targets[target]?.includes(project) ? [] : [project])); }
  const m = partition.createManifest(f.selection, f.nodes, sha);
  assert.deepEqual(m.omittedProjects, f.selection.omittedProjects);
  assert.deepEqual(m.unsupported, f.selection.unsupported);
  f.selection.omittedProjects[0].reason = 'unreviewed omission';
  assert.throws(() => partition.createManifest(f.selection, f.nodes, sha));
});

test('explicit empty lanes succeed only with not-selected evidence and no cache invocation', async () => {
  const f = fixture(); const names = ['krds-react'];
  f.selection = {...f.selection, projects: names, stableProjects: names, previewProjects: [], targets: {test: names, build: names}};
  const m = partition.createManifest(f.selection, f.nodes, sha);
  const all = results(m);
  assert.equal(aggregation.aggregateResults(m, all, needs(), sha).status, 'passed');
  const temp = mkdtempSync(join(tmpdir(), 'krds-worker-'));
  try {
    const out = await worker.runWorker(m, 'preview', {sourceSha: sha, resultPath: join(temp, 'worker-result.json'), budgetMs: 1000, runner: () => { throw new Error('empty worker ran a command'); }});
    assert.equal(out.status, 'not-selected');
    assert.equal(JSON.parse(readFileSync(join(temp, 'worker-result.json'))).status, 'not-selected');
  } finally { rmSync(temp, {recursive: true, force: true}); }
  all.find(r => r.workerId === 'preview').status = 'passed';
  assert.equal(aggregation.aggregateResults(m, all, needs(), sha).status, 'failed');
});

test('aggregation rejects missing/duplicate/unexpected artifacts and incomplete/failed/duplicate pair/cache evidence', () => {
  const m = manifest(); assert.equal(typeof aggregation.aggregateResults, 'function');
  for (const mutate of [
    all => all.pop(), all => all.push(all[0]), all => all.push({...all[0], workerId: 'intruder'}),
    all => { all[0].pairs.pop(); }, all => { all[0].pairs.push(all[0].pairs[0]); }, all => { all[0].pairs[0].status = 'failed'; },
    all => { all[0].cache.projects.pop(); }, all => { all[0].cache.projects.push(all[0].cache.projects[0]); }, all => { all[0].cache.status = 'failed'; },
    all => { all[0].sourceSha = 'b'.repeat(40); }, all => { all[0].selectionDigest = 'wrong'; }, all => { all[0].omittedProjects = [{project: 'made-up'}]; },
    all => { all[0].status = 'not-selected'; }, all => { all[0].cache.projects[0].status = 'failed'; },
  ]) { const all = results(m); mutate(all); assert.equal(aggregation.aggregateResults(m, all, needs(), sha).status, 'failed'); }
});

test('aggregation requires exact successful job conclusions and keeps mandatory preview failure independent', () => {
  const m = manifest();
  for (const status of ['failure', 'cancelled', 'skipped', 'timed_out', undefined]) { const n = needs(); n['native-preview'].result = status; assert.equal(aggregation.aggregateResults(m, results(m), n, sha).status, 'failed'); }
  const missing = needs(); delete missing['select-and-check']; assert.equal(aggregation.aggregateResults(m, results(m), missing, sha).status, 'failed');
  const extra = needs(); extra.unexpected = {result: 'success'}; assert.equal(aggregation.aggregateResults(m, results(m), extra, sha).status, 'failed');
  const all = results(m); all.find(r => r.workerId === 'preview').pairs[0].status = 'timed-out';
  const out = aggregation.aggregateResults(m, all, needs(), sha);
  assert.equal(out.status, 'failed'); assert.equal(out.stable.status, 'passed'); assert.equal(out.preview.status, 'failed');
});

test('worker streams bounded Nx groups, isolates complete Lit test, continues failures and records incremental ledgers', async () => {
  const m = manifest(); const temp = mkdtempSync(join(tmpdir(), 'krds-worker-')); const calls = [];
  try {
    const resultPath = join(temp, 'worker-result.json');
    const out = await worker.runWorker(m, 'stable-lit', {sourceSha: sha, resultPath, budgetMs: 2_000_000, runner: async command => {
      const ledger = JSON.parse(readFileSync(resultPath)); assert.equal(ledger.status, 'running');
      calls.push(command);
      return {status: calls.length === 1 ? 'failed' : 'passed', exitCode: calls.length === 1 ? 1 : 0};
    }});
    assert.equal(out.status, 'failed');
    assert.ok(out.pairs.every(p => ['passed', 'failed'].includes(p.status)));
    const lit = calls.find(c => c.args.includes('--projects=fixture-lit'));
    assert.ok(lit); assert.equal(lit.timeoutMs, 600_000);
    assert.ok(calls.filter(c => c.args.includes('run-many')).every(c => c.args.includes('--parallel=2') && c.args.includes('--outputStyle=stream')));
    assert.equal(calls.at(-1).args.includes('tools/ci/verify-cache.mjs'), true);
    assert.equal(out.cache.status, 'failed'); // no cache report: process exit alone is insufficient evidence
  } finally { rmSync(temp, {recursive: true, force: true}); }
});

test('an exhausted worker budget leaves explicit incomplete evidence and never starts a command', async () => {
  const m = manifest(); const temp = mkdtempSync(join(tmpdir(), 'krds-worker-'));
  try {
    const out = await worker.runWorker(m, 'stable-react', {sourceSha: sha, resultPath: join(temp, 'worker-result.json'), budgetMs: 1, runner: () => { throw new Error('ran with exhausted budget'); }});
    assert.equal(out.status, 'failed'); assert.ok(out.pairs.every(p => p.status === 'incomplete')); assert.equal(out.cache.status, 'incomplete');
  } finally { rmSync(temp, {recursive: true, force: true}); }
});

test('recursive artifact collection ignores cache reports and exposes duplicate/unexpected worker evidence', async () => {
  const {mkdirSync, writeFileSync} = await import('node:fs');
  const temp = mkdtempSync(join(tmpdir(), 'krds-artifacts-'));
  try {
    const m = manifest(); const all = results(m);
    for (const result of all) {
      const dir = join(temp, `native-worker-${result.workerId}`, 'ci'); mkdirSync(dir, {recursive: true});
      writeFileSync(join(dir, 'worker-result.json'), JSON.stringify(result));
      writeFileSync(join(dir, 'cache-restoration.json'), JSON.stringify({workerId: 'not-a-worker', status: 'passed'}));
    }
    assert.equal(aggregation.aggregateResults(m, aggregation.readWorkerResults(temp), needs(), sha).status, 'passed');
    mkdirSync(join(temp, 'duplicate')); writeFileSync(join(temp, 'duplicate', 'worker-result.json'), JSON.stringify(all[0]));
    assert.equal(aggregation.aggregateResults(m, aggregation.readWorkerResults(temp), needs(), sha).status, 'failed');
    writeFileSync(join(temp, 'duplicate', 'worker-result.json'), JSON.stringify({...all[0], workerId: 'unrecognized'}));
    assert.equal(aggregation.aggregateResults(m, aggregation.readWorkerResults(temp), needs(), sha).status, 'failed');
  } finally { rmSync(temp, {recursive: true, force: true}); }
});

test('manifest structural ownership and coverage checks still reject evidence with a freshly computed digest', async () => {
  const {createHash} = await import('node:crypto');
  const m = manifest();
  for (const mutate of [
    x => { x.workers[0].pairs.push(x.workers.at(-1).pairs.pop()); },
    x => { x.workers[0].cacheProjects.push('krds-vue'); },
    x => { x.expectedPairs[0].project = 'unrecognized'; },
    x => { x.expectedPairs[0].channel = 'preview'; },
    x => { x.expectedPairs.push(x.expectedPairs[0]); },
  ]) {
    const x = structuredClone(m); mutate(x);
    const {selectionDigest, ...payload} = x;
    x.selectionDigest = createHash('sha256').update(partition.canonical(payload)).digest('hex');
    assert.throws(() => partition.validateManifest(x, sha));
  }
});

test('worker validates its manifest before starting commands and retains failure diagnostics', async () => {
  const m = manifest(); m.selectionDigest = 'invalid';
  const temp = mkdtempSync(join(tmpdir(), 'krds-invalid-worker-'));
  try {
    const resultPath = join(temp, 'worker-result.json');
    const out = await worker.runWorker(m, 'stable-react', {sourceSha: sha, resultPath, runner: () => { throw new Error('must not launch invalid manifest'); }});
    assert.equal(out.status, 'failed'); assert.match(out.error, /digest/i);
    assert.match(JSON.parse(readFileSync(resultPath)).error, /digest/i);
  } finally { rmSync(temp, {recursive: true, force: true}); }
});

test('a stale passed cache report cannot stand in for fresh worker verification', async () => {
  const {writeFileSync} = await import('node:fs');
  const m = manifest(); const lane = m.workers.find(w => w.id === 'stable-react');
  const temp = mkdtempSync(join(tmpdir(), 'krds-stale-cache-'));
  try {
    writeFileSync(join(temp, 'cache-restoration.json'), JSON.stringify({status: 'passed', projects: lane.cacheProjects, first: lane.cacheProjects.map(project => ({project})), restored: lane.cacheProjects.map(project => ({project}))}));
    const out = await worker.runWorker(m, lane.id, {sourceSha: sha, resultPath: join(temp, 'worker-result.json'), budgetMs: 2_000_000, runner: async () => ({status: 'passed', exitCode: 0})});
    assert.equal(out.status, 'failed'); assert.equal(out.cache.status, 'failed');
  } finally { rmSync(temp, {recursive: true, force: true}); }
});
