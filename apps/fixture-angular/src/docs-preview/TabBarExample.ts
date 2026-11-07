import { Component } from '@angular/core';
import { TabBar } from '@unofficial-krds/angular/tab-bar';
import { localRoute } from './preview-data';

@Component({
  selector: 'docs-tab-bar-example',
  standalone: true,
  imports: [TabBar],
  template: `<krds-tab-bar [items]="items" currentId="home" />`,
})
export class TabBarExample {
  readonly items = [
    { id: 'home', label: '홈', href: localRoute('home'), icon: '⌂' },
    { id: 'apply', label: '신청', href: localRoute('apply'), icon: '✎' },
    { id: 'profile', label: '내 정보', href: localRoute('profile'), icon: '☺' },
  ];
}
