# Toggle switch · svelte {#switch-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/SwitchExample.svelte.txt).


```svelte
<script lang="ts">
import Switch from '@unofficial-krds/svelte/switch';
import type { SwitchProps } from '@unofficial-krds/svelte';
const props: SwitchProps = {
  "label": "예제 알림 받기",
  "name": "notification",
  "defaultChecked": false,
  "size": "medium"
};
</script>
<section data-example="switch"><Switch {...props}/></section>
```

