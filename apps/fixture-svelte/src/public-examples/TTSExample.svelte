<script lang="ts">
import TTS from '@unofficial-krds/svelte/tts';
import type { TTSProps } from '@unofficial-krds/svelte';
const props: TTSProps = {
  "summary": "이 페이지는 예제 신청 방법을 안내합니다.",
  "locale": "ko-KR",
  "state": "idle",
  "label": "음성 안내",
  "size": "small",
  "iconOnly": false
,
onRequest: () => {}
};
</script>
<section data-example="tts"><TTS {...props}/></section>
