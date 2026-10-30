# image · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/ImageExample.svelte](/sources/apps/fixture-svelte/src/public-examples/ImageExample.svelte.txt). SHA-256: `3bf9f94697b8753d14f893f29286a8f94ec4c26bcde4182be27855bf6145d845`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


```svelte
<script lang="ts">
import Image from '@unofficial-krds/svelte/image';
import type { ImageProps } from '@unofficial-krds/svelte';
const props: ImageProps = {
  "src": "/local-assets/specimen-landscape.svg",
  "alt": "산과 강이 있는 독립 예제 그림",
  "width": 640,
  "height": 360,
  "loading": "eager"
};
</script>
<section data-example="image"><Image {...props}/></section>
```

