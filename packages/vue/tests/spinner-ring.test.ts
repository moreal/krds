import { afterEach, expect, test } from 'vitest';
import { createApp, h, nextTick, ref } from 'vue';
import '@unofficial-krds/styles/all.css';
import { Spinner } from '../src/index';
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
function mount(props: () => Record<string, unknown>) { const host = document.createElement('div'); document.body.append(host); const app = createApp({ render: () => h(Spinner, props()) }); app.mount(host); cleanup.push(() => { app.unmount(); host.remove(); }); return host; }
// KRDS component_07_02 L901, L1111: the determinate indicator fills the donut path clockwise from 0° in proportion to the actual progress.
const ring = (host: ParentNode) => { const progress = host.querySelector('progress')!; const box = progress.getBoundingClientRect(); return { value: progress.value, width: box.width, height: box.height, fill: getComputedStyle(progress).backgroundImage }; };
test('a determinate Spinner is a ring the size of the indeterminate one, filled to its value', async () => {
  const indeterminate = ring(mount(() => ({ pending: true, label: '처리 중', completionMessage: '완료' })));
  const value = ref(30);
  const host = mount(() => ({ pending: true, value: value.value, label: '처리 중', completionMessage: '완료' }));
  expect(indeterminate.width).toBeGreaterThan(0);
  expect(ring(host)).toEqual({ value: 30, width: indeterminate.width, height: indeterminate.width, fill: expect.stringMatching(/^conic-gradient\(rgb\([\d, ]+\) 30%, /u) });
  value.value = 75; await nextTick();
  expect(ring(host).fill).toMatch(/^conic-gradient\(rgb\([\d, ]+\) 75%, /u);
});
