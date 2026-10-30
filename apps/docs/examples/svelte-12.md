# in-page-navigation · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/InPageNavigationExample.svelte](/sources/apps/fixture-svelte/src/public-examples/InPageNavigationExample.svelte.txt). SHA-256: `a4da0b7107c3170dc080dd6f8b08704a8bd808988500e5811aa2d8fe9644f39a`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import InPageNavigation from '@unofficial-krds/svelte/in-page-navigation';
import type { InPageNavigationProps } from '@unofficial-krds/svelte';
const props: InPageNavigationProps = {
  "sections": [
    {
      "id": "overview",
      "label": "신청 개요"
    },
    {
      "id": "requirements",
      "label": "신청 조건"
    }
  ],
  "title": "이 페이지의 구성",
  "activeId": "overview",
  "narrowMode": "inline"
};
</script>
<section data-example="in-page-navigation"><InPageNavigation {...props}/></section>
```

