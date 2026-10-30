<script lang="ts">
import Breadcrumb from '@unofficial-krds/svelte/breadcrumb';
import type { BreadcrumbProps } from '@unofficial-krds/svelte';
const props: BreadcrumbProps = {
  "home": {
    "href": "/local/home",
    "label": "홈"
  },
  "items": [
    {
      "id": "apply",
      "label": "신청",
      "href": "/local/apply"
    }
  ],
  "omitCurrent": true,
  "maxVisible": 4,
  "currentItem": {
    "id": "detail",
    "label": "신청 상세"
  }
};
</script>
<section data-example="breadcrumb"><Breadcrumb {...props}/></section>
