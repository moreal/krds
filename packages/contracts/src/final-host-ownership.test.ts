import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

const load = (kind: string) => JSON.parse(readFileSync(new URL(`../../../catalog/full-catalog-${kind}.json`, import.meta.url), 'utf8')).cases;
const stories = load('stories');
const outcomes = load('scenarios');
const story = (id: string) => stories.find((entry: { id: string }) => entry.id === `krds-${id}`);
const outcome = (componentId: string, caseId: string) => outcomes.find((entry: { componentId: string; caseId: string }) => entry.componentId === componentId && entry.caseId === caseId);

it('declares host-authoritative aggregate roots without changing child reset baselines', () => {
  const partial = [story('checkbox--mixed-parent'), story('checkbox--initial-partial-reset'), outcome('checkbox', 'outcome-04'), outcome('checkbox', 'outcome-08')];
  for (const entry of [...partial, outcome('checkbox', 'outcome-05')]) {
    const state = entry.state ?? entry.initialState;
    expect(state.checked).toBe(false);
    expect(state).not.toHaveProperty('defaultChecked');
  }
  for (const entry of partial) {
    expect((entry.state ?? entry.initialState).indeterminate).toBe(true);
    expect(entry.host.children).toEqual([{ id: 'a', defaultChecked: true }, { id: 'b', defaultChecked: false }]);
  }
  expect(outcome('checkbox', 'outcome-05').host.children).toEqual([{ id: 'enabled', defaultChecked: false }, { id: 'disabled', defaultChecked: false, disabled: true }]);
});

it('keeps an aggregate unmixed when no eligible enabled child is selected, regardless of a disabled child', () => {
  const entry = outcome('checkbox', 'outcome-05');
  const eligible = entry.host.children.filter((child: { disabled?: boolean }) => !child.disabled);
  expect(eligible).toEqual([{ id: 'enabled', defaultChecked: false }]);
  const selected = eligible.filter((child: { defaultChecked: boolean }) => child.defaultChecked).length;
  expect(entry.initialState.indeterminate).toBe(selected > 0 && selected < eligible.length);
  expect(entry.initialState.indeterminate).toBe(false);
  const disabledSelected = entry.host.children.map((child: { disabled?: boolean; defaultChecked: boolean }) => child.disabled ? { ...child, defaultChecked: true } : child);
  expect(disabledSelected.filter((child: { disabled?: boolean }) => !child.disabled)).toEqual(eligible);
  expect(story('checkbox--mixed-parent').state.indeterminate).toBe(true);
});

it('declares external-start Coach ownership while retaining actual false/true initial presentation', () => {
  for (const [entry, open] of [[outcome('coach-mark', 'outcome-01'), false], [story('coach-mark--single'), true]] as const) {
    const state = entry.state ?? entry.initialState;
    expect(state.open).toBe(open);
    expect(state).not.toHaveProperty('defaultOpen');
    expect(state.defaultStepId).toBe('one');
  }
});

it('models rejected Stop through controlled open state rather than an unrejectable uncontrolled default', () => {
  for (const entry of [outcome('coach-mark', 'outcome-11'), story('coach-mark--stop-fallback-rejected')]) {
    const state = entry.state ?? entry.initialState;
    expect(state.open).toBe(true);
    expect(state).not.toHaveProperty('defaultOpen');
    expect(state.defaultStepId).toBe('one');
    expect(entry.host.acceptStop).toBe(false);
  }
});

it('starts ContextualHelp removal lifecycle with a real trigger and explicit later removal intent', () => {
  const entry = outcome('contextual-help', 'outcome-06');
  expect(entry.initialState.defaultOpen).toBe(false);
  expect(entry.host.removeTrigger).toBe(false);
  expect(entry.host.removeTriggerAction).toBe(true);
  expect(entry.initialState.fallbackFocusId).toBe('contextual-help-fallback');
  expect(entry.host.fallbackFocusId).toBe(entry.initialState.fallbackFocusId);
  expect(entry.host.fallbackLabel).toBe('다음 작업');
  expect(story('contextual-help--removed-trigger').host.removeTrigger).toBe(true);
});

it('preserves ordinary uncontrolled root counterexamples', () => {
  expect(story('checkbox--binary').state.defaultChecked).toBe(false);
  expect(story('checkbox--binary').state).not.toHaveProperty('checked');
  expect(story('coach-mark--action-gated').state.defaultOpen).toBe(true);
  expect(story('coach-mark--action-gated').state).not.toHaveProperty('open');
});
