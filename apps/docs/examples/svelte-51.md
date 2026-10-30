# range-slider · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/RangeSliderExample.svelte](/sources/apps/fixture-svelte/src/public-examples/RangeSliderExample.svelte.txt). SHA-256: `80a26ee2c8961fc9d1103bcdfb7e8862e8e8831267f281aeda6d5b1db6bfa57e`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import RangeSlider from '@unofficial-krds/svelte/range-slider';
import type { RangeSliderProps } from '@unofficial-krds/svelte';
const props: RangeSliderProps = {
  "label": "예제 비율",
  "name": "ratio",
  "min": 0,
  "max": 100,
  "step": 10
};
</script>
<section data-example="range-slider"><RangeSlider {...props}/></section>
```

