# in-page-navigation · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/InPageNavigationExample.svelte](/sources/apps/fixture-svelte/src/public-examples/InPageNavigationExample.svelte.txt). SHA-256: `a4da0b7107c3170dc080dd6f8b08704a8bd808988500e5811aa2d8fe9644f39a`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


```svelte
<script lang="ts">
import InPageNavigation from '@unofficial-krds/svelte/in-page-navigation';
import type { InPageNavigationProps } from '@unofficial-krds/svelte';
const props: InPageNavigationProps = {
  "sections": [
    {
      "id": "overview",
      "label": "신청 개요"
    },
    {
      "id": "requirements",
      "label": "신청 조건"
    }
  ],
  "title": "이 페이지의 구성",
  "activeId": "overview",
  "narrowMode": "inline"
};
</script>
<section data-example="in-page-navigation"><InPageNavigation {...props}/></section>
```

