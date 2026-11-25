import { afterEach, expect, test } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act, type ReactNode } from 'react';
import '@unofficial-krds/styles/all.css';
import { Spinner } from '../src/index';
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
async function mount(view: ReactNode) { const host = document.createElement('div'); document.body.append(host); const root = createRoot(host); await act(async () => root.render(view)); cleanup.push(() => { act(() => root.unmount()); host.remove(); }); return { host, render: (next: ReactNode) => act(async () => root.render(next)) }; }
// KRDS component_07_02 L901, L1111: the determinate indicator fills the donut path clockwise from 0° in proportion to the actual progress.
const ring = (host: ParentNode) => { const progress = host.querySelector('progress')!; const box = progress.getBoundingClientRect(); return { value: progress.value, width: box.width, height: box.height, fill: getComputedStyle(progress).backgroundImage }; };
test('a determinate Spinner is a ring the size of the indeterminate one, filled to its value', async () => {
  const indeterminate = ring((await mount(<Spinner pending label="처리 중" completionMessage="완료"/>)).host);
  const { host, render } = await mount(<Spinner pending value={30} label="처리 중" completionMessage="완료"/>);
  expect(indeterminate.width).toBeGreaterThan(0);
  expect(ring(host)).toEqual({ value: 30, width: indeterminate.width, height: indeterminate.width, fill: expect.stringMatching(/^conic-gradient\(rgb\([\d, ]+\) 30%, /u) });
  await render(<Spinner pending value={75} label="처리 중" completionMessage="완료"/>);
  expect(ring(host).fill).toMatch(/^conic-gradient\(rgb\([\d, ]+\) 75%, /u);
});
