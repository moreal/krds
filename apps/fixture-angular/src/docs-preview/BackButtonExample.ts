import { Component } from '@angular/core';
import { BackButton } from '@unofficial-krds/angular/back-button';
import { localRoute } from './preview-data';

@Component({
  selector: 'docs-back-button-example',
  standalone: true,
  imports: [BackButton],
  template: `
    <krds-back-button label="뒤로가기" [canGoBack]="true" [fallbackHref]="parent" [dirty]="false" (backRequest)="goBack()" />
    <h2>신청 상세</h2>
    <p role="status">현재 화면: /local/current</p>`,
})
export class BackButtonExample {
  // Local history mock: the prior entry is the in-frame parent destination (/local/parent), never the real browser history.
  readonly parent = localRoute('parent');
  goBack(): void { location.assign(this.parent); }
}
