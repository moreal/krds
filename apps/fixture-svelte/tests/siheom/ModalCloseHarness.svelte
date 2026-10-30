<script lang="ts">
import { Modal } from '@unofficial-krds/svelte';
let { notify }: {
    notify: (detail: {
        open: boolean;
    }) => void;
} = $props();
</script>
<Modal title="Explicit close action" defaultOpen showCloseButton={false} onOpenChange={notify}>
 {#snippet children(data: {close?:()=>void} = {})}
  <p>Close through a native snippet action.</p>
  <button type="button" onclick={data.close}>Cancel action</button>
 {/snippet}
</Modal>
