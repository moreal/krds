# tooltip · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/TooltipExample.svelte](/sources/apps/fixture-svelte/src/public-examples/TooltipExample.svelte.txt). SHA-256: `aba6ac09930ca07c283ca7f56645414a863cf742b9111dafd543dc748fb8f0d7`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


```svelte
<script lang="ts">
import Tooltip from '@unofficial-krds/svelte/tooltip';
import type { TooltipProps } from '@unofficial-krds/svelte';
const props: TooltipProps = {
  "text": "신청 도움말을 엽니다",
  "relationship": "description",
  "triggerLabel": "신청 도움말",
  "triggerId": "help-trigger",
  "textId": "help-tooltip",
  "defaultOpen": false,
  "placement": "bottom-start"
};
</script>
<section data-example="tooltip"><Tooltip {...props}/></section>
```

