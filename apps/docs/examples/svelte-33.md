# tag · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/TagExample.svelte](/sources/apps/fixture-svelte/src/public-examples/TagExample.svelte.txt). SHA-256: `cb5cec51e7a40e3cdbae894e39328a017ee61d18c2ba38b3b2e1af4108844f03`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


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

