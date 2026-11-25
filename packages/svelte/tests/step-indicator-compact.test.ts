import { afterEach, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { mount, unmount, tick } from 'svelte';
import '@unofficial-krds/styles/all.css';
import { StepIndicator } from '../src/lib/index';
const cleanup: (() => unknown)[] = [];
afterEach(async () => { for (const callback of cleanup.splice(0)) await callback(); await page.viewport(1280, 800); });
const steps = [{ id: 'a', label: '약관 확인', status: 'complete', href: '#a' }, { id: 'b', label: '정보 입력', status: 'current' }, { id: 'c', label: '신청 완료', status: 'pending', href: '#c' }] as const;
async function show() { const host = document.createElement('div'); document.body.append(host); const app = mount(StepIndicator, { target: host, props: { steps, mode: 'adaptive' } }); cleanup.push(async () => { await unmount(app); host.remove(); }); await tick(); return host; }
// KRDS component_07_01 L889: a small display keeps the current step and the step count ("4단계 중 1단계");
// specs/components/step-indicator.md: the compact view leaves no hidden focusable step.
const facts = (root: ParentNode) => {
  const shown = (node: Element) => { const box = node.getBoundingClientRect(); return node.checkVisibility() && box.width >= 8 && box.height >= 8; };
  const summary = [...root.querySelectorAll('*')].find(node => !node.childElementCount && node.textContent === '3단계 중 2단계');
  return { summary: !!summary && shown(summary), controls: [...root.querySelectorAll('a[href], button')].map(node => [node.textContent, shown(node)]) };
};
const controls = [['약관 확인', true], ['신청 완료', true]];
test('StepIndicator shows the step count and no hidden focusable step on a narrow screen', async () => {
  await page.viewport(360, 800);
  expect(facts(await show())).toEqual({ summary: true, controls });
  await page.viewport(1280, 800);
  expect(facts(await show())).toEqual({ summary: false, controls });
});
