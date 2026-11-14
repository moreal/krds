<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { AccordionContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: AccordionContract & { panel?: Snippet<[{id:string;title:string;content:string}]> } = $props();
const uid=$props.id();let root=$state<HTMLDivElement>();const open=control<readonly string[]>(()=>p.openIds,untrack(()=>p.defaultOpenIds),[],ids=>p.onOpenChange?.({ids}));function toggle(id:string){open.request(open.value.includes(id)?open.value.filter(x=>x!==id):p.multiple===false?[id]:[...open.value,id]);}
$effect.pre(()=>{const ids=open.value;if(!root)return;const node=[...root.querySelectorAll<HTMLElement>('[data-branch]')].find(node=>!ids.includes(node.dataset.branch!)&&!node.hidden&&node.contains(document.activeElement));if(node){const id=node.id;void tick().then(()=>{if(node.hidden)[...root?.querySelectorAll<HTMLButtonElement>('[aria-controls]')??[]].find(trigger=>trigger.getAttribute('aria-controls')===id)?.focus();});}});
</script>
<div bind:this={root} {...owned('accordion','root')} data-krds-variant={p.variant??'default'}>{#each p.items as item(item.id)}<section {...owned('accordion','item',open.value.includes(item.id)?'open':'closed')}><h3 {...owned('accordion','heading')}><button type="button" id={`${uid}-${item.id}-trigger`} {...owned('accordion','trigger')} aria-expanded={open.value.includes(item.id)} aria-controls={`${uid}-${item.id}-panel`} onclick={event=>{event.currentTarget.focus();toggle(item.id);}}>{item.title}<span aria-hidden="true" {...owned('accordion','icon')}>{open.value.includes(item.id)?'−':'+'}</span></button></h3><div data-branch={item.id} id={`${uid}-${item.id}-panel`} hidden={!open.value.includes(item.id)} {...owned('accordion','panel')}>{#if p.panel}{@render p.panel(item)}{:else}{item.content}{/if}</div></section>{/each}</div>
