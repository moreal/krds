import { afterEach, expect, test } from 'vitest';
import { registerKrdsElements } from '../src/index';
registerKrdsElements(customElements);
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
type Host = HTMLElement & { updateComplete: Promise<unknown>; items: unknown; expandedId?: string | null };
const items = [{ id: 'apply', label: '신청', children: [{ id: 'new', label: '신규 신청', href: '/local/new' }] }, { id: 'help', label: '도움', href: '/local/help' }];
async function mount(expandedId?: string) {
  const host = document.createElement('krds-main-menu') as Host;
  host.items = items; if (expandedId) host.expandedId = expandedId;
  const requests: (string | null)[] = [];
  host.addEventListener('expanded-change', event => requests.push((event as CustomEvent<{ id: string | null }>).detail.id));
  const outside = document.createElement('button'); outside.type = 'button'; outside.textContent = '바깥';
  document.body.append(host, outside); cleanup.push(() => { host.remove(); outside.remove(); });
  await host.updateComplete;
  return { host, outside, requests, trigger: host.shadowRoot!.querySelector<HTMLButtonElement>('button[aria-label="신청"]')! };
}
const press = async (host: Host, node: Element) => { node.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true })); await host.updateComplete; };

// KRDS component_03_02 L1303–1306: clicking the screen outside the menu collapses an open dropdown.
test('a desktop dropdown closes on a press outside the menu and stays open for a press inside it', async () => {
  const { host, outside, requests, trigger } = await mount();
  trigger.click(); await host.updateComplete;
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  await press(host, host.shadowRoot!.querySelector('a[href="/local/new"]')!);
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  await press(host, outside);
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
  expect(requests).toEqual(['apply', null]);
});

test('a controlled dropdown only requests the close, and a disconnected menu stops listening', async () => {
  const { host, requests, trigger } = await mount('apply');
  await press(host, document.body);
  expect(requests).toEqual([null]);
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  host.remove();
  await press(host, document.body);
  expect(requests).toEqual([null]);
});
