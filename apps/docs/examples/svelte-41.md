# Tooltip · svelte {#tooltip-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TooltipExample.svelte.txt).


```svelte
<script lang="ts">
import Tooltip from '@unofficial-krds/svelte/tooltip';
import type { TooltipProps } from '@unofficial-krds/svelte';
const props: TooltipProps = {
  "text": "신청 도움말을 엽니다",
  "relationship": "description",
  "triggerLabel": "신청 도움말",
  "triggerId": "help-trigger",
  "textId": "help-tooltip",
  "defaultOpen": false,
  "placement": "bottom-start"
};
</script>
<section data-example="tooltip"><Tooltip {...props}/></section>
```

