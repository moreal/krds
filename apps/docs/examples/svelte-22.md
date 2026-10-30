# carousel · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/CarouselExample.svelte](/sources/apps/fixture-svelte/src/public-examples/CarouselExample.svelte.txt). SHA-256: `cb00d8e33c8ec1a12b8a0b7e16714f5549c0c972bc5e7c0172cf98c5ac9f9072`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import Carousel from '@unofficial-krds/svelte/carousel';
import type { CarouselProps } from '@unofficial-krds/svelte';
const props: CarouselProps = {
  "items": [
    {
      "id": "a",
      "label": "신청 안내",
      "content": "첫 번째 신청 안내"
    },
    {
      "id": "b",
      "label": "서류 안내",
      "content": "두 번째 서류 안내"
    },
    {
      "id": "c",
      "label": "문의 안내",
      "content": "세 번째 문의 안내"
    }
  ],
  "defaultIndex": 0,
  "layout": "single",
  "autoplay": false,
  "intervalMs": 6000,
  "loop": false
};
</script>
<section data-example="carousel"><Carousel {...props}/></section>
```

