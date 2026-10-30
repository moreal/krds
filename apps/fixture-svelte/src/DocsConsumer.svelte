<script lang="ts">
import { Button, NativeSelect, Modal, Tabs, Calendar, DateInput, KrdsProvider } from '@unofficial-krds/svelte';
import type { DateValue, TabItem } from '@unofficial-krds/svelte';
let button = $state<HTMLButtonElement | null>(null);
let date = $state<DateValue>(null);
let open = $state(false);
const items: TabItem[] = [{ value: 'details', label: 'Details', content: 'Retained local panel' }];
</script>
<KrdsProvider locale="en-US">
 
 <NativeSelect label="Region" options={[{value:'seoul',label:'Seoul'}]}/>
 <Tabs label="Sections" {items}/>
 <DateInput label="Visit date" value={date} onValueChange={detail=>{date=detail.value;}}/>
 <Calendar label="Choose date" referenceDate="2024-02-15"/>
 <Modal title="Review" {open} onOpenChange={detail=>{open=detail.open;}}>
{#snippet trigger({open:requestOpen,expanded,controls})}<Button bind:element={button} onclick={requestOpen} aria-haspopup="dialog" aria-expanded={expanded} aria-controls={controls}>Open review</Button>{/snippet}
<p>Native snippet content</p>
{#snippet actions({close})}<Button onclick={close}>Cancel review</Button>{/snippet}
</Modal>
</KrdsProvider>
