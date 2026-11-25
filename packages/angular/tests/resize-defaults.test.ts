import { TestBed } from '@angular/core/testing';
import { expect, test } from 'vitest';
import { Resize } from '../src/lib/components/resize/resize';
// KRDS component_10_02 L896-905, L918: the default options pair the official wording with the scale; the trigger shows the selected one.
const facts = (root: ParentNode) => ({ options: [...root.querySelectorAll('[data-krds-component="resize"][data-krds-part="option"]')].map(node => node.textContent?.trim()), trigger: root.querySelector('[data-krds-component="resize"][data-krds-part="trigger"]')?.textContent?.trim() });
const expected = { options: ['작게 90%', '보통 100%', '조금 크게 110%', '크게 130%', '가장 크게 150%'], trigger: '화면 크기 보통 100%' };
test('Resize defaults to the five official labelled scales', () => {
  const fixture = TestBed.createComponent(Resize); fixture.detectChanges(); document.body.append(fixture.nativeElement);
  try { expect(facts(fixture.nativeElement as HTMLElement)).toEqual(expected); }
  finally { fixture.destroy(); (fixture.nativeElement as HTMLElement).remove(); }
});
