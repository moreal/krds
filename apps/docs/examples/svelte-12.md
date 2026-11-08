# In-page navigation · svelte {#in-page-navigation-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/InPageNavigationExample.svelte.txt).


```svelte
<script lang="ts">
import InPageNavigation from '@unofficial-krds/svelte/in-page-navigation';
import type { InPageNavigationProps } from '@unofficial-krds/svelte';
const props: InPageNavigationProps = {
  "sections": [
    {
      "id": "overview",
      "label": "신청 개요"
    },
    {
      "id": "requirements",
      "label": "신청 조건"
    }
  ],
  "title": "이 페이지의 구성",
  "activeId": "overview",
  "narrowMode": "inline"
};
</script>
<section data-example="in-page-navigation"><InPageNavigation {...props}/></section>
```

