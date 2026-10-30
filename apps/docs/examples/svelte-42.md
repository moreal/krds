# tts · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/TTSExample.svelte](/sources/apps/fixture-svelte/src/public-examples/TTSExample.svelte.txt). SHA-256: `2f0106dc51fc7088da6071cf0db25a77804d8b1a7088320d5f274f07d38b8234`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import TTS from '@unofficial-krds/svelte/tts';
import type { TTSProps } from '@unofficial-krds/svelte';
const props: TTSProps = {
  "summary": "이 페이지는 예제 신청 방법을 안내합니다.",
  "locale": "ko-KR",
  "state": "idle",
  "label": "음성 안내",
  "size": "small",
  "iconOnly": false
,
onRequest: () => {}
};
</script>
<section data-example="tts"><TTS {...props}/></section>
```

