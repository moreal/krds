import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { expect, test } from 'vitest';
import { BottomSheet } from '../src/lib/components/bottom-sheet/bottom-sheet';

@Component({ selector: 'host-sheet-return', standalone: true, imports: [BottomSheet], template: `
  @if (withOpener()) { <button id="sheet-opener" type="button">열기</button> }
  <button id="sheet-fallback" type="button">대체</button>
  <krds-bottom-sheet title="지역 선택" [open]="open()" returnFocusId="sheet-fallback"><p>본문</p></krds-bottom-sheet>` })
class Host { open = signal(false); withOpener = signal(true); }

const settle = () => new Promise(resolve => setTimeout(resolve, 50));

test('bottom sheet returns focus to the control that opened it and uses returnFocusId only when that control is gone', async () => {
  const fixture = TestBed.createComponent(Host);
  const render = async () => { fixture.detectChanges(); await settle(); fixture.detectChanges(); };
  await render();
  document.getElementById('sheet-opener')!.focus();
  fixture.componentInstance.open.set(true); await render();
  expect(document.activeElement?.getAttribute('role'), 'focus enters the sheet').toBe('dialog');
  fixture.componentInstance.open.set(false); await render();
  expect(document.activeElement?.id, 'the opener wins over returnFocusId').toBe('sheet-opener');
  fixture.componentInstance.open.set(true); await render();
  fixture.componentInstance.withOpener.set(false); await render();
  fixture.componentInstance.open.set(false); await render();
  expect(document.activeElement?.id, 'returnFocusId is the fallback for a removed opener').toBe('sheet-fallback');
});
