import { Component, signal } from '@angular/core';
import { Button } from '@unofficial-krds/angular/button';

@Component({
  selector: 'docs-button-example',
  standalone: true,
  imports: [Button],
  template: `
    <section aria-label="버튼 예제">
      <button krdsButton (click)="count.set(count() + 1)">신청하기</button>
      <p role="status">{{ count() === 0 ? '아직 신청하지 않았습니다.' : '신청이 ' + count() + '회 완료되었습니다.' }}</p>
    </section>`,
})
export class ButtonExample {
  readonly count = signal(0);
}
