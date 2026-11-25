import { afterEach, expect, test } from 'vitest';
import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';
import '@unofficial-krds/styles/all.css';
import { Spinner } from '../src';
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
function mount(view: () => ReturnType<typeof Spinner>) { const host = document.createElement('div'); document.body.append(host); const dispose = render(view, host); cleanup.push(() => { dispose(); host.remove(); }); return host; }
// KRDS component_07_02 L901, L1111: the determinate indicator fills the donut path clockwise from 0° in proportion to the actual progress.
const ring = (host: ParentNode) => { const progress = host.querySelector('progress')!; const box = progress.getBoundingClientRect(); return { value: progress.value, width: box.width, height: box.height, fill: getComputedStyle(progress).backgroundImage }; };
test('a determinate Spinner is a ring the size of the indeterminate one, filled to its value', () => {
  const indeterminate = ring(mount(() => <Spinner pending label="처리 중" completionMessage="완료"/>));
  const [value, setValue] = createSignal(30);
  const host = mount(() => <Spinner pending value={value()} label="처리 중" completionMessage="완료"/>);
  expect(indeterminate.width).toBeGreaterThan(0);
  expect(ring(host)).toEqual({ value: 30, width: indeterminate.width, height: indeterminate.width, fill: expect.stringMatching(/^conic-gradient\(rgb\([\d, ]+\) 30%, /u) });
  setValue(75);
  expect(ring(host).fill).toMatch(/^conic-gradient\(rgb\([\d, ]+\) 75%, /u);
});
