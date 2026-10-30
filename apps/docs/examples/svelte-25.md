# text-list · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/TextListExample.svelte](/sources/apps/fixture-svelte/src/public-examples/TextListExample.svelte.txt). SHA-256: `fd22d06b6f0ec586c2aa9586f31630fad12a71d41d7750b357b4121c6fb675f4`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


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

