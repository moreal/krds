import { Component } from '@angular/core';
import { AccessibleMedia } from '@unofficial-krds/angular/accessible-media';
import { localAsset } from './preview-data';

@Component({
  selector: 'docs-accessible-media-example',
  standalone: true,
  imports: [AccessibleMedia],
  template: `<krds-accessible-media title="로컬 예제 미디어" [media]="media" [captionTracks]="[]" [transcript]="transcript" />`,
})
export class AccessibleMediaExample {
  readonly media = { kind: 'audio' as const, src: localAsset('specimen-audio.wav'), type: 'audio/wav' };
  readonly transcript = { content: '약 2초 동안 일정한 높이의 예제 신호음이 들립니다.' };
}
