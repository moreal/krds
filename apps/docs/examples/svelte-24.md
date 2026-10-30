# table · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/TableExample.svelte](/sources/apps/fixture-svelte/src/public-examples/TableExample.svelte.txt). SHA-256: `dc525578086455b029fbc4ee71427846d600a3a06f4f38df678a82d9fe18433f`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


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

