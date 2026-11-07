import { Component } from '@angular/core';
import { VisuallyHidden } from '@unofficial-krds/angular/visually-hidden';
import { Button } from '@unofficial-krds/angular/button';

@Component({
  selector: 'docs-visually-hidden-example',
  standalone: true,
  imports: [VisuallyHidden, Button],
  template: `
    <button krdsButton aria-describedby="hidden-help">신청 제출</button>
    <krds-visually-hidden id="hidden-help" content="신청 내용을 확인하세요" variant="text" lang="ko" />`,
})
export class VisuallyHiddenExample {}
