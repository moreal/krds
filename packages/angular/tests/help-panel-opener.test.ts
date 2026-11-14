import { TestBed } from '@angular/core/testing';
import { expect, test, vi } from 'vitest';
import { page } from 'vitest/browser';
import { HelpPanel } from '../src/lib/components/help-panel/help-panel';

test('help panel opener only opens: pressing it while the panel is open requests nothing', async () => {
  await page.viewport(1000, 800);
  const fixture = TestBed.createComponent(HelpPanel); const requests: boolean[] = [];
  fixture.componentRef.setInput('topics', [{ id: 'a', title: '주제', content: '내용', relatedLinks: [] }]);
  fixture.componentRef.setInput('defaultOpen', false);
  fixture.componentInstance.openChange.subscribe(({ open }) => requests.push(open));
  fixture.detectChanges();
  const opener = document.querySelector<HTMLButtonElement>('[data-krds-component="help-panel"][data-krds-part="opener"]')!;
  const root = () => document.querySelector('[data-krds-component="help-panel"][data-krds-part="root"]');
  opener.click(); await vi.waitFor(() => { fixture.detectChanges(); expect(root()).not.toBeNull(); });
  opener.click(); fixture.detectChanges(); expect(root()).not.toBeNull(); expect(opener.getAttribute('aria-expanded')).toBe('true'); expect(requests).toEqual([true]);
  document.querySelector<HTMLButtonElement>('[data-krds-component="help-panel"][data-krds-part="close"]')!.click();
  await vi.waitFor(() => { fixture.detectChanges(); expect(root()).toBeNull(); }); expect(requests).toEqual([true, false]);
  fixture.destroy();
});
