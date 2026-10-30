# bottom-sheet · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/BottomSheetExample.svelte](/sources/apps/fixture-svelte/src/public-examples/BottomSheetExample.svelte.txt). SHA-256: `e52c65756551eb2d6f7d3f0447f7b037dbe71c6b90ecbf3a24ef00c837fc2465`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


```svelte
<script lang="ts">
import BottomSheet from '@unofficial-krds/svelte/bottom-sheet';
import type { BottomSheetProps } from '@unofficial-krds/svelte';
const props: BottomSheetProps = {
  "title": "지역 선택",
  "defaultOpen": true,
  "description": "예제 지역을 선택하세요",
  "dismissOnOutside": false
};
</script>
<section data-example="bottom-sheet"><BottomSheet {...props}/></section>
```

