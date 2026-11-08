import { afterEach, expect, test } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { Image } from '../src/index';
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const cleanup: (() => void)[] = [];
afterEach(() => { for (const c of cleanup.splice(0)) c(); });
// Real image events drive this test. Dispatching synthetic load/error events on a real URL raced
// the browser's own network error for that URL (the 404 arrived first on Linux CI), so the
// specimens are data URLs: one that cannot decode and one 1×1 GIF that loads.
const broken = 'data:image/gif;base64,AAAA';
const valid = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
test('Image returns to loading when src changes after a failed load', async () => {
  const host = document.createElement('div'); document.body.append(host); const root = createRoot(host);
  cleanup.push(() => { act(() => root.unmount()); host.remove(); });
  const render = (src: string) => act(async () => root.render(<Image src={src} alt="예제 그림" />));
  const note = () => host.querySelector('[data-krds-part="description"]');
  const img = () => host.querySelector('img')!;
  const state = () => img().getAttribute('data-krds-state');
  await render(broken);
  await expect.poll(state).toBe('error');
  expect(note()?.textContent).toBe('이미지를 불러올 수 없습니다.');
  await render(valid);
  // The src change resets the state during render, before the new image can report anything.
  expect(note()).toBeNull(); expect(state()).toBe('');
  await expect.poll(state).toBe('loaded'); expect(note()).toBeNull();
});
