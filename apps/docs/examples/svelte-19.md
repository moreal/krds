# badge · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/BadgeExample.svelte](/sources/apps/fixture-svelte/src/public-examples/BadgeExample.svelte.txt). SHA-256: `3a4344a9121b1a71bb287d738c5383e753b82c88df2b83a9276d1c02b64131d8`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import Badge from '@unofficial-krds/svelte/badge';
import type { BadgeProps } from '@unofficial-krds/svelte';
const props: BadgeProps = {
  "label": "진행 중",
  "appearance": "outline",
  "tone": "information",
  "size": "medium",
  "numeric": false
};
</script>
<section data-example="badge"><Badge {...props}/></section>
```

