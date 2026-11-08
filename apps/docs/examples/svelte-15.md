# Critical alerts · svelte {#critical-alert-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/CriticalAlertExample.svelte.txt).


```svelte
<script lang="ts">
import CriticalAlert from '@unofficial-krds/svelte/critical-alert';
import type { CriticalAlertProps } from '@unofficial-krds/svelte';
const props: CriticalAlertProps = {
  "urgency": "high",
  "label": "긴급 안내",
  "message": "예제 점검으로 신청이 잠시 중단됩니다.",
  "details": {
    "href": "/local/maintenance",
    "label": "점검 상세 안내",
    "destinationTitle": "점검 상세 안내"
  }
};
</script>
<section data-example="critical-alert"><CriticalAlert {...props}/></section>
```

