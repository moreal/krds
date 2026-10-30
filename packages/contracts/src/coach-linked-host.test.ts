import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

const load = (kind: string) => JSON.parse(readFileSync(new URL(`../../../catalog/full-catalog-${kind}.json`, import.meta.url), 'utf8')).cases;
const stories = load('stories');
const outcomes = load('scenarios');

it('declares the existing linked partial-Stop host in the two narrow Help specimens', () => {
  const story = stories.find((entry: { id: string }) => entry.id === 'krds-coach-mark--stop-partial-narrow-help');
  const outcome = outcomes.find((entry: { componentId: string; caseId: string }) => entry.componentId === 'coach-mark' && entry.caseId === 'outcome-12');
  for (const entry of [story, outcome]) {
    expect(entry.host.linkedTutorial).toBe(true);
    expect(entry.host.acceptRunningFalse).toBe(true);
    expect(entry.host.acceptOpenTrue).toBe(true);
    expect(entry.host.acceptTutorialTab).toBe(false);
    expect(entry.host.layout).toBe('narrow-modal');
    expect(entry.host.startActionPresent).toBe(false);
  }
});

it('retains a standalone action-gated Coach counterexample without implicit Tutorial composition', () => {
  const story = stories.find((entry: { id: string }) => entry.id === 'krds-coach-mark--action-gated');
  const outcome = outcomes.find((entry: { componentId: string; caseId: string }) => entry.componentId === 'coach-mark' && entry.caseId === 'outcome-03');
  for (const entry of [story, outcome]) {
    expect(entry.host.linkedTutorial).not.toBe(true);
    expect((entry.state ?? entry.initialState).steps.some((step: { requiresAction?: boolean }) => step.requiresAction)).toBe(true);
  }
});
