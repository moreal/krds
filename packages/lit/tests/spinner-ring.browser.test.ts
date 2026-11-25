import { afterEach, expect, test } from 'vitest';
import '@unofficial-krds/styles/all.css';
import { registerKrdsElements } from '../src/index';
registerKrdsElements(customElements);
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
type Host = HTMLElement & { updateComplete: Promise<unknown>; value?: number };
async function mount(props: Record<string, unknown>) { const host = document.createElement('krds-spinner') as Host; Object.assign(host, { pending: true, label: '처리 중', completionMessage: '완료', ...props }); document.body.append(host); await host.updateComplete; cleanup.push(() => host.remove()); return host; }
// KRDS component_07_02 L901, L1111: the determinate indicator fills the donut path clockwise from 0° in proportion to the actual progress.
const ring = (host: Host) => { const progress = host.shadowRoot!.querySelector('progress')!; const box = progress.getBoundingClientRect(); return { value: progress.value, width: box.width, height: box.height, fill: getComputedStyle(progress).backgroundImage }; };
test('a determinate Spinner is a ring the size of the indeterminate one, filled to its value', async () => {
  const indeterminate = ring(await mount({}));
  const host = await mount({ value: 30 });
  expect(indeterminate.width).toBeGreaterThan(0);
  expect(ring(host)).toEqual({ value: 30, width: indeterminate.width, height: indeterminate.width, fill: expect.stringMatching(/^conic-gradient\(rgb\([\d, ]+\) 30%, /u) });
  host.value = 75; await host.updateComplete;
  expect(ring(host).fill).toMatch(/^conic-gradient\(rgb\([\d, ]+\) 75%, /u);
});
