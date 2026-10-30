# tag · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/TagExample.svelte](/sources/apps/fixture-svelte/src/public-examples/TagExample.svelte.txt). SHA-256: `cb5cec51e7a40e3cdbae894e39328a017ee61d18c2ba38b3b2e1af4108844f03`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


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

