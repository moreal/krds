<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { SpinnerContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: SpinnerContract  = $props();

function validate(){if(p.value!==undefined&&(!Number.isFinite(p.value)||p.value<0||p.value>100))throw new RangeError('Spinner value must be finite and within 0..100');}validate();$effect(validate);
</script>
<div {...owned('spinner','root',p.pending?'pending':'complete')} aria-busy={p.pending} data-krds-size={p.size??'medium'}>{#if p.pending}<progress {...owned('spinner','indicator',p.value===undefined?'indeterminate':'determinate')} aria-label={p.label} max="100" value={p.value} aria-valuemin="0" aria-valuemax="100" aria-valuenow={p.value}></progress>{/if}<span {...owned('spinner','label')}><span role="status" aria-live="polite" {...owned('spinner','status')}>{p.pending?p.label:p.completionMessage}</span></span></div>
