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
