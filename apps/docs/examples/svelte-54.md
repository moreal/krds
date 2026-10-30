# quantity-toggle · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/QuantityToggleExample.svelte](/sources/apps/fixture-svelte/src/public-examples/QuantityToggleExample.svelte.txt). SHA-256: `70bb958f8476e6e62ad5d73529a2a5d811a152e87cd4cc68dada6aadab262a5f`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import QuantityToggle from '@unofficial-krds/svelte/quantity-toggle';
import type { QuantityToggleProps } from '@unofficial-krds/svelte';
const props: QuantityToggleProps = {
  "label": "신청 수량",
  "name": "quantity",
  "min": 0,
  "max": 10,
  "step": 1,
  "unit": "개"
};
</script>
<section data-example="quantity-toggle"><QuantityToggle {...props}/></section>
```

