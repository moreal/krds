import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextInput } from '@unofficial-krds/angular/text-input';
import { Button } from '@unofficial-krds/angular/button';

@Component({
  selector: 'docs-text-input-example',
  standalone: true,
  imports: [FormsModule, TextInput, Button],
  template: `
    <form #form="ngForm" (reset)="name = ''; submitted = ''">
      <krds-text-input id="applicant" label="신청인 이름" name="applicant" [(ngModel)]="name" autocomplete="name"
        status="error" errorId="name-error" [iconAction]="clear" />
      <p id="name-error">신청인 이름을 입력하세요</p>
      <div class="preview-actions">
        <button krdsButton type="button" (click)="submitted = name">제출</button>
      </div>
      <p role="status">입력: {{ name || '없음' }} / 제출: {{ submitted || '없음' }}</p>
      <div class="preview-actions">
        <button krdsButton variant="secondary" type="reset">초기화</button>
      </div>
    </form>`,
})
export class TextInputExample {
  name = '';
  submitted = '';
  readonly clear = { label: '입력 지우기', onAction: () => { this.name = ''; } };
}
