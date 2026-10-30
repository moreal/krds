import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

it('distinguishes FAB label presentation through actual args while retaining accessible names and expansion', () => {
  const cases = JSON.parse(readFileSync(new URL('../../../catalog/full-catalog-stories.json', import.meta.url), 'utf8')).cases;
  const fab = cases.filter((entry: { componentId: string }) => entry.componentId === 'fab');
  const icon = fab.find((entry: { caseId: string }) => entry.caseId === 'single-icon');
  const extended = fab.find((entry: { caseId: string }) => entry.caseId === 'extended-label');
  expect(icon.state.showLabel).toBe(false);
  expect(extended.state.showLabel).toBe(true);
  expect(icon.state.label).toBe('새 신청');
  expect(extended.state.label).toBe(icon.state.label);
  expect(icon.expected).toEqual(extended.expected);
  expect(fab.find((entry: { caseId: string }) => entry.caseId === 'expandable').state.actions).toHaveLength(2);
  for (const entry of fab.filter((entry: { caseId: string }) => !['single-icon', 'extended-label'].includes(entry.caseId))) {
    expect(entry.state).not.toHaveProperty('showLabel');
  }
});
