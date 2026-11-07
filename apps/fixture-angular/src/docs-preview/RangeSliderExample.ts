import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RangeSlider } from '@unofficial-krds/angular/range-slider';
import { Button } from '@unofficial-krds/angular/button';
import { formResult } from './preview-data';

@Component({
  selector: 'docs-range-slider-example',
  standalone: true,
  imports: [ReactiveFormsModule, RangeSlider, Button],
  template: `
    <form #formElement [formGroup]="form" (reset)="result.set('')">
      <krds-range-slider id="ratio" label="예제 비율" name="ratio" [min]="0" [max]="100" [step]="10" formControlName="ratio" />
      <div class="preview-actions">
        <button krdsButton type="button" (click)="result.set(formResult(formElement))">입력 확인</button>
      </div>
      <output aria-label="입력 결과">{{ result() }}</output>
      <div class="preview-actions">
        <button krdsButton variant="secondary" type="reset">입력 초기화</button>
      </div>
    </form>`,
})
export class RangeSliderExample {
  readonly form = new FormGroup({ ratio: new FormControl(50, { nonNullable: true }) });
  readonly result = signal('');
  protected readonly formResult = formResult;
}
