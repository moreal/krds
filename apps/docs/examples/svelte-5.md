# Identifier · svelte {#identifier-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/IdentifierExample.svelte.txt).


```svelte
<script lang="ts">
import Identifier from '@unofficial-krds/svelte/identifier';
import type { IdentifierProps } from '@unofficial-krds/svelte';
const props: IdentifierProps = {
  "institutionName": "독립 예제 운영기관",
  "logo": {
    "src": "/local-assets/specimen-logo.svg",
    "alt": "독립 예제 운영기관"
  },
  "relationshipText": "독립 예제 운영기관이 운영하는 예제 서비스입니다.",
  "theme": "light"
};
</script>
<section data-example="identifier"><Identifier {...props}/></section>
```

