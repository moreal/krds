<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { SwitchContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: SwitchContract  = $props();
const checked=control(()=>p.checked,untrack(()=>p.defaultChecked),false,checked=>p.onCheckedChange?.({checked}));let input:HTMLInputElement;const uid=$props.id();const id=$derived(p.id??uid);const states=$derived([checked.value?'checked':'unchecked',p.disabled&&'disabled',p.invalid&&'invalid',false].filter(Boolean).join(' '));function sync(){if(input?.isConnected){input.checked=checked.value;}}function change(){checked.request(input.checked);void tick().then(sync);}resetField(()=>input,()=>{checked.reset();sync();});$effect(()=>{checked.value;false;sync();});
</script>
<div {...owned('switch','root',states)} data-krds-appearance={ "default" } data-krds-size={p.size??'medium'}><label for={id} {...owned('switch','label')}><input bind:this={input} {id} type="checkbox" role="switch" aria-checked={checked.value} name={p.name} value={p.value??'on'} checked={checked.value} disabled={p.disabled} required={p.required} aria-invalid={p.invalid||undefined} aria-describedby={[p.helpId,p.invalid?p.errorId:undefined].filter(Boolean).join(' ')||undefined} {...owned('switch','control',states)} onchange={change}/><span aria-hidden="true" {...owned('switch','track',states)}><span {...owned('switch','handle',states)}></span><span {...owned('switch','state-icon',states)}>{checked.value?'✓':'−'}</span></span>{p.label}</label></div>
