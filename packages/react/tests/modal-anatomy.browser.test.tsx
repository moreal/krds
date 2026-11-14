import { afterEach, expect, test } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import '@unofficial-krds/styles/all.css';
import { Modal } from '../src/index';
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });

test('Modal close follows the shared modal anatomy: a compact hidden × glyph named 닫기', async () => {
  const host = document.createElement('div'); document.body.append(host); const root = createRoot(host);
  await act(async () => root.render(<Modal defaultOpen={true} title="신청 확인" actions={<><button type="button">확인</button><button type="button">취소</button></>}><p>신청 내용을 확인하세요.</p></Modal>));
  cleanup.push(() => { act(() => root.unmount()); host.remove(); });
  const close = document.querySelector<HTMLButtonElement>('[data-krds-component="modal"][data-krds-part="close"]')!;
  expect([close.getAttribute('aria-label'), close.textContent?.trim(), close.querySelector('[aria-hidden="true"]')?.textContent]).toEqual(['닫기', '×', '×']);
  const box = close.getBoundingClientRect(), minimum = parseFloat(getComputedStyle(close).minBlockSize);
  expect(Math.round(box.height)).toBe(Math.round(minimum));
  expect(box.width, 'close is not stretched by a text label').toBeLessThanOrEqual(minimum + 1);
});

test('BottomSheet handle is a CSS-drawn bar with no text that keeps its accessible name', async () => {
  const { BottomSheet } = await import('../src/index');
  const host = document.createElement('div'); document.body.append(host); const root = createRoot(host);
  await act(async () => root.render(<BottomSheet title="지역 선택" defaultOpen={true}><p>본문</p></BottomSheet>));
  cleanup.push(() => { act(() => root.unmount()); host.remove(); });
  const handle = document.querySelector<HTMLElement>('[data-krds-component="bottom-sheet"][data-krds-part="handle"]')!;
  expect([handle.textContent, handle.getAttribute('aria-label')]).toEqual(['', '시트 닫기']);
});

test('BottomSheet follows the shared order (handle, then header with title and close, then body) and a handle tap requests close', async () => {
  const { BottomSheet } = await import('../src/index');
  const requests: string[] = [];
  const host = document.createElement('div'); document.body.append(host); const root = createRoot(host);
  await act(async () => root.render(<BottomSheet title="지역 선택" description="한 곳을 고르세요" open={true} onOpenChange={({ reason }) => requests.push(reason)}><p>본문</p></BottomSheet>));
  cleanup.push(() => { act(() => root.unmount()); host.remove(); });
  const sheet = (name: string) => document.querySelector<HTMLElement>(`[data-krds-component="bottom-sheet"][data-krds-part="${name}"]`)!;
  const order = [...sheet('root').querySelectorAll<HTMLElement>('[data-krds-component="bottom-sheet"]')].map(node => node.getAttribute('data-krds-part'));
  expect(order).toEqual(['handle', 'header', 'title', 'close', 'body']);
  await act(async () => sheet('handle').click());
  expect(requests, 'a tap on the handle is a close request, not a drag').toEqual(['close']);
});

test('BottomSheet returns focus to the control that opened it and uses returnFocusId only when that control is gone', async () => {
  const { BottomSheet } = await import('../src/index');
  const host = document.createElement('div'); document.body.append(host); const root = createRoot(host);
  cleanup.push(() => { act(() => root.unmount()); host.remove(); });
  const view = (open: boolean, withOpener = true) => <>{withOpener && <button id="sheet-opener" type="button">열기</button>}<button id="sheet-fallback" type="button">대체</button><BottomSheet title="지역 선택" open={open} returnFocusId="sheet-fallback"><p>본문</p></BottomSheet></>;
  await act(async () => root.render(view(false)));
  document.getElementById('sheet-opener')!.focus();
  await act(async () => root.render(view(true)));
  expect(document.activeElement?.getAttribute('role'), 'focus enters the sheet').toBe('dialog');
  await act(async () => root.render(view(false)));
  expect(document.activeElement?.id, 'the opener wins over returnFocusId').toBe('sheet-opener');
  await act(async () => root.render(view(true)));
  await act(async () => root.render(view(true, false)));
  await act(async () => root.render(view(false, false)));
  expect(document.activeElement?.id, 'returnFocusId is the fallback for a removed opener').toBe('sheet-fallback');
});
