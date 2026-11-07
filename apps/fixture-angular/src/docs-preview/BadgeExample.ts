import { Component } from '@angular/core';
import { Badge } from '@unofficial-krds/angular/badge';

@Component({
  selector: 'docs-badge-example',
  standalone: true,
  imports: [Badge],
  template: `<p>신청 상태 <krds-badge label="진행 중" appearance="outline" tone="information" size="medium" /></p>`,
})
export class BadgeExample {}
