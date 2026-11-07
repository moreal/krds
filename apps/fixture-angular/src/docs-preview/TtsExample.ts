import { Component, signal } from '@angular/core';
import { TTS } from '@unofficial-krds/angular/tts';

type SpeechState = 'idle' | 'playing' | 'paused';

@Component({
  selector: 'docs-tts-example',
  standalone: true,
  imports: [TTS],
  template: `
    <p role="note">로컬 음성 안내 시뮬레이션입니다. 실제 음성이나 외부 음성 서비스를 사용하지 않습니다.</p>
    <section id="main-content">
      <p>이 페이지는 예제 신청 방법을 안내합니다.</p>
      <krds-tts summary="이 페이지는 예제 신청 방법을 안내합니다." locale="ko-KR" label="음성 안내" size="small" [state]="state()"
        (request)="request($event.action)" />
      <p id="tts-state">상태: {{ labels[state()] }}</p>
    </section>`,
})
export class TtsExample {
  readonly state = signal<SpeechState>('idle');
  readonly labels: Record<SpeechState, string> = { idle: '준비', playing: '읽는 중', paused: '일시 정지됨' };
  // Local speech mock: requests change visible state only; no speechSynthesis or remote voice service is used.
  request(action: 'play' | 'pause' | 'resume' | 'stop'): void {
    this.state.set(action === 'pause' ? 'paused' : action === 'stop' ? 'idle' : 'playing');
  }
}
