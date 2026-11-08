# TTS · svelte {#tts-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TTSExample.svelte.txt).


```svelte
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
```

