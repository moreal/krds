import { Component, signal } from '@angular/core';
import { FAB } from '@unofficial-krds/angular/fab';

@Component({
  selector: 'docs-fab-example',
  standalone: true,
  imports: [FAB],
  template: `
    <krds-fab label="새 신청" icon="plus" [defaultExpanded]="false" (action)="count.set(count() + 1)" />
    <p role="status">새 신청 {{ count() }}건</p>`,
})
export class FabExample {
  readonly count = signal(0);
}
