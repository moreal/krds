import { afterEach, expect, test, vi } from 'vitest';
import { createSignal, Show, ErrorBoundary, type JSX } from 'solid-js';
import { render } from 'solid-js/web';
import { userEvent } from 'vitest/browser';
import * as K from '@unofficial-krds/solid';

const cleanups: (() => void)[] = [];
afterEach(() => { cleanups.splice(0).reverse().forEach(dispose => dispose()); vi.useRealTimers(); window.scrollTo(0, 0); });
function mount(view: () => JSX.Element) {
  const host = document.createElement('div'); document.body.append(host);
  let failure:unknown; const dispose = render(() => <ErrorBoundary fallback={error => { failure=error; return null; }}>{view()}</ErrorBoundary>, host); if(failure){dispose();host.remove();throw failure;} cleanups.push(() => { dispose(); host.remove(); }); return host;
}
const flush = async () => { await Promise.resolve(); await Promise.resolve(); };
const topics = [{ id: 'one', title: 'Topic', content: 'Content', relatedLinks: [] }];

test('G1 desktop Help does not consume Escape from the actual top modal', async () => {
  let background = 0, modal = 0;
  const [show, setShow] = createSignal(false);
  mount(() => <><K.HelpPanel topics={topics} open onOpenChange={() => background++}/><K.Modal title="Top modal" open={show()} onOpenChange={() => { modal++; setShow(false); }}><button>Modal action</button></K.Modal></>);
  setShow(true); await flush();
  document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  expect(modal).toBe(1); expect(background).toBe(0);
});

test('G2 MainMenu preserves composing draft and caret across controlled host query changes', () => {
  const [query, setQuery] = createSignal('committed'); const requests: string[] = [];
  const host = mount(() => <K.MainMenu items={[]} query={query()} onQueryChange={({ value }) => requests.push(value)}/>);
  const input = host.querySelector('input')!;
  input.focus(); input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
  input.value = '입력 중'; input.setSelectionRange(2, 2);
  input.dispatchEvent(new InputEvent('input', { bubbles: true, isComposing: true }));
  setQuery('host revision');
  expect(input.value).toBe('입력 중'); expect(input.selectionStart).toBe(2); expect(requests).toEqual([]);
  input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
  expect(requests).toEqual(['입력 중']); expect(input.value).toBe('host revision');
});

test('G4 Help close uses the surviving initiating topic icon after an unusable opener', async () => {
  const [show, setShow] = createSignal(true);
  const host = mount(() => <K.HelpPanel topics={topics} defaultOpen={false} showOpener={show()}/>);
  const icon = host.querySelector<HTMLButtonElement>('[data-krds-part="topic-trigger"]')!;
  icon.click(); setShow(false);
  document.querySelector<HTMLButtonElement>('[data-krds-component="help-panel"][data-krds-part="close"]')!.click();
  await flush(); expect(document.activeElement).toBe(icon);
});

test('G4 Tooltip teardown uses its saved usable ancestor when the trigger disappears', async () => {
  const [show, setShow] = createSignal(true);
  const host = mount(() => <div tabIndex={-1} id="tooltip-ancestor"><Show when={show()}><K.Tooltip text="Details" relationship="description" triggerLabel="Details help" triggerId="saved-tip" textId="saved-tip-text" defaultOpen/></Show></div>);
  setShow(false); await flush(); expect(document.activeElement).toBe(host.firstElementChild);
});

const tree = [{ id: 'a', label: 'A', children: [{ id: 'b', label: 'B', children: [{ id: 'c', label: 'C', href: '#c' }] }] }];
test('G5 deep current SideNavigation exposes its branch with two-level progressive header context', () => {
  const host = mount(() => <K.SideNavigation items={tree} currentId="c"/>);
  const current = host.querySelector<HTMLElement>('[aria-current="page"]')!;
  expect(current.getClientRects().length).toBeGreaterThan(0);
  expect(host.querySelector('[data-krds-part="header"]')?.textContent).toContain('A');
  let levels = 0, node: Element | null = current;
  while (node) { if (node.tagName === 'UL') levels++; node = node.parentElement; }
  expect(levels).toBeLessThanOrEqual(2);
});
test('G5 externally accepted branch collapse returns a focused descendant to its own trigger', () => {
  const [ids, setIds] = createSignal<readonly string[]>(['a', 'b']);
  const host = mount(() => <K.SideNavigation items={tree} expandedIds={ids()}/>);
  host.querySelector<HTMLElement>('a')!.focus(); setIds(['a']);
  expect(document.activeElement?.textContent).toContain('B');
});

test('G6 asynchronous load-more waits for actual append then scrolls and focuses exactly once', async () => {
  const [shown, setShown] = createSignal(1), [pending, setPending] = createSignal(false);
  const host = mount(() => <><K.Pagination variant="load-more" pageCount={3} hrefForPage={n => `#${n}`} loadMore={{ shown: shown(), total: 3, pending: pending(), firstNewItemId: 'async-added', onLoadMore: () => setPending(true) }}/><div style={{ height: '2500px' }}/><Show when={shown() > 1}><article id="async-added">Appended result</article></Show></>);
  host.querySelector<HTMLButtonElement>('button')!.click();
  await new Promise(resolve => setTimeout(resolve, 0)); setShown(2); setPending(false); await flush();
  expect(document.activeElement?.id).toBe('async-added'); expect(window.scrollY).toBeGreaterThan(0);
});

for (const ids of [['', 'valid'], ['duplicate', 'duplicate']]) test(`G7 rejects malformed explicit Radio IDs ${JSON.stringify(ids)}`, () => {
  expect(() => mount(() => <K.RadioGroup label="Choice" options={ids.map((id, i) => ({ id, value: String(i), label: String(i) }))}/>)).toThrow(TypeError);
});

test('G8 Resize defaults include90 and a native outside pointer dismisses the open list', () => {
  const requests: string[] = [];
  const host = mount(() => <><K.Resize onValueChange={({ value }) => requests.push(value)}/><button id="resize-outside">Outside</button></>);
  const trigger = host.querySelector<HTMLButtonElement>('[data-krds-part="trigger"]')!;
  trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
  expect(requests).toEqual(['90']); trigger.click();
  host.querySelector('#resize-outside')!.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
});

test('G9 Header defaults horizontal and MainMenu renders supplied submenu heading/description', () => {
  const host = mount(() => <><K.Header home={{ href: '#home', label: 'Home', logo: { src: '/local.svg', alt: 'Service' } }} utilityItems={[]} mainNavigation={[]}/><K.MainMenu items={[{ id: 'described', label: 'Applications', description: 'Meaningful supplied explanation', children: [{ id: 'leaf', label: 'Apply', href: '#apply', description: 'Leaf route explanation' }] }]} defaultExpandedId="described"/></>);
  expect(host.querySelector('header')?.getAttribute('data-krds-action-layout')).toBe('horizontal');
  expect(host.querySelector('[data-krds-part="submenu-title"]')?.textContent).toBe('Applications');
  expect(host.querySelector('[data-krds-part="description"]')?.textContent).toBe('Meaningful supplied explanation');
  expect(host.textContent).toContain('Leaf route explanation');
});

test('G10 an actual committed Carousel slide change safely focuses play-pause before hiding its focused slide', () => {
  const [index, setIndex] = createSignal(0);
  const host = mount(() => <K.Carousel index={index()} items={[{ id: 'one', label: 'One', content: 'One' }, { id: 'two', label: 'Two', content: 'Two' }]}/>);
  const content = host.querySelector<HTMLElement>('[data-krds-part="slide"] p')!; content.tabIndex = 0; content.focus();
  setIndex(1); expect(document.activeElement).toBe(host.querySelector('[data-krds-part="play-pause"]'));
});

test('G11 a remote/nonadjacent Coach boundary suspends ordinary instructions and Next', () => {
  const host = mount(() => <><button id="coach-target">Target</button><button>Unrelated intervening control</button><span id="remote-boundary"/><K.CoachMark defaultOpen startActionId="start" steps={[{ id: 'one', targetId: 'coach-target', title: 'Step', instruction: 'Ordinary actionable step' }, { id: 'two', targetId: 'coach-target', title: 'Next', instruction: 'Next' }]} boundaries={[{ targetId: 'coach-target', insertionBoundaryId: 'remote-boundary' }]}/></>);
  expect(document.querySelector<HTMLButtonElement>('[data-krds-component="coach-mark"][data-krds-part="next"]')?.disabled).toBe(true);
  expect(document.querySelector('[data-krds-part="instruction"]')?.textContent).not.toBe('Ordinary actionable step');
});

test('G12 same-ID Snackbar action removal restores initiator and resets lost hover pause for the next surface', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] });
  const [message, setMessage] = createSignal<K.SnackbarProps['message']>(null);
  const [action, setAction] = createSignal<K.SnackbarProps['action']>({ id: 'save', kind: 'button', label: 'Save' });
  const dismissed: unknown[] = [];
  const host = mount(() => <><button id="snack-initiator">Initiate</button><K.Snackbar message={message()} action={action()} durationMs={1000} onDismiss={d => dismissed.push(d)}/></>);
  host.querySelector<HTMLButtonElement>('#snack-initiator')!.focus(); setMessage({ id: 'same', title: 'Saved', text: 'Result' });
  host.querySelector<HTMLButtonElement>('[data-krds-part="action"]')!.focus(); setAction(undefined); await flush();
  expect(document.activeElement?.id).toBe('snack-initiator');
  const surface = host.querySelector<HTMLElement>('[data-krds-component="snackbar"][data-krds-part="root"]')!;
  surface.dispatchEvent(new PointerEvent('pointerenter')); setMessage(null); setMessage({ id: 'next', title: 'Next', text: 'Next result' });
  vi.advanceTimersByTime(1000); expect(dismissed).toHaveLength(1);
});

test('G13 blocked backdrop pointer cannot relabel a later Escape request as outside', () => {
  const requests: string[] = [];
  mount(() => <K.BottomSheet title="Sheet" open onOpenChange={({ reason }) => requests.push(reason)}/>);
  const backdrop = document.querySelector('[data-krds-component="modal"][data-krds-part="backdrop"]')!;
  backdrop.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 1, button: 0, isPrimary: true }));
  backdrop.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1, button: 0, isPrimary: true }));
  document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  expect(requests).toEqual(['escape']);
});

test('G13 a rejected native handle drag emits one drag request and suppresses its following pointer click', async () => {
  const requests: string[] = [];
  mount(() => <K.BottomSheet title="Drag sheet" open onOpenChange={({ reason }) => requests.push(reason)}><button style={{ display: 'block', 'margin-top': '150px' }}>Drag destination</button></K.BottomSheet>);
  const handle = document.querySelector<HTMLElement>('[data-krds-part="handle"]')!;
  const destination = [...document.querySelectorAll('button')].find(node => node.textContent === 'Drag destination')!;
  const clicks: boolean[] = []; handle.addEventListener('click', event => clicks.push(event.isTrusted));
  await userEvent.dragAndDrop(handle, destination);
  expect(requests).toEqual(['drag']);
  expect(clicks).toEqual([true]);
  await userEvent.click(handle);
  expect(requests).toEqual(['drag', 'close']);
});

test('G6 accepted append work cannot focus after Pagination has been disposed', async () => {
  const [shown, setShown] = createSignal(1), [pending, setPending] = createSignal(false), [visible, setVisible] = createSignal(true);
  const host = mount(() => <><button id="append-outside">Outside</button><Show when={visible()}><K.Pagination variant="load-more" pageCount={2} hrefForPage={n => `#${n}`} loadMore={{ shown: shown(), total: 2, pending: pending(), firstNewItemId: 'disposed-append', onLoadMore: () => setPending(true) }}/></Show><article id="disposed-append">Later result</article></>);
  host.querySelector<HTMLButtonElement>('[data-krds-part="load-more"]')!.click(); setShown(2); setPending(false); setVisible(false);
  host.querySelector<HTMLButtonElement>('#append-outside')!.focus(); await flush();
  expect(document.activeElement?.id).toBe('append-outside');
});

test('G12 same-ID button-to-link replacement restores its removed initiator through saved ancestor', async () => {
  const [message, setMessage] = createSignal<K.SnackbarProps['message']>(null);
  const [action, setAction] = createSignal<K.SnackbarProps['action']>({ id: 'a', kind: 'button', label: 'Act' });
  const [initiator, setInitiator] = createSignal(true);
  const host = mount(() => <div id="snackbar-ancestor" tabIndex={-1}><Show when={initiator()}><button id="replacement-initiator">Show</button></Show><K.Snackbar message={message()} action={action()} onDismiss={() => {}}/></div>);
  host.querySelector<HTMLButtonElement>('button')!.focus(); setMessage({ id: 'same', title: 'Title', text: 'Message' });
  host.querySelector<HTMLButtonElement>('[data-krds-part="action"]')!.focus(); setInitiator(false); setAction({ id: 'a', kind: 'link', label: 'Route', href: '#route' }); await flush();
  expect(document.activeElement?.id).toBe('snackbar-ancestor');
});

const deep = [{ id: '1', label: 'One', children: [{ id: '2', label: 'Two', children: [{ id: '3', label: 'Three', children: [{ id: '4', label: 'Four' }] }] }] }];
test('G14 FAB rejects four actions', () => { expect(() => mount(() => <K.FAB label="Actions" icon="plus" actions={Array.from({ length: 4 }, (_, i) => ({ id: String(i), label: String(i), onAction() {} }))}/>)).toThrow(TypeError); });
test('G14 TabBar rejects a sixth total terminal action', () => { expect(() => mount(() => <K.TabBar currentId="0" items={Array.from({ length: 5 }, (_, i) => ({ id: String(i), label: String(i), href: `#${i}`, icon: '+' }))} menuAction={{ label: 'Menu', onRequest() {} }}/>)).toThrow(TypeError); });
test('G14 MainMenu accepts deeper drilldown data without exposing a fourth level', () => { const host=mount(() => <K.MainMenu items={deep}/>); expect(host.querySelector('[data-krds-part="root"]')).not.toBeNull(); expect([...host.querySelectorAll('a,button')].filter(node=>node.getClientRects().length&&node.textContent==='Four')).toHaveLength(0); });
test('G14 InPageNavigation rejects a fourth level', () => { expect(() => mount(() => <K.InPageNavigation sections={deep}/>)).toThrow(TypeError); });
test('G14 Accordion rejects duplicate item IDs and unknown committed open IDs', () => {
  expect(() => mount(() => <K.Accordion items={[{ id: 'same', title: 'One', content: 'One' }, { id: 'same', title: 'Two', content: 'Two' }]}/>)).toThrow(TypeError);
  expect(() => mount(() => <K.Accordion items={[{ id: 'one', title: 'One', content: 'One' }]} openIds={['unknown']}/>)).toThrow(TypeError);
});

test('G15 Tag keyboard reentry starts at the first enabled item after roving away', async () => {
  const host = mount(() => <><button tabIndex={0}>Before tags</button><K.Tag mode="toggle" items={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }]}/><button tabIndex={0}>After tags</button></>);
  host.querySelector<HTMLButtonElement>('button')!.focus(); await userEvent.keyboard('{Tab}{ArrowRight}{Tab}{Shift>}{Tab}{/Shift}');
  expect(document.activeElement?.textContent).toBe('A');
});

test('G16 an accepted pointer-close timer cannot restore over a reopened ContextualHelp', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  const [open, setOpen] = createSignal(true);
  const host = mount(() => <><K.ContextualHelp triggerLabel="Help" title="Help title" content="Help content" open={open()} onOpenChange={({ open }) => setOpen(open)}><button id="context-inner">Inner action</button></K.ContextualHelp><button id="context-outside">Outside</button></>);
  await flush(); host.querySelector('#context-outside')!.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
  setOpen(true); await flush(); host.querySelector<HTMLButtonElement>('#context-inner')!.focus();
  vi.runOnlyPendingTimers(); expect(document.activeElement?.id).toBe('context-inner');
});
