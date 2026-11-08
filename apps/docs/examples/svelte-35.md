# Step indicator · svelte {#step-indicator-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/StepIndicatorExample.svelte.txt).


```svelte
<script lang="ts">
import StepIndicator from '@unofficial-krds/svelte/step-indicator';
import type { StepIndicatorProps } from '@unofficial-krds/svelte';
const props: StepIndicatorProps = {
  "steps": [
    {
      "id": "a",
      "label": "약관 확인",
      "status": "complete"
    },
    {
      "id": "b",
      "label": "정보 입력",
      "status": "current"
    },
    {
      "id": "c",
      "label": "신청 완료",
      "status": "pending"
    }
  ],
  "mode": "sequential"
};
</script>
<section data-example="step-indicator"><StepIndicator {...props}/></section>
```

