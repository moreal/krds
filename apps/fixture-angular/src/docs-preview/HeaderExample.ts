import { Component } from '@angular/core';
import { Header } from '@unofficial-krds/angular/header';
import { SkipLink } from '@unofficial-krds/angular/skip-link';
import { localAsset, localRoute } from './preview-data';

@Component({
  selector: 'docs-header-example',
  standalone: true,
  imports: [Header, SkipLink],
  template: `
    <krds-skip-link [links]="skipLinks" />
    <krds-header [home]="home" [utilityItems]="utilities" [mainNavigation]="navigation" actionLayout="horizontal"
      [sticky]="false" />
    <main id="main-content" tabindex="-1" class="preview-long">
      <h1>예제 신청 서비스</h1>
      <p>지역별 신청 정보를 확인하세요.</p>
    </main>`,
})
export class HeaderExample {
  readonly skipLinks = [{ id: 'main', label: '본문 바로가기', targetId: 'main-content' }];
  readonly home = { href: localRoute('home'), label: '예제 서비스 홈', logo: { src: localAsset('specimen-logo.svg'), alt: '예제 서비스 홈' } };
  readonly utilities = [{ id: 'policy', label: '이용약관', href: localRoute('policy') }];
  readonly navigation = [
    { id: 'home', label: '홈', href: localRoute('home') },
    { id: 'apply', label: '신청', children: [
      { id: 'apply-new', label: '신규 신청', href: localRoute('apply') },
      { id: 'history', label: '신청 내역', href: localRoute('history') },
    ] },
    { id: 'support', label: '지원', href: localRoute('support') },
  ];
}
