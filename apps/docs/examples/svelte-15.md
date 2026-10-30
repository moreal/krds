# critical-alert · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/CriticalAlertExample.svelte](/sources/apps/fixture-svelte/src/public-examples/CriticalAlertExample.svelte.txt). SHA-256: `94873f7ecadcb9be71794c40c5be66cf54b2850ace590004b309ce32fdff6a02`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import CriticalAlert from '@unofficial-krds/svelte/critical-alert';
import type { CriticalAlertProps } from '@unofficial-krds/svelte';
const props: CriticalAlertProps = {
  "urgency": "high",
  "label": "긴급 안내",
  "message": "예제 점검으로 신청이 잠시 중단됩니다.",
  "details": {
    "href": "/local/maintenance",
    "label": "점검 상세 안내",
    "destinationTitle": "점검 상세 안내"
  }
};
</script>
<section data-example="critical-alert"><CriticalAlert {...props}/></section>
```

