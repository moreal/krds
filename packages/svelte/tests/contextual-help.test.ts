import { afterEach, expect, test } from 'vitest';
import { mount, unmount, tick } from 'svelte';
import { userEvent } from 'vitest/browser';
import { ContextualHelp } from '../src/lib/index';
const cleanup: (() => unknown)[] = [];
afterEach(async () => { for (const callback of cleanup.splice(0)) await callback(); });
async function mountHelp(outside: HTMLButtonElement) {
  const host = document.createElement('div'); document.body.append(host, outside);
  const app = mount(ContextualHelp, { target: host, props: { title: '신청 자격 도움말', content: '설명', triggerLabel: '신청 자격 도움말' } });
  cleanup.push(async () => { await unmount(app); host.remove(); outside.remove(); }); await tick();
  return host;
}
function button(id: string) { const node = document.createElement('button'); node.type = 'button'; node.id = id; node.textContent = id; return node; }
const popover = () => document.querySelector('[data-krds-component="contextual-help"][data-krds-part="popover"]');

// KRDS component_08_03 L1288-1294: Esc hides the help wherever focus is and returns focus to the icon button.
test('ContextualHelp closes on Escape after focus has left it and returns focus to the trigger', async () => {
  const elsewhere = button('elsewhere');
  const host = await mountHelp(elsewhere);
  const trigger = host.querySelector<HTMLButtonElement>('[data-krds-part="trigger"]')!;
  await userEvent.click(trigger); await tick();
  expect(popover()).not.toBeNull();
  elsewhere.focus();
  await userEvent.keyboard('{Escape}'); await tick(); await tick();
  expect(popover()).toBeNull();
  expect(document.activeElement).toBe(trigger);
});

test('ContextualHelp stays open when another control has already claimed Escape', async () => {
  const claims = button('claims');
  claims.addEventListener('keydown', event => { if (event.key === 'Escape') event.preventDefault(); });
  const host = await mountHelp(claims);
  await userEvent.click(host.querySelector<HTMLButtonElement>('[data-krds-part="trigger"]')!); await tick();
  claims.focus();
  await userEvent.keyboard('{Escape}'); await tick(); await tick();
  expect(popover()).not.toBeNull();
  expect(document.activeElement).toBe(claims);
});
