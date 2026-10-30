import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const load = kind => JSON.parse(readFileSync(new URL(`../../../catalog/full-catalog-${kind}.json`, import.meta.url), 'utf8')).cases;
const scenarios = load('scenarios');
const stories = load('stories');
const outcome = (componentId, caseId) => scenarios.find(entry => entry.componentId === componentId && entry.caseId === caseId);
const story = id => stories.find(entry => entry.id === `krds-${id}`);

test('external Disclosure close starts controlled without changing its closed value', () => {
  const state = outcome('disclosure', 'outcome-04').initialState;
  assert.equal(state.open, false);
  assert.equal(Object.hasOwn(state, 'defaultOpen'), false);
  assert.equal(state.contentId, 'application-help');
});

test('external Coach step replacement starts controlled while open ownership remains uncontrolled', () => {
  const state = outcome('coach-mark', 'outcome-02').initialState;
  assert.equal(state.stepId, 'one');
  assert.equal(Object.hasOwn(state, 'defaultStepId'), false);
  assert.equal(state.defaultOpen, true);
  assert.equal(Object.hasOwn(state, 'open'), false);
  assert.equal(state.steps[0].id, state.stepId);
});

test('ordinary native-interaction pure stories keep their uncontrolled defaults', () => {
  const disclosure = story('disclosure--interactive-content').state;
  assert.equal(disclosure.defaultOpen, false);
  assert.equal(Object.hasOwn(disclosure, 'open'), false);
  const coach = story('coach-mark--multi-step').state;
  assert.equal(coach.defaultOpen, true);
  assert.equal(coach.defaultStepId, 'one');
  assert.equal(Object.hasOwn(coach, 'open'), false);
  assert.equal(Object.hasOwn(coach, 'stepId'), false);
});
