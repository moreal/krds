# language-switcher · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/LanguageSwitcherExample.svelte](/sources/apps/fixture-svelte/src/public-examples/LanguageSwitcherExample.svelte.txt). SHA-256: `9001984571fbabc3b02aaad418817a61b3be877e95e5e7e585986409eb2e2f22`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import LanguageSwitcher from '@unofficial-krds/svelte/language-switcher';
import type { LanguageSwitcherProps } from '@unofficial-krds/svelte';
const props: LanguageSwitcherProps = {
  "currentLocale": "ko",
  "options": [
    {
      "locale": "ko",
      "nativeLabel": "한국어",
      "translatedLabel": "한국어",
      "href": "/local/ko"
    },
    {
      "locale": "en",
      "nativeLabel": "English",
      "translatedLabel": "영어",
      "href": "/local/en"
    }
  ],
  "defaultOpen": false
};
</script>
<section data-example="language-switcher"><LanguageSwitcher {...props}/></section>
```

