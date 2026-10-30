<script lang="ts">
import InPageNavigation from '@unofficial-krds/svelte/in-page-navigation';
import type { InPageNavigationProps } from '@unofficial-krds/svelte';
const props: InPageNavigationProps = {
  "sections": [
    {
      "id": "overview",
      "label": "신청 개요"
    },
    {
      "id": "requirements",
      "label": "신청 조건"
    }
  ],
  "title": "이 페이지의 구성",
  "activeId": "overview",
  "narrowMode": "inline"
};
</script>
<section data-example="in-page-navigation"><InPageNavigation {...props}/></section>
