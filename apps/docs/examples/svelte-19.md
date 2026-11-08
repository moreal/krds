# Badge · svelte {#badge-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/BadgeExample.svelte.txt).


```svelte
<script lang="ts">
import Badge from '@unofficial-krds/svelte/badge';
import type { BadgeProps } from '@unofficial-krds/svelte';
const props: BadgeProps = {
  "label": "진행 중",
  "appearance": "outline",
  "tone": "information",
  "size": "medium",
  "numeric": false
};
</script>
<section data-example="badge"><Badge {...props}/></section>
```

