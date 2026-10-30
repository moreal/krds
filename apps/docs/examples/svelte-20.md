# accordion · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/AccordionExample.svelte](/sources/apps/fixture-svelte/src/public-examples/AccordionExample.svelte.txt). SHA-256: `de645efeca94a27c28b41b204f390eb81b1bd89b6553e57b477abc4cd25acfd8`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


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

