# footer · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/FooterExample.svelte](/sources/apps/fixture-svelte/src/public-examples/FooterExample.svelte.txt). SHA-256: `684b7233cead62f93943b35607411e389cb874dfe9ec0b3da3b4c65219330d23`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import Footer from '@unofficial-krds/svelte/footer';
import type { FooterProps } from '@unofficial-krds/svelte';
const props: FooterProps = {
  "serviceLogo": {
    "src": "/local-assets/specimen-logo.svg",
    "alt": "예제 서비스"
  },
  "contacts": [
    {
      "label": "예제 문의",
      "text": "로컬 예제 연락처"
    }
  ],
  "utilityLinks": [
    {
      "id": "policy",
      "label": "이용약관",
      "href": "/local/policy"
    }
  ],
  "privacyPolicy": {
    "href": "/local/privacy",
    "label": "개인정보처리방침"
  },
  "policyLinks": [
    {
      "id": "policy",
      "label": "이용약관",
      "href": "/local/policy"
    }
  ],
  "copyrightText": "Independent local specimen"
};
</script>
<section data-example="footer"><Footer {...props}/></section>
```

