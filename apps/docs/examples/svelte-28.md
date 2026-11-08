# Button · svelte {#button-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/ButtonExample.svelte.txt).


```svelte
<script lang="ts">
import Button from '@unofficial-krds/svelte/button';
import type { ButtonProps } from '@unofficial-krds/svelte';
const props: ButtonProps = { disabled: false };
</script>
<section data-example="button"><Button {...props}>저장</Button></section>
```

