<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { TextListContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: TextListContract  = $props();

</script>
{#snippet list(items: typeof p.items,level:number)}{#if p.ordered}<ol role="list" {...owned('text-list',level===1?'root':'nested-list')} data-krds-ordering="ordered">{@render entries(items,level)}</ol>{:else}<ul role="list" {...owned('text-list',level===1?'root':'nested-list')} data-krds-ordering="unordered" data-krds-marker={p.marker??'dot'}>{@render entries(items,level)}</ul>{/if}{/snippet}{#snippet entries(items: typeof p.items,level:number)}{#each items as item(item.id)}<li {...owned('text-list','item',`level-${level}`)}><span {...owned('text-list','content')}>{item.content}</span>{#if item.children?.length&&level<3}{@render list(item.children,level+1)}{/if}</li>{/each}{/snippet}{@render list(p.items,1)}
