# Masthead · svelte {#masthead-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/MastheadExample.svelte.txt).


```svelte
<script lang="ts">
import Masthead from '@unofficial-krds/svelte/masthead';
import type { MastheadProps } from '@unofficial-krds/svelte';
const props: MastheadProps = {
  "governmentService": false
};
</script>
<section data-example="masthead"><Masthead {...props}/></section>
```

