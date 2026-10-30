import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

const stories = JSON.parse(readFileSync(new URL('../../../catalog/full-catalog-stories.json', import.meta.url), 'utf8')).cases;
const cases = [
  ['krds-contextual-help--removed-trigger', 'contextual-help-fallback'],
  ['krds-tooltip--trigger-removed', 'tooltip-fallback'],
] as const;

it.each(cases)('%s describes an actual post-removal state and usable host fallback', (id, fallbackId) => {
  const entry = stories.find((entry: { id: string }) => entry.id === id);
  expect(entry.host.removeTrigger).toBe(true);
  expect(entry.state.defaultOpen).toBe(false);
  expect(entry.state.fallbackFocusId).toBe(fallbackId);
  expect(entry.host.fallbackFocusId).toBe(fallbackId);
  expect(entry.host.fallbackLabel).toBe('다음 작업');
  expect(entry.expected).toEqual([{ role: 'button', name: '다음 작업' }]);
  expect(entry.expected).not.toContainEqual({ role: 'button', name: entry.state.triggerLabel });
  expect(entry.actions).toEqual([
    'Inspect the initial post-removal state without invoking the absent trigger.',
    'Reach and activate the actual configured host fallback button without reconstructing the removed control.',
  ]);
  expect(entry.assertions).toContainEqual({ kind: 'semantic', condition: 'Initial post-removal state has no native owned root, named trigger or popup.' });
  expect(entry.assertions).toContainEqual({ kind: 'semantic', condition: 'Inspecting or focusing this pure state does not establish native close/removal restoration; lifecycle restoration is verified separately by the 315 outcome cases.' });
});
