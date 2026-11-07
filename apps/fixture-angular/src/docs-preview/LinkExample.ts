import { Component } from '@angular/core';
import { Link } from '@unofficial-krds/angular/link';
import { localRoute } from './preview-data';

@Component({
  selector: 'docs-link-example',
  standalone: true,
  imports: [Link],
  template: `<p>자세한 내용은 <krds-link [href]="href" label="신청 안내" appearance="basic" size="medium" [underline]="true" />를 확인하세요.</p>`,
})
export class LinkExample {
  readonly href = localRoute('application');
}
