import { afterEach, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { createApp, h, nextTick } from 'vue';
import '@unofficial-krds/styles/all.css';
import { Resize } from '../src/index';
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
const frame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(null))));

for (const width of [390, 1280]) for (const edge of ['start', 'end'] as const) test(`Resize options stay inside a ${width}px viewport with the trigger at the inline ${edge} edge`, async () => {
  await page.viewport(width, 700);
  const host = document.createElement('div'); host.style.display = 'flex'; host.style.justifyContent = edge === 'start' ? 'flex-start' : 'flex-end'; document.body.style.margin = '0'; document.body.append(host);
  const app = createApp({ render: () => h(Resize, { defaultOpen: true }) }); app.mount(host); cleanup.push(() => { app.unmount(); host.remove(); });
  await nextTick(); await frame();
  const options = [...document.querySelectorAll<HTMLElement>('[data-krds-component="resize"][data-krds-part="option"]')];
  expect(options.length).toBe(5);
  const outside = options.map(node => [node.textContent?.trim(), node.getBoundingClientRect()] as const).filter(([, box]) => box.left < 0 || box.right > document.documentElement.clientWidth || box.top < 0 || box.bottom > innerHeight).map(([label, box]) => `${label} ${Math.round(box.left)}..${Math.round(box.right)}`);
  expect(outside, 'every option is fully inside the viewport').toEqual([]);
  const target = options.at(-1)!, box = target.getBoundingClientRect();
  expect(document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2)).toBe(target);
});
