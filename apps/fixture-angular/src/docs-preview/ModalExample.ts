import { Component, signal } from '@angular/core';
import { Modal } from '@unofficial-krds/angular/modal';
import { Button } from '@unofficial-krds/angular/button';

@Component({
  selector: 'docs-modal-example',
  standalone: true,
  imports: [Modal, Button],
  template: `
    <button krdsButton id="modal-trigger" (click)="open.set(true)">모달 열기</button>
    <krds-modal id="preview-modal" title="신청 확인" description="입력한 내용을 확인하세요."
      [open]="open()" (openChange)="open.set($event.open)" returnFocusId="modal-trigger" initialFocusId="modal-confirm">
      <p>로컬 예제 신청입니다.</p>
      <button krdsButton krdsModalActions id="modal-confirm" (click)="confirmed.set(true); open.set(false)">확인</button>
    </krds-modal>
    <p role="status">{{ confirmed() ? '확인했습니다.' : '확인 전입니다.' }}</p>`,
})
export class ModalExample {
  readonly open = signal(false);
  readonly confirmed = signal(false);
}
