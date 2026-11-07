import { afterEach, expect, test } from 'vitest';
import { registerKrdsElements } from '../src/index';
registerKrdsElements(customElements);
const cleanup: (() => void)[] = [];
afterEach(() => { for (const c of cleanup.splice(0)) c(); });
test('Image renders the description part only after a failed load', async () => {
  const host = document.createElement('krds-image') as HTMLElement & { updateComplete: Promise<unknown>; [k: string]: unknown };
  Object.assign(host, { src: 'missing.png', alt: '예제 그림', caption: '캡션' }); document.body.append(host); cleanup.push(() => host.remove()); await host.updateComplete;
  const note = () => host.shadowRoot!.querySelector('figure [data-krds-component="image"][data-krds-part="description"]');
  expect(note()).toBeNull();
  host.shadowRoot!.querySelector('img')!.dispatchEvent(new Event('error')); await host.updateComplete;
  expect(note()?.textContent).toBe('이미지를 불러올 수 없습니다.');
  expect(note()?.getAttribute('part')).toBe('description');
  expect(note()!.previousElementSibling?.getAttribute('data-krds-part')).toBe('caption');
  host.shadowRoot!.querySelector('img')!.dispatchEvent(new Event('load')); await host.updateComplete;
  expect(note()).toBeNull();
});
test('Image returns to loading when src changes after a failed load', async () => {
  const host = document.createElement('krds-image') as HTMLElement & { updateComplete: Promise<unknown>; [k: string]: unknown };
  Object.assign(host, { src: 'missing.png', alt: '예제 그림' }); document.body.append(host); cleanup.push(() => host.remove()); await host.updateComplete;
  const note = () => host.shadowRoot!.querySelector('[data-krds-part="description"]');
  const img = () => host.shadowRoot!.querySelector('img')!;
  img().dispatchEvent(new Event('error')); await host.updateComplete;
  expect(note()).not.toBeNull(); expect(img().getAttribute('data-krds-state')).toBe('error');
  host.src = 'next.png'; await host.updateComplete;
  expect(note()).toBeNull(); expect(img().getAttribute('data-krds-state')).toBe('');
  img().dispatchEvent(new Event('load')); await host.updateComplete;
  expect(img().getAttribute('data-krds-state')).toBe('loaded'); expect(note()).toBeNull();
});
