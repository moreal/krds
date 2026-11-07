import { Component, signal } from '@angular/core';
import { Resize } from '@unofficial-krds/angular/resize';
import { Button } from '@unofficial-krds/angular/button';

@Component({
  selector: 'docs-resize-example',
  standalone: true,
  imports: [Resize, Button],
  template: `
    <krds-resize [levels]="levels" [value]="value()" (valueChange)="value.set($event.value)" [defaultOpen]="false" />
    <section id="resize-scope" [style.font-size.%]="percent()">
      <p>확대된 예제 내용입니다.</p>
      <button krdsButton variant="secondary">작업</button>
    </section>`,
})
export class ResizeExample {
  readonly value = signal('100');
  readonly levels = [
    { id: '90', label: '작게', percent: 90 },
    { id: '100', label: '기본', percent: 100 },
    { id: '110', label: '조금 크게', percent: 110 },
    { id: '120', label: '크게', percent: 120 },
    { id: '130', label: '아주 크게', percent: 130 },
  ];
  percent(): number { return this.levels.find(level => level.id === this.value())?.percent ?? 100; }
}
