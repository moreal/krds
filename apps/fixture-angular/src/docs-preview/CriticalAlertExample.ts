import { Component } from '@angular/core';
import { CriticalAlert } from '@unofficial-krds/angular/critical-alert';
import { localRoute } from './preview-data';

@Component({
  selector: 'docs-critical-alert-example',
  standalone: true,
  imports: [CriticalAlert],
  template: `
    <div>
      <krds-critical-alert urgency="high" label="긴급 안내" message="예제 점검으로 신청이 잠시 중단됩니다." [details]="details" />
    </div>
    <h2>예제 신청 서비스</h2>
    <p>점검이 끝나면 신청을 다시 시작할 수 있습니다.</p>`,
})
export class CriticalAlertExample {
  readonly details = { href: localRoute('maintenance'), label: '점검 상세 안내', destinationTitle: '점검 상세 안내' };
}
