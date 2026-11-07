import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import '../../styles/dist/all.css';
import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { BottomSheet } from '../src/lib/components/bottom-sheet/bottom-sheet';
import { RadioGroup } from '../src/lib/components/radio-group/radio-group';

@Component({ selector: 'host-sheet', standalone: true, imports: [BottomSheet, RadioGroup], template: `
  <krds-bottom-sheet title="지역 선택" [open]="true">
    <krds-radio-group label="거주 지역" name="region" [options]="options" [value]="region()" (valueChange)="region.set($event.value ?? 'seoul')"/>
  </krds-bottom-sheet>` })
class Host { region = signal('seoul'); options = [{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]; }

const settle = () => new Promise(resolve => setTimeout(resolve, 100));

test('bottom-sheet radio input itself is hit-testable and clickable', async () => {
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges(); await settle(); fixture.detectChanges();
  const input = document.querySelector<HTMLInputElement>('input[type=radio][value=busan]')!;
  const rect = input.getBoundingClientRect();
  expect(rect.width).toBeGreaterThan(0); expect(rect.height).toBeGreaterThan(0);
  const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
  expect(hit).toBe(input);
  // Playwright's check() verifies the state right after the click, before the parent re-renders.
  input.click();
  expect(input.checked).toBe(true);
  await settle(); fixture.detectChanges();
  expect(input.checked).toBe(true);
  expect(fixture.componentInstance.region()).toBe('busan');
});

test('controlled radio group reverts a change the parent rejects after the next render', async () => {
  const fixture = TestBed.createComponent(Rejecting);
  fixture.detectChanges(); await settle(); fixture.detectChanges();
  const busan = document.querySelector<HTMLInputElement>('input[type=radio][value=busan]')!;
  busan.click();
  await settle(); fixture.detectChanges(); await settle();
  expect(busan.checked).toBe(false);
  expect(document.querySelector<HTMLInputElement>('input[type=radio][value=seoul]')!.checked).toBe(true);
});

@Component({ selector: 'host-reject', standalone: true, imports: [RadioGroup], template: `<krds-radio-group label="지역" name="r2" [options]="options" value="seoul"/>` })
class Rejecting { options = [{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]; }
