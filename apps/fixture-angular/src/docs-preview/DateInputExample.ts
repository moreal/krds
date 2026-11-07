import { Component, signal } from '@angular/core';
import { DateInput } from '@unofficial-krds/angular/date-input';
import type { DateValue } from '@unofficial-krds/angular';

@Component({
  selector: 'docs-date-input-example',
  standalone: true,
  imports: [DateInput],
  template: `
    <krds-date-input id="visit-date" label="방문일" name="visit" referenceDate="2024-02-15" [value]="value()"
      (valueChange)="value.set($event.value)" />
    <p id="date-result" role="status">입력한 날짜: {{ value() ?? '없음' }}</p>`,
})
export class DateInputExample {
  readonly value = signal<DateValue>(null);
}
