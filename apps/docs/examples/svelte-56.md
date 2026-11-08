# Snackbar · svelte {#snackbar-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/SnackbarExample.svelte.txt).


```svelte
<script lang="ts">
import Snackbar from '@unofficial-krds/svelte/snackbar';
import type { SnackbarProps } from '@unofficial-krds/svelte';
const props: SnackbarProps = {
  "message": {
    "id": "saved",
    "title": "저장 완료",
    "text": "예제 신청을 저장했습니다."
  },
  "durationMs": null
,
onDismiss: () => {}
};
</script>
<section data-example="snackbar"><Snackbar {...props}/></section>
```

