<script lang="ts">
import Tag from '@unofficial-krds/svelte/tag';
import type { TagProps } from '@unofficial-krds/svelte';
const props: TagProps = {
  "items": [
    {
      "id": "a",
      "label": "서울",
      "href": "/local/seoul"
    },
    {
      "id": "b",
      "label": "부산",
      "href": "/local/busan"
    }
  ],
  "mode": "static",
  "selectedIds": []
};
</script>
<section data-example="tag"><Tag {...props}/></section>
