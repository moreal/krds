import { TestBed } from '@angular/core/testing';
import { expect, test } from 'vitest';
import '@unofficial-krds/styles/all.css';
import { Spinner } from '../src/lib/components/spinner/spinner';
// KRDS component_07_02 L901, L1111: the determinate indicator fills the donut path clockwise from 0° in proportion to the actual progress.
const ring = (host: ParentNode) => { const progress = host.querySelector('progress')!; const box = progress.getBoundingClientRect(); return { value: progress.value, width: box.width, height: box.height, fill: getComputedStyle(progress).backgroundImage }; };
// TestBed keeps one root element at a time, so each spinner is measured before the next is created.
function measure(value: number | undefined, update?: number) {
  const fixture = TestBed.createComponent(Spinner), host = fixture.nativeElement as HTMLElement;
  fixture.componentRef.setInput('pending', true); fixture.componentRef.setInput('label', '처리 중'); fixture.componentRef.setInput('completionMessage', '완료');
  if (value !== undefined) fixture.componentRef.setInput('value', value);
  fixture.detectChanges(); document.body.append(host);
  try {
    const first = ring(host);
    if (update === undefined) return [first];
    fixture.componentRef.setInput('value', update); fixture.detectChanges();
    return [first, ring(host)];
  } finally { fixture.destroy(); host.remove(); }
}
test('a determinate Spinner is a ring the size of the indeterminate one, filled to its value', () => {
  const [indeterminate] = measure(undefined), [determinate, updated] = measure(30, 75);
  expect(determinate).toEqual({ value: 30, width: indeterminate.width, height: indeterminate.width, fill: expect.stringMatching(/^conic-gradient\(rgb\([\d, ]+\) 30%, /u) });
  expect(indeterminate.width).toBeGreaterThan(0);
  expect(updated.fill).toMatch(/^conic-gradient\(rgb\([\d, ]+\) 75%, /u);
});
