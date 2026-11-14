<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { SwitchContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: SwitchContract  = $props();
const checked=control(()=>p.checked,untrack(()=>p.defaultChecked),false,checked=>p.onCheckedChange?.({checked}));let input:HTMLInputElement;const uid=$props.id();const id=$derived(p.id??uid);const states=$derived(p.disabled?'disabled':checked.value?'checked':'unchecked');function sync(){if(input?.isConnected){input.checked=checked.value;}}function change(){checked.request(input.checked);void tick().then(sync);}resetField(()=>input,()=>{checked.reset();sync();});$effect(()=>{checked.value;false;sync();});
</script>
<div {...owned('switch','root',states)} data-krds-size={p.size??'medium'}><input bind:this={input} {id} type="checkbox" role="switch" aria-checked={checked.value} {...owned('switch','control')} name={p.name} value={p.value??'on'} checked={checked.value} disabled={p.disabled} required={p.required} aria-invalid={p.invalid||undefined} aria-describedby={[p.helpId,p.invalid?p.errorId:undefined].filter(Boolean).join(' ')||undefined} onchange={change}/><label for={id} {...owned('switch','label')}>{p.label}<span {...owned('switch','track')} aria-hidden="true"><span {...owned('switch','handle')}></span></span></label></div>
