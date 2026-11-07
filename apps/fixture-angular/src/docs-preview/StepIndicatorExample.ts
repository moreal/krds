import { Component } from '@angular/core';
import { StepIndicator } from '@unofficial-krds/angular/step-indicator';

@Component({
  selector: 'docs-step-indicator-example',
  standalone: true,
  imports: [StepIndicator],
  template: `<krds-step-indicator [steps]="steps" mode="sequential" />`,
})
export class StepIndicatorExample {
  readonly steps = [
    { id: 'a', label: '약관 확인', status: 'complete' as const },
    { id: 'b', label: '정보 입력', status: 'current' as const },
    { id: 'c', label: '신청 완료', status: 'pending' as const },
  ];
}
