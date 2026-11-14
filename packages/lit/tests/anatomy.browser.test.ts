import { afterEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { registerKrdsElements } from '../src/index';
registerKrdsElements(customElements);
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
type Host = HTMLElement & { updateComplete: Promise<unknown>; [key: string]: unknown };
async function mount(tag: string, props: Record<string, unknown>, attributes: Record<string, string> = {}) {
  const before = document.createElement('button'); before.textContent = 'Before'; document.body.append(before);
  const host = document.createElement(tag) as Host; for (const [name, value] of Object.entries(attributes)) host.setAttribute(name, value); Object.assign(host, props); document.body.append(host);
  const after = document.createElement('button'); after.textContent = 'After'; document.body.append(after);
  await host.updateComplete; cleanup.push(() => { before.remove(); host.remove(); after.remove(); }); return { host, root: host.shadowRoot!, before };
}
const tabbable = (root: ParentNode) => [...root.querySelectorAll<HTMLElement>('a[href],button,input,select,textarea,[tabindex]')].filter(node => node.tabIndex >= 0 && !(node as HTMLButtonElement).disabled && !node.closest('[hidden]'));
const text = (root: ShadowRoot, ids: string | null) => (ids ?? '').split(' ').filter(Boolean).map(id => root.getElementById(id)?.textContent?.trim() ?? `missing:${id}`);
const tasks = [{ id: 'apply', title: '예제 신청하기', steps: [{ id: 'one', title: '이름 입력', targetId: 'applicant-name', instruction: '이름을 입력하세요' }, { id: 'two', title: '신청 저장', targetId: 'save-application', instruction: '저장하세요' }] }];

test('FileUpload keeps one keyboard/AT file control in real Shadow DOM: the visible picker opens the hidden native input (KRDS component.css 2943-2953, component_09_04)', async () => {
  const { host, root, before } = await mount('krds-file-upload', { label: '첨부 서류', name: 'documents', accept: '.txt', files: [] });
  const input = root.querySelector<HTMLInputElement>('[data-krds-part="file-input"]')!;
  const picker = root.querySelector<HTMLButtonElement>('[data-krds-part="picker"]')!;
  expect([input.type, input.tabIndex, input.getAttribute('aria-hidden'), input.hasAttribute('style')]).toEqual(['file', -1, 'true', false]);
  expect(getComputedStyle(input).clipPath).not.toBe('none');
  expect(tabbable(root)).toEqual([picker]);
  const group = root.querySelector<HTMLElement>('[data-krds-part="root"]')!; const label = root.querySelector<HTMLElement>('[data-krds-part="label"]')!;
  expect([label.localName, group.getAttribute('role'), text(root, group.getAttribute('aria-labelledby'))]).toEqual(['p', 'group', ['첨부 서류']]);
  expect([picker.getAttribute('aria-labelledby'), picker.getAttribute('aria-label'), picker.textContent!.trim()]).toEqual([null, null, '파일 선택']);
  expect(text(root, picker.getAttribute('aria-describedby'))).toEqual([root.querySelector('[data-krds-part="help"]')!.textContent!.trim()]);
  before.focus(); await userEvent.tab();
  expect(root.activeElement).toBe(picker);
  let opened = 0; input.click = () => { opened++; };
  await userEvent.keyboard('{Enter}'); await userEvent.keyboard(' ');
  expect(opened).toBe(2);
  await userEvent.tab();
  expect(document.activeElement?.textContent).toBe('After');
  expect(host.isConnected).toBe(true);
});

test('FileUpload routes a host aria-label (no visible label) to the group name, not the picker or the hidden input', async () => {
  const { root } = await mount('krds-file-upload', { name: 'documents', files: [] }, { 'aria-label': '증빙 서류' });
  const input = root.querySelector<HTMLInputElement>('[data-krds-part="file-input"]')!;
  const picker = root.querySelector<HTMLButtonElement>('[data-krds-part="picker"]')!;
  const group = root.querySelector<HTMLElement>('[data-krds-part="root"]')!;
  expect([group.getAttribute('role'), group.getAttribute('aria-label'), group.getAttribute('aria-labelledby')]).toEqual(['group', '증빙 서류', null]);
  expect([picker.getAttribute('aria-label'), picker.getAttribute('aria-labelledby')]).toEqual([null, null]);
  expect(input.getAttribute('aria-label')).toBeNull();
  expect(input.ariaLabelledByElements ?? null).toBeNull();
});

test('TutorialPanel inner controls carry shared tab/start/step parts', async () => {
  const { root } = await mount('krds-tutorial-panel', { tasks, activeTaskId: 'apply', activeStepId: 'two', startActionId: 'tutorial-start', defaultOpen: true });
  const part = (name: string) => [...root.querySelectorAll<HTMLElement>(`[data-krds-component="tutorial-panel"][data-krds-part="${name}"]`)];
  expect(part('tab').map(tab => tab.getAttribute('role'))).toEqual(['tab', 'tab']);
  expect(part('tab').map(tab => [tab.getAttribute('aria-selected'), tab.getAttribute('data-krds-state')]).every(([selected, state]) => (selected === 'true') === (state === 'selected'))).toBe(true);
  expect(part('start').map(node => [node.tagName, node.id])).toEqual([['BUTTON', 'tutorial-start']]);
  expect(part('task-toggle').map(node => [node.tagName, node.parentElement?.tagName, (node.parentElement as HTMLDetailsElement).open, node.nextElementSibling?.getAttribute('data-krds-part')]), 'each task has a native disclosure for its step list').toEqual([['SUMMARY', 'DETAILS', true, 'step-list']]);
  const [header] = part('header');
  expect(['title', 'close'].map(name => part(name)[0]?.parentElement === header), 'the header holds the title and close').toEqual([true, true]);
  expect(part('tabs')[0]?.previousElementSibling, 'the tablist follows the header').toBe(header);
  expect(part('title')[0]?.textContent?.trim()).toBe('따라하기');
  expect(part('tabs')[0]?.getAttribute('aria-label')).toBe('지원 패널');
  expect(part('step').map(node => [node.tagName, node.getAttribute('data-krds-state'), node.getAttribute('aria-current')])).toEqual([['BUTTON', '', null], ['BUTTON', 'current', 'step']]);
});

const multiTasks = [...tasks, { id: 'review', title: '신청 내역 확인', steps: [{ id: 'open', title: '내역 열기', targetId: 'history', instruction: '내역을 여세요' }] }];

test('TutorialPanel overview lists every task without back; the task view lists only the active task and back requests the overview', async () => {
  const listed = (root: ShadowRoot) => [...root.querySelectorAll('[data-krds-part="task-list"] > [data-krds-part="task"] > details > [data-krds-part="task-toggle"]')].map(node => node.textContent?.trim());
  const back = (root: ShadowRoot) => [...root.querySelectorAll<HTMLButtonElement>('[data-krds-component="tutorial-panel"][data-krds-part="back"]')];
  const overview = await mount('krds-tutorial-panel', { tasks: multiTasks, activeTaskId: null, activeStepId: null, startActionId: 'tutorial-start', defaultOpen: true });
  expect(listed(overview.root), 'overview lists all tasks').toEqual(['예제 신청하기', '신청 내역 확인']);
  expect(back(overview.root), 'no back on the overview').toEqual([]);
  overview.host.activeTaskId = 'apply'; await overview.host.updateComplete;
  expect(listed(overview.root), 'a selected task without a step stays on the overview').toEqual(['예제 신청하기', '신청 내역 확인']);
  expect(back(overview.root)).toEqual([]);
  const changes: unknown[] = [];
  overview.host.addEventListener('task-change', event => { changes.push((event as CustomEvent).detail); overview.host.activeStepId = null; overview.host.activeTaskId = (event as CustomEvent<{ id: string | null }>).detail.id; });
  overview.host.activeStepId = 'two'; await overview.host.updateComplete;
  expect(listed(overview.root), 'task view lists only the active task').toEqual(['예제 신청하기']);
  expect(back(overview.root).map(node => node.textContent?.trim()), 'one back control labelled 작업 목록 in the task view').toEqual(['작업 목록']);
  await userEvent.click(back(overview.root)[0]!); await overview.host.updateComplete;
  expect(changes).toEqual([{ id: null }]);
  expect(listed(overview.root), 'back returns to the full overview').toEqual(['예제 신청하기', '신청 내역 확인']);
  expect(back(overview.root)).toEqual([]);
});

test('TutorialPanel root is the panel surface: a right-anchored full-height dialog, not a fit-content browser dialog', async () => {
  const { root } = await mount('krds-tutorial-panel', { tasks: multiTasks, activeTaskId: null, activeStepId: null, startActionId: 'tutorial-start', defaultOpen: true });
  const panel = root.querySelector<HTMLElement>('[data-krds-component="tutorial-panel"][data-krds-part="root"]')!;
  expect([panel.tagName, (panel as HTMLDialogElement).open]).toEqual(['DIALOG', true]);
  const box = panel.getBoundingClientRect(), style = getComputedStyle(panel);
  expect({ right: Math.round(box.right), top: Math.round(box.top), height: Math.round(box.height), marginLeft: style.marginLeft, borderTop: style.borderTopWidth }).toEqual({ right: document.documentElement.clientWidth, top: 0, height: innerHeight, marginLeft: '0px', borderTop: '0px' });
  expect(Math.round(box.width)).toBe(Math.round(parseFloat(getComputedStyle(document.documentElement).fontSize) * 39));
  const toggles = [...root.querySelectorAll<HTMLElement>('[data-krds-part="task-toggle"]')];
  expect(toggles.map(node => (node.parentElement as HTMLDetailsElement).open), 'nothing auto-expands on the overview').toEqual([false, false]);
});
