# spinner · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/SpinnerExample.svelte](/sources/apps/fixture-svelte/src/public-examples/SpinnerExample.svelte.txt). SHA-256: `438abdcc6babda29864c1fad95506bfdf0c2cc0c604d32915fb0b8d87158efe9`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import Spinner from '@unofficial-krds/svelte/spinner';
import type { SpinnerProps } from '@unofficial-krds/svelte';
const props: SpinnerProps = {
  "pending": true,
  "label": "신청 내역 불러오는 중",
  "completionMessage": "신청 내역을 불러왔습니다.",
  "size": "medium",
  "value": 40
};
</script>
<section data-example="spinner"><Spinner {...props}/></section>
```

