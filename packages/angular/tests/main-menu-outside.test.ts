import { TestBed } from '@angular/core/testing';
import { afterEach, expect, test, vi } from 'vitest';
import { page } from 'vitest/browser';
import { MainMenu } from '../src/lib/components/main-menu/main-menu';

const items = [{ id: 'apply', label: '신청', children: [{ id: 'new', label: '신규 신청', href: '/local/new' }] }, { id: 'help', label: '도움', href: '/local/help' }];
afterEach(async () => { await page.viewport(414, 800); });
async function mount(expandedId?: string) {
  await page.viewport(1000, 800);
  const fixture = TestBed.createComponent(MainMenu);
  fixture.componentRef.setInput('items', items);
  if (expandedId) fixture.componentRef.setInput('expandedId', expandedId);
  const requests: (string | null)[] = [];
  fixture.componentInstance.expandedChange.subscribe(({ id }) => requests.push(id));
  const root: HTMLElement = fixture.nativeElement;
  await vi.waitFor(() => { fixture.detectChanges(); expect(root.querySelector('nav')?.getAttribute('data-krds-layout')).toBe('desktop'); });
  return { fixture, root, requests, trigger: () => root.querySelector<HTMLButtonElement>('button[aria-label="신청"]')! };
}
const press = (node: Element) => node.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }));

// KRDS component_03_02 L1303–1306: clicking the screen outside the menu collapses an open dropdown.
test('a desktop dropdown closes on a press outside the menu and stays open for a press inside it', async () => {
  const { fixture, root, requests, trigger } = await mount();
  const outside = document.createElement('button'); outside.textContent = '바깥'; document.body.append(outside);
  try {
    trigger().click(); fixture.detectChanges();
    await vi.waitFor(() => { fixture.detectChanges(); expect(trigger().getAttribute('aria-expanded')).toBe('true'); });
    press(root.querySelector('a[href="/local/new"]')!); fixture.detectChanges();
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    press(outside);
    await vi.waitFor(() => { fixture.detectChanges(); expect(trigger().getAttribute('aria-expanded')).toBe('false'); });
    expect(requests).toEqual(['apply', null]);
  } finally { outside.remove(); }
});

test('a controlled dropdown only requests the close, and a destroyed menu stops listening', async () => {
  const { fixture, requests, trigger } = await mount('apply');
  press(document.body); fixture.detectChanges();
  expect(requests).toEqual([null]);
  expect(trigger().getAttribute('aria-expanded')).toBe('true');
  fixture.destroy();
  press(document.body);
  expect(requests).toEqual([null]);
});
