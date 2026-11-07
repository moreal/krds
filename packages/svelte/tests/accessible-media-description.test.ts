import { afterEach, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { mount, unmount, tick } from 'svelte';
import { AccessibleMedia } from '../src/lib/index';
const cleanup: (() => unknown)[] = [];
afterEach(async () => { for (const c of cleanup.splice(0)) await c(); });
test('AccessibleMedia computed accessible description is the transcript text', async () => {
  const host = document.createElement('div'); document.body.append(host); const instance = mount(AccessibleMedia, { target: host, props: { media: { kind: 'audio', src: 'a.wav', type: 'audio/wav' }, title: '로컬 예제 미디어', transcript: { content: '안녕하세요 대본 본문입니다' } } }); await tick(); cleanup.push(() => { unmount(instance); host.remove(); });
  const media = host.querySelector('audio')!;
  await expect.element(page.elementLocator(media)).toHaveAccessibleDescription(/안녕하세요 대본 본문입니다/);
  expect(media.getAttribute('aria-describedby')).toBeTruthy();
  const target=(media.getRootNode() as Document|ShadowRoot).getElementById(media.getAttribute('aria-describedby')!)!;
  expect(target.hasAttribute('aria-label')).toBe(false);
});
