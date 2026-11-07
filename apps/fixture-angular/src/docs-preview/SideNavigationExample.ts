import { Component } from '@angular/core';
import { SideNavigation } from '@unofficial-krds/angular/side-navigation';
import { localRoute } from './preview-data';

@Component({
  selector: 'docs-side-navigation-example',
  standalone: true,
  imports: [SideNavigation],
  template: `<krds-side-navigation title="신청 메뉴" [items]="items" currentId="apply-new" [defaultExpandedIds]="['apply']" />`,
})
export class SideNavigationExample {
  readonly items = [
    { id: 'home', label: '홈', href: localRoute('home') },
    { id: 'apply', label: '신청', children: [
      { id: 'apply-new', label: '신규 신청', href: localRoute('apply') },
      { id: 'history', label: '신청 내역', href: localRoute('history') },
    ] },
    { id: 'support', label: '지원', href: localRoute('support') },
  ];
}
