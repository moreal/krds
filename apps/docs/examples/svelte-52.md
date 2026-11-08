# Back button · svelte {#back-button-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/BackButtonExample.svelte.txt).


```svelte
<script lang="ts">
import BackButton from '@unofficial-krds/svelte/back-button';
import type { BackButtonProps } from '@unofficial-krds/svelte';
const props: BackButtonProps = {
  "label": "뒤로가기",
  "canGoBack": true,
  "dirty": false,
  "fallbackHref": "/local/parent"
,
onBackRequest: () => {}
};
</script>
<section data-example="back-button"><BackButton {...props}/></section>
```

