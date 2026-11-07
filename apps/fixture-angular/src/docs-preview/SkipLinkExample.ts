import { Component } from '@angular/core';
import { SkipLink } from '@unofficial-krds/angular/skip-link';
import { Button } from '@unofficial-krds/angular/button';

@Component({
  selector: 'docs-skip-link-example',
  standalone: true,
  imports: [SkipLink, Button],
  template: `
    <krds-skip-link [links]="links" visibility="focus-revealed" />
    <header class="preview-banner"><strong>예제 서비스</strong></header>
    <section id="main-content" tabindex="-1">
      <h2>신청 본문</h2>
      <button krdsButton variant="secondary">신청서 작성</button>
    </section>`,
})
export class SkipLinkExample {
  readonly links = [{ id: 'main', label: '본문 바로가기', targetId: 'main-content' }];
}
