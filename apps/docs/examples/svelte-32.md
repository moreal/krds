# native-select · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/NativeSelectExample.svelte](/sources/apps/fixture-svelte/src/public-examples/NativeSelectExample.svelte.txt). SHA-256: `c9f6e16607434aaffc9c3bf24c4c5ebdf5013a9ac36e1a0d66f3f8913564ba66`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import NativeSelect from '@unofficial-krds/svelte/native-select';
import type { NativeSelectProps } from '@unofficial-krds/svelte';
const props: NativeSelectProps = { label: "지역", options: [{value:"seoul",label:"서울"}] };
</script>
<section data-example="native-select"><NativeSelect {...props}/></section>
```

