import { Component, signal } from '@angular/core';
import { Toast } from '@unofficial-krds/angular/toast';
import { Button } from '@unofficial-krds/angular/button';
import type { ToastMessage } from '@unofficial-krds/angular';

@Component({
  selector: 'docs-toast-example',
  standalone: true,
  imports: [Toast, Button],
  template: `
    <button krdsButton (click)="save()">신청 저장</button>
    <h2>처리 결과 확인</h2>
    <p id="saved-result">{{ saved() ? '신청이 저장되었습니다.' : '저장 전입니다.' }}</p>
    <krds-toast [message]="message()" [durationMs]="3000" (dismiss)="message.set(null)" />`,
})
export class ToastExample {
  readonly saved = signal(false);
  readonly message = signal<ToastMessage | null>(null);
  save(): void {
    this.saved.set(true);
    this.message.set({ id: 'saved', text: '신청이 저장되었습니다.', tone: 'information', persistentResultId: 'saved-result' });
  }
}
