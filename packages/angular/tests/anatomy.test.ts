import { TestBed } from '@angular/core/testing';
import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { FileUpload } from '../src/lib/components/file-upload/file-upload';
import { TutorialPanel } from '../src/lib/components/tutorial-panel/tutorial-panel';

const tick = () => new Promise(resolve => setTimeout(resolve, 50));
const tabbable = (root: Element) => [...root.querySelectorAll<HTMLElement>('a[href],button,input,select,textarea,[tabindex]')].filter(node => node.tabIndex >= 0 && !(node as HTMLButtonElement).disabled && !node.closest('[hidden]'));
const text = (ids: string | null) => (ids ?? '').split(' ').filter(Boolean).map(id => document.getElementById(id)?.textContent?.trim() ?? `missing:${id}`);
const tasks = [{ id: 'apply', title: '예제 신청하기', steps: [{ id: 'one', title: '이름 입력', targetId: 'applicant-name', instruction: '이름을 입력하세요' }, { id: 'two', title: '신청 저장', targetId: 'save-application', instruction: '저장하세요' }] }];

test('FileUpload keeps one keyboard/AT file control: the visible picker opens the hidden native input (KRDS component.css 2943-2953, component_09_04)', async () => {
  const before = document.createElement('button'); before.textContent = 'Before upload'; document.body.append(before);
  const fixture = TestBed.createComponent(FileUpload);
  fixture.componentRef.setInput('label', '첨부 서류'); fixture.componentRef.setInput('name', 'documents'); fixture.componentRef.setInput('accept', '.txt'); fixture.componentRef.setInput('files', []);
  fixture.detectChanges(); document.body.append(fixture.nativeElement); await tick();
  try {
    const root = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('[data-krds-component="file-upload"][data-krds-part="root"]')!;
    const input = root.querySelector<HTMLInputElement>('[data-krds-part="file-input"]')!;
    const picker = root.querySelector<HTMLButtonElement>('[data-krds-part="picker"]')!;
    expect(input.type).toBe('file');
    expect(input.name).toBe('documents');
    expect(input.tabIndex).toBe(-1);
    expect(input.getAttribute('aria-hidden')).toBe('true');
    expect(tabbable(root)).toEqual([picker]);
    expect(picker.textContent).toBe('파일 선택');
    expect(picker.hasAttribute('aria-labelledby'), 'picker name is exactly its own visible text').toBe(false);
    expect(picker.hasAttribute('aria-label')).toBe(false);
    const label = root.querySelector<HTMLElement>('[data-krds-part="label"]')!;
    expect(label.tagName).toBe('P');
    expect(root.getAttribute('role')).toBe('group');
    expect(text(root.getAttribute('aria-labelledby')), 'the group is named by the field label').toEqual(['첨부 서류']);
    expect(text(picker.getAttribute('aria-describedby')), 'no error region is referenced while nothing was rejected').toEqual([root.querySelector('[data-krds-part="help"]')!.textContent!.trim()]);
    before.focus(); await userEvent.tab();
    expect(document.activeElement).toBe(picker);
    let opened = 0; input.click = () => { opened++; };
    await userEvent.keyboard('{Enter}'); await userEvent.keyboard(' ');
    expect(opened).toBe(2);
  } finally { fixture.destroy(); (fixture.nativeElement as HTMLElement).remove(); before.remove(); }
});

test('TutorialPanel inner controls carry shared tab/start/step parts', async () => {
  await page.viewport(1280, 800);
  const fixture = TestBed.createComponent(TutorialPanel);
  fixture.componentRef.setInput('tasks', tasks); fixture.componentRef.setInput('activeTaskId', 'apply'); fixture.componentRef.setInput('activeStepId', 'two');
  fixture.componentRef.setInput('defaultRunning', false); fixture.componentRef.setInput('defaultActivePanel', 'tutorial'); fixture.componentRef.setInput('startActionId', 'tutorial-start'); fixture.componentRef.setInput('defaultOpen', true);
  fixture.detectChanges(); document.body.append(fixture.nativeElement); await tick(); fixture.detectChanges();
  try {
    const host = fixture.nativeElement as HTMLElement;
    const part = (name: string) => [...host.querySelectorAll<HTMLElement>(`[data-krds-component="tutorial-panel"][data-krds-part="${name}"]`)];
    expect(part('start').map(node => [node.tagName, node.id])).toEqual([['BUTTON', 'tutorial-start']]);
    const disclosure = host.querySelector<HTMLButtonElement>('button[aria-controls$="-apply-steps"]')!;
    const steps = () => document.getElementById(disclosure.getAttribute('aria-controls')!);
    expect([disclosure.getAttribute('aria-expanded'), steps()?.getAttribute('data-krds-part'), steps()?.hidden], 'active task starts expanded without interaction').toEqual(['true', 'step-list', false]);
    expect(host.querySelectorAll('[data-krds-component="tutorial-panel"][data-krds-part="back"]').length, 'back control while a task view is active').toBe(1);
    disclosure.click(); fixture.detectChanges(); await tick();
    expect([disclosure.getAttribute('aria-expanded'), steps()?.getAttribute('data-krds-part'), steps()?.hidden], 'collapsed list stays in the DOM so aria-controls never dangles').toEqual(['false', 'step-list', true]);
    expect(host.querySelectorAll('[data-krds-component="tutorial-panel"][data-krds-part="back"]').length, 'no back control on the overview').toBe(0);
    disclosure.click(); fixture.detectChanges(); await tick();
    expect(disclosure.getAttribute('aria-expanded')).toBe('true');
    expect(part('task-toggle')).toEqual([disclosure]);
    expect(part('step').map(node => [node.tagName, node.getAttribute('data-krds-state'), node.getAttribute('aria-current')])).toEqual([['BUTTON', '', null], ['BUTTON', 'current', 'step']]);
    const tabs = part('tab');
    expect(tabs.map(tab => [tab.tagName, tab.getAttribute('role'), tab.getAttribute('aria-selected'), tab.getAttribute('data-krds-state')])).toEqual([['BUTTON', 'tab', 'false', ''], ['BUTTON', 'tab', 'true', 'selected']]);
    expect(tabs.every(tab => tab.closest('[data-krds-component="tutorial-panel"][data-krds-part="tabs"][role="tablist"]'))).toBe(true);
    tabs[1]!.focus(); expect(document.activeElement).toBe(tabs[1]); await userEvent.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(tabs[0]);
    await userEvent.keyboard('{Enter}'); fixture.detectChanges(); await tick();
    expect(tabs.map(tab => tab.getAttribute('data-krds-state'))).toEqual(['selected', '']);
    expect(document.getElementById(tabs[0]!.getAttribute('aria-controls')!)?.hidden).toBe(false);
  } finally { fixture.destroy(); (fixture.nativeElement as HTMLElement).remove(); }
});

const multiTasks = [...tasks, { id: 'review', title: '신청 내역 확인', steps: [{ id: 'open', title: '내역 열기', targetId: 'history', instruction: '내역을 여세요' }] }];

test('TutorialPanel overview lists every task without back; the task view replaces it with only the active task and back requests the overview', async () => {
  await page.viewport(1280, 800);
  const fixture = TestBed.createComponent(TutorialPanel);
  const changes: ({ id: string | null })[] = [];
  const subscription = fixture.componentInstance.taskChange.subscribe(detail => { changes.push(detail); fixture.componentRef.setInput('activeStepId', null); fixture.componentRef.setInput('activeTaskId', detail.id); });
  fixture.componentRef.setInput('tasks', multiTasks); fixture.componentRef.setInput('activeTaskId', null); fixture.componentRef.setInput('activeStepId', null);
  fixture.componentRef.setInput('defaultRunning', false); fixture.componentRef.setInput('defaultActivePanel', 'tutorial'); fixture.componentRef.setInput('startActionId', 'tutorial-start'); fixture.componentRef.setInput('defaultOpen', true);
  fixture.detectChanges(); document.body.append(fixture.nativeElement); await tick(); fixture.detectChanges();
  try {
    const host = fixture.nativeElement as HTMLElement;
    const listed = () => [...host.querySelectorAll('[data-krds-component="tutorial-panel"][data-krds-part="task-list"] > [data-krds-part="task"] > h3')].map(node => node.textContent?.trim());
    const back = () => [...host.querySelectorAll<HTMLButtonElement>('[data-krds-component="tutorial-panel"][data-krds-part="back"]')];
    expect(listed(), 'overview lists all tasks').toEqual(['예제 신청하기', '신청 내역 확인']);
    expect(back(), 'no back on the overview').toEqual([]);
    fixture.componentRef.setInput('activeTaskId', 'apply'); fixture.detectChanges(); await tick(); fixture.detectChanges();
    expect(listed(), 'a selected task without a step stays on the overview').toEqual(['예제 신청하기', '신청 내역 확인']);
    expect(back()).toEqual([]);
    fixture.componentRef.setInput('activeStepId', 'two'); fixture.detectChanges(); await tick(); fixture.detectChanges();
    expect(listed(), 'task view lists only the active task').toEqual(['예제 신청하기']);
    expect(back().map(node => node.textContent?.trim()), 'one back control labelled 작업 목록 in the task view').toEqual(['작업 목록']);
    await userEvent.click(back()[0]!); fixture.detectChanges(); await tick(); fixture.detectChanges();
    expect(changes).toEqual([{ id: null }]);
    expect(listed(), 'back returns to the full overview').toEqual(['예제 신청하기', '신청 내역 확인']);
    expect(back()).toEqual([]);
    expect(host.querySelector('[data-krds-component="tutorial-panel"][data-krds-part="title"]')?.textContent?.trim(), 'official item 3: the panel title').toBe('따라하기');
    fixture.componentRef.setInput('activeTaskId', 'review'); fixture.componentRef.setInput('activeStepId', 'open'); fixture.detectChanges(); await tick(); fixture.detectChanges();
    expect(listed()).toEqual(['신청 내역 확인']);
    fixture.componentRef.setInput('activeTaskId', null); fixture.componentRef.setInput('activeStepId', null); fixture.detectChanges(); await tick(); fixture.detectChanges();
    expect(listed(), 'a direct host reset to no task returns to the overview').toEqual(['예제 신청하기', '신청 내역 확인']);
    expect(back(), 'no back after a host reset').toEqual([]);
  } finally { subscription.unsubscribe(); fixture.destroy(); (fixture.nativeElement as HTMLElement).remove(); }
});

test('BottomSheet handle is a CSS-drawn bar with no text named 시트 닫기', async () => {
  const { BottomSheet } = await import('../src/lib/components/bottom-sheet/bottom-sheet');
  const fixture = TestBed.createComponent(BottomSheet);
  fixture.componentRef.setInput('title', '지역 선택'); fixture.componentRef.setInput('defaultOpen', true);
  fixture.detectChanges(); document.body.append(fixture.nativeElement); await tick(); fixture.detectChanges();
  try {
    const handle = document.querySelector<HTMLElement>('[data-krds-component="bottom-sheet"][data-krds-part="handle"]')!;
    expect([handle.textContent, handle.getAttribute('aria-label')]).toEqual(['', '시트 닫기']);
  } finally { fixture.destroy(); (fixture.nativeElement as HTMLElement).remove(); }
});
