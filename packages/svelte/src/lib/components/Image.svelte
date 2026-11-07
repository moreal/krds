<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { ImageContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: ImageContract  = $props();
let status=$state('loading');let image=$state<HTMLImageElement>();$effect(()=>{p.src;p.srcset;status='loading';const node=image;let active=true;if(node?.complete&&node.naturalWidth)void node.decode().then(()=>{if(active)status='loaded';},()=>{if(active)status='error';});return()=>{active=false;};});
</script>
<figure {...owned('image','figure',status==='loading'?undefined:status)}><img bind:this={image} {...owned('image','root',status==='loading'?undefined:status)} src={p.src} alt={p.decorative?'':p.alt} width={p.width} height={p.height} srcset={p.srcset} sizes={p.sizes} loading={p.loading??'lazy'} aria-describedby={p.descriptionId} onload={()=>{const node=image,src=node?.currentSrc;void node?.decode().then(()=>{if(node===image&&node.currentSrc===src)status='loaded';},()=>{if(node===image&&node.currentSrc===src)status='error';});}} onerror={()=>status='error'}/>{#if p.caption}<figcaption {...owned('image','caption')}>{p.caption}</figcaption>{/if}{#if status==='error'}<span {...owned('image','description')}>이미지를 불러올 수 없습니다.</span>{/if}</figure>
