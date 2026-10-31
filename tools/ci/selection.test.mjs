import test from 'node:test';
import assert from 'node:assert/strict';
const api = await import('./selection.mjs').catch(() => ({}));

test('PR scope uses the merge base and the exact checked-out head', () => {
  const calls = [];
  const git = args => {
    calls.push(args);
    if (args[0] === 'rev-parse') return 'b'.repeat(40);
    if (args[0] === 'merge-base') return 'c'.repeat(40);
    return '';
  };
  assert.equal(typeof api.resolveScope, 'function');
  assert.deepEqual(api.resolveScope({base: 'a'.repeat(40), head: 'b'.repeat(40), git}), {
    mode: 'affected', base: 'c'.repeat(40), head: 'b'.repeat(40), reason: 'exact PR merge base',
  });
  assert.ok(calls.some(args => args.join(' ') === `merge-base ${'a'.repeat(40)} ${'b'.repeat(40)}`));
});

test('missing history and invalid SHA require full verification', () => {
  assert.equal(typeof api.resolveScope, 'function');
  for (const input of [
    {},
    {base: 'main', head: 'b'.repeat(40), git: () => 'b'.repeat(40)},
    {base: 'a'.repeat(40), head: 'b'.repeat(40), git: () => { throw new Error('unavailable history'); }},
  ]) assert.equal(api.resolveScope(input).mode, 'full');
});

test('a checkout of the wrong source SHA fails instead of validating a different PR', () => {
  assert.throws(() => api.resolveScope({base: 'a'.repeat(40), head: 'b'.repeat(40), git: () => 'd'.repeat(40)}), /checkout.*head/i);
});

test('selection rejects empty suites and missing required native targets', () => {
  assert.equal(typeof api.buildSelection, 'function');
  const testing = {requiredStorybookFrameworks: ['react'], requiredSiheomFrameworks: ['react'], unsupportedOrSeparate: []};
  assert.throws(() => api.buildSelection({}, [], testing), /zero/i);
  assert.throws(() => api.buildSelection({'fixture-react': {data: {targets: {build: {}, test: {}, contract: {}}}}}, ['fixture-react'], testing), /siheom/);
  assert.throws(() => api.buildSelection({'storybook-react': {data: {targets: {build: {}, test: {}, 'storybook-build': {}}}}}, ['storybook-react'], testing), /stories/);
});

test('unsupported siheom stays explicitly separate from required suites', () => {
  assert.equal(typeof api.buildSelection, 'function');
  const testing = {requiredStorybookFrameworks: ['lit'], requiredSiheomFrameworks: [], unsupportedOrSeparate: [{framework: 'lit', siheom: {status: 'unsupported-upstream'}}]};
  const targets = {build: {}, test: {}, contract: {}};
  const selection = api.buildSelection({'fixture-lit': {data: {targets}}}, ['fixture-lit'], testing);
  assert.deepEqual(selection.targets.contract, ['fixture-lit']);
  assert.deepEqual(selection.targets.siheom, []);
  assert.equal(selection.unsupported[0].framework, 'lit');
});

test('explicit unsupported Storybook quarantine preserves stable gates and executes its native alternatives', () => {
  const stable = ['react', 'solid', 'svelte', 'vue', 'lit', 'qwik', 'angular'];
  const testing = {requiredStorybookFrameworks: stable, requiredSiheomFrameworks: [], unsupportedOrSeparate: [{framework: 'solid-next', storybook: {status: 'pending-preview-validation', ci: {status: 'quarantined-unsupported-preview', project: 'storybook-solid-next', reason: 'Exact RC renderer integration remains unverified; native preview is required.', requiredAlternativeTargets: {'krds-solid-next': ['typecheck', 'build'], 'fixture-solid-next': ['typecheck', 'build', 'contract']}}}}]};
  const nodes = Object.fromEntries(stable.map(framework => [`storybook-${framework}`, {data: {targets: {build: {}, test: {}, 'storybook-build': {}, stories: {}}}}]));
  nodes['krds-solid-next'] = {data: {targets: {build: {}, typecheck: {}, test: {}}}};
  nodes['fixture-solid-next'] = {data: {targets: {build: {}, typecheck: {}, test: {}, contract: {}}}};
  nodes['storybook-solid-next'] = {data: {metadata: {capabilityStatus: 'quarantined-unsupported-preview'}, targets: {}}};
  const selection = api.buildSelection(nodes, Object.keys(nodes), testing);
  assert.deepEqual(selection.targets['storybook-build'], stable.map(framework => `storybook-${framework}`).sort());
  assert.deepEqual(selection.targets.stories, stable.map(framework => `storybook-${framework}`).sort());
  assert.deepEqual(selection.targets.contract, ['fixture-solid-next']);
  assert.ok(selection.targets.build.includes('krds-solid-next'));
  assert.ok(selection.targets.typecheck.includes('fixture-solid-next'));
  assert.equal(selection.projects.includes('storybook-solid-next'), false);
  assert.deepEqual(selection.omittedProjects, [{project: 'storybook-solid-next', capability: 'storybook', status: 'quarantined-unsupported-preview', reason: testing.unsupportedOrSeparate[0].storybook.ci.reason}]);
  const affected = api.buildSelection(nodes, ['storybook-solid-next'], testing);
  assert.deepEqual(affected.projects, ['fixture-solid-next', 'krds-solid-next']);
  for (const target of ['build', 'typecheck', 'test', 'storybook-build', 'stories']) {
    const resurrected = structuredClone(nodes); resurrected['storybook-solid-next'].data.targets[target] = {};
    assert.throws(() => api.buildSelection(resurrected, Object.keys(nodes), testing), /quarantin.*executable/i);
  }
  const missing = structuredClone(nodes); delete missing['fixture-solid-next'].data.targets.contract;
  assert.throws(() => api.buildSelection(missing, Object.keys(nodes), testing), /alternative.*contract/i);
  const stableExemption = structuredClone(testing); stableExemption.requiredStorybookFrameworks.push('solid-next');
  assert.throws(() => api.buildSelection(nodes, Object.keys(nodes), stableExemption), /required.*storybook.*quarantin/i);
});
