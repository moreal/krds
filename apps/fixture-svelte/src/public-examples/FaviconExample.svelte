<script lang="ts">
import Favicon from '@unofficial-krds/svelte/favicon';
import type { FaviconProps } from '@unofficial-krds/svelte';
const props: FaviconProps = {
  "light": {
    "href": "/local-assets/specimen-icon-light.svg",
    "type": "image/svg+xml",
    "sizes": "any"
  },
  "dark": {
    "href": "/local-assets/specimen-icon-dark.svg",
    "type": "image/svg+xml",
    "sizes": "any"
  }
};
</script>
<section data-example="favicon"><Favicon {...props}/></section>
