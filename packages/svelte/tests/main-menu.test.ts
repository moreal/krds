import { afterEach, expect, test } from 'vitest';
import { mount, unmount, tick, flushSync } from 'svelte';
import { MainMenu } from '../src/lib/index';
const cleanup: (() => unknown)[] = [];
afterEach(async () => { for (const callback of cleanup.splice(0)) await callback(); });
async function render(props: Record<string, unknown>) {
  const host = document.createElement('div'); document.body.append(host);
  const outside = document.createElement('button'); outside.type = 'button'; outside.textContent = '바깥'; document.body.append(outside);
  const app = mount(MainMenu, { target: host, props: props as never });
  let mounted = true; const remove = async () => { if (!mounted) return; mounted = false; await unmount(app); host.remove(); outside.remove(); };
  cleanup.push(remove); await tick(); return { host, outside, remove };
}
const items = [{ id: 'apply', label: '신청', children: [{ id: 'new', label: '신규 신청', href: '/local/new' }] }, { id: 'help', label: '도움', href: '/local/help' }];
const press = async (node: Element) => { node.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true })); flushSync(); await tick(); };

// KRDS component_03_02 L1303–1306: clicking the screen outside the menu collapses an open dropdown.
test('a desktop dropdown closes on a press outside the menu and stays open for a press inside it', async () => {
  const requests: (string | null)[] = [];
  const { host, outside } = await render({ items, onExpandedChange: ({ id }: { id: string | null }) => requests.push(id) });
  const trigger = host.querySelector<HTMLButtonElement>('button[aria-label="신청"]')!;
  trigger.click(); flushSync(); await tick();
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  await press(host.querySelector('a[href="/local/new"]')!);
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  await press(outside);
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
  expect(requests).toEqual(['apply', null]);
});

test('a controlled dropdown only requests the close, and an unmounted menu stops listening', async () => {
  const requests: (string | null)[] = [];
  const { host, remove } = await render({ items, expandedId: 'apply', onExpandedChange: ({ id }: { id: string | null }) => requests.push(id) });
  await press(document.body);
  expect(requests).toEqual([null]);
  expect(host.querySelector('button[aria-label="신청"]')!.getAttribute('aria-expanded')).toBe('true');
  await remove();
  await press(document.body);
  expect(requests).toEqual([null]);
});
