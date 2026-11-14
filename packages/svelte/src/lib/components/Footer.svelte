<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { FooterContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: FooterContract  = $props();
import Identifier from './Identifier.svelte';
const safeRel=(target?:string,rel?:string)=>target==='_blank'?[...new Set(`${rel??''} noopener noreferrer`.trim().split(/\s+/))].join(' '):rel;
</script>
<footer {...owned('footer','root')}><img {...owned('footer','logo')} src={p.serviceLogo.src} alt={p.serviceLogo.alt}/><address {...owned('footer','contacts')}>{#each p.contacts as item}<p>{item.label}: {#if item.href}<a href={item.href}>{item.text}</a>{:else}{item.text}{/if}</p>{/each}</address><nav {...owned('footer','utilities')} aria-label="서비스 관련 링크">{#each p.utilityLinks as item}<a href={item.href} target={item.target} rel={safeRel(item.target,item.rel)}>{item.label}{#if item.target==='_blank'}<span> (새 창)</span>{/if}</a>{/each}</nav><nav {...owned('footer','policies')} aria-label="정책"><a {...owned('footer','privacy-link')} href={p.privacyPolicy.href} target={p.privacyPolicy.target} rel={safeRel(p.privacyPolicy.target,p.privacyPolicy.rel)}>{p.privacyPolicy.label}{#if p.privacyPolicy.target==='_blank'}<span> (새 창)</span>{/if}</a>{#each p.policyLinks as item}<a href={item.href} target={item.target} rel={safeRel(item.target,item.rel)}>{item.label}{#if item.target==='_blank'}<span> (새 창)</span>{/if}</a>{/each}</nav><p {...owned('footer','copyright')}>{p.copyrightText}</p>{#if p.institution}<Identifier {...p.institution}/>{/if}</footer>
