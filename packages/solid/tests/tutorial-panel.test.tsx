import { afterEach, expect, test } from 'vitest';
import { render } from 'solid-js/web';
import type { JSX } from 'solid-js';
import { page, userEvent } from 'vitest/browser';
import { TutorialPanel } from '../src';

const cleanups: (() => unknown)[] = [];
afterEach(async () => { for (const dispose of cleanups.splice(0)) await dispose(); });
function mount(view: () => JSX.Element) { const host = document.createElement('div'); document.body.append(host); const dispose = render(view, host); cleanups.push(() => { dispose(); host.remove(); }); return host; }
const tasks = [{ id: 'apply', title: '예제 신청하기', steps: [{ id: 'one', title: '이름 입력', targetId: 'applicant-name', instruction: '이름을 입력하세요' }] }];
const panelRoot = () => document.querySelector<HTMLElement>('[data-krds-component="tutorial-panel"][data-krds-part="root"]');
const settled = () => new Promise(resolve => setTimeout(resolve, 0));

// KRDS component_08_02 L1084-1085: the opener and the panel come right after the page content.
test('TutorialPanel places the desktop panel right after its opener in reading and Tab order', async () => {
  const host = mount(() => <><main><button type="button">본문 작업</button></main><TutorialPanel tasks={tasks} activeTaskId="apply" activeStepId={null} defaultOpen={false} startActionId="tutorial-start"/><footer><button type="button" id="after">다음 영역</button></footer></>);
  const opener = host.querySelector<HTMLButtonElement>('[data-krds-part="opener"]')!;
  await userEvent.click(opener); await settled();
  const panel = panelRoot()!;
  expect(panel.getAttribute('role')).toBe('complementary');
  expect(document.activeElement).toBe(panel);
  expect(panel.compareDocumentPosition(host.querySelector('#after')!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  await userEvent.tab({ shift: true });
  expect(document.activeElement).toBe(opener);
});

// KRDS component_08_02 L965: only the narrow layout presents the panel as a modal.
test('TutorialPanel narrow modal stays reachable above the inert page', async () => {
  await page.viewport(375, 800); cleanups.push(() => page.viewport(1280, 800));
  const host = mount(() => <><main><button type="button">본문 작업</button></main><TutorialPanel tasks={tasks} activeTaskId="apply" activeStepId={null} defaultOpen={false} startActionId="tutorial-start"/></>);
  await userEvent.click(host.querySelector<HTMLButtonElement>('[data-krds-part="opener"]')!); await settled();
  const dialog = panelRoot()!;
  expect([dialog.getAttribute('role'), dialog.getAttribute('aria-modal')]).toEqual(['dialog', 'true']);
  expect(document.activeElement).toBe(dialog);
  expect(dialog.closest('[inert]')).toBeNull();
  expect(host.closest('[inert]')).not.toBeNull();
});
