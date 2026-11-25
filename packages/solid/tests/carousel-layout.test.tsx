import { afterEach, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'solid-js/web';
import * as K from '../src';
const cleanups: (() => void)[] = [];
afterEach(async () => { cleanups.splice(0).forEach(dispose => dispose()); await page.viewport(1280, 800); });
const items = [{ id: 'a', label: '신청', content: '첫째' }, { id: 'b', label: '서류', content: '둘째' }, { id: 'c', label: '문의', content: '셋째' }, { id: 'd', label: '결과', content: '넷째' }];
function mount(props: { layout: 'single' | 'multiple'; defaultIndex?: number }) {
  const host = document.createElement('div'); document.body.append(host);
  const dispose = render(() => <K.Carousel items={items} {...props}/>, host);
  cleanups.push(() => { dispose(); host.remove(); });
  return host;
}
const flush = () => new Promise(resolve => setTimeout(resolve, 0));
// 'on' = rendered and reachable; 'off' = hidden and inert; anything else leaks a half-hidden slide.
const exposure = (host: ParentNode) => [...host.querySelectorAll<HTMLElement>('[data-krds-component="carousel"][data-krds-part="slide"]')].map(slide => !slide.hidden && !slide.inert && slide.getClientRects().length > 0 ? 'on' : slide.hidden && slide.inert ? 'off' : 'partial');

// KRDS component_04_09 L951: the multiple layout shows two or more whole items; L1232-1234: the rest stay out of reach.
test('Carousel multiple layout shows two slides and keeps the rest hidden and inert', async () => {
  const host = mount({ layout: 'multiple' }); await flush();
  expect(exposure(host)).toEqual(['on', 'on', 'off', 'off']);
  host.querySelector<HTMLButtonElement>('[data-krds-part="next"]')!.click(); await flush();
  expect(exposure(host)).toEqual(['off', 'on', 'on', 'off']);
  const last = mount({ layout: 'multiple', defaultIndex: 3 }); await flush();
  expect(exposure(last)).toEqual(['off', 'off', 'on', 'on']);
  const single = mount({ layout: 'single', defaultIndex: 3 }); await flush();
  expect(exposure(single)).toEqual(['off', 'off', 'off', 'on']);
});

// L1097-1098 narrows the page below 1023px; there the multiple layout falls back to one item, like the fraction indicator.
test('Carousel multiple layout shows one slide on a narrow page', async () => {
  await page.viewport(1000, 800);
  const host = mount({ layout: 'multiple', defaultIndex: 1 }); await flush();
  expect(exposure(host)).toEqual(['off', 'on', 'off', 'off']);
});
