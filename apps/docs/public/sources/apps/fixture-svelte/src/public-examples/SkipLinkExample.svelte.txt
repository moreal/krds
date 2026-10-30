<script lang="ts">
import SkipLink from '@unofficial-krds/svelte/skip-link';
import type { SkipLinkProps } from '@unofficial-krds/svelte';
const props: SkipLinkProps = {
  "links": [
    {
      "id": "main",
      "label": "본문 바로가기",
      "targetId": "main-content"
    }
  ],
  "visibility": "visible"
};
</script>
<section data-example="skip-link"><SkipLink {...props}/></section>
