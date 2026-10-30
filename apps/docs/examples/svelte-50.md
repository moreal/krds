# visually-hidden · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/VisuallyHiddenExample.svelte](/sources/apps/fixture-svelte/src/public-examples/VisuallyHiddenExample.svelte.txt). SHA-256: `1402be2cf2b6d74eb7b0cabf991143bb77d5383a897d5fb0ff6e3398ba761bb2`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


```svelte
<script lang="ts">
import VisuallyHidden from '@unofficial-krds/svelte/visually-hidden';
import type { VisuallyHiddenProps } from '@unofficial-krds/svelte';
const props: VisuallyHiddenProps = {
  "id": "hidden-help",
  "content": "신청 내용을 확인하세요",
  "variant": "text",
  "lang": "ko"
};
</script>
<section data-example="visually-hidden"><VisuallyHidden {...props}/></section>
```

