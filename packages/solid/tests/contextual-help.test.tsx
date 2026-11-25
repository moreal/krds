import { afterEach, expect, test } from 'vitest';
import { render } from 'solid-js/web';
import type { JSX } from 'solid-js';
import { userEvent } from 'vitest/browser';
import { ContextualHelp } from '../src';

const cleanups: (() => void)[] = [];
afterEach(() => { cleanups.splice(0).forEach(dispose => dispose()); });
function mount(view: () => JSX.Element) { const host = document.createElement('div'); document.body.append(host); const dispose = render(view, host); cleanups.push(() => { dispose(); host.remove(); }); return host; }
const popover = () => document.querySelector('[data-krds-component="contextual-help"][data-krds-part="popover"]');
const settled = () => new Promise(resolve => setTimeout(resolve, 0));

// KRDS component_08_03 L1288-1294: Esc hides the help wherever focus is and returns focus to the icon button.
test('ContextualHelp closes on Escape after focus has left it and returns focus to the trigger', async () => {
  const host = mount(() => <><ContextualHelp title="신청 자격 도움말" content="설명" triggerLabel="신청 자격 도움말"/><button type="button" id="elsewhere">다른 작업</button></>);
  const trigger = host.querySelector<HTMLButtonElement>('[data-krds-part="trigger"]')!;
  await userEvent.click(trigger);
  expect(popover()).not.toBeNull();
  host.querySelector<HTMLButtonElement>('#elsewhere')!.focus();
  await userEvent.keyboard('{Escape}'); await settled();
  expect(popover()).toBeNull();
  expect(document.activeElement).toBe(trigger);
});

test('ContextualHelp stays open when another control has already claimed Escape', async () => {
  const host = mount(() => <><ContextualHelp title="신청 자격 도움말" content="설명" triggerLabel="신청 자격 도움말"/><button type="button" id="claims" on:keydown={event => { if (event.key === 'Escape') event.preventDefault(); }}>Escape를 쓰는 작업</button></>);
  await userEvent.click(host.querySelector<HTMLButtonElement>('[data-krds-part="trigger"]')!);
  const claims = host.querySelector<HTMLButtonElement>('#claims')!;
  claims.focus();
  await userEvent.keyboard('{Escape}'); await settled();
  expect(popover()).not.toBeNull();
  expect(document.activeElement).toBe(claims);
});
