<script lang="ts">
import { Tabs } from '@unofficial-krds/svelte';
</script>
<Tabs label="Panel focus fallback" items={[{value:'a',label:'Alpha',panel:disabledPanel}]}/>
{#snippet disabledPanel()}<button type="button" disabled>Unavailable first child</button>
<p>Readable panel content</p>{/snippet}
