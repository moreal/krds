<script lang="ts">
import StructuredList from '@unofficial-krds/svelte/structured-list';
import type { StructuredListProps } from '@unofficial-krds/svelte';
const props: StructuredListProps = {
  "items": [
    {
      "id": "a",
      "title": "예제 신청 공고",
      "href": "/local/notice/a",
      "metadata": [
        {
          "label": "마감일",
          "value": "2026-11-30"
        },
        {
          "label": "담당 부서",
          "value": "예제 부서"
        }
      ]
    },
    {
      "id": "b",
      "title": "다음 신청 공고",
      "href": "/local/notice/b",
      "metadata": [
        {
          "label": "마감일",
          "value": "2026-12-31"
        }
      ]
    }
  ],
  "variant": "list"
};
</script>
<section data-example="structured-list"><StructuredList {...props}/></section>
