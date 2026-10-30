# checkbox · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/CheckboxExample.svelte](/sources/apps/fixture-svelte/src/public-examples/CheckboxExample.svelte.txt). SHA-256: `9e11da4a12f61a9df647a4ff681779595a2280e85a4bc80eabd68b2f6f0ae0e3`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


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

