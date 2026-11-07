import { Component } from '@angular/core';
import { HelpPanel } from '@unofficial-krds/angular/help-panel';
import { localRoute } from './preview-data';

@Component({
  selector: 'docs-help-panel-example',
  standalone: true,
  imports: [HelpPanel],
  template: `
    <krds-help-panel id="application-help-panel" openerId="help-panel-opener" [topics]="topics" [defaultOpen]="true"
      [defaultSelectedTopicId]="null" mode="help" fallbackFocusId="panel-fallback" />
    <p id="panel-fallback" tabindex="-1">신청서 작성 화면</p>`,
})
export class HelpPanelExample {
  readonly topics = [
    { id: 'eligibility', title: '신청 자격', content: '예제 신청 자격 도움말', relatedLinks: [{ id: 'policy', label: '이용약관', href: localRoute('policy') }] },
    { id: 'documents', title: '제출 서류', content: '예제 제출 서류 도움말', relatedLinks: [] },
  ];
}
