# resize · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/ResizeExample.svelte](/sources/apps/fixture-svelte/src/public-examples/ResizeExample.svelte.txt). SHA-256: `51fafda76351bf338e5c3dff1426cb51516bc1fb162270227d095d4705e566b4`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


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

