import { Component, signal } from '@angular/core';
import { TutorialPanel } from '@unofficial-krds/angular/tutorial-panel';
import { Button } from '@unofficial-krds/angular/button';

@Component({
  selector: 'docs-tutorial-panel-example',
  standalone: true,
  imports: [TutorialPanel, Button],
  template: `
    <div class="preview-field">
      <label for="applicant-name">신청인 이름</label>
      <input id="applicant-name" name="applicant" [attr.data-active-target]="step() === 'one'" />
    </div>
    <div id="applicant-name-after"></div>
    <button krdsButton id="save-application" [attr.data-active-target]="step() === 'two'">신청 저장</button>
    <div id="save-application-after"></div>
    <p role="status">현재 대상: {{ step() === 'one' ? '신청인 이름' : step() === 'two' ? '신청 저장' : '없음' }}</p>
    <krds-tutorial-panel id="application-tutorial" [tasks]="tasks" activeTaskId="apply" [activeStepId]="step()"
      [running]="running()" defaultActivePanel="tutorial" startActionId="tutorial-start" fallbackFocusId="tutorial-fallback"
      (start)="start($event.stepId)" (stepChange)="move($event.id)" (stop)="stop()" />
    <button krdsButton variant="tertiary" id="tutorial-fallback">도움말로 돌아가기</button>`,
})
export class TutorialPanelExample {
  readonly running = signal(false);
  readonly step = signal<string | null>(null);
  readonly tasks = [{ id: 'apply', title: '예제 신청하기', steps: [
    { id: 'one', title: '이름 입력', targetId: 'applicant-name', instruction: '신청인 이름을 입력하세요' },
    { id: 'two', title: '신청 저장', targetId: 'save-application', instruction: '저장을 눌러 완료하세요' },
  ] }, { id: 'review', title: '신청 내용 확인하기', steps: [
    { id: 'review-name', title: '이름 확인', targetId: 'applicant-name', instruction: '입력한 이름을 확인하세요' },
  ] }];
  start(stepId: string): void { this.running.set(true); this.step.set(stepId); }
  move(id: string | null): void { this.step.set(id); }
  stop(): void { this.running.set(false); this.step.set(null); }
}
