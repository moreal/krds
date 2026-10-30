<script lang="ts">
import { Button } from '@unofficial-krds/svelte';
let { notify }: {
    notify: (kind: string, value?: unknown) => void;
} = $props();
let element = $state<HTMLButtonElement | null>(null);
</script>
<form onsubmit={(event)=>{event.preventDefault();notify('submit',Array.from(new FormData(event.currentTarget,event.submitter).entries()));}} onreset={()=>notify('reset')}>
 <Button bind:element onclick={()=>notify('action')}>Action</Button>
 <Button type="submit" name="intent" value="save">Submit</Button>
 <Button type="reset">Reset</Button>
 <Button disabled onclick={()=>notify('disabled')}>Unavailable</Button>
</form>
