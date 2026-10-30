# header · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/HeaderExample.svelte](/sources/apps/fixture-svelte/src/public-examples/HeaderExample.svelte.txt). SHA-256: `e838fa4ef72a748067476d3e3563742302b9b47a6e881c81aa5d233ff27d670a`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import Header from '@unofficial-krds/svelte/header';
import type { HeaderProps } from '@unofficial-krds/svelte';
const props: HeaderProps = {
  "home": {
    "href": "/local/home",
    "label": "예제 서비스 홈",
    "logo": {
      "src": "/local-assets/specimen-logo.svg",
      "alt": "예제 서비스 홈"
    }
  },
  "utilityItems": [
    {
      "id": "policy",
      "label": "이용약관",
      "href": "/local/policy"
    }
  ],
  "mainNavigation": [
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
  "actionLayout": "horizontal",
  "sticky": false
};
</script>
<section data-example="header"><Header {...props}/></section>
```

