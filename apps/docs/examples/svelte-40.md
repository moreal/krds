# coach-mark · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/CoachMarkExample.svelte](/sources/apps/fixture-svelte/src/public-examples/CoachMarkExample.svelte.txt). SHA-256: `fbc8a42dc6532a0ef2993e57ba6dbad52b5e66c515f7729ba5a4f1f2c995e823`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


```svelte
<script lang="ts">
import CoachMark from '@unofficial-krds/svelte/coach-mark';
import type { CoachMarkProps } from '@unofficial-krds/svelte';
const props: CoachMarkProps = {
  "steps": [
    {
      "id": "one",
      "title": "이름 입력",
      "targetId": "applicant-name",
      "instruction": "신청인 이름을 입력하세요"
    }
  ],
  "boundaries": [
    {
      "targetId": "applicant-name",
      "insertionBoundaryId": "applicant-name-after"
    },
    {
      "targetId": "save-application",
      "insertionBoundaryId": "save-application-after"
    }
  ],
  "defaultOpen": true,
  "defaultStepId": "one",
  "startActionId": "tutorial-start",
  "fallbackFocusId": "coach-fallback"
,
onTargetAction: () => false
};
</script>
<section data-example="coach-mark"><CoachMark {...props}/></section>
```

