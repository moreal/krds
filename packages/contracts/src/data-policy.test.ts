import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const load = (name: string) => JSON.parse(readFileSync(new URL(`../../../catalog/full-catalog-${name}.json`, import.meta.url), 'utf8')).cases;
const stories = load('stories');
const scenarios = load('scenarios');
const story = (caseId: string) => stories.find((entry: { id: string }) => entry.id === `krds-${caseId}`);
const outcome = (componentId: string, caseId: string) => scenarios.find((entry: { componentId: string; caseId: string }) => entry.componentId === componentId && entry.caseId === caseId);

describe('reviewed catalog data policy', () => {
  it('uses valid complete processes and preserves the actual optional skip transaction', () => {
    for (const entry of stories.filter((entry: { componentId: string }) => entry.componentId === 'step-indicator')) {
      expect(entry.state.steps.length, entry.id).toBeGreaterThanOrEqual(3);
      expect(entry.state.steps.length, entry.id).toBeLessThanOrEqual(7);
    }
    for (const state of [story('step-indicator--optional-skip').state, outcome('step-indicator', 'outcome-05').initialState]) {
      expect(state.steps).toEqual([
        { id: 'prerequisite', label: '기본 정보 확인', status: 'complete' },
        { id: 'a', label: '선택 단계', status: 'current', optional: true },
        { id: 'b', label: '최종 검토', status: 'pending' },
      ]);
    }
    expect(outcome('step-indicator', 'outcome-05').host.skipDestination).toBe('/local/review');
  });

  it('distinguishes static tag lists from homogeneous interactive groups', () => {
    for (const entry of stories.filter((entry: { componentId: string }) => entry.componentId === 'tag')) {
      expect(entry.expected).toEqual([{ role: entry.state.mode === 'static' ? 'list' : 'group' }]);
    }
  });

  it('names the actual load-more purpose and closed outline disclosure', () => {
    for (const id of ['load-more', 'load-failure']) {
      expect(story(`pagination--${id}`).expected).toEqual([{ role: 'navigation', name: '결과 더보기' }]);
    }
    expect(story('pagination--number-links').expected).toEqual([{ role: 'navigation', name: '페이지 이동' }]);
    expect(story('in-page-navigation--mobile-disclosure').expected).toContainEqual({ role: 'button', name: '구성 펼치기' });
  });

  it('requires the language dropdown button without inventing a landmark', () => {
    expect(story('language-switcher--dropdown').expected).toEqual([{ role: 'button', name: '언어: 한국어' }]);
  });

  it('associates each alternative-information region with its supplied media title', () => {
    for (const entry of stories.filter((entry: { componentId: string }) => entry.componentId === 'accessible-media')) {
      expect(entry.expected).toEqual([{ role: 'region', name: `${entry.state.title} 대체 정보` }]);
    }
  });

  it('starts progressive navigation closed with a purposeful action name', () => {
    const entry = story('side-navigation--deep-progressive');
    expect(entry.state.defaultExpandedIds).toEqual([]);
    expect(entry.state.currentId).toBeUndefined();
    expect(entry.expected).toContainEqual({ role: 'button', name: '분류 펼치기' });
  });

  it('starts the browser and in-app loss guard with actual dirty input', () => {
    const entry = outcome('back-button', 'outcome-05');
    expect(entry.initialState.dirty).toBe(true);
    expect(entry.host.confirmationMode).toBe('interactive-modal');
    expect(entry.host.confirmationInitiallyPending).toBe(true);
    expect(entry.host).not.toHaveProperty('confirmationResult');
  });
});
