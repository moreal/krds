import { Component } from '@angular/core';
import { Disclosure } from '@unofficial-krds/angular/disclosure';

@Component({
  selector: 'docs-disclosure-example',
  standalone: true,
  imports: [Disclosure],
  template: `<krds-disclosure label="신청 도움말" contentId="application-help" [defaultOpen]="false">신청서를 작성하는 방법입니다.</krds-disclosure>`,
})
export class DisclosureExample {}
