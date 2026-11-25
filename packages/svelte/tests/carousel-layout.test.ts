import { afterEach, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { createRawSnippet, mount, unmount, tick } from 'svelte';
import { Carousel } from '../src/lib/index';
const cleanup: (() => unknown)[] = [];
afterEach(async () => { for (const callback of cleanup.splice(0)) await callback(); await page.viewport(1280, 800); });
const items = [{ id: 'a', label: '신청', content: '첫째' }, { id: 'b', label: '서류', content: '둘째' }, { id: 'c', label: '문의', content: '셋째' }, { id: 'd', label: '결과', content: '넷째' }];
async function show(props: { layout: 'single' | 'multiple'; defaultIndex?: number }) {
  const host = document.createElement('div'); document.body.append(host);
  const app = mount(Carousel, { target: host, props: { items, ...props } });
  cleanup.push(async () => { await unmount(app); host.remove(); });
  await tick(); return host;
}
// 'on' = rendered and reachable; 'off' = hidden and inert; anything else leaks a half-hidden slide.
const exposure = (host: ParentNode) => [...host.querySelectorAll<HTMLElement>('[data-krds-component="carousel"][data-krds-part="slide"]')].map(slide => !slide.hidden && !slide.inert && slide.getClientRects().length > 0 ? 'on' : slide.hidden && slide.inert ? 'off' : 'partial');

// KRDS component_04_09 L951: the multiple layout shows two or more whole items; L1232-1234: the rest stay out of reach.
test('Carousel multiple layout shows two slides and keeps the rest hidden and inert', async () => {
  const host = await show({ layout: 'multiple' });
  expect(exposure(host)).toEqual(['on', 'on', 'off', 'off']);
  host.querySelector<HTMLButtonElement>('[data-krds-part="next"]')!.click(); await tick();
  expect(exposure(host)).toEqual(['off', 'on', 'on', 'off']);
  expect(exposure(await show({ layout: 'multiple', defaultIndex: 3 }))).toEqual(['off', 'off', 'on', 'on']);
  expect(exposure(await show({ layout: 'single', defaultIndex: 3 }))).toEqual(['off', 'off', 'off', 'on']);
});

// L1097-1098 narrows the page below 1023px; there the multiple layout falls back to one item, like the fraction indicator.
test('Carousel multiple layout shows one slide on a narrow page', async () => {
  await page.viewport(1000, 800);
  expect(exposure(await show({ layout: 'multiple', defaultIndex: 1 }))).toEqual(['off', 'on', 'off', 'off']);
});

test('Carousel multiple layout moves focus to play/pause before a narrowing page hides the focused slide', async () => {
  const slide = createRawSnippet((item: () => { id: string; content: string }) => ({ render: () => `<p><a href="#${item().id}">${item().content}</a></p>` }));
  const host = document.createElement('div'); document.body.append(host);
  const app = mount(Carousel, { target: host, props: { items, layout: 'multiple', slide } });
  cleanup.push(async () => { await unmount(app); host.remove(); });
  await tick();
  host.querySelector<HTMLAnchorElement>('a[href="#b"]')!.focus();
  await page.viewport(1000, 800); await new Promise(resolve => setTimeout(resolve, 50)); await tick();
  expect([exposure(host), document.activeElement?.getAttribute('data-krds-part')]).toEqual([['on', 'off', 'off', 'off'], 'play-pause']);
});
