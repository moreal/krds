# identifier · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/IdentifierExample.svelte](/sources/apps/fixture-svelte/src/public-examples/IdentifierExample.svelte.txt). SHA-256: `e77921b67cb2e4410197bfcb6d975adb4060f9801bf58c12cb2be194d2ee3316`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


```svelte
<script lang="ts">
import Identifier from '@unofficial-krds/svelte/identifier';
import type { IdentifierProps } from '@unofficial-krds/svelte';
const props: IdentifierProps = {
  "institutionName": "독립 예제 운영기관",
  "logo": {
    "src": "/local-assets/specimen-logo.svg",
    "alt": "독립 예제 운영기관"
  },
  "relationshipText": "독립 예제 운영기관이 운영하는 예제 서비스입니다.",
  "theme": "light"
};
</script>
<section data-example="identifier"><Identifier {...props}/></section>
```

