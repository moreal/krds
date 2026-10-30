# radio-group · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/RadioGroupExample.svelte](/sources/apps/fixture-svelte/src/public-examples/RadioGroupExample.svelte.txt). SHA-256: `8642fd041578bef34cbbbfa5c71b0a3f99d0768aeb768343b00523f5894ab636`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


```svelte
<script lang="ts">
import RadioGroup from '@unofficial-krds/svelte/radio-group';
import type { RadioGroupProps } from '@unofficial-krds/svelte';
const props: RadioGroupProps = {
  "label": "거주 지역",
  "name": "region",
  "options": [
    {
      "value": "seoul",
      "label": "서울"
    },
    {
      "value": "busan",
      "label": "부산"
    },
    {
      "value": "jeju",
      "label": "제주",
      "disabled": true
    }
  ],
  "size": "medium",
  "appearance": "default"
};
</script>
<section data-example="radio-group"><RadioGroup {...props}/></section>
```

