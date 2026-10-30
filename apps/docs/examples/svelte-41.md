# tooltip · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/TooltipExample.svelte](/sources/apps/fixture-svelte/src/public-examples/TooltipExample.svelte.txt). SHA-256: `aba6ac09930ca07c283ca7f56645414a863cf742b9111dafd543dc748fb8f0d7`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


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

