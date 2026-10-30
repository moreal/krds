# coach-mark · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/CoachMarkExample.svelte](/sources/apps/fixture-svelte/src/public-examples/CoachMarkExample.svelte.txt). SHA-256: `fbc8a42dc6532a0ef2993e57ba6dbad52b5e66c515f7729ba5a4f1f2c995e823`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


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

