import { afterEach, expect, test } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act, type ReactNode } from 'react';
import { MainMenu } from '../src/index';
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
async function mount(view: ReactNode) { const host = document.createElement('div'); document.body.append(host); const root = createRoot(host); await act(async () => root.render(view)); let mounted = true; const unmount = () => { if (!mounted) return; mounted = false; act(() => root.unmount()); host.remove(); }; cleanup.push(unmount); return { host, unmount }; }
const items = [{ id: 'apply', label: '신청', children: [{ id: 'new', label: '신규 신청', href: '/local/new' }] }, { id: 'help', label: '도움', href: '/local/help' }];
const press = (node: Element) => act(async () => { node.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true })); });

// KRDS component_03_02 L1303–1306: clicking the screen outside the menu collapses an open dropdown.
test('a desktop dropdown closes on a press outside the menu and stays open for a press inside it', async () => {
  const requests: (string | null)[] = [];
  const { host } = await mount(<><MainMenu items={items} onExpandedChange={({ id }) => requests.push(id)}/><button type="button" id="outside">바깥</button></>);
  const trigger = host.querySelector<HTMLButtonElement>('button[aria-label="신청"]')!;
  await act(async () => trigger.click());
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  await press(host.querySelector('a[href="/local/new"]')!);
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  await press(host.querySelector('#outside')!);
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
  expect(requests).toEqual(['apply', null]);
});

test('a controlled dropdown only requests the close, and an unmounted menu stops listening', async () => {
  const requests: (string | null)[] = [];
  const { host, unmount } = await mount(<MainMenu items={items} expandedId="apply" onExpandedChange={({ id }) => requests.push(id)}/>);
  await press(document.body);
  expect(requests).toEqual([null]);
  expect(host.querySelector('button[aria-label="신청"]')!.getAttribute('aria-expanded')).toBe('true');
  unmount();
  await press(document.body);
  expect(requests).toEqual([null]);
});
