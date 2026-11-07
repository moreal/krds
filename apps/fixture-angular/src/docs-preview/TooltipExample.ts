import { Component } from '@angular/core';
import { Tooltip } from '@unofficial-krds/angular/tooltip';

@Component({
  selector: 'docs-tooltip-example',
  standalone: true,
  imports: [Tooltip],
  template: `
    <p><a id="tooltip-before" href="#help-trigger">신청서 작성 안내</a></p>
    <krds-tooltip text="신청 도움말을 엽니다" relationship="description" triggerLabel="신청 도움말" triggerId="help-trigger"
      textId="help-tooltip" [defaultOpen]="false" placement="bottom-start" />`,
})
export class TooltipExample {}
