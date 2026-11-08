# Accessible multimedia · svelte {#accessible-media-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/AccessibleMediaExample.svelte.txt).


```svelte
<script lang="ts">
import AccessibleMedia from '@unofficial-krds/svelte/accessible-media';
import type { AccessibleMediaProps } from '@unofficial-krds/svelte';
const props: AccessibleMediaProps = {
  "media": {
    "kind": "audio",
    "src": "/local-assets/specimen-audio.wav",
    "type": "audio/wav"
  },
  "captionTracks": [],
  "transcript": {
    "content": "약 1초 동안 일정한 높이의 예제 신호음이 들립니다."
  },
  "title": "로컬 예제 미디어",
  "controls": true,
  "autoplay": false
};
</script>
<section data-example="accessible-media"><AccessibleMedia {...props}/></section>
```

