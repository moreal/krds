# side-navigation · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/SideNavigationExample.svelte](/sources/apps/fixture-svelte/src/public-examples/SideNavigationExample.svelte.txt). SHA-256: `6726d1d314f23df711ac12232fdac462b1020723e94781c4fa959fe833bb5aea`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import SideNavigation from '@unofficial-krds/svelte/side-navigation';
import type { SideNavigationProps } from '@unofficial-krds/svelte';
const props: SideNavigationProps = {
  "items": [
    {
      "id": "home",
      "label": "홈",
      "href": "/local/home"
    },
    {
      "id": "apply",
      "label": "신청",
      "children": [
        {
          "id": "apply-new",
          "label": "신규 신청",
          "href": "/local/apply"
        },
        {
          "id": "history",
          "label": "신청 내역",
          "href": "/local/history"
        }
      ]
    },
    {
      "id": "support",
      "label": "지원",
      "href": "/local/support"
    }
  ],
  "currentId": "apply-new",
  "defaultExpandedIds": [
    "apply"
  ]
};
</script>
<section data-example="side-navigation"><SideNavigation {...props}/></section>
```

