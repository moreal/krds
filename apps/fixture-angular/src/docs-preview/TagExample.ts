import { Component, signal } from '@angular/core';
import { Tag } from '@unofficial-krds/angular/tag';
import { localRoute } from './preview-data';

@Component({
  selector: 'docs-tag-example',
  standalone: true,
  imports: [Tag],
  template: `
    <krds-tag mode="toggle" [items]="items" [selectedIds]="ids()" (selectionChange)="ids.set($event.ids)" />
    <p role="status" id="applied-filters">선택 지역: {{ labels() }}</p>`,
})
export class TagExample {
  readonly ids = signal<readonly string[]>([]);
  readonly items = [
    { id: 'a', label: '서울', href: localRoute('seoul') },
    { id: 'b', label: '부산', href: localRoute('busan') },
  ];
  labels(): string { return this.items.filter(item => this.ids().includes(item.id)).map(item => item.label).join(', ') || '없음'; }
}
