import { afterEach, expect, test } from 'vitest';
import { createApp, h, nextTick } from 'vue';
import { userEvent } from 'vitest/browser';
import { ContextualHelp } from '../src/index';
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
function mount(after: () => ReturnType<typeof h>) {
  const host = document.createElement('div'); document.body.append(host);
  const app = createApp({ render: () => [h(ContextualHelp, { title: '신청 자격 도움말', content: '설명', triggerLabel: '신청 자격 도움말' }), after()] }); app.mount(host);
  cleanup.push(() => { app.unmount(); host.remove(); }); return host;
}
const popover = () => document.querySelector('[data-krds-component="contextual-help"][data-krds-part="popover"]');
const settled = async () => { await nextTick(); await new Promise(resolve => requestAnimationFrame(() => resolve(undefined))); await nextTick(); };

// KRDS component_08_03 L1288-1294: Esc hides the help wherever focus is and returns focus to the icon button.
test('ContextualHelp closes on Escape after focus has left it and returns focus to the trigger', async () => {
  const host = mount(() => h('button', { type: 'button', id: 'elsewhere' }, '다른 작업'));
  const trigger = host.querySelector<HTMLButtonElement>('[data-krds-part="trigger"]')!;
  await userEvent.click(trigger); await nextTick();
  expect(popover()).not.toBeNull();
  host.querySelector<HTMLButtonElement>('#elsewhere')!.focus();
  await userEvent.keyboard('{Escape}'); await settled();
  expect(popover()).toBeNull();
  expect(document.activeElement).toBe(trigger);
});

test('ContextualHelp stays open when another control has already claimed Escape', async () => {
  const host = mount(() => h('button', { type: 'button', id: 'claims', onKeydown: (event: KeyboardEvent) => { if (event.key === 'Escape') event.preventDefault(); } }, 'Escape를 쓰는 작업'));
  await userEvent.click(host.querySelector<HTMLButtonElement>('[data-krds-part="trigger"]')!); await nextTick();
  const claims = host.querySelector<HTMLButtonElement>('#claims')!;
  claims.focus();
  await userEvent.keyboard('{Escape}'); await settled();
  expect(popover()).not.toBeNull();
  expect(document.activeElement).toBe(claims);
});
