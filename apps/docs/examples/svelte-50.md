# visually-hidden · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/VisuallyHiddenExample.svelte](/sources/apps/fixture-svelte/src/public-examples/VisuallyHiddenExample.svelte.txt). SHA-256: `1402be2cf2b6d74eb7b0cabf991143bb77d5383a897d5fb0ff6e3398ba761bb2`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import VisuallyHidden from '@unofficial-krds/svelte/visually-hidden';
import type { VisuallyHiddenProps } from '@unofficial-krds/svelte';
const props: VisuallyHiddenProps = {
  "id": "hidden-help",
  "content": "신청 내용을 확인하세요",
  "variant": "text",
  "lang": "ko"
};
</script>
<section data-example="visually-hidden"><VisuallyHidden {...props}/></section>
```

