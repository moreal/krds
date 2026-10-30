# tab-bar · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- All 54 source bytes are unchanged. The later retained strict fixture compiler checkpoint reports zero errors and zero warnings; the original evidence also preserves an earlier unrelated initial-value-capture warning. Native source repairs, runtime/SSR evidence and final candidate acceptance remain separate.

Source: [apps/fixture-svelte/src/public-examples/TabBarExample.svelte](/sources/apps/fixture-svelte/src/public-examples/TabBarExample.svelte.txt). SHA-256: `2bdd49ebcc16852af08d42a5ff7af7019929df1b5e282876b5e622a163e16d5d`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).


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

