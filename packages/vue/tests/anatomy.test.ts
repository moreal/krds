import { afterEach, expect, test } from 'vitest';
import { createApp, defineComponent, h, nextTick, ref, type Component } from 'vue';
import { userEvent } from 'vitest/browser';
import { FileUpload, TutorialPanel } from '../src/index';
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
function mount(component: Component, props: Record<string, unknown>, before?: string) {
  const host = document.createElement('div'); document.body.append(host);
  const app = createApp({ render: () => [before ? h('button', { type: 'button' }, before) : null, h(component, props)] }); app.mount(host);
  cleanup.push(() => { app.unmount(); host.remove(); }); return host;
}
const tabbable = (root: Element) => [...root.querySelectorAll<HTMLElement>('a[href],button,input,select,textarea,[tabindex]')].filter(node => node.tabIndex >= 0 && !(node as HTMLButtonElement).disabled && !node.closest('[hidden]'));
const text = (ids: string | null) => (ids ?? '').split(' ').filter(Boolean).map(id => document.getElementById(id)?.textContent?.trim() ?? `missing:${id}`);
const tasks = [{ id: 'apply', title: '예제 신청하기', steps: [{ id: 'one', title: '이름 입력', targetId: 'applicant-name', instruction: '이름을 입력하세요' }, { id: 'two', title: '신청 저장', targetId: 'save-application', instruction: '저장하세요' }] }];

test('FileUpload keeps one keyboard/AT file control: the visible picker opens the hidden native input (KRDS component.css 2943-2953, component_09_04)', async () => {
  const host = mount(FileUpload, { label: '첨부 서류', name: 'documents', files: [], accept: '.txt' }, 'Before upload'); await nextTick();
  const root = host.querySelector<HTMLElement>('[data-krds-component="file-upload"][data-krds-part="root"]')!;
  const input = root.querySelector<HTMLInputElement>('[data-krds-part="file-input"]')!;
  const picker = root.querySelector<HTMLButtonElement>('[data-krds-part="picker"]')!;
  expect(input.type).toBe('file');
  expect(input.name).toBe('documents');
  expect(input.tabIndex).toBe(-1);
  expect(input.getAttribute('aria-hidden')).toBe('true');
  expect(tabbable(root)).toEqual([picker]);
  expect(picker.textContent).toBe('파일 선택');
    expect(picker.hasAttribute('aria-labelledby') || picker.hasAttribute('aria-label'), 'picker name is exactly its visible text').toBe(false);
    expect(root.getAttribute('role')).toBe('group');
    expect(text(root.getAttribute('aria-labelledby')), 'the group is named by the p[label]').toEqual(['첨부 서류']);
    expect(root.querySelector('[data-krds-part="label"]')!.tagName).toBe('P');
    expect(text(picker.getAttribute('aria-describedby'))).toEqual([root.querySelector('[data-krds-part="help"]')!.textContent!.trim()]);
  host.querySelector<HTMLButtonElement>('button')!.focus(); await userEvent.tab();
  expect(document.activeElement).toBe(picker);
  let opened = 0; input.click = () => { opened++; };
  await userEvent.keyboard('{Enter}'); await userEvent.keyboard(' ');
  expect(opened).toBe(2);
});

test('TutorialPanel inner controls carry shared tab/start/step parts', async () => {
  mount(TutorialPanel, { tasks, activeTaskId: 'apply', activeStepId: 'two', defaultRunning: false, defaultOpen: true, defaultActivePanel: 'tutorial', startActionId: 'tutorial-start' }); await nextTick();
  const part = (name: string) => [...document.querySelectorAll<HTMLElement>(`[data-krds-component="tutorial-panel"][data-krds-part="${name}"]`)];
  expect(part('tab').map(tab => [tab.getAttribute('role'), tab.getAttribute('data-krds-state')])).toEqual([['tab', ''], ['tab', 'selected']]);
  expect(part('start').map(node => [node.tagName, node.id])).toEqual([['BUTTON', 'tutorial-start']]);
  expect(part('task-toggle').map(node => [node.tagName, node.tagName === 'SUMMARY' ? String((node.parentElement as HTMLDetailsElement).open) : node.getAttribute('aria-expanded'), node.textContent?.includes('예제 신청하기')])).toEqual([['SUMMARY', 'true', true]]);
  expect(part('step').map(node => [node.tagName, node.getAttribute('data-krds-state'), node.getAttribute('aria-current')])).toEqual([['BUTTON', '', null], ['BUTTON', 'current', 'step']]);
});

const multiTasks = [...tasks, { id: 'review', title: '신청 내역 확인', steps: [{ id: 'open', title: '내역 열기', targetId: 'history', instruction: '내역을 여세요' }] }];
const tutorialPart = (name: string) => [...document.querySelectorAll<HTMLElement>(`[data-krds-component="tutorial-panel"][data-krds-part="${name}"]`)];
const listedTasks = () => tutorialPart('task-list').flatMap(list => [...list.querySelectorAll<HTMLElement>('[data-krds-part="task-toggle"]')].map(toggle => toggle.textContent?.trim()));

test('TutorialPanel overview lists every task without back; the task view replaces it with only the active task and back requests the overview', async () => {
  const changes: ({ id: string | null })[] = [];
  const task = ref<string | null>(null), step = ref<string | null>(null);
  const Host = defineComponent({ render: () => h(TutorialPanel, { tasks: multiTasks, activeTaskId: task.value, activeStepId: step.value, defaultRunning: false, defaultOpen: true, defaultActivePanel: 'tutorial', startActionId: 'tutorial-start', onTaskChange: (detail: { id: string | null }) => { changes.push(detail); step.value = null; task.value = detail.id; }, onStepChange: (detail: { id: string | null }) => { step.value = detail.id; } }) });
  mount(Host, {}); await nextTick();
  expect(listedTasks(), 'overview lists all tasks').toEqual(['예제 신청하기', '신청 내역 확인']);
  expect(tutorialPart('back'), 'no back on the overview').toEqual([]);
  task.value = 'apply'; step.value = 'two'; await nextTick();
  expect(listedTasks(), 'task view lists only the active task').toEqual(['예제 신청하기']);
  expect(tutorialPart('back').map(node => node.textContent?.trim()), 'one back control labelled 작업 목록 in the task view').toEqual(['작업 목록']);
  await userEvent.click(tutorialPart('back')[0]!); await nextTick();
  expect(changes).toEqual([{ id: null }]);
  expect(listedTasks(), 'back returns to the full overview').toEqual(['예제 신청하기', '신청 내역 확인']);
  expect(tutorialPart('back')).toEqual([]);
});

test('TutorialPanel stays on the overview while a task is selected without a step', async () => {
  mount(TutorialPanel, { tasks: multiTasks, activeTaskId: 'apply', activeStepId: null, defaultRunning: false, defaultOpen: true, defaultActivePanel: 'tutorial', startActionId: 'task-start' }); await nextTick();
  expect(listedTasks()).toEqual(['예제 신청하기', '신청 내역 확인']);
  expect(tutorialPart('back')).toEqual([]);
});

test('TutorialPanel title sits in the header, names the root and stays visible on the Help tab', async () => {
  mount(TutorialPanel, { tasks: multiTasks, activeTaskId: null, activeStepId: null, defaultRunning: false, defaultOpen: true, defaultActivePanel: 'help', startActionId: 'help-start' }); await nextTick();
  const [title] = tutorialPart('title'), [root] = tutorialPart('root'), [header] = tutorialPart('header');
  expect(title?.closest('[data-krds-part="header"]')).toBe(header);
  expect(header?.firstElementChild).toBe(title);
  expect([root?.getAttribute('aria-labelledby'), root?.hasAttribute('aria-label')]).toEqual([title?.id, false]);
  expect(title?.textContent?.trim()).toBe('따라하기');
  expect(title?.closest('[hidden]'), 'title is not hidden on the Help tab').toBeNull();
});
