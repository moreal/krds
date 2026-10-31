import { afterEach, beforeEach, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'solid-js/web';
import * as K from '@unofficial-krds/solid';
const cleanups: (() => void)[] = [];
let previousViewport: { width: number; height: number };
beforeEach(async () => {
  previousViewport = { width: innerWidth, height: innerHeight };
  await page.viewport(360, 800);
  expect(innerWidth, 'actual narrow browser iframe width before mount').toBe(360);
  expect(innerHeight).toBe(800);
  expect(matchMedia('(max-width: 767px)').matches).toBe(true);
  expect(matchMedia('(max-width: 1022px)').matches).toBe(true);
});
afterEach(async () => {
  try { cleanups.splice(0).forEach(dispose => dispose()); }
  finally {
    await page.viewport(previousViewport.width, previousViewport.height);
    expect(innerWidth, 'actual browser iframe width restored after cleanup').toBe(previousViewport.width);
    expect(innerHeight).toBe(previousViewport.height);
  }
});
test('G3 omitted narrow Help and Tutorial open state starts with only openers', () => {
  const host = document.createElement('div'); document.body.append(host);
  const dispose = render(() => <><K.HelpPanel topics={[]}/><K.TutorialPanel tasks={[]} activeTaskId={null} activeStepId={null} startActionId="narrow-start"/></>, host);
  cleanups.push(() => { dispose(); host.remove(); });
  expect(document.querySelector('[role="dialog"]')).toBeNull();
  expect(host.querySelectorAll('button[aria-expanded="false"]').length).toBe(2);
});
test('G10 narrow Carousel replaces numbered indicators with the fraction', () => {
  const host = document.createElement('div'); document.body.append(host);
  const dispose = render(() => <K.Carousel items={[{ id: 'a', label: 'A', content: 'A' }, { id: 'b', label: 'B', content: 'B' }]}/>, host);
  cleanups.push(() => { dispose(); host.remove(); });
  const indicators = host.querySelector<HTMLElement>('[data-krds-part="indicators"]')!;
  expect(indicators.getClientRects().length).toBe(0);
  expect(host.querySelector<HTMLElement>('[data-krds-part="position"]')!.getClientRects().length).toBeGreaterThan(0);
});
