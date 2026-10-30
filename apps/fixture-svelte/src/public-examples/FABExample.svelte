<script lang="ts">
import FAB from '@unofficial-krds/svelte/fab';
import type { FABProps } from '@unofficial-krds/svelte';
const props: FABProps = {
  "label": "새 신청",
  "icon": "plus",
  "defaultExpanded": false
};
</script>
<section data-example="fab"><FAB {...props}/></section>
