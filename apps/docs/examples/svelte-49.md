# accessible-media · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/AccessibleMediaExample.svelte](/sources/apps/fixture-svelte/src/public-examples/AccessibleMediaExample.svelte.txt). SHA-256: `3d7eba9538212f2025eb72d98c04290eb80a531d3db778b29d59403b7c26fffa`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import AccessibleMedia from '@unofficial-krds/svelte/accessible-media';
import type { AccessibleMediaProps } from '@unofficial-krds/svelte';
const props: AccessibleMediaProps = {
  "media": {
    "kind": "audio",
    "src": "/local-assets/specimen-audio.wav",
    "type": "audio/wav"
  },
  "captionTracks": [],
  "transcript": {
    "content": "약 1초 동안 일정한 높이의 예제 신호음이 들립니다."
  },
  "title": "로컬 예제 미디어",
  "controls": true,
  "autoplay": false
};
</script>
<section data-example="accessible-media"><AccessibleMedia {...props}/></section>
```

