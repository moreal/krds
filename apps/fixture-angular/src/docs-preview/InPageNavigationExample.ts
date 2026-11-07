import { Component, signal } from '@angular/core';
import { InPageNavigation } from '@unofficial-krds/angular/in-page-navigation';

@Component({
  selector: 'docs-in-page-navigation-example',
  standalone: true,
  imports: [InPageNavigation],
  template: `
    <div class="preview-outline">
      <krds-in-page-navigation title="이 페이지의 구성" [sections]="sections" [activeId]="activeId()" narrowMode="inline"
        (activeChange)="activeId.set($event.id)" />
      <article>
        <section id="overview" class="preview-section"><h2>신청 개요</h2><p>예제 신청 서비스의 개요입니다.</p></section>
        <section id="requirements" class="preview-section"><h2>신청 조건</h2><p>거주 지역과 제출 서류를 확인하세요.</p></section>
      </article>
    </div>`,
})
export class InPageNavigationExample {
  readonly activeId = signal('overview');
  readonly sections = [{ id: 'overview', label: '신청 개요' }, { id: 'requirements', label: '신청 조건' }];
}
