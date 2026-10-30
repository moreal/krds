import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const load = kind => JSON.parse(readFileSync(new URL(`../../../catalog/full-catalog-${kind}.json`, import.meta.url), 'utf8')).cases;
const scenarios = load('scenarios').filter(entry => entry.componentId === 'bottom-sheet');
const stories = load('stories').filter(entry => entry.componentId === 'bottom-sheet');

test('drag-close then declared external reopen uses controlled open from mount', () => {
  const entry = scenarios.find(entry => entry.caseId === 'outcome-03');
  assert.equal(entry.initialState.open, true);
  assert.equal(Object.hasOwn(entry.initialState, 'defaultOpen'), false);
  assert.equal(entry.host.dragClose, true);
  assert.equal(entry.host.openerId, 'sheet-opener');
  assert.equal(entry.host.acceptChanges, true);
});

test('the other five BottomSheet outcomes retain ordinary uncontrolled ownership', () => {
  const ordinary = scenarios.filter(entry => entry.caseId !== 'outcome-03');
  assert.equal(ordinary.length, 5);
  for (const entry of ordinary) {
    assert.equal(entry.initialState.defaultOpen, true);
    assert.equal(Object.hasOwn(entry.initialState, 'open'), false);
  }
});

test('all seven pure BottomSheet stories retain their original uncontrolled defaults', () => {
  assert.equal(stories.length, 7);
  for (const entry of stories) {
    assert.equal(entry.state.defaultOpen, true);
    assert.equal(Object.hasOwn(entry.state, 'open'), false);
  }
});
