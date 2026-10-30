# step-indicator · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/StepIndicatorExample.svelte](/sources/apps/fixture-svelte/src/public-examples/StepIndicatorExample.svelte.txt). SHA-256: `0ca32726208376a9cdb10662755a1ef06728a287a114d57ba28fa252a7169778`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import StepIndicator from '@unofficial-krds/svelte/step-indicator';
import type { StepIndicatorProps } from '@unofficial-krds/svelte';
const props: StepIndicatorProps = {
  "steps": [
    {
      "id": "a",
      "label": "약관 확인",
      "status": "complete"
    },
    {
      "id": "b",
      "label": "정보 입력",
      "status": "current"
    },
    {
      "id": "c",
      "label": "신청 완료",
      "status": "pending"
    }
  ],
  "mode": "sequential"
};
</script>
<section data-example="step-indicator"><StepIndicator {...props}/></section>
```

