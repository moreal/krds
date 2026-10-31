import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {assertNode, git, readJson, writeJson} from './common.mjs';
import {loadGraph, targets} from './selection.mjs';
import {quarantinedStorybooks} from './capabilities.mjs';

export const stableFrameworks = ['react', 'solid', 'svelte', 'vue', 'lit', 'qwik', 'angular'];
export const workerIds = [...stableFrameworks.map(f => `stable-${f}`), 'shared', 'docs', 'preview'];
const shared = new Map(['contracts', 'tokens', 'styles', 'assets', 'fonts'].map(p => [`krds-${p}`, 'shared']));
shared.set('krds-test-contracts', 'test');
shared.set('krds-workspace', 'tooling');
export const pairKey = p => `${p.channel}/${p.project}/${p.target}`;
export function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
  return JSON.stringify(value);
}
const equal = (a, b, message) => assert.equal(canonical(a), canonical(b), message);
function unique(values, label) {
  assert.ok(Array.isArray(values), `${label} must be an array`);
  assert.equal(new Set(values).size, values.length, `Duplicate ${label}`);
  return values;
}
function owner(project, data) {
  let id; let layer; let framework;
  if (shared.has(project)) { id = 'shared'; layer = shared.get(project); }
  else if (project === 'krds-docs') { id = 'docs'; layer = 'app'; }
  else {
    const match = /^(krds|fixture|storybook)-(react|solid|svelte|vue|lit|qwik|angular|solid-next)$/.exec(project);
    assert.ok(match && project !== 'storybook-solid-next', `Unknown project ownership: ${project}`);
    framework = match[2]; layer = match[1] === 'krds' ? 'adapter' : 'app';
    id = framework === 'solid-next' ? 'preview' : `stable-${framework}`;
  }
  if (data) {
    const tags = unique(data.tags, `${project} tags`);
    equal(tags.filter(t => t.startsWith('framework:')), framework ? [`framework:${framework}`] : [], `${project}: framework ownership mismatch`);
    equal(tags.filter(t => t.startsWith('layer:')), [`layer:${layer}`], `${project}: layer ownership mismatch`);
  }
  return id;
}
function validateOmissions(m, nodes) {
  assert.ok(Array.isArray(m.unsupported), 'unsupported metadata must be an array');
  unique(m.omittedProjects.map(p => p.project), 'omitted projects');
  const quarantines = quarantinedStorybooks({requiredStorybookFrameworks: stableFrameworks, unsupportedOrSeparate: m.unsupported});
  for (const omission of m.omittedProjects) {
    const q = quarantines.find(q => q.project === omission.project);
    assert.ok(q, `Unsupported omission ${omission.project}`);
    equal(omission, {project: q.project, capability: 'storybook', status: q.status, reason: q.reason}, 'Omission metadata mismatch');
    assert.ok(!m.expectedPairs.some(p => p.project === q.project), 'Omitted project has selected pairs');
    if (nodes) {
      const data = nodes[q.project]?.data;
      assert.ok(data && data.metadata?.capabilityStatus === q.status && !Object.keys(data.targets ?? {}).length, 'Quarantined graph project mismatch');
      equal(data.tags.filter(t => t.startsWith('framework:')), [`framework:${q.framework}`], 'Quarantined framework mismatch');
      equal(data.tags.filter(t => t.startsWith('layer:')), ['layer:app'], 'Quarantined layer mismatch');
    }
    for (const [project, required] of Object.entries(q.requiredAlternativeTargets)) for (const target of required) assert.ok(m.expectedPairs.some(p => p.project === project && p.target === target), `Missing quarantine alternative ${project}:${target}`);
  }
}
function digest(m) { const {selectionDigest, ...payload} = m; return createHash('sha256').update(canonical(payload)).digest('hex'); }
export function createManifest(selection, nodes, sourceSha) {
  unique(selection.projects, 'selected projects');
  assert.ok(selection.projects.length, 'Zero selected projects');
  unique(selection.stableProjects, 'stable projects'); unique(selection.previewProjects, 'preview projects');
  equal([...selection.stableProjects, ...selection.previewProjects].sort(), [...selection.projects].sort(), 'Channel coverage mismatch');
  for (const target of Object.keys(selection.targets)) assert.ok(targets.includes(target), `Unknown target ${target}`);
  const expectedPairs = [];
  for (const target of targets) unique(selection.targets[target] ?? [], `${target} projects`);
  for (const project of [...selection.projects].sort()) {
    const data = nodes[project]?.data; assert.ok(data, `Missing graph project ${project}`);
    const id = owner(project, data); const channel = id === 'preview' ? 'preview' : 'stable';
    assert.ok(selection[`${channel}Projects`].includes(project), `${project}: channel mismatch`);
    for (const target of targets) {
      const selected = (selection.targets[target] ?? []).includes(project);
      assert.equal(selected, Object.hasOwn(data.targets ?? {}, target), `${project}:${target} graph selection mismatch`);
      if (selected) expectedPairs.push({channel, project, target});
    }
  }
  for (const selected of Object.values(selection.targets).flat()) assert.ok(selection.projects.includes(selected), `Unselected target project ${selected}`);
  const m = {schemaVersion: 1, sourceSha, scope: structuredClone(selection.scope), omittedProjects: structuredClone(selection.omittedProjects ?? []), unsupported: structuredClone(selection.unsupported ?? []), expectedPairs, workers: workerIds.map(id => {
    const pairs = expectedPairs.filter(p => owner(p.project) === id);
    return {id, pairs, cacheProjects: pairs.filter(p => p.target === 'build').map(p => p.project).sort()};
  })};
  validateOmissions(m, nodes);
  m.selectionDigest = digest(m);
  return validateManifest(m, sourceSha);
}
export function validateManifest(m, sourceSha) {
  assert.ok(m && m.schemaVersion === 1, 'Unsupported manifest schema');
  assert.ok(/^[a-f0-9]{40}$/i.test(sourceSha ?? '') && m.sourceSha === sourceSha, 'Source SHA mismatch');
  assert.ok(m.scope && ['full', 'affected'].includes(m.scope.mode) && typeof m.scope.reason === 'string' && m.scope.reason.trim(), 'Malformed scope');
  if (m.scope.mode === 'affected') assert.ok(/^[a-f0-9]{40}$/i.test(m.scope.base ?? '') && m.scope.head === sourceSha, 'Affected scope SHA mismatch');
  assert.ok(Array.isArray(m.expectedPairs) && m.expectedPairs.length, 'Zero manifest pairs');
  const keys = [];
  for (const p of m.expectedPairs) {
    equal(Object.keys(p).sort(), ['channel', 'project', 'target'], 'Malformed manifest pair');
    assert.ok(targets.includes(p.target), `Unknown target ${p.target}`);
    assert.equal(p.channel, owner(p.project) === 'preview' ? 'preview' : 'stable', 'Pair channel mismatch');
    keys.push(pairKey(p));
  }
  unique(keys, 'manifest pairs');
  for (const target of ['build', 'test']) assert.ok(m.expectedPairs.some(p => p.target === target), `Zero ${target} pairs`);
  assert.ok(Array.isArray(m.workers), 'Malformed workers');
  equal(m.workers.map(w => w.id), workerIds, 'Worker ownership mismatch');
  for (const w of m.workers) {
    equal(w.pairs, m.expectedPairs.filter(p => owner(p.project) === w.id), `${w.id}: pair coverage mismatch`);
    equal(w.cacheProjects, w.pairs.filter(p => p.target === 'build').map(p => p.project).sort(), `${w.id}: cache coverage mismatch`);
  }
  assert.ok(Array.isArray(m.omittedProjects), 'Malformed omissions'); validateOmissions(m);
  assert.equal(m.selectionDigest, digest(m), 'Selection digest mismatch');
  return m;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  assertNode();
  if (process.argv.length > 2) throw new Error('Usage: partition.mjs');
  const manifest = createManifest(readJson('test-results/ci/selection.json'), loadGraph().nodes, git(['rev-parse', 'HEAD']));
  writeJson('test-results/ci/manifest.json', manifest);
  console.log(`Partitioned ${manifest.expectedPairs.length} selected pairs across ${manifest.workers.length} workers (${manifest.selectionDigest})`);
}
