# identifier · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/IdentifierExample.svelte](/sources/apps/fixture-svelte/src/public-examples/IdentifierExample.svelte.txt). SHA-256: `e77921b67cb2e4410197bfcb6d975adb4060f9801bf58c12cb2be194d2ee3316`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import Identifier from '@unofficial-krds/svelte/identifier';
import type { IdentifierProps } from '@unofficial-krds/svelte';
const props: IdentifierProps = {
  "institutionName": "독립 예제 운영기관",
  "logo": {
    "src": "/local-assets/specimen-logo.svg",
    "alt": "독립 예제 운영기관"
  },
  "relationshipText": "독립 예제 운영기관이 운영하는 예제 서비스입니다.",
  "theme": "light"
};
</script>
<section data-example="identifier"><Identifier {...props}/></section>
```

