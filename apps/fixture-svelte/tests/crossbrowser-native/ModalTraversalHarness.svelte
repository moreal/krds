<script lang="ts">
import {Modal} from '@unofficial-krds/svelte';import PanelShell from '../../../../packages/svelte/src/lib/components/PanelShell.svelte';let {shell=false,positive=false}:{shell?:boolean;positive?:boolean}=$props();
</script>
<button type="button">Outside</button>{#if shell}<PanelShell open={true} narrow={true} title="Panel" componentId="help-panel" states="open modal" onClose={()=>{}}><button type="button" tabindex={positive?2:undefined}>First inside</button><button type="button" tabindex={positive?1:undefined}>Second inside</button></PanelShell>{:else}<Modal defaultOpen={true} title="Modal"><button type="button" tabindex={positive?2:undefined}>First inside</button><button type="button" tabindex={positive?1:undefined}>Second inside</button></Modal>{/if}
