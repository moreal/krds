# Resize · svelte {#resize-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/ResizeExample.svelte.txt).


```svelte
<script lang="ts">
import Resize from '@unofficial-krds/svelte/resize';
import type { ResizeProps } from '@unofficial-krds/svelte';
const props: ResizeProps = {
  "levels": [
    {
      "id": "90",
      "label": "작게",
      "percent": 90
    },
    {
      "id": "100",
      "label": "기본",
      "percent": 100
    },
    {
      "id": "110",
      "label": "조금 크게",
      "percent": 110
    },
    {
      "id": "120",
      "label": "크게",
      "percent": 120
    },
    {
      "id": "130",
      "label": "아주 크게",
      "percent": 130
    }
  ],
  "defaultOpen": false
};
</script>
<section data-example="resize"><Resize {...props}/></section>
```

