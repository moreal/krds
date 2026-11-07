import { Component, signal } from '@angular/core';
import { Spinner } from '@unofficial-krds/angular/spinner';
import { Button } from '@unofficial-krds/angular/button';

@Component({
  selector: 'docs-spinner-example',
  standalone: true,
  imports: [Spinner, Button],
  template: `
    <section id="results" [attr.aria-busy]="!done()">
      <krds-spinner [pending]="!done()" [value]="done() ? undefined : 40" label="신청 내역 불러오는 중"
        completionMessage="신청 내역을 불러왔습니다." size="medium" />
      <button krdsButton variant="secondary" [disabled]="done()" (click)="done.set(true)">작업 완료</button>
    </section>`,
})
export class SpinnerExample {
  readonly done = signal(false);
}
