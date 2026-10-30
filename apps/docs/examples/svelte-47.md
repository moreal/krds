# language-switcher · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/LanguageSwitcherExample.svelte](/sources/apps/fixture-svelte/src/public-examples/LanguageSwitcherExample.svelte.txt). SHA-256: `9001984571fbabc3b02aaad418817a61b3be877e95e5e7e585986409eb2e2f22`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


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

