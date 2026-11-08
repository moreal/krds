# Visually hidden · svelte {#visually-hidden-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/VisuallyHiddenExample.svelte.txt).


```svelte
<script lang="ts">
import VisuallyHidden from '@unofficial-krds/svelte/visually-hidden';
import type { VisuallyHiddenProps } from '@unofficial-krds/svelte';
const props: VisuallyHiddenProps = {
  "id": "hidden-help",
  "content": "신청 내용을 확인하세요",
  "variant": "text",
  "lang": "ko"
};
</script>
<section data-example="visually-hidden"><VisuallyHidden {...props}/></section>
```

