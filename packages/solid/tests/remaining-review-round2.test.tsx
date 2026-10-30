import { afterEach, expect, test } from 'vitest';
import { createSignal, ErrorBoundary, type JSX } from 'solid-js';
import { render } from 'solid-js/web';
import * as K from '../src';
const cleanups: (() => void)[] = [];
afterEach(() => { cleanups.splice(0).reverse().forEach(dispose => dispose()); window.scrollTo(0, 0); });
function mount(view: () => JSX.Element) { const host = document.createElement('div'); document.body.append(host); let failure:unknown; const dispose = render(() => <ErrorBoundary fallback={error => { failure=error; return null; }}>{view()}</ErrorBoundary>, host); if(failure){dispose();host.remove();throw failure;} cleanups.push(() => { dispose(); host.remove(); }); return host; }
const flush = async () => { await Promise.resolve(); await Promise.resolve(); };

test('A Help falls back to the initiating icon ancestor before an unrelated opener ancestor', async () => {
  const host = mount(() => <><div id="opener-ancestor" tabIndex={-1}><K.HelpPanel topics={[{ id: 'one', title: 'Topic', content: 'Content', relatedLinks: [] }]} defaultOpen={false}/></div><div id="icon-ancestor" tabIndex={-1}/></>);
  const opener = host.querySelector<HTMLElement>('[data-krds-part="opener"]')!, icon = host.querySelector<HTMLElement>('[data-krds-part="topic-trigger"]')!;
  host.querySelector('#icon-ancestor')!.append(icon); icon.click(); opener.remove(); icon.remove();
  document.querySelector<HTMLButtonElement>('[data-krds-component="help-panel"][data-krds-part="close"]')!.click(); await flush();
  expect(document.activeElement?.id).toBe('icon-ancestor');
});

test('B passive SideNavigation context collapse preserves unrelated outside focus', async () => {
  const [ids, setIds] = createSignal<readonly string[]>(['a', 'b']); const requests: unknown[] = [];
  const items = [{ id: 'a', label: 'A', children: [{ id: 'b', label: 'B', children: [{ id: 'c', label: 'C', href: '#c' }] }] }];
  const host = mount(() => <><K.SideNavigation items={items} currentId="c" expandedIds={ids()} onExpandedChange={d => requests.push(d)}/><input id="outside-context" aria-label="Outside"/></>);
  host.querySelector<HTMLInputElement>('input')!.focus(); setIds([]); await flush();
  expect(document.activeElement?.id).toBe('outside-context'); expect(requests).toEqual([]);
});

for (const clearPrevious of [false, true]) test(`C successive accepted appends resolve actual new target IDs; clearPrevious=${clearPrevious}`, async () => {
  const [shown, setShown] = createSignal(1), [pending, setPending] = createSignal(false), [firstId, setFirstId] = createSignal<string>();
  const host = mount(() => <><K.Pagination variant="load-more" pageCount={4} hrefForPage={n => `#${n}`} loadMore={{ shown: shown(), total: 4, pending: pending(), firstNewItemId: firstId(), onLoadMore: () => { setPending(true); if (clearPrevious) setFirstId(undefined); } }}/><article id="new-one">First append</article><article id="new-two">Second append</article></>);
  const load = host.querySelector<HTMLButtonElement>('[data-krds-part="load-more"]')!;
  load.click(); setFirstId('new-one'); setShown(2); setPending(false); await flush(); expect(document.activeElement?.id).toBe('new-one');
  load.focus(); load.click(); setFirstId('new-two'); setShown(3); setPending(false); await flush(); expect(document.activeElement?.id).toBe('new-two');
});

test('C actual dataset replacement cancels an accepted append focus ticket', async () => {
  const [total, setTotal] = createSignal(4), [shown, setShown] = createSignal(1), [pending, setPending] = createSignal(false);
  const host = mount(() => <><K.Pagination variant="load-more" pageCount={4} hrefForPage={n => `#${n}`} loadMore={{ shown: shown(), total: total(), pending: pending(), firstNewItemId: 'replacement-result', onLoadMore: () => setPending(true) }}/><input id="replacement-outside" aria-label="Outside"/><article id="replacement-result">Different dataset</article></>);
  host.querySelector<HTMLButtonElement>('[data-krds-part="load-more"]')!.click(); host.querySelector<HTMLInputElement>('input')!.focus(); setTotal(99); setShown(3); setPending(false); await flush();
  expect(document.activeElement?.id).toBe('replacement-outside');
});

test('E MainMenu retains four-level data through bounded progressive exposure and Back focus', async () => {
  const tree = [{ id: 'a', label: 'A', children: [{ id: 'b', label: 'B', children: [{ id: 'c', label: 'C', children: [{ id: 'd', label: 'D route', href: '#deep-route' }] }] }] }];
  const host = mount(() => <K.MainMenu items={tree} defaultExpandedId="a"/>);
  const trigger = (label:string) => [...host.querySelectorAll<HTMLButtonElement>('[data-krds-part="trigger"]')].find(node=>node.getAttribute('aria-label')===label)!;
  trigger('B').click(); expect(trigger('C').getClientRects().length).toBeGreaterThan(0);
  expect(host.querySelector('a[href="#deep-route"]')?.getClientRects().length ?? 0).toBe(0);
  trigger('C').click(); await flush();
  const route = host.querySelector<HTMLAnchorElement>('a[href="#deep-route"]')!;
  expect(route.getClientRects().length).toBeGreaterThan(0);
  let levels=0,node:Element|null=route;while(node){if(node.tagName==='UL'&&node.getClientRects().length)levels++;node=node.parentElement;}
  expect(levels).toBeLessThanOrEqual(3);
  host.querySelector<HTMLButtonElement>('[data-krds-part="back"]')!.click(); await flush();
  expect(document.activeElement).toBe(trigger('C')); expect(host.querySelector('a[href="#deep-route"]')?.getClientRects().length ?? 0).toBe(0);
});
