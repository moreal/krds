import { Component, signal } from '@angular/core';
import { Accordion } from '@unofficial-krds/angular/accordion';

@Component({
  selector: 'docs-accordion-example',
  standalone: true,
  imports: [Accordion],
  template: `<krds-accordion [items]="items" [openIds]="openIds()" (openChange)="openIds.set($event.ids)" />`,
})
export class AccordionExample {
  readonly openIds = signal<readonly string[]>([]);
  readonly items = [
    { id: 'eligibility', title: '신청 자격', content: '예제 신청 자격 안내' },
    { id: 'documents', title: '필요 서류', content: '신분증과 신청 확인서를 준비해 주세요.' },
  ];
}
