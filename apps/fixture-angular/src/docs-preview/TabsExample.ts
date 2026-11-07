import { Component, signal } from '@angular/core';
import { Tabs } from '@unofficial-krds/angular/tabs';

@Component({
  selector: 'docs-tabs-example',
  standalone: true,
  imports: [Tabs],
  template: `<krds-tabs id="guide-tabs" label="안내" [items]="items" [value]="value()" (valueChange)="value.set($event.value)" />`,
})
export class TabsExample {
  readonly value = signal('overview');
  readonly items = [
    { value: 'overview', label: '개요', panel: '개요 내용' },
    { value: 'details', label: '상세', panel: '상세 내용' },
  ];
}
