<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { CheckboxContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: CheckboxContract  = $props();
const checked=control(()=>p.checked,untrack(()=>p.defaultChecked),false,checked=>p.onCheckedChange?.({checked}));let input:HTMLInputElement;const uid=$props.id();const id=$derived(p.id??uid);const mark=$derived(p.indeterminate?'mixed':checked.value?'checked':'unchecked');const states=$derived(p.disabled?'disabled':mark);function sync(){if(input?.isConnected){input.checked=checked.value;input.indeterminate=Boolean(p.indeterminate);}}function change(){checked.request(input.checked);void tick().then(sync);}resetField(()=>input,()=>{checked.reset();sync();});$effect(()=>{checked.value;p.indeterminate&&'mixed';sync();});
</script>
<div {...owned('checkbox','root',states)} data-krds-appearance={p.appearance??'default'} data-krds-size={p.size??'medium'}><input bind:this={input} {id} type="checkbox" {...owned('checkbox','control')} name={p.name} value={p.value??'on'} checked={checked.value} disabled={p.disabled} required={p.required} aria-invalid={p.invalid||undefined} aria-describedby={[p.helpId,p.invalid?p.errorId:undefined].filter(Boolean).join(' ')||undefined} onchange={change}/><label for={id} {...owned('checkbox','label')}>{p.label}<span {...owned('checkbox','indicator',mark)} aria-hidden="true"></span></label></div>
