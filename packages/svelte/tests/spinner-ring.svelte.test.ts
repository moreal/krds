import { afterEach, expect, test } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import '@unofficial-krds/styles/all.css';
import { Spinner } from '../src/lib/index';
const cleanup: (() => unknown)[] = [];
afterEach(async () => { for (const callback of cleanup.splice(0)) await callback(); });
function place(props: Record<string, unknown>) { const host = document.createElement('div'); document.body.append(host); const app = mount(Spinner, { target: host, props: props as never }); flushSync(); cleanup.push(async () => { await unmount(app); host.remove(); }); return host; }
// KRDS component_07_02 L901, L1111: the determinate indicator fills the donut path clockwise from 0° in proportion to the actual progress.
const ring = (host: ParentNode) => { const progress = host.querySelector('progress')!; const box = progress.getBoundingClientRect(); return { value: progress.value, width: box.width, height: box.height, fill: getComputedStyle(progress).backgroundImage }; };
test('a determinate Spinner is a ring the size of the indeterminate one, filled to its value', () => {
  const indeterminate = ring(place({ pending: true, label: '처리 중', completionMessage: '완료' }));
  const props = $state({ pending: true, value: 30, label: '처리 중', completionMessage: '완료' });
  const host = place(props);
  expect(indeterminate.width).toBeGreaterThan(0);
  expect(ring(host)).toEqual({ value: 30, width: indeterminate.width, height: indeterminate.width, fill: expect.stringMatching(/^conic-gradient\(rgb\([\d, ]+\) 30%, /u) });
  props.value = 75; flushSync();
  expect(ring(host).fill).toMatch(/^conic-gradient\(rgb\([\d, ]+\) 75%, /u);
});
