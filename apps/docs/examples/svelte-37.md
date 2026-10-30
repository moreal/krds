# help-panel · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/HelpPanelExample.svelte](/sources/apps/fixture-svelte/src/public-examples/HelpPanelExample.svelte.txt). SHA-256: `895574a712051b406315570aca044a3eb8c33462ad7408c94ba2b79bb281a2ee`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


```svelte
<script lang="ts">
import HelpPanel from '@unofficial-krds/svelte/help-panel';
import type { HelpPanelProps } from '@unofficial-krds/svelte';
const props: HelpPanelProps = {
  "defaultOpen": true,
  "defaultSelectedTopicId": null,
  "topics": [
    {
      "id": "eligibility",
      "title": "신청 자격",
      "content": "예제 신청 자격 도움말",
      "relatedLinks": [
        {
          "id": "policy",
          "label": "이용약관",
          "href": "/local/policy"
        }
      ]
    },
    {
      "id": "documents",
      "title": "제출 서류",
      "content": "예제 제출 서류 도움말",
      "relatedLinks": []
    }
  ],
  "mode": "help",
  "fallbackFocusId": "panel-fallback"
};
</script>
<section data-example="help-panel"><HelpPanel {...props}/></section>
```

