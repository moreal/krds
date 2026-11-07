import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Switch } from '@unofficial-krds/angular/switch';
import { Button } from '@unofficial-krds/angular/button';
import { formResult } from './preview-data';

@Component({
  selector: 'docs-switch-example',
  standalone: true,
  imports: [ReactiveFormsModule, Switch, Button],
  template: `
    <form #formElement [formGroup]="form" (reset)="result.set('')">
      <krds-switch id="notification" label="예제 알림 받기" name="notification" size="medium" helpId="notification-help"
        formControlName="notification" />
      <p id="notification-help">알림은 예제 화면에서만 변경됩니다.</p>
      <div class="preview-actions">
        <button krdsButton type="button" (click)="result.set(formResult(formElement))">입력 확인</button>
      </div>
      <output aria-label="입력 결과">{{ result() }}</output>
      <div class="preview-actions">
        <button krdsButton variant="secondary" type="reset">입력 초기화</button>
      </div>
    </form>`,
})
export class SwitchExample {
  readonly form = new FormGroup({ notification: new FormControl(false, { nonNullable: true }) });
  readonly result = signal('');
  protected readonly formResult = formResult;
}
