import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

const load = (kind: string) => JSON.parse(readFileSync(new URL(`../../../catalog/full-catalog-${kind}.json`, import.meta.url), 'utf8')).cases.filter((entry: { componentId: string }) => entry.componentId === 'masthead');
const stories = load('stories');
const outcomes = load('scenarios');
const notice = '공식 정부서비스를 가정한 배너 UI 예시입니다. 실제 공식 정부서비스가 아닙니다.';
const official = '이 누리집은 대한민국 공식 전자정부 누리집입니다.';

it('uses actual true props and visibly labels every simulated official-wording specimen', () => {
  for (const entry of [...stories, ...outcomes.filter((entry: { caseId: string }) => entry.caseId !== 'outcome-03')]) {
    expect(entry.state ?? entry.initialState).toEqual({ governmentService: true });
    expect(entry.host.specimenLabel).toBe(notice);
    expect(entry.host.authorizedGovernmentHost).toBe(false);
  }
});

it('requires both the exact official paragraph and visible simulation notice in each story', () => {
  expect(stories).toHaveLength(3);
  for (const entry of stories) {
    expect(entry.expected).toEqual([
      { role: 'paragraph', visibleText: official },
      { role: 'paragraph', visibleText: notice },
    ]);
  }
});

it('retains the independent false branch and explicitly forbids an official assertion', () => {
  const independent = outcomes.find((entry: { caseId: string }) => entry.caseId === 'outcome-03');
  expect(independent.initialState).toEqual({ governmentService: false });
  expect(independent.host.authorizedGovernmentHost).toBe(false);
  expect(independent.host.specimenLabel).toBe('비공식 독립 로컬 예제');
  expect(independent.assertions).toContainEqual({ kind: 'semantic', condition: 'The exact official-service sentence is absent from the entire independent page; governmentService:false must never be overridden by the host or an unsupported specimen prop.' });
});

it('never passes an unsupported specimen prop or changes existing API identity', () => {
  for (const entry of [...stories, ...outcomes]) {
    expect(entry.state ?? entry.initialState).not.toHaveProperty('specimen');
  }
});
