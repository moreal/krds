import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import '../../styles/dist/all.css';
import { Carousel } from '../src/lib/components/carousel/carousel';

const tick = () => new Promise(resolve => setTimeout(resolve, 50));
const items = [{ id: 'a', label: '신청', content: '첫째' }, { id: 'b', label: '서류', content: '둘째' }, { id: 'c', label: '문의', content: '셋째' }, { id: 'd', label: '결과', content: '넷째' }];
const cleanup: (() => void)[] = [];
beforeEach(() => page.viewport(1280, 800));
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
async function mount(inputs: Record<string, unknown>) {
  const fixture = TestBed.createComponent(Carousel);
  fixture.componentRef.setInput('items', items);
  for (const [name, value] of Object.entries(inputs)) fixture.componentRef.setInput(name, value);
  const changes: { index: number; reason: string }[] = [];
  const subscription = fixture.componentInstance.indexChange.subscribe(detail => changes.push(detail));
  fixture.detectChanges(); document.body.append(fixture.nativeElement); await tick(); fixture.detectChanges();
  cleanup.push(() => { subscription.unsubscribe(); fixture.destroy(); (fixture.nativeElement as HTMLElement).remove(); });
  const host = fixture.nativeElement as HTMLElement;
  const settle = async () => { fixture.detectChanges(); await tick(); };
  return { host, changes, settle };
}
const slides = (host: ParentNode) => [...host.querySelectorAll<HTMLElement>('[data-krds-component="carousel"][data-krds-part="slide"]')];
// 'on' = rendered and reachable; 'off' = hidden and inert; anything else leaks a half-hidden slide.
const exposure = (host: ParentNode) => slides(host).map(slide => !slide.hidden && !slide.inert && slide.getClientRects().length > 0 ? 'on' : slide.hidden && slide.inert ? 'off' : 'partial');
const position = (host: ParentNode) => host.querySelector('[data-krds-part="indicator"][aria-current="true"]')?.textContent;

// KRDS component_04_09 L951: the multiple layout shows two or more whole items; L1232-1234: the rest stay out of reach.
test('Carousel multiple layout shows two whole slides side by side up to the last slide', async () => {
  const { host } = await mount({ layout: 'multiple' });
  expect(exposure(host)).toEqual(['on', 'on', 'off', 'off']);
  const [first, second] = slides(host).filter(slide => !slide.hidden).map(slide => slide.getBoundingClientRect());
  expect(Math.round(second!.top)).toBe(Math.round(first!.top));
  expect(second!.left).toBeGreaterThanOrEqual(first!.right);
  expect(exposure((await mount({ layout: 'multiple', defaultIndex: 3 })).host)).toEqual(['off', 'off', 'on', 'on']);
  expect(exposure((await mount({ layout: 'single', defaultIndex: 3 })).host)).toEqual(['off', 'off', 'off', 'on']);
});

test('Carousel multiple layout shows one slide on a narrow page', async () => {
  await page.viewport(1000, 800);
  expect(exposure((await mount({ layout: 'multiple', defaultIndex: 1 })).host)).toEqual(['off', 'on', 'off', 'off']);
});

// L1061-1062 and the Swipe row at L1303-1306: a horizontal drag or swipe moves to the neighbouring slide.
test('Carousel swipe and drag reach the same slides as the buttons and leave vertical gestures alone', async () => {
  const { host, changes, settle } = await mount({ defaultIndex: 0 });
  const gesture = async (pointerType: string, dx: number, dy: number) => {
    const surface = host.querySelector<HTMLElement>('[data-krds-part="slide"]:not([hidden])')!;
    const at = { bubbles: true, isPrimary: true, button: 0, pointerId: 1, pointerType, clientX: 400, clientY: 300 };
    surface.dispatchEvent(new PointerEvent('pointerdown', at));
    surface.dispatchEvent(new PointerEvent('pointerup', { ...at, clientX: 400 + dx, clientY: 300 + dy }));
    await settle();
  };
  await gesture('touch', -120, 10);
  expect([position(host), changes]).toEqual(['2', [{ index: 1, reason: 'swipe' }]]);
  await gesture('mouse', -120, 0);
  expect([position(host), changes.at(-1)]).toEqual(['3', { index: 2, reason: 'swipe' }]);
  await gesture('touch', 120, 0);
  expect([position(host), changes.at(-1)]).toEqual(['2', { index: 1, reason: 'swipe' }]);
  await gesture('touch', -60, 160);
  await gesture('touch', -30, 0);
  expect([position(host), changes.length], 'vertical-dominant and short gestures do not navigate').toEqual(['2', 3]);
});
