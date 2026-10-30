<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { TextListContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: TextListContract  = $props();

</script>
{#snippet list(items: typeof p.items,level:number)}<svelte:element this={p.ordered?'ol':'ul'} {...owned('text-list',level===1?'root':'nested-list',p.ordered?'ordered':'unordered',`level-${level}`)} data-krds-marker={p.marker??'dot'}>{#each items as item(item.id)}<li {...owned('text-list','item',`level-${level}`)}>{item.content}{#if item.children&&level<3}{@render list(item.children,level+1)}{/if}</li>{/each}</svelte:element>{/snippet}{@render list(p.items,1)}
