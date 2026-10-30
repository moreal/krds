# tutorial-panel · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/TutorialPanelExample.svelte](/sources/apps/fixture-svelte/src/public-examples/TutorialPanelExample.svelte.txt). SHA-256: `b5267b8375a597d171bfdc9e4fb3d0a37394c8f88a705754de228b2bdb079735`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import TutorialPanel from '@unofficial-krds/svelte/tutorial-panel';
import type { TutorialPanelProps } from '@unofficial-krds/svelte';
const props: TutorialPanelProps = {
  "tasks": [
    {
      "id": "apply",
      "title": "예제 신청하기",
      "steps": [
        {
          "id": "one",
          "title": "이름 입력",
          "targetId": "applicant-name",
          "instruction": "신청인 이름을 입력하세요"
        },
        {
          "id": "two",
          "title": "신청 저장",
          "targetId": "save-application",
          "instruction": "저장을 눌러 완료하세요"
        }
      ]
    }
  ],
  "activeTaskId": "apply",
  "activeStepId": null,
  "defaultRunning": false,
  "defaultOpen": true,
  "defaultActivePanel": "tutorial",
  "startActionId": "tutorial-start",
  "fallbackFocusId": "tutorial-fallback"
};
</script>
<section data-example="tutorial-panel"><TutorialPanel {...props}/></section>
```

