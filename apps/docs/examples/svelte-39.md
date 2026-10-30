# contextual-help · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/ContextualHelpExample.svelte](/sources/apps/fixture-svelte/src/public-examples/ContextualHelpExample.svelte.txt). SHA-256: `eb999a408c81a6d001406010259f52f58f9a76bc7d91152fd119d6319e06d43a`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


```svelte
<script lang="ts">
import ContextualHelp from '@unofficial-krds/svelte/contextual-help';
import type { ContextualHelpProps } from '@unofficial-krds/svelte';
const props: ContextualHelpProps = {
  "title": "신청 자격 도움말",
  "content": "신청 자격에 관한 예제 설명입니다.",
  "triggerLabel": "신청 자격 도움말",
  "defaultOpen": false,
  "variant": "information",
  "placement": "bottom-start"
};
</script>
<section data-example="contextual-help"><ContextualHelp {...props}/></section>
```

