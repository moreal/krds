# accessible-media · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/AccessibleMediaExample.svelte](/sources/apps/fixture-svelte/src/public-examples/AccessibleMediaExample.svelte.txt). SHA-256: `3d7eba9538212f2025eb72d98c04290eb80a531d3db778b29d59403b7c26fffa`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


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

