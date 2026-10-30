# tab-bar · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/TabBarExample.svelte](/sources/apps/fixture-svelte/src/public-examples/TabBarExample.svelte.txt). SHA-256: `2bdd49ebcc16852af08d42a5ff7af7019929df1b5e282876b5e622a163e16d5d`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import TabBar from '@unofficial-krds/svelte/tab-bar';
import type { TabBarProps } from '@unofficial-krds/svelte';
const props: TabBarProps = {
  "items": [
    {
      "id": "home",
      "label": "홈",
      "href": "/local/home",
      "icon": "home"
    },
    {
      "id": "apply",
      "label": "신청",
      "href": "/local/apply",
      "icon": "document"
    },
    {
      "id": "profile",
      "label": "내 정보",
      "href": "/local/profile",
      "icon": "person"
    }
  ],
  "currentId": "home"
};
</script>
<section data-example="tab-bar"><TabBar {...props}/></section>
```

