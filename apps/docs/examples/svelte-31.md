# checkbox · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/CheckboxExample.svelte](/sources/apps/fixture-svelte/src/public-examples/CheckboxExample.svelte.txt). SHA-256: `9e11da4a12f61a9df647a4ff681779595a2280e85a4bc80eabd68b2f6f0ae0e3`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


```svelte
<script lang="ts">
import Checkbox from '@unofficial-krds/svelte/checkbox';
import type { CheckboxProps } from '@unofficial-krds/svelte';
const props: CheckboxProps = {
  "label": "이용약관 동의",
  "name": "consent",
  "defaultChecked": false,
  "indeterminate": false,
  "value": "agreed"
};
</script>
<section data-example="checkbox"><Checkbox {...props}/></section>
```

