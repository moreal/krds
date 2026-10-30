<script lang="ts">
import { untrack } from 'svelte';
import { Button, NativeSelect, Modal, Tabs, Calendar, DateInput } from '@unofficial-krds/svelte';
import type { DateRangeValue } from '@unofficial-krds/svelte';
import '@unofficial-krds/styles/all.css';
let { kind, disabled = false, value = 'seoul', open = true, invalid = false, errorMessage = '', mode = 'single', referenceDate = '2024-02-15', today }: {
    kind: string;
    disabled?: boolean;
    value?: unknown;
    open?: boolean;
    invalid?: boolean;
    errorMessage?: string;
    mode?: string;
    referenceDate?: string;
    today?: string;
} = $props();
let selected = $state('seoul');
let modalOpen = $state(untrack(() => open));
let date = $state<string | null>(null);
let tab = $state('first');
</script>
<main style="max-width:48rem;padding:1rem">
<h1>KRDS Svelte</h1>
 {#if kind==='sizes'}
<div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center">
{#each ['xsmall','small','medium','large','xlarge'] as size}
<Button size={size as 'medium'}>{size}</Button>{/each}
</div>
{:else if kind==='button'}
<Button {disabled}>저장</Button>
 {:else if kind==='native-select'}
<NativeSelect label="지역" options={[{value:'seoul',label:'서울'},{value:'busan',label:'부산'}]} value={selected} onValueChange={details=>{selected=details.value;}}/>
 {:else if kind==='modal'}
<Modal title="확인" open={modalOpen} onOpenChange={({open})=>{modalOpen=open;}}>
 {#snippet trigger({open,expanded,controls})}<Button onclick={open} aria-haspopup="dialog" aria-expanded={expanded} aria-controls={controls}>열기</Button>{/snippet}
 <p>입력 내용을 확인하세요.</p>
</Modal>
 {:else if kind==='tabs'}
<Tabs label="안내" value={tab} items={[{value:'first',label:'첫 번째',content:'첫 번째 내용'},{value:'second',label:'두 번째',content:'두 번째 내용'}]} onValueChange={({value})=>{tab=value;}}/>
 {:else if kind==='date-input'}
<DateInput label="날짜" value={date} {invalid} error={errorMessage} onValueChange={({value})=>{date=value as string|null;}} {referenceDate}/>
 {:else if kind==='calendar'}
<Calendar mode="range" value={value as DateRangeValue} {referenceDate} {today} label="기간 선택"/>{/if}
</main>
