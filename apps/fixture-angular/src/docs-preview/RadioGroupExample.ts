import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RadioGroup } from '@unofficial-krds/angular/radio-group';
import { Button } from '@unofficial-krds/angular/button';
import { formResult } from './preview-data';

@Component({
  selector: 'docs-radio-group-example',
  standalone: true,
  imports: [ReactiveFormsModule, RadioGroup, Button],
  template: `
    <form #formElement [formGroup]="form" (reset)="result.set('')">
      <krds-radio-group id="region" label="거주 지역" name="region" [options]="options" size="medium" appearance="default"
        formControlName="region" />
      <div class="preview-actions">
        <button krdsButton type="button" (click)="result.set(formResult(formElement))">입력 확인</button>
      </div>
      <output aria-label="입력 결과">{{ result() }}</output>
      <div class="preview-actions">
        <button krdsButton variant="secondary" type="reset">입력 초기화</button>
      </div>
    </form>`,
})
export class RadioGroupExample {
  readonly options = [
    { value: 'seoul', label: '서울' },
    { value: 'busan', label: '부산' },
    { value: 'jeju', label: '제주', disabled: true },
  ];
  readonly form = new FormGroup({ region: new FormControl<string | null>(null) });
  readonly result = signal('');
  protected readonly formResult = formResult;
}
