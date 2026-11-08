# Contextual help · svelte {#contextual-help-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/ContextualHelpExample.svelte.txt).


```svelte
<script lang="ts">
import ContextualHelp from '@unofficial-krds/svelte/contextual-help';
import type { ContextualHelpProps } from '@unofficial-krds/svelte';
const props: ContextualHelpProps = {
  "title": "신청 자격 도움말",
  "content": "신청 자격에 관한 예제 설명입니다.",
  "triggerLabel": "신청 자격 도움말",
  "defaultOpen": false,
  "variant": "information",
  "placement": "bottom-start"
};
</script>
<section data-example="contextual-help"><ContextualHelp {...props}/></section>
```

