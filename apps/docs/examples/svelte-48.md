# resize · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/ResizeExample.svelte](/sources/apps/fixture-svelte/src/public-examples/ResizeExample.svelte.txt). SHA-256: `51fafda76351bf338e5c3dff1426cb51516bc1fb162270227d095d4705e566b4`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


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

