# structured-list · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/StructuredListExample.svelte](/sources/apps/fixture-svelte/src/public-examples/StructuredListExample.svelte.txt). SHA-256: `d56874681350ff75d421c3c036293f7be23eccb916760210fd9f379def01c1fc`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


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

