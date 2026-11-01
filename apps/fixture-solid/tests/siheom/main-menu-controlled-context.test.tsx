import { afterEach, expect, test } from 'vitest';
import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';
import { MainMenu } from '@unofficial-krds/solid';
const cleanups: (() => void)[] = [];
afterEach(() => cleanups.splice(0).forEach(dispose => dispose()));
const items = [{ id: 'a', label: 'Root A', children: [{ id: 'b', label: 'Branch B', children: [{ id: 'c', label: 'Branch C', children: [{ id: 'd', label: 'Deep route', href: '#deep' }] }] }] }, { id: 'x', label: 'Root X', children: [{ id: 'x-leaf', label: 'Sibling route', href: '#sibling' }] }];
const flush = async () => { await Promise.resolve(); await Promise.resolve(); };
for (const nextRoot of [null, 'x']) for (const outsideFocus of [false, true]) test(`Controlled deep context reconciles committed root=${nextRoot}; outsideFocus=${outsideFocus}`, async () => {
  const host = document.createElement('div'); document.body.append(host);
  const [expanded, setExpanded] = createSignal<string | null>('a'); const events: unknown[] = [];
  const dispose = render(() => <><MainMenu items={items} expandedId={expanded()} onExpandedChange={detail => events.push(detail)}/><input aria-label="Outside"/></>, host);
  cleanups.push(() => { dispose(); host.remove(); });
  const trigger = (label: string) => [...host.querySelectorAll<HTMLButtonElement>('[data-krds-part="trigger"]')].find(node => node.getAttribute('aria-label') === label)!;
  trigger('Branch B').click(); trigger('Branch C').click(); await flush();
  const route = host.querySelector<HTMLAnchorElement>('a[href="#deep"]')!;
  expect(route.getClientRects().length).toBeGreaterThan(0);
  const outside = host.querySelector<HTMLInputElement>('input')!;
  (outsideFocus ? outside : route).focus(); await flush();
  expect(events).toEqual(outsideFocus ? [{ id: null }] : []);
  // A rejected outside-focus request retains the committed deep context.
  expect(route.getClientRects().length).toBeGreaterThan(0);
  events.length = 0;
  setExpanded(nextRoot); await flush();
  expect(host.querySelector('a[href="#deep"]')?.getClientRects().length ?? 0).toBe(0);
  expect(document.activeElement).toBe(outsideFocus ? outside : trigger('Root A'));
  expect(events).toEqual([]);
  if (nextRoot === 'x') expect(host.querySelector('a[href="#sibling"]')!.getClientRects().length).toBeGreaterThan(0);
  // Returning to the old root must not resurrect its stale deep frame.
  setExpanded('a'); await flush();
  expect(host.querySelector('a[href="#deep"]')?.getClientRects().length ?? 0).toBe(0);
  expect(events).toEqual([]);
});
test('Rejected controlled root drill retains the committed sibling and request/focus authority', async () => {
  const host = document.createElement('div'); document.body.append(host); const events: unknown[] = [];
  const dispose = render(() => <MainMenu items={items} expandedId="x" onExpandedChange={detail => events.push(detail)}/>, host);
  cleanups.push(() => { dispose(); host.remove(); });
  const rootA = [...host.querySelectorAll<HTMLButtonElement>('[data-krds-part="trigger"]')].find(node => node.getAttribute('aria-label') === 'Root A')!;
  rootA.focus(); rootA.click(); await flush();
  expect(rootA.getAttribute('aria-expanded')).toBe('false'); expect(document.activeElement).toBe(rootA);
  expect(host.querySelector('a[href="#sibling"]')!.getClientRects().length).toBeGreaterThan(0);
  expect(host.querySelector('a[href="#deep"]')?.getClientRects().length ?? 0).toBe(0);
  expect(events).toEqual([{ id: 'a' }]);
});
