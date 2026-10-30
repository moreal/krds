# skip-link · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/SkipLinkExample.svelte](/sources/apps/fixture-svelte/src/public-examples/SkipLinkExample.svelte.txt). SHA-256: `8128a4ccce8fad8e87ad77aea8db8204d177d281e9b7921912bdc1ba8719b0d5`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import SkipLink from '@unofficial-krds/svelte/skip-link';
import type { SkipLinkProps } from '@unofficial-krds/svelte';
const props: SkipLinkProps = {
  "links": [
    {
      "id": "main",
      "label": "본문 바로가기",
      "targetId": "main-content"
    }
  ],
  "visibility": "visible"
};
</script>
<section data-example="skip-link"><SkipLink {...props}/></section>
```

