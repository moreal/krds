# Table · svelte {#table-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TableExample.svelte.txt).


```svelte
<script lang="ts">
import Table from '@unofficial-krds/svelte/table';
import type { TableProps } from '@unofficial-krds/svelte';
const props: TableProps = {
  "caption": "예제 신청 내역",
  "columns": [
    {
      "id": "name",
      "label": "신청명",
      "kind": "text"
    },
    {
      "id": "count",
      "label": "수량",
      "kind": "number"
    }
  ],
  "rows": [
    {
      "id": "a",
      "cells": {
        "name": "신청 가",
        "count": 2
      }
    },
    {
      "id": "b",
      "cells": {
        "name": "신청 나",
        "count": 1
      }
    }
  ]
};
</script>
<section data-example="table"><Table {...props}/></section>
```

