# Text input · svelte {#text-input-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TextInputExample.svelte.txt).


```svelte
<script lang="ts">
import TextInput from '@unofficial-krds/svelte/text-input';
import type { TextInputProps } from '@unofficial-krds/svelte';
const props: TextInputProps = {
  "label": "신청인 이름",
  "name": "applicant",
  "type": "text",
  "size": "medium",
  "status": "default",
  "autocomplete": "name"
};
</script>
<section data-example="text-input"><TextInput {...props}/></section>
```

