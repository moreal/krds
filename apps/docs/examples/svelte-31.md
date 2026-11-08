# Checkbox · svelte {#checkbox-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/CheckboxExample.svelte.txt).


```svelte
<script lang="ts">
import Checkbox from '@unofficial-krds/svelte/checkbox';
import type { CheckboxProps } from '@unofficial-krds/svelte';
const props: CheckboxProps = {
  "label": "이용약관 동의",
  "name": "consent",
  "defaultChecked": false,
  "indeterminate": false,
  "value": "agreed"
};
</script>
<section data-example="checkbox"><Checkbox {...props}/></section>
```

