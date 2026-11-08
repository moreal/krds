# Textarea · svelte {#textarea-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TextareaExample.svelte.txt).


```svelte
<script lang="ts">
import Textarea from '@unofficial-krds/svelte/textarea';
import type { TextareaProps } from '@unofficial-krds/svelte';
const props: TextareaProps = {
  "label": "신청 사유",
  "name": "reason",
  "rows": 5,
  "disabled": false,
  "readOnly": false
};
</script>
<section data-example="textarea"><Textarea {...props}/></section>
```

