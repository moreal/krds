# text-list · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/TextListExample.svelte](/sources/apps/fixture-svelte/src/public-examples/TextListExample.svelte.txt). SHA-256: `fd22d06b6f0ec586c2aa9586f31630fad12a71d41d7750b357b4121c6fb675f4`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


```svelte
<script lang="ts">
import TextList from '@unofficial-krds/svelte/text-list';
import type { TextListProps } from '@unofficial-krds/svelte';
const props: TextListProps = {
  "ordered": false,
  "marker": "dot",
  "items": [
    {
      "id": "one",
      "content": "신청 조건 확인"
    },
    {
      "id": "two",
      "content": "제출 서류 준비"
    }
  ]
};
</script>
<section data-example="text-list"><TextList {...props}/></section>
```

