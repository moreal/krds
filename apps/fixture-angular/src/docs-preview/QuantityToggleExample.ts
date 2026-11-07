import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QuantityToggle } from '@unofficial-krds/angular/quantity-toggle';
import { Button } from '@unofficial-krds/angular/button';
import { formResult } from './preview-data';

@Component({
  selector: 'docs-quantity-toggle-example',
  standalone: true,
  imports: [ReactiveFormsModule, QuantityToggle, Button],
  template: `
    <form #formElement [formGroup]="form" (reset)="result.set('')">
      <krds-quantity-toggle id="quantity" label="신청 수량" name="quantity" [min]="0" [max]="10" [step]="1" unit="개"
        formControlName="quantity" />
      <div class="preview-actions">
        <button krdsButton type="button" (click)="result.set(formResult(formElement))">입력 확인</button>
      </div>
      <output aria-label="입력 결과">{{ result() }}</output>
      <div class="preview-actions">
        <button krdsButton variant="secondary" type="reset">입력 초기화</button>
      </div>
    </form>`,
})
export class QuantityToggleExample {
  readonly form = new FormGroup({ quantity: new FormControl(2, { nonNullable: true }) });
  readonly result = signal('');
  protected readonly formResult = formResult;
}
