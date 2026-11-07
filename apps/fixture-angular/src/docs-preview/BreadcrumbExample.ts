import { Component } from '@angular/core';
import { Breadcrumb } from '@unofficial-krds/angular/breadcrumb';
import { localRoute } from './preview-data';

@Component({
  selector: 'docs-breadcrumb-example',
  standalone: true,
  imports: [Breadcrumb],
  template: `<krds-breadcrumb [home]="home" [items]="items" [omitCurrent]="true" [maxVisible]="4" [currentItem]="current" />`,
})
export class BreadcrumbExample {
  readonly home = { href: localRoute('home'), label: '홈' };
  readonly items = [{ id: 'apply', label: '신청', href: localRoute('apply') }];
  readonly current = { id: 'detail', label: '신청 상세' };
}
