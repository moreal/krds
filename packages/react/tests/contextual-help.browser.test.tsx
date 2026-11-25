import { afterEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { createRoot } from 'react-dom/client';
import { act, type ReactNode } from 'react';
import { ContextualHelp } from '../src/index';
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
async function mount(view: ReactNode) { const host = document.createElement('div'); document.body.append(host); const root = createRoot(host); await act(async () => root.render(view)); cleanup.push(() => { act(() => root.unmount()); host.remove(); }); return host; }
const popover = () => document.querySelector('[data-krds-component="contextual-help"][data-krds-part="popover"]');

// KRDS component_08_03 L1288-1294: Esc hides the help wherever focus is and returns focus to the icon button.
test('ContextualHelp closes on Escape after focus has left it and returns focus to the trigger', async () => {
  const host = await mount(<><ContextualHelp title="신청 자격 도움말" content="설명" triggerLabel="신청 자격 도움말"/><button type="button" id="elsewhere">다른 작업</button></>);
  const trigger = host.querySelector<HTMLButtonElement>('[data-krds-part="trigger"]')!;
  await userEvent.click(trigger);
  expect(popover()).not.toBeNull();
  host.querySelector<HTMLButtonElement>('#elsewhere')!.focus();
  await userEvent.keyboard('{Escape}');
  expect(popover()).toBeNull();
  expect(document.activeElement).toBe(trigger);
});

test('ContextualHelp stays open when another control has already claimed Escape', async () => {
  const host = await mount(<><ContextualHelp title="신청 자격 도움말" content="설명" triggerLabel="신청 자격 도움말"/><button type="button" id="claims" onKeyDown={event => { if (event.key === 'Escape') event.preventDefault(); }}>Escape를 쓰는 작업</button></>);
  await userEvent.click(host.querySelector<HTMLButtonElement>('[data-krds-part="trigger"]')!);
  const claims = host.querySelector<HTMLButtonElement>('#claims')!;
  claims.focus();
  await userEvent.keyboard('{Escape}');
  expect(popover()).not.toBeNull();
  expect(document.activeElement).toBe(claims);
});
