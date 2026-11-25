import { afterEach, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { registerKrdsElements } from '../src/index';
registerKrdsElements(customElements);
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
type Host = HTMLElement & { updateComplete: Promise<unknown> };
async function mount(page: number) { const host = document.createElement('krds-pagination') as Host; Object.assign(host, { variant: 'direct-page', defaultPage: page, pageCount: 3, hrefForPage: (n: number) => `#page-${n}` }); document.body.append(host); await host.updateComplete; cleanup.push(() => host.remove()); return host.shadowRoot!; }
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
// KRDS component_03_06 L1077, L1108: up to 11 links with ellipses on wide screens and 7 on narrow ones; first and last stay listed.
test('Pagination lists at most 7 items on a narrow screen and 11 on a wide one', async () => {
  const items = async () => { const host = document.createElement('krds-pagination') as Host; Object.assign(host, { defaultPage: 15, pageCount: 30, hrefForPage: (n: number) => `#page-${n}` }); document.body.append(host); await host.updateComplete; cleanup.push(() => host.remove()); return [...host.shadowRoot!.querySelectorAll('[data-krds-part="item"]')].map(item => item.textContent); };
  try {
    await page.viewport(360, 800);
    expect(await items()).toEqual(['1', '…', '14', '15', '16', '…', '30']);
  } finally { await page.viewport(1280, 800); }
  expect(await items()).toEqual(['1', '…', '12', '13', '14', '15', '16', '17', '18', '…', '30']);
});
