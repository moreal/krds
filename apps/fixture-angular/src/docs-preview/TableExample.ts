import { Component } from '@angular/core';
import { Table } from '@unofficial-krds/angular/table';

@Component({
  selector: 'docs-table-example',
  standalone: true,
  imports: [Table],
  template: `<krds-table id="applications" caption="예제 신청 내역" [columns]="columns" [rows]="rows" rowHeaderColumnId="name" />`,
})
export class TableExample {
  readonly columns = [
    { id: 'name', label: '신청명', kind: 'text' as const },
    { id: 'count', label: '수량', kind: 'number' as const },
  ];
  readonly rows = [
    { id: 'a', cells: { name: '신청 가', count: 2 } },
    { id: 'b', cells: { name: '신청 나', count: 1 } },
  ];
}
