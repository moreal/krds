import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, expect, test, vi } from 'vitest';
import { page } from 'vitest/browser';
import { TutorialPanel } from '../src/lib/components/tutorial-panel/tutorial-panel';
import { HelpPanel } from '../src/lib/components/help-panel/help-panel';
import { MainMenu } from '../src/lib/components/main-menu/main-menu';

@Component({ selector: 'host-layouts', standalone: true, imports: [TutorialPanel, HelpPanel], template: `
  <krds-tutorial-panel id="tp" [tasks]="tasks" activeTaskId="t" activeStepId="s1"/>
  <krds-help-panel id="hp" [topics]="topics"/>` })
class Host {
  tasks = [{ id: 't', title: '작업', steps: [{ id: 's1', title: '단계', targetId: 'x', instruction: '해 보세요' }] }];
  topics = [{ id: 'a', title: '주제', content: '내용', relatedLinks: [] }];
}

const MEDIA = '(max-width:767px)';
const q = (selector: string) => document.querySelectorAll(selector);
const roots = (component: string) => q(`[data-krds-component="${component}"][data-krds-part="root"]`);
function assertCounts(label: string) {
  expect(roots('tutorial-panel').length, `${label}: tutorial roots`).toBe(1);
  expect(q('[data-krds-component="tutorial-panel"][data-krds-part="back"]').length, `${label}: back`).toBe(1);
  expect(roots('help-panel').length, `${label}: help roots`).toBe(1);
  const ids = [...q('[id]')].map(node => node.id); expect(new Set(ids).size, `${label}: duplicate ids`).toBe(ids.length);
}
function assertClean(label: string, narrow: boolean) {
  assertCounts(label);
  expect(q('[role="dialog"][data-krds-part=root]').length, `${label}: dialogs`).toBe(narrow ? 2 : 0);
  // Active task/step survive the layout swap.
  expect(document.querySelector('[data-krds-part="step"][aria-current="step"]'), `${label}: active step`).not.toBeNull();
  if (!narrow) {
    expect(q('[data-krds-native-layer]').length, `${label}: wrapper`).toBe(0);
    expect(comments().length, `${label}: placeholder comments`).toBe(0);
    expect(document.body.style.overflow, `${label}: scroll lock`).not.toBe('hidden');
    expect(document.querySelectorAll('[inert]').length, `${label}: inert`).toBe(0);
  }
}
function comments(): Comment[] {
  const found: Comment[] = []; const walker = document.createTreeWalker(document, NodeFilter.SHOW_COMMENT);
  while (walker.nextNode()) if ((walker.currentNode as Comment).data === 'krds-layer-origin') found.push(walker.currentNode as Comment);
  return found;
}
const busy = (ms: number) => { const end = performance.now() + ms; while (performance.now() < end); };
afterEach(async () => { await page.viewport(414, 800); });

test('tutorial and help panels keep exactly one clean layout across repeated breakpoint flips', async () => {
  await page.viewport(1000, 800);
  // The stall runs inside the media-query change dispatch, ahead of the components' own listeners.
  const media = window.matchMedia(MEDIA); const stall = () => busy(120); media.addEventListener('change', stall);
  try {
    const fixture: ComponentFixture<Host> = TestBed.createComponent(Host);
    await vi.waitFor(() => { fixture.detectChanges(); assertClean('initial wide', false); });
    for (let i = 0; i < 6; i++) {
      const narrow = i % 2 === 0;
      await page.viewport(narrow ? 500 : 1000, 800);
      assertCounts(`flip ${i} immediately`);
      await vi.waitFor(() => { fixture.detectChanges(); expect(q('[role="dialog"][data-krds-part=root]').length > 0).toBe(narrow); });
      assertClean(`flip ${i} settled`, narrow);
    }
  } finally { media.removeEventListener('change', stall); }
});

test('main menu mobile dialog opens and closes repeatedly without orphans or leftover locks', async () => {
  await page.viewport(414, 800);
  const fixture = TestBed.createComponent(MainMenu);
  fixture.componentRef.setInput('items', [{ id: 'a', label: 'A', href: '#a' }]);
  fixture.detectChanges();
  const trigger = () => document.querySelector<HTMLButtonElement>('[data-krds-part="mobile-trigger"]')!;
  for (let i = 0; i < 4; i++) {
    trigger().click(); await vi.waitFor(() => { fixture.detectChanges(); expect(document.querySelector('[data-krds-native-layer]')).not.toBeNull(); });
    expect(q('[data-krds-part="mobile-content"]').length).toBe(1);
    trigger().click();
    await vi.waitFor(() => { fixture.detectChanges(); expect(document.querySelector('[data-krds-native-layer]')).toBeNull(); });
    expect(q('[data-krds-part="mobile-content"]').length, 'the closed mobile content is not rendered').toBe(0);
    expect(comments().length).toBe(0);
    expect(document.body.style.overflow).not.toBe('hidden');
  }
  // Destroying the owner while its dialog is open releases the layer and leaves no wrapper, placeholder or scroll lock.
  trigger().click(); await vi.waitFor(() => { fixture.detectChanges(); expect(document.querySelector('[data-krds-native-layer]')).not.toBeNull(); });
  fixture.destroy();
  expect(document.querySelector('[data-krds-native-layer]')).toBeNull();
  expect(q('[data-krds-part="mobile-content"]').length).toBe(0);
  expect(comments().length).toBe(0);
  expect(document.body.style.overflow).not.toBe('hidden');
});
