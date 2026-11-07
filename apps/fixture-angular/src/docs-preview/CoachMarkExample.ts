import { Component, signal } from '@angular/core';
import { CoachMark } from '@unofficial-krds/angular/coach-mark';
import { Button } from '@unofficial-krds/angular/button';

@Component({
  selector: 'docs-coach-mark-example',
  standalone: true,
  imports: [CoachMark, Button],
  template: `
    <button krdsButton variant="secondary" id="tutorial-start" (click)="open.set(true)">따라하기 시작</button>
    <div class="preview-field">
      <label for="applicant-name">신청인 이름</label>
      <input id="applicant-name" name="applicant" autocomplete="name" />
      <div id="applicant-name-after"></div>
    </div>
    <button krdsButton id="save-application">신청 저장</button>
    <div id="save-application-after"></div>
    <button krdsButton variant="tertiary" id="coach-fallback">안내 다시 보기</button>
    <krds-coach-mark [steps]="steps" [boundaries]="boundaries" [open]="open()" (openChange)="open.set($event.open)"
      defaultStepId="one" startActionId="tutorial-start" fallbackFocusId="coach-fallback" />`,
})
export class CoachMarkExample {
  readonly open = signal(false);
  readonly steps = [{ id: 'one', title: '이름 입력', targetId: 'applicant-name', instruction: '신청인 이름을 입력하세요' }];
  readonly boundaries = [
    { targetId: 'applicant-name', insertionBoundaryId: 'applicant-name-after' },
    { targetId: 'save-application', insertionBoundaryId: 'save-application-after' },
  ];
}
