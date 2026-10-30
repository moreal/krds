# snackbar · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/SnackbarExample.svelte](/sources/apps/fixture-svelte/src/public-examples/SnackbarExample.svelte.txt). SHA-256: `192ef5bd01beeae32f0a55ca31638390c8a4992429274a2883797171f17fb42b`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import Snackbar from '@unofficial-krds/svelte/snackbar';
import type { SnackbarProps } from '@unofficial-krds/svelte';
const props: SnackbarProps = {
  "message": {
    "id": "saved",
    "title": "저장 완료",
    "text": "예제 신청을 저장했습니다."
  },
  "durationMs": null
,
onDismiss: () => {}
};
</script>
<section data-example="snackbar"><Snackbar {...props}/></section>
```

