<script lang="ts">
import MainMenu from '@unofficial-krds/svelte/main-menu';
import type { MainMenuProps } from '@unofficial-krds/svelte';
const props: MainMenuProps = {
  "items": [
    {
      "id": "home",
      "label": "홈",
      "href": "/local/home"
    },
    {
      "id": "support",
      "label": "지원",
      "href": "/local/support"
    }
  ],
  "currentId": "apply-new",
  "defaultExpandedId": null,
  "defaultMobileOpen": false
};
</script>
<section data-example="main-menu"><MainMenu {...props}/></section>
