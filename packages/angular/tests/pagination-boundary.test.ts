import { TestBed } from '@angular/core/testing';
import { expect, test } from 'vitest';
import { Pagination } from '../src/lib/components/pagination/pagination';
function mount(page: number) {
  const fixture = TestBed.createComponent(Pagination);
  fixture.componentRef.setInput('variant', 'direct-page'); fixture.componentRef.setInput('defaultPage', page); fixture.componentRef.setInput('pageCount', 3); fixture.componentRef.setInput('hrefForPage', (n: number) => `#page-${n}`);
  fixture.detectChanges(); document.body.append(fixture.nativeElement);
  return fixture;
}
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
test(title, () => {
  for (const [page, expected] of [[1, first], [3, last]] as const) {
    const fixture = mount(page);
    try { expect(facts(fixture.nativeElement as HTMLElement)).toEqual(expected); }
    finally { fixture.destroy(); (fixture.nativeElement as HTMLElement).remove(); }
  }
});
