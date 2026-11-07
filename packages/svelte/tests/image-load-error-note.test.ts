import { afterEach, expect, test } from 'vitest';
import { mount, unmount, tick } from 'svelte';
import { Image } from '../src/lib/index';
const cleanup: (() => unknown)[] = [];
afterEach(async () => { for (const c of cleanup.splice(0)) await c(); });
test('Image renders the description part only after a failed load', async () => {
  const host = document.createElement('div'); document.body.append(host); const instance = mount(Image, { target: host, props: { src: 'missing.png', alt: '예제 그림' } }); await tick(); cleanup.push(() => { unmount(instance); host.remove(); });
  const note = () => host.querySelector('figure [data-krds-component="image"][data-krds-part="description"]');
  host.querySelector('img')!.dispatchEvent(new Event('error')); await tick();
  expect(note()?.textContent).toBe('이미지를 불러올 수 없습니다.');
  expect(note()?.hasAttribute('role')).toBe(false);
  expect(host.querySelector('img')!.getAttribute('alt')).toBe('예제 그림');
});
test('Image without a load failure renders no description part', async () => {
  const host = document.createElement('div'); document.body.append(host); const instance = mount(Image, { target: host, props: { src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=', alt: '예제 그림' } }); await tick(); cleanup.push(() => { unmount(instance); host.remove(); });
  expect(host.querySelector('[data-krds-part="description"]')).toBeNull();
});
