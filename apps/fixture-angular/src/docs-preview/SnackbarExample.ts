import { Component, signal } from '@angular/core';
import { Snackbar } from '@unofficial-krds/angular/snackbar';
import { Button } from '@unofficial-krds/angular/button';
import type { SnackbarMessage } from '@unofficial-krds/angular';

@Component({
  selector: 'docs-snackbar-example',
  standalone: true,
  imports: [Snackbar, Button],
  template: `
    <button krdsButton variant="secondary" id="snack-origin" (click)="save()">신청 저장</button>
    <p id="snackbar-result">{{ result() }}</p>
    <krds-snackbar [message]="message()" [action]="action" [durationMs]="null" fallbackFocusId="after-notification"
      (action)="undo()" (dismiss)="message.set(null)" />
    <p id="after-notification" tabindex="-1">알림 이후 내용</p>`,
})
export class SnackbarExample {
  readonly saved: SnackbarMessage = { id: 'saved', title: '저장 완료', text: '예제 신청을 저장했습니다.' };
  readonly message = signal<SnackbarMessage | null>(this.saved);
  readonly result = signal('저장된 신청');
  readonly action = { kind: 'button' as const, id: 'undo', label: '실행 취소' };
  save(): void { this.result.set('저장된 신청'); this.message.set({ ...this.saved }); }
  undo(): void { this.result.set('저장을 취소했습니다.'); this.message.set(null); }
}
