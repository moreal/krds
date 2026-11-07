import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Textarea } from '@unofficial-krds/angular/textarea';
import { Button } from '@unofficial-krds/angular/button';
import { formResult } from './preview-data';

@Component({
  selector: 'docs-textarea-example',
  standalone: true,
  imports: [ReactiveFormsModule, Textarea, Button],
  template: `
    <form #formElement [formGroup]="form" (reset)="result.set('')">
      <krds-textarea id="reason" label="신청 사유" name="reason" [rows]="5" helpId="reason-help" formControlName="reason" />
      <p id="reason-help">예제 신청 사유를 입력하세요</p>
      <div class="preview-actions">
        <button krdsButton type="button" (click)="result.set(formResult(formElement))">입력 확인</button>
      </div>
      <output aria-label="입력 결과">{{ result() }}</output>
      <div class="preview-actions">
        <button krdsButton variant="secondary" type="reset">입력 초기화</button>
      </div>
    </form>`,
})
export class TextareaExample {
  readonly form = new FormGroup({ reason: new FormControl('', { nonNullable: true }) });
  readonly result = signal('');
  protected readonly formResult = formResult;
}
