# structured-list · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/StructuredListExample.svelte](/sources/apps/fixture-svelte/src/public-examples/StructuredListExample.svelte.txt). SHA-256: `d56874681350ff75d421c3c036293f7be23eccb916760210fd9f379def01c1fc`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


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

