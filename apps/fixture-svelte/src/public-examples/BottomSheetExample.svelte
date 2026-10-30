<script lang="ts">
import BottomSheet from '@unofficial-krds/svelte/bottom-sheet';
import type { BottomSheetProps } from '@unofficial-krds/svelte';
const props: BottomSheetProps = {
  "title": "지역 선택",
  "defaultOpen": true,
  "description": "예제 지역을 선택하세요",
  "dismissOnOutside": false
};
</script>
<section data-example="bottom-sheet"><BottomSheet {...props}/></section>
