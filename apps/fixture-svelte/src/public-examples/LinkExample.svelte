<script lang="ts">
import Link from '@unofficial-krds/svelte/link';
import type { LinkProps } from '@unofficial-krds/svelte';
const props: LinkProps = {
  "href": "/local/application",
  "label": "신청 안내",
  "appearance": "basic",
  "size": "medium",
  "underline": true
};
</script>
<section data-example="link"><Link {...props}/></section>
