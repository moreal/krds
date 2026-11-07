import { Component } from '@angular/core';
import { Identifier } from '@unofficial-krds/angular/identifier';
import { localAsset } from './preview-data';

@Component({
  selector: 'docs-identifier-example',
  standalone: true,
  imports: [Identifier],
  template: `
    <footer>
      <p>로컬 예제 서비스 문의 안내</p>
      <krds-identifier institutionName="독립 예제 운영기관" [logo]="logo"
        relationshipText="독립 예제 운영기관이 운영하는 예제 서비스입니다." theme="light" />
    </footer>`,
})
export class IdentifierExample {
  readonly logo = { src: localAsset('specimen-logo.svg'), alt: '독립 예제 운영기관' };
}
