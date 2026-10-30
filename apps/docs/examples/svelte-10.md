# breadcrumb · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/BreadcrumbExample.svelte](/sources/apps/fixture-svelte/src/public-examples/BreadcrumbExample.svelte.txt). SHA-256: `19686c4b356eab13bca4948d1913f3f4fc9e6e619d6ad58fe151183f0508bf09`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


```svelte
<script lang="ts">
import Breadcrumb from '@unofficial-krds/svelte/breadcrumb';
import type { BreadcrumbProps } from '@unofficial-krds/svelte';
const props: BreadcrumbProps = {
  "home": {
    "href": "/local/home",
    "label": "홈"
  },
  "items": [
    {
      "id": "apply",
      "label": "신청",
      "href": "/local/apply"
    }
  ],
  "omitCurrent": true,
  "maxVisible": 4,
  "currentItem": {
    "id": "detail",
    "label": "신청 상세"
  }
};
</script>
<section data-example="breadcrumb"><Breadcrumb {...props}/></section>
```

