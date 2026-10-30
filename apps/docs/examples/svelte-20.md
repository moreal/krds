# accordion · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/AccordionExample.svelte](/sources/apps/fixture-svelte/src/public-examples/AccordionExample.svelte.txt). SHA-256: `de645efeca94a27c28b41b204f390eb81b1bd89b6553e57b477abc4cd25acfd8`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


```svelte
<script lang="ts">
import Accordion from '@unofficial-krds/svelte/accordion';
import type { AccordionProps } from '@unofficial-krds/svelte';
const props: AccordionProps = {
  "items": [
    {
      "id": "eligibility",
      "title": "신청 자격",
      "content": "예제 신청 자격 안내"
    },
    {
      "id": "documents",
      "title": "제출 서류",
      "content": "예제 제출 서류 안내"
    }
  ],
  "defaultOpenIds": [],
  "multiple": true,
  "variant": "default"
};
</script>
<section data-example="accordion"><Accordion {...props}/></section>
```

