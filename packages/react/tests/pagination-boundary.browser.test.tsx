import { afterEach, expect, test } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { Pagination } from '../src/index';
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
async function mount(page: number) { const host = document.createElement('div'); document.body.append(host); const root = createRoot(host); await act(async () => root.render(<Pagination variant="direct-page" defaultPage={page} pageCount={3} hrefForPage={n => `#page-${n}`}/>)); cleanup.push(() => { act(() => root.unmount()); host.remove(); }); return host; }
// KRDS component_03_06: prev/next stay rendered and turn disabled at the boundary (markup guide L1533-1541, example L1458);
// direct-page keeps the number list and follows previous, list, next, input, total, go (L969, L1316).
const facts = (root: ParentNode) => {
  const edge = (part: string) => { const node = root.querySelector<HTMLElement>(`[data-krds-component="pagination"][data-krds-part="${part}"]`)!; return [node.dataset.krdsState ?? '', node.getAttribute('aria-disabled'), node.hasAttribute('href'), (node.focus(), node.matches(":focus"))]; };
  return { order: [...root.querySelectorAll<HTMLElement>('[data-krds-part="root"] > [data-krds-part]')].map(node => node.dataset.krdsPart), previous: edge('previous'), next: edge('next') };
};
const order = ['previous', 'list', 'next', 'input', 'total', 'go'];
const first = { order, previous: ['disabled', 'true', false, false], next: ['', null, true, true] };
const last = { order, previous: ['', null, true, true], next: ['disabled', 'true', false, false] };
const title = 'Pagination keeps disabled previous/next at the boundaries and puts the direct-page input after the number list';
test(title, async () => {
  expect(facts(await mount(1))).toEqual(first);
  expect(facts(await mount(3))).toEqual(last);
});
// KRDS component_03_06 L1290-1291: a number link is named "페이지 N", the last one "마지막 페이지, N"; the visible text stays the number.
const names = (root: ParentNode) => [...root.querySelectorAll<HTMLElement>('[data-krds-component="pagination"][data-krds-part="link"][href]')].map(link => [link.textContent, link.getAttribute('aria-label')]);
test('Pagination names number links as pages and the last one as the last page', async () => {
  expect(names(await mount(1))).toEqual([['2', '페이지 2'], ['3', '마지막 페이지, 3']]);
  expect(names(await mount(3))).toEqual([['1', '페이지 1'], ['2', '페이지 2']]);
});
