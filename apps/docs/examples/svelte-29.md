# FAB · svelte {#fab-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/FABExample.svelte.txt).


```svelte
<script lang="ts">
import FAB from '@unofficial-krds/svelte/fab';
import type { FABProps } from '@unofficial-krds/svelte';
const props: FABProps = {
  "label": "새 신청",
  "icon": "plus",
  "defaultExpanded": false
};
</script>
<section data-example="fab"><FAB {...props}/></section>
```

