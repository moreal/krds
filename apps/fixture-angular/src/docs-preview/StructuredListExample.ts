import { Component, signal } from '@angular/core';
import { StructuredList } from '@unofficial-krds/angular/structured-list';
import { Button } from '@unofficial-krds/angular/button';
import { localRoute } from './preview-data';

@Component({
  selector: 'docs-structured-list-example',
  standalone: true,
  imports: [StructuredList, Button],
  template: `
    <krds-structured-list [items]="items" variant="list" [actionsTemplate]="actions" />
    <ng-template #actions let-item>
      <button krdsButton variant="tertiary" size="small" [attr.aria-label]="item.title + ' 저장'" (click)="saved.set(item.title)">저장</button>
    </ng-template>
    <p role="status">저장한 공고: {{ saved() ?? '없음' }}</p>`,
})
export class StructuredListExample {
  readonly saved = signal<string | null>(null);
  readonly items = [
    { id: 'a', title: '예제 신청 공고', href: localRoute('notice/a'), metadata: [{ label: '마감일', value: '2026-11-30' }, { label: '담당 부서', value: '예제 부서' }] },
    { id: 'b', title: '다음 신청 공고', href: localRoute('notice/b'), metadata: [{ label: '마감일', value: '2026-12-31' }] },
  ];
}
