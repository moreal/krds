import { afterEach, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { AccessibleMedia } from '../src/index';
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const cleanup: (() => void)[] = [];
afterEach(() => { for (const c of cleanup.splice(0)) c(); });
test('AccessibleMedia computed accessible description is the transcript text', async () => {
  const host = document.createElement('div'); document.body.append(host); const root = createRoot(host);
  await act(async () => root.render(<AccessibleMedia media={{kind:'audio',src:'a.wav',type:'audio/wav'}} title="로컬 예제 미디어" transcript={{ content: '안녕하세요 대본 본문입니다' }} />)); cleanup.push(() => { act(() => root.unmount()); host.remove(); });
  const media = host.querySelector('audio')!;
  await expect.element(page.elementLocator(media)).toHaveAccessibleDescription(/안녕하세요 대본 본문입니다/);
  expect(media.getAttribute('aria-describedby')).toBeTruthy();
  const target=(media.getRootNode() as Document|ShadowRoot).getElementById(media.getAttribute('aria-describedby')!)!;
  expect(target.hasAttribute('aria-label')).toBe(false);
});
