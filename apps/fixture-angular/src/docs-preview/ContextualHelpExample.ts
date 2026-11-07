import { Component } from '@angular/core';
import { ContextualHelp } from '@unofficial-krds/angular/contextual-help';

@Component({
  selector: 'docs-contextual-help-example',
  standalone: true,
  imports: [ContextualHelp],
  template: `
    <p>신청 자격을 확인한 뒤 신청서를 작성하세요.</p>
    <krds-contextual-help title="신청 자격 도움말" content="신청 자격에 관한 예제 설명입니다." triggerLabel="신청 자격 도움말"
      [defaultOpen]="false" variant="information" placement="bottom-start" />`,
})
export class ContextualHelpExample {}
