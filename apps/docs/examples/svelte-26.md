# favicon · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/FaviconExample.svelte](/sources/apps/fixture-svelte/src/public-examples/FaviconExample.svelte.txt). SHA-256: `0416f6820888c3ae116bfb8dadf85c69ea63be5544a7ee732055d5f053f7d4a3`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import Favicon from '@unofficial-krds/svelte/favicon';
import type { FaviconProps } from '@unofficial-krds/svelte';
const props: FaviconProps = {
  "light": {
    "href": "/local-assets/specimen-icon-light.svg",
    "type": "image/svg+xml",
    "sizes": "any"
  },
  "dark": {
    "href": "/local-assets/specimen-icon-dark.svg",
    "type": "image/svg+xml",
    "sizes": "any"
  }
};
</script>
<section data-example="favicon"><Favicon {...props}/></section>
```

