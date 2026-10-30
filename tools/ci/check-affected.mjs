import assert from 'node:assert/strict';
import {assertNode, readJson, writeJson, yarn} from './common.mjs';
import {buildSelection, loadGraph} from './selection.mjs';
assertNode();
const graph = loadGraph();
const testing = readJson('compatibility/testing.json');
assert.deepEqual([...testing.requiredStorybookFrameworks].sort(), ['angular', 'lit', 'qwik', 'react', 'solid', 'svelte', 'vue']);
assert.deepEqual([...testing.requiredSiheomFrameworks].sort(), ['angular', 'qwik', 'react', 'solid', 'svelte', 'vue']);
const frameworks = [...testing.requiredStorybookFrameworks, 'solid-next'];
const native = frameworks.map(f => `krds-${f}`);
const behaviors = [...frameworks.map(f => `fixture-${f}`), ...frameworks.map(f => `storybook-${f}`)];
const cases = [
  {file: 'packages/tokens/src/index.ts', expected: [...native, ...behaviors]},
  {file: 'packages/contracts/src/index.ts', expected: [...native, ...behaviors]},
  {file: 'packages/react/src/index.ts', expected: ['krds-react', 'fixture-react', 'storybook-react']},
  {file: 'yarn.lock', expected: Object.keys(graph.nodes)},
  {file: 'packages/test-contracts/src/fixtures/index.ts', expected: behaviors},
  ...['catalog/fixture-cases.json', 'catalog/story-cases.json', 'catalog/story-coverage.json'].map(file => ({file, expected: behaviors})),
];
const results = [];
for (const row of cases) {
  const projects = JSON.parse(yarn(['nx', 'show', 'projects', '--affected', `--files=${row.file}`, '--json']));
  const selection = buildSelection(graph.nodes, projects, testing);
  const missing = row.expected.filter(project => !projects.includes(project));
  results.push({...row, projects, targets: selection.targets, missing});
}
writeJson('test-results/ci/affected-regressions.json', results);
for (const row of results) assert.deepEqual(row.missing, [], `${row.file} failed to select mandatory native validation projects`);
console.log(`Actual Nx affected checks passed for ${results.length} change classes; known unsupported siheom: ${testing.unsupportedOrSeparate.map(row => row.framework).join(', ')}`);
