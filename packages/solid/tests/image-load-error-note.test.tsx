import { afterEach, expect, test } from 'vitest';
import { render } from 'solid-js/web';
import { Image } from '../src';
const cleanup: (() => void)[] = [];
afterEach(() => { for (const c of cleanup.splice(0)) c(); });
test('Image renders the description part only after a failed load', async () => {
  const host = document.createElement('div'); document.body.append(host); const dispose = render(() => <Image src="missing.png" alt="예제 그림" />, host); cleanup.push(() => { dispose(); host.remove(); });
  const note = () => host.querySelector('figure [data-krds-component="image"][data-krds-part="description"]');
  expect(note()).toBeNull();
  host.querySelector('img')!.dispatchEvent(new Event('error'));
  expect(note()?.textContent).toBe('이미지를 불러올 수 없습니다.');
  expect(note()?.hasAttribute('role')).toBe(false);
  host.querySelector('img')!.dispatchEvent(new Event('load'));
  expect(note()).toBeNull();
});
