# tutorial-panel · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/TutorialPanelExample.svelte](/sources/apps/fixture-svelte/src/public-examples/TutorialPanelExample.svelte.txt). SHA-256: `b5267b8375a597d171bfdc9e4fb3d0a37394c8f88a705754de228b2bdb079735`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


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

