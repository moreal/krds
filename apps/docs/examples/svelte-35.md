# step-indicator · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/StepIndicatorExample.svelte](/sources/apps/fixture-svelte/src/public-examples/StepIndicatorExample.svelte.txt). SHA-256: `0ca32726208376a9cdb10662755a1ef06728a287a114d57ba28fa252a7169778`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


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

