# Link · svelte {#link-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/LinkExample.svelte.txt).


```svelte
<script lang="ts">
import Link from '@unofficial-krds/svelte/link';
import type { LinkProps } from '@unofficial-krds/svelte';
const props: LinkProps = {
  "href": "/local/application",
  "label": "신청 안내",
  "appearance": "basic",
  "size": "medium",
  "underline": true
};
</script>
<section data-example="link"><Link {...props}/></section>
```

