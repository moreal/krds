import { Component } from '@angular/core';
import { Favicon } from '@unofficial-krds/angular/favicon';
import { localAsset } from './preview-data';

@Component({
  selector: 'docs-favicon-example',
  standalone: true,
  imports: [Favicon],
  template: `
    <krds-favicon [light]="light" [dark]="dark" />
    <p>이 예제 문서의 탭 아이콘을 로컬 이미지로 설정했습니다.</p>
    <img [src]="light.href" width="48" height="48" alt="로컬 예제 탭 아이콘 미리보기" />`,
})
export class FaviconExample {
  readonly light = { href: localAsset('specimen-icon-light.svg'), type: 'image/svg+xml', sizes: 'any' };
  readonly dark = { href: localAsset('specimen-icon-dark.svg'), type: 'image/svg+xml', sizes: 'any' };
}
