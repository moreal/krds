import { afterEach, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import '@unofficial-krds/styles/all.css';
import { Carousel } from '../src/index';
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const cleanup: (() => void)[] = [];
afterEach(async () => { for (const callback of cleanup.splice(0)) callback(); await page.viewport(1280, 800); });
const items = [{ id: 'a', label: '신청', content: '첫째' }, { id: 'b', label: '서류', content: '둘째' }, { id: 'c', label: '문의', content: '셋째' }, { id: 'd', label: '결과', content: '넷째' }];
async function mount(props: Partial<Parameters<typeof Carousel>[0]>) {
  const host = document.createElement('div'); document.body.append(host); const root = createRoot(host);
  await act(async () => root.render(<Carousel items={items} {...props}/>));
  cleanup.push(() => { act(() => root.unmount()); host.remove(); });
  return host;
}
const slides = (host: ParentNode) => [...host.querySelectorAll<HTMLElement>('[data-krds-component="carousel"][data-krds-part="slide"]')];
// 'on' = rendered and reachable; 'off' = hidden and inert; anything else leaks a half-hidden slide.
const exposure = (host: ParentNode) => slides(host).map(slide => !slide.hidden && !slide.inert && slide.getClientRects().length > 0 ? 'on' : slide.hidden && slide.inert ? 'off' : 'partial');

// KRDS component_04_09 L951: the multiple layout shows two or more whole items; L1232-1234: the rest stay out of reach.
test('Carousel multiple layout shows two whole slides side by side and keeps the rest hidden and inert', async () => {
  const host = await mount({ layout: 'multiple' });
  expect(exposure(host)).toEqual(['on', 'on', 'off', 'off']);
  const [first, second] = slides(host).filter(slide => !slide.hidden).map(slide => slide.getBoundingClientRect());
  expect(Math.round(second!.top)).toBe(Math.round(first!.top));
  expect(second!.left).toBeGreaterThanOrEqual(first!.right);
  await act(async () => host.querySelector<HTMLButtonElement>('[data-krds-part="next"]')!.click());
  expect(exposure(host)).toEqual(['off', 'on', 'on', 'off']);
  expect(exposure(await mount({ layout: 'multiple', defaultIndex: 3 }))).toEqual(['off', 'off', 'on', 'on']);
  expect(exposure(await mount({ layout: 'single', defaultIndex: 3 }))).toEqual(['off', 'off', 'off', 'on']);
});

// L1097-1098 narrows the page below 1023px; there the multiple layout falls back to one item, like the fraction indicator.
test('Carousel multiple layout shows one slide on a narrow page', async () => {
  await page.viewport(1000, 800);
  expect(exposure(await mount({ layout: 'multiple', defaultIndex: 1 }))).toEqual(['off', 'on', 'off', 'off']);
});

test('Carousel multiple layout moves focus to play/pause before a narrowing page hides the focused slide', async () => {
  const host = await mount({ layout: 'multiple', content: { b: <a href="#second">둘째 링크</a> } });
  host.querySelector<HTMLAnchorElement>('a[href="#second"]')!.focus();
  await act(async () => { await page.viewport(1000, 800); await new Promise(resolve => setTimeout(resolve, 50)); });
  expect([exposure(host), document.activeElement?.getAttribute('data-krds-part')]).toEqual([['on', 'off', 'off', 'off'], 'play-pause']);
});
