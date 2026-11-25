import { afterEach, expect, test } from 'vitest';
import { mount, unmount, tick } from 'svelte';
import { page, userEvent } from 'vitest/browser';
import { TutorialPanel } from '../src/lib/index';
const cleanup: (() => unknown)[] = [];
afterEach(async () => { for (const callback of cleanup.splice(0)) await callback(); });
const tasks = [{ id: 'apply', title: '예제 신청하기', steps: [{ id: 'one', title: '이름 입력', targetId: 'applicant-name', instruction: '이름을 입력하세요' }] }];
const panelRoot = () => document.querySelector<HTMLElement>('[data-krds-component="tutorial-panel"][data-krds-part="root"]');
async function openFromOpener() {
  const host = document.createElement('div'); document.body.append(host);
  const app = mount(TutorialPanel, { target: host, props: { tasks, activeTaskId: 'apply', activeStepId: null, defaultOpen: false, defaultRunning: false, defaultActivePanel: 'tutorial', startActionId: 'tutorial-start' } });
  cleanup.push(async () => { await unmount(app); host.remove(); }); await tick();
  await userEvent.click(host.querySelector<HTMLButtonElement>('[data-krds-part="opener"]')!); await tick(); await tick();
  return panelRoot()!;
}

// KRDS component_08_02 L1076, L1118-1131: once the panel opens, keyboard focus moves to the panel itself.
test('TutorialPanel moves focus to the desktop panel itself when the opener opens it', async () => {
  const panel = await openFromOpener();
  expect(panel.getAttribute('role')).toBe('complementary');
  expect(document.activeElement).toBe(panel);
});

test('TutorialPanel moves focus to the narrow modal panel itself when the opener opens it', async () => {
  await page.viewport(375, 800); cleanup.push(() => page.viewport(1280, 800));
  const panel = await openFromOpener();
  expect([panel.getAttribute('role'), panel.getAttribute('aria-modal')]).toEqual(['dialog', 'true']);
  expect(document.activeElement).toBe(panel);
});
