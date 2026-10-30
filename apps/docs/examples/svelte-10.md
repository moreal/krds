# breadcrumb · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/BreadcrumbExample.svelte](/sources/apps/fixture-svelte/src/public-examples/BreadcrumbExample.svelte.txt). SHA-256: `19686c4b356eab13bca4948d1913f3f4fc9e6e619d6ad58fe151183f0508bf09`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


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

