import { afterEach, expect, test } from 'vitest';
import { mount, unmount, tick } from 'svelte';
import { Pagination } from '../src/lib/index';
const cleanup: (() => unknown)[] = [];
afterEach(async () => { for (const callback of cleanup.splice(0)) await callback(); });
async function show(page: number) { const host = document.createElement('div'); document.body.append(host); const app = mount(Pagination, { target: host, props: { variant: 'direct-page', defaultPage: page, pageCount: 3, hrefForPage: (n: number) => `#page-${n}` } }); cleanup.push(async () => { await unmount(app); host.remove(); }); await tick(); return host; }
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
  expect(facts(await show(1))).toEqual(first);
  expect(facts(await show(3))).toEqual(last);
});
