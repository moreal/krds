import { afterEach, expect, test } from 'vitest';
import { render } from 'solid-js/web';
import * as K from '@unofficial-krds/solid';
const cleanups: (() => void)[] = [];
afterEach(() => cleanups.splice(0).forEach(dispose => dispose()));
test.skipIf(innerWidth > 767)('G3 omitted narrow Help and Tutorial open state starts with only openers', () => {
  const host = document.createElement('div'); document.body.append(host);
  const dispose = render(() => <><K.HelpPanel topics={[]}/><K.TutorialPanel tasks={[]} activeTaskId={null} activeStepId={null} startActionId="narrow-start"/></>, host);
  cleanups.push(() => { dispose(); host.remove(); });
  expect(document.querySelector('[role="dialog"]')).toBeNull();
  expect(host.querySelectorAll('button[aria-expanded="false"]').length).toBe(2);
});
test.skipIf(innerWidth > 1022)('G10 narrow Carousel replaces numbered indicators with the fraction', () => {
  const host = document.createElement('div'); document.body.append(host);
  const dispose = render(() => <K.Carousel items={[{ id: 'a', label: 'A', content: 'A' }, { id: 'b', label: 'B', content: 'B' }]}/>, host);
  cleanups.push(() => { dispose(); host.remove(); });
  const indicators = host.querySelector<HTMLElement>('[data-krds-part="indicators"]')!;
  expect(indicators.getClientRects().length).toBe(0);
  expect(host.querySelector<HTMLElement>('[data-krds-part="position"]')!.getClientRects().length).toBeGreaterThan(0);
});
