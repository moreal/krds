import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Checkbox } from '@unofficial-krds/angular/checkbox';
import { Button } from '@unofficial-krds/angular/button';
import { formResult } from './preview-data';

@Component({
  selector: 'docs-checkbox-example',
  standalone: true,
  imports: [ReactiveFormsModule, Checkbox, Button],
  template: `
    <form #formElement [formGroup]="form" (reset)="result.set('')">
      <krds-checkbox id="consent" label="이용약관 동의" name="consent" value="agreed" formControlName="consent" />
      <div class="preview-actions">
        <button krdsButton type="button" (click)="result.set(formResult(formElement))">입력 확인</button>
      </div>
      <output aria-label="입력 결과">{{ result() }}</output>
      <div class="preview-actions">
        <button krdsButton variant="secondary" type="reset">입력 초기화</button>
      </div>
    </form>`,
})
export class CheckboxExample {
  readonly form = new FormGroup({ consent: new FormControl(false, { nonNullable: true }) });
  readonly result = signal('');
  protected readonly formResult = formResult;
}
