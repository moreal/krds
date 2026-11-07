import { afterEach, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { registerKrdsElements } from '../src/index';
registerKrdsElements(customElements);
const cleanup: (() => void)[] = [];
afterEach(() => { for (const c of cleanup.splice(0)) c(); });
test('AccessibleMedia computed accessible description is the transcript text', async () => {
  const host = document.createElement('krds-accessible-media') as HTMLElement & { updateComplete: Promise<unknown>; [k: string]: unknown };
  Object.assign(host, { media: { kind: 'audio', src: 'a.wav', type: 'audio/wav' }, title: '로컬 예제 미디어', transcript: { content: '안녕하세요 대본 본문입니다' } }); document.body.append(host); cleanup.push(() => host.remove()); await host.updateComplete;
  const media = host.shadowRoot!.querySelector('audio')!;
  await expect.element(page.elementLocator(media)).toHaveAccessibleDescription(/안녕하세요 대본 본문입니다/);
  expect(media.getAttribute('aria-describedby')).toBeTruthy();
  const target=(media.getRootNode() as Document|ShadowRoot).getElementById(media.getAttribute('aria-describedby')!)!;
  expect(target.hasAttribute('aria-label')).toBe(false);
});
