import { afterEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { createRoot } from 'react-dom/client';
import { act, useState, type ReactNode } from 'react';
import '@unofficial-krds/styles/all.css';
import { FileUpload, TutorialPanel } from '../src/index';
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
async function mount(view: ReactNode) { const host = document.createElement('div'); document.body.append(host); const root = createRoot(host); await act(async () => root.render(view)); cleanup.push(() => { act(() => root.unmount()); host.remove(); }); return host; }
const tabbable = (root: Element) => [...root.querySelectorAll<HTMLElement>('a[href],button,input,select,textarea,[tabindex]')].filter(node => node.tabIndex >= 0 && !(node as HTMLButtonElement).disabled && !node.closest('[hidden]'));
const text = (ids: string | null) => (ids ?? '').split(' ').filter(Boolean).map(id => document.getElementById(id)?.textContent?.trim() ?? `missing:${id}`);
const tasks = [{ id: 'apply', title: '예제 신청하기', steps: [{ id: 'one', title: '이름 입력', targetId: 'applicant-name', instruction: '이름을 입력하세요' }, { id: 'two', title: '신청 저장', targetId: 'save-application', instruction: '저장하세요' }] }];

test('FileUpload keeps one keyboard/AT file control: the visible picker opens the hidden native input (KRDS component.css 2943-2953, component_09_04)', async () => {
  const host = await mount(<><button type="button">Before upload</button><FileUpload label="첨부 서류" name="documents" files={[]} accept=".txt" onFilesChange={() => {}}/><button type="button">After upload</button></>);
  const root = host.querySelector<HTMLElement>('[data-krds-component="file-upload"][data-krds-part="root"]')!;
  const input = root.querySelector<HTMLInputElement>('[data-krds-part="file-input"]')!;
  const picker = root.querySelector<HTMLButtonElement>('[data-krds-part="picker"]')!;
  expect([input.type, input.tabIndex, input.getAttribute('aria-hidden')]).toEqual(['file', -1, 'true']);
  expect(tabbable(root)).toEqual([picker]);
  expect([picker.getAttribute('aria-labelledby'), picker.getAttribute('aria-label'), picker.textContent]).toEqual([null, null, '파일 선택']);
  const label = root.querySelector<HTMLElement>('[data-krds-part="label"]')!;
  expect([label.tagName, root.getAttribute('role'), root.getAttribute('aria-labelledby'), label.textContent]).toEqual(['P', 'group', label.id, '첨부 서류']);
  expect(text(picker.getAttribute('aria-describedby'))).toEqual([root.querySelector('[data-krds-part="help"]')!.textContent]);
  host.querySelector('button')!.focus(); await userEvent.tab();
  expect(document.activeElement).toBe(picker);
  let opened = 0; input.click = () => { opened++; };
  await userEvent.keyboard('{Enter}'); await userEvent.keyboard(' ');
  expect(opened).toBe(2);
  await userEvent.tab();
  expect(document.activeElement?.textContent).toBe('After upload');
});

test('TutorialPanel inner controls carry shared tab/start/step parts', async () => {
  await mount(<TutorialPanel tasks={tasks} activeTaskId="apply" activeStepId="two" defaultRunning={false} defaultOpen={true} defaultActivePanel="tutorial" startActionId="tutorial-start"/>);
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
  function Host() {
    const [task, setTask] = useState<string | null>(null), [step, setStep] = useState<string | null>(null);
    return <><button type="button" onClick={() => { setTask('apply'); setStep('two'); }}>enter task view</button><TutorialPanel tasks={multiTasks} activeTaskId={task} activeStepId={step} defaultRunning={false} defaultOpen={true} defaultActivePanel="tutorial" startActionId="tutorial-start" onTaskChange={detail => { changes.push(detail); setTask(detail.id); setStep(null); }} onStepChange={detail => setStep(detail.id)}/></>;
  }
  const host = await mount(<Host/>);
  expect(listedTasks(), 'overview lists all tasks').toEqual(['예제 신청하기', '신청 내역 확인']);
  expect(tutorialPart('back'), 'no back on the overview').toEqual([]);
  await act(async () => host.querySelector<HTMLButtonElement>('button')!.click());
  expect(listedTasks(), 'task view lists only the active task').toEqual(['예제 신청하기']);
  expect(tutorialPart('back').map(node => node.textContent?.trim()), 'one back control labelled 작업 목록 in the task view').toEqual(['작업 목록']);
  await act(async () => tutorialPart('back')[0]!.click());
  expect(changes).toEqual([{ id: null }]);
  expect(listedTasks(), 'back returns to the full overview').toEqual(['예제 신청하기', '신청 내역 확인']);
  expect(tutorialPart('back')).toEqual([]);
});

test('TutorialPanel stays on the overview while a task is selected without a step', async () => {
  await mount(<TutorialPanel tasks={multiTasks} activeTaskId="apply" activeStepId={null} defaultRunning={false} defaultOpen={true} defaultActivePanel="tutorial" startActionId="task-start"/>);
  expect(listedTasks()).toEqual(['예제 신청하기', '신청 내역 확인']);
  expect(tutorialPart('back')).toEqual([]);
});

test('TutorialPanel step-list items carry each step instruction under its step control, as the Solid/Vue/Qwik step lists do', async () => {
  await mount(<TutorialPanel tasks={tasks} activeTaskId="apply" activeStepId="one" defaultRunning={false} defaultOpen={true} defaultActivePanel="tutorial" startActionId="tutorial-start"/>);
  const items = [...document.querySelectorAll('[data-krds-component="tutorial-panel"][data-krds-part="step-list"] > li')];
  expect(items.map(item => [item.querySelector('[data-krds-part="step"]')?.textContent, item.querySelector('p')?.textContent])).toEqual([['이름 입력', '이름을 입력하세요'], ['신청 저장', '저장하세요']]);
});

test('TutorialPanel narrow layout keeps the close control in its reserved top row, clear of the title and tabs (390px)', async () => {
  const { page } = await import('vitest/browser');
  await page.viewport(390, 800);
  try {
    await mount(<TutorialPanel tasks={tasks} activeTaskId="apply" activeStepId="one" defaultRunning={false} defaultOpen={true} defaultActivePanel="tutorial" startActionId="narrow-start"/>);
    await new Promise(resolve => setTimeout(resolve, 50));
    const box = (name: string) => document.querySelector<HTMLElement>(`[data-krds-component="tutorial-panel"][data-krds-part="${name}"]`)!.getBoundingClientRect();
    const close = box('close'), facts = ['tabs', 'title'].map(name => { const other = box(name); return [name, close.right > other.left && close.left < other.right && close.bottom > other.top && close.top < other.bottom, Math.round(close.bottom), Math.round(other.top)]; });
    expect(facts.map(([name, overlaps]) => [name, overlaps]), JSON.stringify(facts)).toEqual([['tabs', false], ['title', false]]);
  } finally { await page.viewport(1280, 800); }
});

test('TutorialPanel narrow modal keeps the shared panel surface: the modal layer adds no inline background or padding', async () => {
  const { page } = await import('vitest/browser');
  await page.viewport(390, 800);
  try {
    await mount(<TutorialPanel tasks={tasks} activeTaskId="apply" activeStepId="one" defaultRunning={false} defaultOpen={true} defaultActivePanel="tutorial" startActionId="surface-start"/>);
    await new Promise(resolve => setTimeout(resolve, 50));
    const root = document.querySelector<HTMLElement>('[data-krds-component="tutorial-panel"][data-krds-part="root"]')!;
    const probe = document.createElement('div'); probe.style.background = 'var(--krds-light-color-surface-gray-subtler)'; probe.style.padding = 'var(--krds-padding-6)'; document.body.append(probe);
    const actual = getComputedStyle(root), shared = getComputedStyle(probe);
    expect([root.dataset.krdsLayout, root.getAttribute('role'), root.getAttribute('aria-modal')]).toEqual(['narrow-modal', 'dialog', 'true']);
    expect({ background: actual.backgroundColor, padding: [actual.paddingTop, actual.paddingInlineStart], inline: root.style.background || root.style.padding }).toEqual({ background: shared.backgroundColor, padding: [shared.paddingTop, shared.paddingInlineStart], inline: '' });
    probe.remove();
  } finally { await page.viewport(1280, 800); }
});
