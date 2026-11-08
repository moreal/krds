# Favicon · svelte {#favicon-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/FaviconExample.svelte.txt).


```svelte
<script lang="ts">
import Favicon from '@unofficial-krds/svelte/favicon';
import type { FaviconProps } from '@unofficial-krds/svelte';
const props: FaviconProps = {
  "light": {
    "href": "/local-assets/specimen-icon-light.svg",
    "type": "image/svg+xml",
    "sizes": "any"
  },
  "dark": {
    "href": "/local-assets/specimen-icon-dark.svg",
    "type": "image/svg+xml",
    "sizes": "any"
  }
};
</script>
<section data-example="favicon"><Favicon {...props}/></section>
```

