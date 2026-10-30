<script lang="ts">
import TextList from '@unofficial-krds/svelte/text-list';
import type { TextListProps } from '@unofficial-krds/svelte';
const props: TextListProps = {
  "ordered": false,
  "marker": "dot",
  "items": [
    {
      "id": "one",
      "content": "신청 조건 확인"
    },
    {
      "id": "two",
      "content": "제출 서류 준비"
    }
  ]
};
</script>
<section data-example="text-list"><TextList {...props}/></section>
