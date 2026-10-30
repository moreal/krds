<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { DisclosureContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: DisclosureContract & { children?: Snippet } = $props();
const open=control(()=>p.open,untrack(()=>p.defaultOpen),false,value=>p.onOpenChange?.({open:value}));let root:HTMLDivElement;let trigger:HTMLButtonElement;$effect(()=>{if(!open.value&&root?.querySelector(`#${CSS.escape(p.contentId)}`)?.contains(document.activeElement))trigger?.focus();});
</script>
<div bind:this={root} {...owned('disclosure','root',open.value?'open':'closed')}><button bind:this={trigger} type="button" {...owned('disclosure','trigger',open.value?'open':'closed')} aria-expanded={open.value} aria-controls={p.contentId} onclick={event=>{event.currentTarget.focus();open.request(!open.value);}}>{p.label}<span aria-hidden="true">{open.value?'−':'+'}</span></button><div id={p.contentId} hidden={!open.value} {...owned('disclosure','content',open.value?'open':'closed')}>{#if p.children}{@render p.children()}{/if}</div></div>
