import { TestBed } from '@angular/core/testing';
import { afterEach, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import '@unofficial-krds/styles/all.css';
import { StepIndicator } from '../src/lib/components/step-indicator/step-indicator';
afterEach(async () => { await page.viewport(1280, 800); });
const steps = [{ id: 'a', label: '약관 확인', status: 'complete', href: '#a' }, { id: 'b', label: '정보 입력', status: 'current' }, { id: 'c', label: '신청 완료', status: 'pending', href: '#c' }] as const;
// KRDS component_07_01 L889: a small display keeps the current step and the step count ("4단계 중 1단계");
// specs/components/step-indicator.md: the compact view leaves no hidden focusable step.
const facts = (root: ParentNode) => {
  const shown = (node: Element) => { const box = node.getBoundingClientRect(); return node.checkVisibility() && box.width >= 8 && box.height >= 8; };
  const summary = [...root.querySelectorAll('*')].find(node => !node.childElementCount && node.textContent === '3단계 중 2단계');
  return { summary: !!summary && shown(summary), controls: [...root.querySelectorAll('a[href], button')].map(node => [node.textContent, shown(node)]) };
};
const controls = [['약관 확인', true], ['신청 완료', true]];
test('StepIndicator shows the step count and no hidden focusable step on a narrow screen', async () => {
  for (const [width, summary] of [[360, true], [1280, false]] as const) {
    await page.viewport(width, 800);
    const fixture = TestBed.createComponent(StepIndicator);
    fixture.componentRef.setInput('steps', steps); fixture.componentRef.setInput('mode', 'adaptive'); fixture.detectChanges(); document.body.append(fixture.nativeElement);
    try { expect(facts(fixture.nativeElement as HTMLElement)).toEqual({ summary, controls }); }
    finally { fixture.destroy(); (fixture.nativeElement as HTMLElement).remove(); }
  }
});
