/// <reference types="vite/client" />
import { afterEach, expect, test } from 'vitest';
import { createSignal, type JSX } from 'solid-js';
import { render } from 'solid-js/web';
import { MainMenu } from '../src/components/main-menu';
import { Modal } from '../src/components/modal';
import { page, userEvent } from 'vitest/browser';
import '@unofficial-krds/styles/all.css';

const cleanups: (() => void)[] = [];
afterEach(() => cleanups.splice(0).reverse().forEach(dispose => dispose()));
function mount(view: () => JSX.Element) {
  const host = document.createElement('div'); document.body.append(host);
  const dispose = render(view, host);
  const cleanup = () => { dispose(); host.remove(); };
  cleanups.push(cleanup); return { host, cleanup };
}
const flush = async () => { await Promise.resolve(); await Promise.resolve(); };
const items = [{ id: 'catalog', label: 'Components', children: Array.from({ length: 55 }, (_, i) => ({ id: `entry-${i}`, label: `Component ${i + 1}`, href: `#entry-${i}` })) }, { id: 'legal', label: 'Legal', children: [{ id: 'rights', label: 'Rights', href: '#rights' }] }];
const part = (name: string) => `[data-krds-component="main-menu"][data-krds-part="${name}"]`;

test('desktop public CSS overlays a long first-level menu without moving following content', async () => {
  const { host } = mount(() => <><MainMenu items={items}/><main>Following content</main></>);
  const nav = host.querySelector<HTMLElement>('nav')!, main = host.querySelector('main')!;
  const before = { nav: nav.getBoundingClientRect().height, main: main.getBoundingClientRect().top };
  for (const label of ['Components', 'Legal']) {
    const trigger = host.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!;
    trigger.click(); await flush();
    const panel = document.getElementById(trigger.getAttribute('aria-controls')!)!;
    expect(Math.abs(nav.getBoundingClientRect().height - before.nav)).toBeLessThanOrEqual(1);
    expect(Math.abs(main.getBoundingClientRect().top - before.main)).toBeLessThanOrEqual(1);
    expect(getComputedStyle(panel).position).toBe('absolute');
    expect(panel.getBoundingClientRect().width).toBeCloseTo(nav.getBoundingClientRect().width, 0);
    expect(panel.getBoundingClientRect().height).toBeLessThanOrEqual(innerHeight * .7 + 1);
    expect(getComputedStyle(panel).listStyleType).toBe('none');
    const last = panel.querySelector<HTMLAnchorElement>('li:last-child a')!;
    last.scrollIntoView({ block: 'nearest' });
    expect(last.getBoundingClientRect().bottom).toBeLessThanOrEqual(panel.getBoundingClientRect().bottom + 1);
    trigger.click(); await flush();
  }
});

test('desktop outside pointer and focus departure close without stealing outside focus', async () => {
  const { host } = mount(() => <><MainMenu items={items}/><button id="outside">Outside</button></>);
  const trigger = host.querySelector<HTMLButtonElement>('button[aria-label="Legal"]')!, outside = host.querySelector<HTMLButtonElement>('#outside')!;
  trigger.click();
  outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); outside.focus(); await flush();
  expect(trigger.getAttribute('aria-expanded')).toBe('false'); expect(document.activeElement).toBe(outside);
  trigger.click(); trigger.focus();
  host.querySelector<HTMLAnchorElement>('a[href="#rights"]')!.focus();
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  outside.focus(); await flush();
  expect(trigger.getAttribute('aria-expanded')).toBe('false'); expect(document.activeElement).toBe(outside);
  trigger.click(); trigger.focus();
  trigger.blur(); await flush();
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
});

test('desktop Escape outside the nav requests close and returns focus only after acceptance', async () => {
  const [expanded, setExpanded] = createSignal<string | null>('legal'); const requests: (string | null)[] = [];
  const { host } = mount(() => <><MainMenu items={items} expandedId={expanded()} onExpandedChange={({ id }) => requests.push(id)}/><button id="outside">Outside</button></>);
  const trigger = host.querySelector<HTMLButtonElement>('button[aria-label="Legal"]')!, outside = host.querySelector<HTMLButtonElement>('#outside')!;
  outside.focus(); requests.length = 0;
  outside.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await flush();
  expect(requests).toEqual([null]); expect(trigger.getAttribute('aria-expanded')).toBe('true'); expect(document.activeElement).toBe(outside);
  setExpanded(null); await flush(); expect(document.activeElement).toBe(outside);
  setExpanded('legal'); trigger.focus();
  // A synchronous accepting host follows the existing controlled request path.
  const accepting = mount(() => <MainMenu items={items} expandedId={expanded()} onExpandedChange={({ id }) => setExpanded(id)}/>);
  const acceptedTrigger = accepting.host.querySelector<HTMLButtonElement>('button[aria-label="Legal"]')!;
  acceptedTrigger.focus(); acceptedTrigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await flush();
  expect(acceptedTrigger.getAttribute('aria-expanded')).toBe('false'); expect(document.activeElement).toBe(acceptedTrigger);
});

test('desktop rejected outside close retains committed panel and disposal removes document listeners', async () => {
  const requests: (string | null)[] = [];
  const { host, cleanup } = mount(() => <><MainMenu items={items} expandedId="legal" onExpandedChange={({ id }) => requests.push(id)}/><button id="outside">Outside</button></>);
  const trigger = host.querySelector<HTMLButtonElement>('button[aria-label="Legal"]')!, outside = host.querySelector<HTMLButtonElement>('#outside')!;
  outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); await flush();
  expect(requests).toEqual([null]); expect(trigger.getAttribute('aria-expanded')).toBe('true');
  requests.length = 0; cleanup();
  document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
  document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); document.body.focus(); await flush();
  expect(requests).toEqual([]);
});

test('desktop nested submenus stay in panel flow and own lists have no bullets', async () => {
  const { host } = mount(() => <MainMenu items={[{ id: 'a', label: 'A', children: [{ id: 'b', label: 'B', children: [{ id: 'c', label: 'C', href: '#c' }] }] }]} defaultExpandedId="a"/>);
  host.querySelector<HTMLButtonElement>('button[aria-label="B"]')!.click(); await flush();
  const panels = host.querySelectorAll<HTMLElement>(part('submenu'));
  expect(getComputedStyle(panels[0]).position).toBe('absolute'); expect(getComputedStyle(panels[1]).position).toBe('static');
  for (const list of host.querySelectorAll<HTMLElement>('ul')) expect(getComputedStyle(list).listStyleType).toBe('none');
});

test('one actual rejected outside click emits one request and later keyboard departure is independent', async () => {
  const requests: (string | null)[] = [];
  const { host } = mount(() => <><button id="outside-action">Outside action</button><MainMenu items={items} expandedId="legal" onExpandedChange={({ id }) => requests.push(id)}/></>);
  await userEvent.click(page.getByRole('button', { name: 'Outside action', exact: true })); await flush();
  expect(requests).toEqual([null]);
  expect(host.querySelector('button[aria-label="Legal"]')!.getAttribute('aria-expanded')).toBe('true');
  await userEvent.click(page.getByRole('button', { name: 'Outside action', exact: true })); await flush();
  expect(requests).toEqual([null, null]);
  host.querySelector<HTMLButtonElement>('button[aria-label="Legal"]')!.focus();
  await userEvent.keyboard('{End}');
  host.querySelector<HTMLButtonElement>('#outside-action')!.focus();
  expect(requests).toEqual([null, null, null]);
});

test('a rejected desktop menu yields document Escape to a separate active public Modal', async () => {
  const [open, setOpen] = createSignal(false); const requests: { id: string | null; modalOpen: boolean }[] = [];
  mount(() => <><button onClick={() => setOpen(true)}>Open separate modal</button><MainMenu items={items} expandedId="legal" onExpandedChange={({ id }) => requests.push({ id, modalOpen: open() })}/><Modal title="Separate modal" open={open()} onOpenChange={({ open }) => setOpen(open)}><button>Modal action</button></Modal></>);
  await userEvent.click(page.getByRole('button', { name: 'Open separate modal', exact: true })); await flush(); requests.length = 0;
  await userEvent.keyboard('{Escape}'); await flush();
  expect(document.querySelector('[role="dialog"]')).toBeNull();
  // Restoring the opener after the modal closes is an ordinary outside focus;
  // the menu must not handle the Escape while the modal still owns the layer.
  expect(requests.filter(request => request.modalOpen)).toEqual([]);
});

test('Escape inside a desktop menu in the active Modal collapses the menu before the Modal', async () => {
  const [open, setOpen] = createSignal(false);
  mount(() => <><button onClick={() => setOpen(true)}>Open containing modal</button><Modal title="Containing modal" open={open()} onOpenChange={({ open }) => setOpen(open)}><MainMenu items={items} defaultExpandedId="legal"/></Modal></>);
  await userEvent.click(page.getByRole('button', { name: 'Open containing modal', exact: true })); await flush();
  const trigger = document.querySelector<HTMLButtonElement>('[role="dialog"] button[aria-label="Legal"]')!; trigger.focus();
  await userEvent.keyboard('{Escape}'); await flush();
  expect(trigger.getAttribute('aria-expanded')).toBe('false'); expect(document.querySelector('[role="dialog"]')).not.toBeNull();
  await userEvent.keyboard('{Escape}'); await flush(); expect(document.querySelector('[role="dialog"]')).toBeNull();
});

test('offset desktop panel uses remaining viewport space and local scroll without moving the page', async () => {
  const [spacing, setSpacing] = createSignal(340);
  const { host } = mount(() => <><div style={{ height: `${spacing()}px` }}/><MainMenu items={items} defaultExpandedId="catalog"/><main style={{ height: '1000px' }}>Following content</main></>);
  const panel = host.querySelector<HTMLElement>(part('submenu'))!;
  const check = async () => {
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    const before = scrollY; panel.scrollTop = panel.scrollHeight;
    const bounds = panel.getBoundingClientRect(), last = panel.querySelector('li:last-child a')!.getBoundingClientRect();
    expect(bounds.bottom).toBeLessThanOrEqual(innerHeight + 1); expect(last.bottom).toBeLessThanOrEqual(innerHeight + 1); expect(scrollY).toBe(before);
  };
  await check();
  setSpacing(440); window.dispatchEvent(new Event('resize')); await check();
});

test('desktop viewport bounds resources release on close and disposal', async () => {
  const { host, cleanup } = mount(() => <MainMenu items={items} defaultExpandedId="legal"/>);
  const nav = host.querySelector<HTMLElement>('nav')!, trigger = host.querySelector<HTMLButtonElement>('button[aria-label="Legal"]')!;
  expect(nav.style.getPropertyValue('--krds-main-menu-available-height')).not.toBe('');
  trigger.click(); await flush(); expect(nav.style.getPropertyValue('--krds-main-menu-available-height')).toBe('');
  window.dispatchEvent(new Event('resize')); document.dispatchEvent(new Event('scroll'));
  expect(nav.style.getPropertyValue('--krds-main-menu-available-height')).toBe('');
  trigger.click(); await flush(); expect(nav.style.getPropertyValue('--krds-main-menu-available-height')).not.toBe('');
  cleanup(); document.body.append(nav); nav.style.height = '123px';
  window.dispatchEvent(new Event('resize')); document.dispatchEvent(new Event('scroll'));
  window.visualViewport?.dispatchEvent(new Event('resize'));
  await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  expect(nav.style.getPropertyValue('--krds-main-menu-available-height')).toBe(''); nav.remove();
});
