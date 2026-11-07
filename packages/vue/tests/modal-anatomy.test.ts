import { afterEach, expect, test } from 'vitest';
import { createApp, h, nextTick } from 'vue';
import '@unofficial-krds/styles/all.css';
import { Modal } from '../src/index';
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
const part = (name: string) => document.querySelector<HTMLElement>(`[data-krds-component="modal"][data-krds-part="${name}"]`)!;

test('Modal close and actions follow the shared modal anatomy: a compact × close named 닫기 and spaced action buttons', async () => {
  const host = document.createElement('div'); document.body.append(host);
  const app = createApp({ render: () => h(Modal, { defaultOpen: true, title: '신청 확인' }, { default: () => h('p', '신청 내용을 확인하세요.'), actions: () => [h('button', { type: 'button' }, '확인'), h('button', { type: 'button' }, '취소')] }) });
  app.mount(host); cleanup.push(() => { app.unmount(); host.remove(); }); await nextTick(); await nextTick();
  const close = part('close');
  expect([close.getAttribute('aria-label'), close.textContent?.trim(), close.querySelector('[aria-hidden="true"]')?.textContent], 'visible glyph is hidden from AT; the name stays 닫기').toEqual(['닫기', '×', '×']);
  const box = close.getBoundingClientRect(), minimum = parseFloat(getComputedStyle(close).minBlockSize);
  expect(Math.round(box.height), 'close keeps the shared size-height-7 target').toBe(Math.round(minimum));
  expect(box.width, 'close is not stretched by a text label').toBeLessThanOrEqual(minimum + 1);
  const [confirm, cancel] = [...part('actions').querySelectorAll('button')];
  const gap = cancel!.getBoundingClientRect().left - confirm!.getBoundingClientRect().right;
  expect(gap, 'actions are separated by the shared gap-3').toBeCloseTo(parseFloat(getComputedStyle(part('actions')).columnGap), 0);
  expect(gap).toBeGreaterThan(0);
});

test('BottomSheet handle is a CSS-drawn bar with no text named 시트 닫기, and a tap requests close', async () => {
  const { BottomSheet } = await import('../src/index');
  const host = document.createElement('div'); document.body.append(host);
  const reasons: string[] = [];
  const app = createApp({ render: () => h(BottomSheet, { open: true, title: '지역 선택', onOpenChange: (detail: { reason: string }) => reasons.push(detail.reason) }, { default: () => h('p', '본문') }) });
  app.mount(host); cleanup.push(() => { app.unmount(); host.remove(); }); await nextTick(); await nextTick();
  const handle = document.querySelector<HTMLElement>('[data-krds-component="bottom-sheet"][data-krds-part="handle"]')!;
  expect([handle.textContent, handle.getAttribute('aria-label')]).toEqual(['', '시트 닫기']);
  handle.click(); await nextTick();
  expect(reasons, 'a tap on the handle is a close request, not a drag').toEqual(['close']);
});
