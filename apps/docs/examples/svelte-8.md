# Skip link · svelte {#skip-link-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/SkipLinkExample.svelte.txt).


```svelte
<script lang="ts">
import SkipLink from '@unofficial-krds/svelte/skip-link';
import type { SkipLinkProps } from '@unofficial-krds/svelte';
const props: SkipLinkProps = {
  "links": [
    {
      "id": "main",
      "label": "본문 바로가기",
      "targetId": "main-content"
    }
  ],
  "visibility": "visible"
};
</script>
<section data-example="skip-link"><SkipLink {...props}/></section>
```

