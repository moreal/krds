# Spinner · svelte {#spinner-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/SpinnerExample.svelte.txt).


```svelte
<script lang="ts">
import Spinner from '@unofficial-krds/svelte/spinner';
import type { SpinnerProps } from '@unofficial-krds/svelte';
const props: SpinnerProps = {
  "pending": true,
  "label": "신청 내역 불러오는 중",
  "completionMessage": "신청 내역을 불러왔습니다.",
  "size": "medium",
  "value": 40
};
</script>
<section data-example="spinner"><Spinner {...props}/></section>
```

