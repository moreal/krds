import { afterEach, expect, test } from 'vitest';
import { mount, unmount, tick } from 'svelte';
import { userEvent } from 'vitest/browser';
import { FileUpload, TutorialPanel } from '../src/lib/index';
const cleanup: (() => unknown)[] = [];
afterEach(async () => { for (const callback of cleanup.splice(0)) await callback(); });
const tabbable = (root: Element) => [...root.querySelectorAll<HTMLElement>('a[href],button,input,select,textarea,[tabindex]')].filter(node => node.tabIndex >= 0 && !(node as HTMLButtonElement).disabled && !node.closest('[hidden]'));
const text = (ids: string | null) => (ids ?? '').split(' ').filter(Boolean).map(id => document.getElementById(id)?.textContent?.trim() ?? `missing:${id}`);
const tasks = [{ id: 'apply', title: '예제 신청하기', steps: [{ id: 'one', title: '이름 입력', targetId: 'applicant-name', instruction: '이름을 입력하세요' }, { id: 'two', title: '신청 저장', targetId: 'save-application', instruction: '저장하세요' }] }];

test('FileUpload keeps one keyboard/AT file control: the visible picker opens the hidden native input (KRDS component.css 2943-2953, component_09_04)', async () => {
  const before = document.createElement('button'); before.textContent = 'Before upload'; document.body.append(before);
  const host = document.createElement('div'); document.body.append(host);
  const app = mount(FileUpload, { target: host, props: { label: '첨부 서류', name: 'documents', files: [], accept: '.txt', onFilesChange: () => {} } });
  cleanup.push(async () => { await unmount(app); host.remove(); before.remove(); }); await tick();
  const root = host.querySelector<HTMLElement>('[data-krds-component="file-upload"][data-krds-part="root"]')!;
  const input = root.querySelector<HTMLInputElement>('[data-krds-part="file-input"]')!;
  const picker = root.querySelector<HTMLButtonElement>('[data-krds-part="picker"]')!;
  expect(input.type).toBe('file');
  expect(input.tabIndex).toBe(-1);
  expect(input.getAttribute('aria-hidden')).toBe('true');
  expect(tabbable(root)).toEqual([picker]);
  expect(picker.textContent).toBe('파일 선택');
    expect(text(picker.getAttribute('aria-labelledby')), 'picker name is its text plus the field label').toEqual(['파일 선택', '첨부 서류']);
    expect(text(picker.getAttribute('aria-describedby'))).toEqual([root.querySelector('[data-krds-part="description"]')!.textContent!.trim()]);
  before.focus(); await userEvent.tab();
  expect(document.activeElement).toBe(picker);
  let opened = 0; input.click = () => { opened++; };
  await userEvent.keyboard('{Enter}'); await userEvent.keyboard(' ');
  expect(opened).toBe(2);
});

test('TutorialPanel inner controls carry shared tab/start/step parts', async () => {
  const host = document.createElement('div'); document.body.append(host);
  const app = mount(TutorialPanel, { target: host, props: { tasks, activeTaskId: 'apply', activeStepId: 'two', defaultRunning: false, defaultOpen: true, defaultActivePanel: 'tutorial', startActionId: 'tutorial-start' } });
  cleanup.push(async () => { await unmount(app); host.remove(); }); await tick();
  const part = (name: string) => [...document.querySelectorAll<HTMLElement>(`[data-krds-component="tutorial-panel"][data-krds-part="${name}"]`)];
  expect(part('tab').map(tab => [tab.getAttribute('role'), tab.getAttribute('data-krds-state')])).toEqual([['tab', ''], ['tab', 'selected']]);
  expect(part('start').map(node => [node.tagName, node.id])).toEqual([['BUTTON', 'tutorial-start']]);
  const toggle = part('task-toggle')[0]!; const controlled = document.getElementById(toggle.getAttribute('aria-controls')!);
  expect([controlled?.getAttribute('data-krds-part'), controlled?.hidden]).toEqual(['step-list', false]);
  expect(part('task-toggle').map(node => [node.tagName, node.tagName === 'SUMMARY' ? String((node.parentElement as HTMLDetailsElement).open) : node.getAttribute('aria-expanded'), node.textContent?.includes('예제 신청하기')])).toEqual([['BUTTON', 'true', true]]);
  expect(part('step').map(node => [node.tagName, node.getAttribute('data-krds-state'), node.getAttribute('aria-current')])).toEqual([['BUTTON', '', null], ['BUTTON', 'current', 'step']]);
});

const multiTasks = [...tasks, { id: 'review', title: '신청 내역 확인', steps: [{ id: 'open', title: '내역 열기', targetId: 'history', instruction: '내역을 여세요' }] }];
const tutorialPart = (name: string) => [...document.querySelectorAll<HTMLElement>(`[data-krds-component="tutorial-panel"][data-krds-part="${name}"]`)];
const listedTasks = () => tutorialPart('task-list').flatMap(list => [...list.querySelectorAll<HTMLElement>(':scope > [data-krds-part="task"] [data-krds-part="task-toggle"]')].map(toggle => toggle.textContent?.trim()));
async function mountTutorial(props: Record<string, unknown>) {
  const host = document.createElement('div'); document.body.append(host);
  const app = mount(TutorialPanel, { target: host, props: { tasks: multiTasks, defaultRunning: false, defaultOpen: true, defaultActivePanel: 'tutorial', startActionId: 'tutorial-start', ...props } as never });
  cleanup.push(async () => { await unmount(app); host.remove(); }); await tick(); return host;
}

test('TutorialPanel renders parted header/title/task-list with no unparted heading', async () => {
  const host = await mountTutorial({ activeTaskId: null, activeStepId: null });
  const header = tutorialPart('header');
  expect(header.length).toBe(1);
  expect(tutorialPart('title').map(node => [node.tagName, node.closest('[data-krds-part="header"]') === header[0]])).toEqual([['H2', true]]);
  expect(tutorialPart('tabs')[0]?.closest('[data-krds-part="header"]')).toBe(header[0]);
  expect(tutorialPart('close')[0]?.closest('[data-krds-part="header"]')).toBe(header[0]);
  expect([...host.querySelectorAll('h2')].filter(node => !node.hasAttribute('data-krds-part')), 'no stray unparted heading').toEqual([]);
  expect(tutorialPart('task-list').map(node => node.tagName)).toEqual(['UL']);
  expect(tutorialPart('task').every(node => node.tagName === 'LI' && node.parentElement?.getAttribute('data-krds-part') === 'task-list')).toBe(true);
});

test('TutorialPanel overview lists every task collapsed without back; the task view lists only the active task and back requests the overview', async () => {
  await mountTutorial({ activeTaskId: null, activeStepId: null });
  expect(listedTasks(), 'overview lists all tasks').toEqual(['예제 신청하기', '신청 내역 확인']);
  expect(tutorialPart('task-toggle').map(node => node.getAttribute('aria-expanded')), 'no task auto-expands on the overview').toEqual(['false', 'false']);
  expect(tutorialPart('back'), 'no back on the overview').toEqual([]);
  for (const callback of cleanup.splice(0)) await callback();
  await mountTutorial({ activeTaskId: 'apply', activeStepId: null });
  expect(listedTasks(), 'a selected task without a step stays on the overview').toEqual(['예제 신청하기', '신청 내역 확인']);
  expect(tutorialPart('task-toggle').map(node => node.getAttribute('aria-expanded'))).toEqual(['true', 'false']);
  expect(tutorialPart('back')).toEqual([]);
  for (const callback of cleanup.splice(0)) await callback();
  const changes: ({ id: string | null })[] = [];
  await mountTutorial({ activeTaskId: 'apply', activeStepId: 'two', onTaskChange: (detail: { id: string | null }) => changes.push(detail) });
  expect(listedTasks(), 'task view lists only the active task').toEqual(['예제 신청하기']);
  expect(tutorialPart('back').map(node => node.textContent?.trim()), 'one back control labelled 작업 목록 in the task view').toEqual(['작업 목록']);
  await userEvent.click(tutorialPart('back')[0]!);
  expect(changes).toEqual([{ id: null }]);
});

test('BottomSheet handle is a decorative CSS-drawn bar with no text content', async () => {
  const { BottomSheet } = await import('../src/lib/index');
  const host = document.createElement('div'); document.body.append(host);
  const app = mount(BottomSheet, { target: host, props: { title: '지역 선택', defaultOpen: true } as never });
  cleanup.push(async () => { await unmount(app); host.remove(); }); await tick();
  const handle = document.querySelector<HTMLElement>('[data-krds-component="bottom-sheet"][data-krds-part="handle"]')!;
  expect([handle.getAttribute('aria-hidden'), handle.textContent]).toEqual(['true', '']);
});
