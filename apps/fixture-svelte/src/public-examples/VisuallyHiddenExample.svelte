<script lang="ts">
import VisuallyHidden from '@unofficial-krds/svelte/visually-hidden';
import type { VisuallyHiddenProps } from '@unofficial-krds/svelte';
const props: VisuallyHiddenProps = {
  "id": "hidden-help",
  "content": "신청 내용을 확인하세요",
  "variant": "text",
  "lang": "ko"
};
</script>
<section data-example="visually-hidden"><VisuallyHidden {...props}/></section>
