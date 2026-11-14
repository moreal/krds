<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { RangeSliderContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: RangeSliderContract  = $props();
const value=control(()=>p.value,untrack(()=>p.defaultValue),untrack(()=>p.min??0),value=>p.onValueChange?.({value}));function validate(current:number){const min=p.min??0,max=p.max??100,step=p.step??10;if(!Number.isFinite(min)||!Number.isFinite(max)||min>=max||!Number.isFinite(step)||step<=0||!Number.isFinite(current)||current<min||current>max||Math.abs((current-min)/step-Math.round((current-min)/step))>1e-7)throw new RangeError('Range bounds, step and committed value must define a finite on-step value');}validate(untrack(()=>value.value));$effect.pre(()=>validate(value.value));

let input:HTMLInputElement;onMount(()=>{input.defaultValue=String(value.value);});const uid=$props.id();function sync(){if(input?.isConnected)input.value=String(value.value);}function change(){value.request(Number(input.value));void tick().then(sync);}resetField(()=>input,()=>{value.reset();sync();});$effect(()=>{value.value;sync();});
</script>
<div {...owned('range-slider','root',p.disabled&&'disabled')}><label for={p.id??uid} {...owned('range-slider','label')}>{p.label}</label><input bind:this={input} {...owned('range-slider','control')} type="range" id={p.id??uid} name={p.name} min={p.min??0} max={p.max??100} step={p.step??10} value={value.value} disabled={p.disabled} aria-valuetext={p.valueText?.(value.value)} oninput={change}/><output for={p.id??uid} {...owned('range-slider','output')}>{p.valueText?.(value.value)??value.value}</output><span {...owned('range-slider','minimum')}>{p.min??0}</span><span {...owned('range-slider','maximum')}>{p.max??100}</span></div>
