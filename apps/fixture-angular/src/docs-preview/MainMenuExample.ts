import { Component } from '@angular/core';
import { MainMenu } from '@unofficial-krds/angular/main-menu';
import { localRoute } from './preview-data';

@Component({
  selector: 'docs-main-menu-example',
  standalone: true,
  imports: [MainMenu],
  template: `<krds-main-menu label="메인 메뉴" [items]="items" currentId="apply-new" [defaultExpandedId]="null" [defaultMobileOpen]="false" />`,
})
export class MainMenuExample {
  readonly items = [
    { id: 'home', label: '홈', href: localRoute('home') },
    { id: 'support', label: '지원', href: localRoute('support') },
  ];
}
