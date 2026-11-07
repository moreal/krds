<script lang="ts">
import TTS from '@unofficial-krds/svelte/tts';
import type { TTSProps } from '@unofficial-krds/svelte';
let state = $state<TTSProps['state']>('idle');
</script>
<p role="note">로컬 음성 안내 시뮬레이션입니다. 실제 음성이나 외부 음성 서비스를 사용하지 않습니다.</p>
<p data-tts-label>현재 상태: {state === 'playing' ? '읽는 중' : state === 'paused' ? '일시 정지됨' : '대기 중(중지됨)'}</p>
<TTS summary="이 페이지는 예제 신청 방법을 안내합니다." locale="ko-KR" label="음성 안내" size="small" iconOnly={false} {state} onRequest={(d) => state = d.action === 'pause' ? 'paused' : d.action === 'stop' ? 'idle' : 'playing'} />
