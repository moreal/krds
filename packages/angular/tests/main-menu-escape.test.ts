import { TestBed } from '@angular/core/testing';
import { afterEach, expect, test, vi } from 'vitest';
import { page } from 'vitest/browser';
import { MainMenu } from '../src/lib/components/main-menu/main-menu';

const items = [{ id: 'services', label: 'Services', children: [{ id: 'civil', label: 'Civil', children: [{ id: 'issue', label: 'Issue', children: [{ id: 'copy', label: 'Copy', href: '#copy' }] }] }] }, { id: 'legal', label: 'Legal', children: [{ id: 'rights', label: 'Rights', href: '#rights' }] }];
afterEach(async () => { await page.viewport(414, 800); });

test('Escape collapses every expanded level at once and focuses the first-level trigger', async () => {
  await page.viewport(1000, 800);
  const fixture = TestBed.createComponent(MainMenu);
  fixture.componentRef.setInput('items', items);
  const requests: (string | null)[] = [];
  fixture.componentInstance.expandedChange.subscribe(({ id }) => requests.push(id));
  const root: HTMLElement = fixture.nativeElement;
  const button = (label: string) => root.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`);
  const open = async (label: string) => {
    await vi.waitFor(() => { fixture.detectChanges(); expect(button(label)?.closest('[hidden]')).toBeNull(); expect(button(label)).not.toBeNull(); });
    button(label)!.click(); fixture.detectChanges();
  };
  await vi.waitFor(() => { fixture.detectChanges(); expect(root.querySelector('nav')?.getAttribute('data-krds-layout')).toBe('desktop'); });
  await open('Services'); await open('Civil');
  // The third level opens a drill-down context two steps below the first-level trigger.
  await open('Issue');
  let leaf!: HTMLAnchorElement;
  await vi.waitFor(() => { fixture.detectChanges(); leaf = root.querySelector<HTMLAnchorElement>('a[href="#copy"]')!; expect(leaf).not.toBeNull(); expect(leaf.closest('[hidden]')).toBeNull(); });
  leaf.focus(); requests.length = 0;
  leaf.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
  await vi.waitFor(() => {
    fixture.detectChanges();
    expect(root.querySelector('[data-krds-part="trigger"][aria-expanded="true"]')).toBeNull();
    expect(document.activeElement).toBe(button('Services'));
  });
  expect(requests).toEqual([null]);
  // Reopening starts from the first level again; the lower levels did not stay expanded.
  await open('Services');
  await vi.waitFor(() => { fixture.detectChanges(); expect(button('Civil')?.getAttribute('aria-expanded')).toBe('false'); });
});
