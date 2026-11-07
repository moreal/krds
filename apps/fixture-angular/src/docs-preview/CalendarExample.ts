import { Component, signal } from '@angular/core';
import { Calendar } from '@unofficial-krds/angular/calendar';
import type { DateValue } from '@unofficial-krds/angular';

@Component({
  selector: 'docs-calendar-example',
  standalone: true,
  imports: [Calendar],
  template: `
    <krds-calendar id="visit-calendar" label="방문 날짜" referenceDate="2024-02-15" [value]="value()"
      (valueChange)="value.set($event.value)" />
    <p role="status">선택한 날짜: {{ value() ?? '없음' }}</p>`,
})
export class CalendarExample {
  readonly value = signal<DateValue>(null);
}
