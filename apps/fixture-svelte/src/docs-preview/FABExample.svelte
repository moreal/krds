<script lang="ts">
import FAB from '@unofficial-krds/svelte/fab';
import type { FABProps } from '@unofficial-krds/svelte';
const props: FABProps = { label: '새 신청', icon: 'plus', defaultExpanded: false };
let count = $state(0);
</script>
<FAB {...props} onAction={() => count += 1} />
<p role="status">새 신청 {count}건</p>
