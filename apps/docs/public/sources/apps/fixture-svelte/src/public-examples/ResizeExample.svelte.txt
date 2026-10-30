<script lang="ts">
import Resize from '@unofficial-krds/svelte/resize';
import type { ResizeProps } from '@unofficial-krds/svelte';
const props: ResizeProps = {
  "levels": [
    {
      "id": "90",
      "label": "작게",
      "percent": 90
    },
    {
      "id": "100",
      "label": "기본",
      "percent": 100
    },
    {
      "id": "110",
      "label": "조금 크게",
      "percent": 110
    },
    {
      "id": "120",
      "label": "크게",
      "percent": 120
    },
    {
      "id": "130",
      "label": "아주 크게",
      "percent": 130
    }
  ],
  "defaultOpen": false
};
</script>
<section data-example="resize"><Resize {...props}/></section>
