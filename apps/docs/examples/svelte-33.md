# Tag · svelte {#tag-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TagExample.svelte.txt).


```svelte
<script lang="ts">
import Tag from '@unofficial-krds/svelte/tag';
import type { TagProps } from '@unofficial-krds/svelte';
const props: TagProps = {
  "items": [
    {
      "id": "a",
      "label": "서울",
      "href": "/local/seoul"
    },
    {
      "id": "b",
      "label": "부산",
      "href": "/local/busan"
    }
  ],
  "mode": "static",
  "selectedIds": []
};
</script>
<section data-example="tag"><Tag {...props}/></section>
```

