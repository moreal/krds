# back-button · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/BackButtonExample.svelte](/sources/apps/fixture-svelte/src/public-examples/BackButtonExample.svelte.txt). SHA-256: `985f61059accfc8c6124de2d2875921840757b1fc2370d2a1af0a2dd5e1e6d21`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


```svelte
<script lang="ts">
import BackButton from '@unofficial-krds/svelte/back-button';
import type { BackButtonProps } from '@unofficial-krds/svelte';
const props: BackButtonProps = {
  "label": "뒤로가기",
  "canGoBack": true,
  "dirty": false,
  "fallbackHref": "/local/parent"
,
onBackRequest: () => {}
};
</script>
<section data-example="back-button"><BackButton {...props}/></section>
```

