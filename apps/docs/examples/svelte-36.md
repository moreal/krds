# spinner · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/SpinnerExample.svelte](/sources/apps/fixture-svelte/src/public-examples/SpinnerExample.svelte.txt). SHA-256: `438abdcc6babda29864c1fad95506bfdf0c2cc0c604d32915fb0b8d87158efe9`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


```svelte
<script lang="ts">
import Spinner from '@unofficial-krds/svelte/spinner';
import type { SpinnerProps } from '@unofficial-krds/svelte';
const props: SpinnerProps = {
  "pending": true,
  "label": "신청 내역 불러오는 중",
  "completionMessage": "신청 내역을 불러왔습니다.",
  "size": "medium",
  "value": 40
};
</script>
<section data-example="spinner"><Spinner {...props}/></section>
```

