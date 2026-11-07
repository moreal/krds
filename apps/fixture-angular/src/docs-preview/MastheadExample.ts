import { Component } from '@angular/core';
import { Masthead } from '@unofficial-krds/angular/masthead';
import { SkipLink } from '@unofficial-krds/angular/skip-link';

@Component({
  selector: 'docs-masthead-example',
  standalone: true,
  imports: [Masthead, SkipLink],
  template: `
    <krds-skip-link [links]="links" />
    <p role="note">공식 정부서비스를 가정한 배너 UI 예시입니다. 실제 공식 정부서비스가 아닙니다.</p>
    <krds-masthead [governmentService]="true" />
    <section id="main-content" tabindex="-1"><h2>독립 로컬 예제</h2></section>`,
})
export class MastheadExample {
  readonly links = [{ id: 'main', label: '본문 바로가기', targetId: 'main-content' }];
}
