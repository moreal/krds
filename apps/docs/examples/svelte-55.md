# toast · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/ToastExample.svelte](/sources/apps/fixture-svelte/src/public-examples/ToastExample.svelte.txt). SHA-256: `98f5e6bc09ae7e86ddcc76678d6ec67a2d6e277edcff8a400abd5822a8fc2518`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


```svelte
<script lang="ts">
import Toast from '@unofficial-krds/svelte/toast';
import type { ToastProps } from '@unofficial-krds/svelte';
const props: ToastProps = {
  "message": {
    "id": "saved",
    "text": "신청이 저장되었습니다.",
    "tone": "information",
    "persistentResultId": "saved-result"
  },
  "durationMs": 3000
,
onDismiss: () => {}
};
</script>
<section data-example="toast"><Toast {...props}/></section>
```

