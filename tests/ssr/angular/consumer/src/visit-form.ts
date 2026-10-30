import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Button, DateInput, NativeSelect } from '@unofficial-krds/angular';

@Component({
  selector: 'visit-form',
  standalone: true,
  imports: [Button, NativeSelect, DateInput, ReactiveFormsModule],
  template: `
    <form>
      <krds-native-select id="region" label="지역" name="region"
        [options]="regions" [formControl]="region" />
      <krds-date-input id="visit" label="방문일" name="visit"
        [formControl]="visit" referenceDate="2024-02-15" />
      <button krdsButton type="submit">저장</button>
    </form>
  `,
})
export class VisitForm {
  readonly regions = [{ value: 'seoul', label: '서울' }];
  readonly region = new FormControl('seoul', { nonNullable: true });
  readonly visit = new FormControl<string | null>('2024-02-29');
}
