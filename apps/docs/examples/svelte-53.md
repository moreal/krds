# bottom-sheet · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/BottomSheetExample.svelte](/sources/apps/fixture-svelte/src/public-examples/BottomSheetExample.svelte.txt). SHA-256: `e52c65756551eb2d6f7d3f0447f7b037dbe71c6b90ecbf3a24ef00c837fc2465`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


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

