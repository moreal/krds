import { afterEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'solid-js/web';
import { createSignal, type JSX } from 'solid-js';
import * as K from '../src';
const cleanups: (() => void)[] = [];
afterEach(() => { cleanups.splice(0).forEach(cleanup => cleanup()); });
function mount(view: () => JSX.Element) { const host = document.createElement('div'); document.body.append(host); const dispose = render(view, host); cleanups.push(() => { dispose(); host.remove(); }); return host; }
const tabbable = (root: Element) => [...root.querySelectorAll<HTMLElement>('a[href],button,input,select,textarea,[tabindex]')].filter(node => node.tabIndex >= 0 && !(node as HTMLButtonElement).disabled && !node.closest('[hidden]'));
const text = (ids: string | null) => (ids ?? '').split(' ').filter(Boolean).map(id => document.getElementById(id)?.textContent?.trim() ?? `missing:${id}`);
const tasks = [{ id: 'apply', title: '예제 신청하기', steps: [{ id: 'one', title: '이름 입력', targetId: 'applicant-name', instruction: '이름을 입력하세요' }, { id: 'two', title: '신청 저장', targetId: 'save-application', instruction: '저장하세요' }] }];

test('FileUpload keeps one keyboard/AT file control: the visible picker opens the hidden native input (KRDS component.css 2943-2953, component_09_04)', async () => {
    const host = mount(() => <><button>Before upload</button><K.FileUpload label="첨부 서류" name="documents" files={[]} accept=".txt" onFilesChange={() => {}}/><button>After upload</button></>);
    const root = host.querySelector<HTMLElement>('[data-krds-component="file-upload"][data-krds-part="root"]')!;
    const input = root.querySelector<HTMLInputElement>('[data-krds-part="file-input"]')!;
    const picker = root.querySelector<HTMLButtonElement>('[data-krds-part="picker"]')!;
    expect(input.type).toBe('file');
    expect(input.tabIndex).toBe(-1);
    expect(input.getAttribute('aria-hidden')).toBe('true');
    expect(tabbable(root)).toEqual([picker]);
    expect(picker.textContent).toBe('파일 선택');
    expect([picker.hasAttribute('aria-labelledby'), picker.hasAttribute('aria-label')], 'picker name is exactly its own visible text').toEqual([false, false]);
    const label = root.querySelector<HTMLElement>('[data-krds-part="label"]')!;
    expect([label.tagName, root.getAttribute('role'), root.getAttribute('aria-labelledby')], 'the group is named by its paragraph label').toEqual(['P', 'group', label.id]);
    expect(text(picker.getAttribute('aria-describedby'))).toEqual([root.querySelector('[data-krds-part="help"]')!.textContent!.trim()]);
    host.querySelector('button')!.focus();
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement).toBe(picker);
    let opened = 0; input.click = () => { opened++; };
    await userEvent.keyboard('{Enter}'); await userEvent.keyboard(' ');
    expect(opened).toBe(2);
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement?.textContent).toBe('After upload');
});

test('TutorialPanel inner controls carry shared tab/start/step parts', () => {
    const host = mount(() => <K.TutorialPanel tasks={tasks} activeTaskId="apply" activeStepId="two" defaultRunning={false} defaultOpen={true} defaultActivePanel="tutorial" startActionId="tutorial-start"/>);
    const part = (name: string) => [...document.querySelectorAll<HTMLElement>(`[data-krds-component="tutorial-panel"][data-krds-part="${name}"]`)];
    const tabs = part('tab');
    expect(tabs.map(tab => [tab.getAttribute('role'), tab.getAttribute('data-krds-state')])).toEqual([['tab', ''], ['tab', 'selected']]);
    expect(part('start').map(node => [node.tagName, node.id])).toEqual([['BUTTON', 'tutorial-start']]);
    expect(part('task-toggle').map(node => [node.tagName, node.tagName === 'SUMMARY' ? String((node.parentElement as HTMLDetailsElement).open) : node.getAttribute('aria-expanded'), node.textContent?.includes('예제 신청하기')])).toEqual([['SUMMARY', 'true', true]]);
    expect(part('step').map(node => [node.tagName, node.getAttribute('data-krds-state'), node.getAttribute('aria-current')])).toEqual([['BUTTON', '', null], ['BUTTON', 'current', 'step']]);
    expect(host).toBeTruthy();
});

const multiTasks = [...tasks, { id: 'review', title: '신청 내역 확인', steps: [{ id: 'open', title: '내역 열기', targetId: 'history', instruction: '내역을 여세요' }] }];
const tutorialPart = (name: string) => [...document.querySelectorAll<HTMLElement>(`[data-krds-component="tutorial-panel"][data-krds-part="${name}"]`)];
const listedTasks = () => tutorialPart('task-list').flatMap(list => [...list.querySelectorAll<HTMLElement>('[data-krds-part="task-toggle"]')].map(toggle => toggle.textContent?.trim()));

test('TutorialPanel overview lists every task without back; the task view replaces it with only the active task and back requests the overview', async () => {
    const changes: ({ id: string | null })[] = [];
    const [task, setTask] = createSignal<string | null>(null), [step, setStep] = createSignal<string | null>(null);
    mount(() => <K.TutorialPanel tasks={multiTasks} activeTaskId={task()} activeStepId={step()} defaultRunning={false} defaultOpen={true} defaultActivePanel="tutorial" startActionId="tutorial-start" onTaskChange={detail => { changes.push(detail); setStep(null); setTask(detail.id); }} onStepChange={detail => setStep(detail.id)}/>);
    expect(listedTasks(), 'overview lists all tasks').toEqual(['예제 신청하기', '신청 내역 확인']);
    expect(tutorialPart('back'), 'no back on the overview').toEqual([]);
    setTask('apply'); setStep('two');
    expect(listedTasks(), 'task view lists only the active task').toEqual(['예제 신청하기']);
    expect(tutorialPart('back').map(node => node.textContent?.trim()), 'one back control labelled 작업 목록 in the task view').toEqual(['작업 목록']);
    await userEvent.click(tutorialPart('back')[0]!);
    expect(changes).toEqual([{ id: null }]);
    expect(listedTasks(), 'back returns to the full overview').toEqual(['예제 신청하기', '신청 내역 확인']);
    expect(tutorialPart('back')).toEqual([]);
});

test('TutorialPanel stays on the overview while a task is selected without a step', () => {
    mount(() => <K.TutorialPanel tasks={multiTasks} activeTaskId="apply" activeStepId={null} defaultRunning={false} defaultOpen={true} defaultActivePanel="tutorial" startActionId="task-start"/>);
    expect(listedTasks()).toEqual(['예제 신청하기', '신청 내역 확인']);
    expect(tutorialPart('back')).toEqual([]);
});
