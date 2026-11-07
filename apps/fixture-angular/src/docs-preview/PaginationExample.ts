import { Component, signal } from '@angular/core';
import { Pagination } from '@unofficial-krds/angular/pagination';
import { localRoute } from './preview-data';

@Component({
  selector: 'docs-pagination-example',
  standalone: true,
  imports: [Pagination],
  template: `
    <krds-pagination [page]="page()" [pageCount]="12" variant="number-links" [hrefForPage]="hrefForPage"
      (pageChange)="page.set($event.page)" />
    <p role="status">현재 {{ page() }}쪽 결과</p>`,
})
export class PaginationExample {
  readonly page = signal(1);
  readonly hrefForPage = (page: number) => localRoute('results?page=' + page);
}
