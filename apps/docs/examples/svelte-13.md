# Pagination · svelte {#pagination-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/PaginationExample.svelte.txt).


```svelte
<script lang="ts">
import Pagination from '@unofficial-krds/svelte/pagination';
import type { PaginationProps } from '@unofficial-krds/svelte';
const props: PaginationProps = {
  "defaultPage": 1,
  "pageCount": 12,
  "variant": "number-links"
,
hrefForPage: page => `/local/list?page=${page}`
};
</script>
<section data-example="pagination"><Pagination {...props}/></section>
```

