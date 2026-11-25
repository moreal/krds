import { afterEach, expect, test } from 'vitest';
import { createApp, h, nextTick } from 'vue';
import { MainMenu } from '../src/index';
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
async function mount(props: Record<string, unknown>) {
  const host = document.createElement('div'); document.body.append(host);
  const app = createApp({ render: () => [h(MainMenu, props), h('button', { type: 'button', id: 'outside' }, '바깥')] }); app.mount(host);
  let mounted = true; const unmount = () => { if (!mounted) return; mounted = false; app.unmount(); host.remove(); };
  cleanup.push(unmount); await nextTick(); return { host, unmount };
}
const items = [{ id: 'apply', label: '신청', children: [{ id: 'new', label: '신규 신청', href: '/local/new' }] }, { id: 'help', label: '도움', href: '/local/help' }];
const press = async (node: Element) => { node.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true })); await nextTick(); };

// KRDS component_03_02 L1303–1306: clicking the screen outside the menu collapses an open dropdown.
test('a desktop dropdown closes on a press outside the menu and stays open for a press inside it', async () => {
  const requests: (string | null)[] = [];
  const { host } = await mount({ items, onExpandedChange: ({ id }: { id: string | null }) => requests.push(id) });
  const trigger = host.querySelector<HTMLButtonElement>('button[aria-label="신청"]')!;
  trigger.click(); await nextTick();
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  await press(host.querySelector('a[href="/local/new"]')!);
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  await press(host.querySelector('#outside')!);
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
  expect(requests).toEqual(['apply', null]);
});

test('a controlled dropdown only requests the close, and an unmounted menu stops listening', async () => {
  const requests: (string | null)[] = [];
  const { host, unmount } = await mount({ items, expandedId: 'apply', onExpandedChange: ({ id }: { id: string | null }) => requests.push(id) });
  await press(document.body);
  expect(requests).toEqual([null]);
  expect(host.querySelector('button[aria-label="신청"]')!.getAttribute('aria-expanded')).toBe('true');
  unmount();
  await press(document.body);
  expect(requests).toEqual([null]);
});
