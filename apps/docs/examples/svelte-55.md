# Toast · svelte {#toast-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/ToastExample.svelte.txt).


```svelte
<script lang="ts">
import Toast from '@unofficial-krds/svelte/toast';
import type { ToastProps } from '@unofficial-krds/svelte';
const props: ToastProps = {
  "message": {
    "id": "saved",
    "text": "신청이 저장되었습니다.",
    "tone": "information",
    "persistentResultId": "saved-result"
  },
  "durationMs": 3000
,
onDismiss: () => {}
};
</script>
<section data-example="toast"><Toast {...props}/></section>
```

