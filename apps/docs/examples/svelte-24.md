# table · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/TableExample.svelte](/sources/apps/fixture-svelte/src/public-examples/TableExample.svelte.txt). SHA-256: `dc525578086455b029fbc4ee71427846d600a3a06f4f38df678a82d9fe18433f`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


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

