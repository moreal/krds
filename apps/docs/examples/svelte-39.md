# contextual-help · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/ContextualHelpExample.svelte](/sources/apps/fixture-svelte/src/public-examples/ContextualHelpExample.svelte.txt). SHA-256: `eb999a408c81a6d001406010259f52f58f9a76bc7d91152fd119d6319e06d43a`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import ContextualHelp from '@unofficial-krds/svelte/contextual-help';
import type { ContextualHelpProps } from '@unofficial-krds/svelte';
const props: ContextualHelpProps = {
  "title": "신청 자격 도움말",
  "content": "신청 자격에 관한 예제 설명입니다.",
  "triggerLabel": "신청 자격 도움말",
  "defaultOpen": false,
  "variant": "information",
  "placement": "bottom-start"
};
</script>
<section data-example="contextual-help"><ContextualHelp {...props}/></section>
```

