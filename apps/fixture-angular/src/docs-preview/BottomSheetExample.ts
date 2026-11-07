import { Component, signal } from '@angular/core';
import { BottomSheet } from '@unofficial-krds/angular/bottom-sheet';
import { RadioGroup } from '@unofficial-krds/angular/radio-group';
import { Button } from '@unofficial-krds/angular/button';

@Component({
  selector: 'docs-bottom-sheet-example',
  standalone: true,
  imports: [BottomSheet, RadioGroup, Button],
  template: `
    <button krdsButton variant="secondary" id="sheet-opener" (click)="open.set(true)">지역 선택 열기</button>
    <krds-bottom-sheet id="region-sheet" title="지역 선택" description="예제 지역을 선택하세요" [open]="open()"
      (openChange)="open.set(false)" returnFocusId="sheet-opener" [dismissOnOutside]="false">
      <krds-radio-group id="sheet-region" label="거주 지역" name="region" [options]="options" [value]="region()"
        (valueChange)="region.set($event.value ?? 'seoul')" />
    </krds-bottom-sheet>
    <p role="status">선택 지역: {{ region() === 'seoul' ? '서울' : '부산' }}</p>`,
})
export class BottomSheetExample {
  readonly open = signal(true);
  readonly region = signal('seoul');
  readonly options = [{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }];
}
