<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { VisuallyHiddenContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: VisuallyHiddenContract & { children?:Snippet; surrogate?:Snippet } = $props();
let root=$state<HTMLSpanElement>();
$effect(()=>{if(p.variant!=='interactive-overlay'||!root)return;const container=root;let current:HTMLElement|null=null,previous:Record<string,string|null>={};function clear(){if(current)for(const[key,value]of Object.entries(previous)){if(value===null)current.removeAttribute(key);else current.setAttribute(key,value);}current=null;previous={};}function annotate(){const next=container.querySelector<HTMLElement>('input,button,select,textarea');if(next===current)return;clear();current=next;if(current)for(const[key,value]of Object.entries(owned('visually-hidden','overlay-control'))){previous[key]=current.getAttribute(key);current.setAttribute(key,value);}}annotate();const observer=new MutationObserver(annotate);observer.observe(container,{childList:true,subtree:true});return()=>{observer.disconnect();clear();};});

</script>
{#if p.variant==='interactive-overlay'}<span id={p.id} lang={p.lang} bind:this={root} {...owned('visually-hidden','root','interactive-overlay')} data-krds-variant="interactive-overlay" style="position:relative;display:inline-block">{#if p.children}{@render p.children()}{/if}<span {...owned('visually-hidden','visible-surrogate')} aria-hidden="true">{#if p.surrogate}{@render p.surrogate()}{:else}{p.content}{/if}</span></span>{:else}<span id={p.id} lang={p.lang} {...owned('visually-hidden','root',p.variant??'text')} data-krds-variant={p.variant??'text'} style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0">{p.content}{#if p.children}{@render p.children()}{/if}</span>{/if}
