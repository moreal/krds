# Structured list · svelte {#structured-list-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/StructuredListExample.svelte.txt).


```svelte
<script lang="ts">
import StructuredList from '@unofficial-krds/svelte/structured-list';
import type { StructuredListProps } from '@unofficial-krds/svelte';
const props: StructuredListProps = {
  "items": [
    {
      "id": "a",
      "title": "예제 신청 공고",
      "href": "/local/notice/a",
      "metadata": [
        {
          "label": "마감일",
          "value": "2026-11-30"
        },
        {
          "label": "담당 부서",
          "value": "예제 부서"
        }
      ]
    },
    {
      "id": "b",
      "title": "다음 신청 공고",
      "href": "/local/notice/b",
      "metadata": [
        {
          "label": "마감일",
          "value": "2026-12-31"
        }
      ]
    }
  ],
  "variant": "list"
};
</script>
<section data-example="structured-list"><StructuredList {...props}/></section>
```

