<script lang="ts">
import Tabs from '@unofficial-krds/svelte/tabs';
import type { TabsProps } from '@unofficial-krds/svelte';
const props: TabsProps = {label:"안내",items:[{value:"details",label:"상세",content:"상세 내용"}]};
</script>
<section data-example="tabs"><Tabs {...props}/></section>
