import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NativeSelect } from '@unofficial-krds/angular/native-select';
import { Button } from '@unofficial-krds/angular/button';

@Component({
  selector: 'docs-native-select-example',
  standalone: true,
  imports: [FormsModule, NativeSelect, Button],
  template: `
    <form #form="ngForm">
      <krds-native-select id="region" label="지역" name="region" [(ngModel)]="region" [options]="options" />
      <p role="status">선택: {{ region === 'seoul' ? '서울' : '부산' }}</p>
      <div class="preview-actions">
        <button krdsButton variant="secondary" type="button" (click)="form.resetForm({ region: 'seoul' })">초기화</button>
      </div>
    </form>`,
})
export class NativeSelectExample {
  region = 'seoul';
  readonly options = [{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }];
}
