<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { FooterContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: FooterContract  = $props();
import Identifier from './Identifier.svelte';
</script>
<footer {...owned('footer','root')}><img {...owned('footer','logo')} src={p.serviceLogo.src} alt={p.serviceLogo.alt}/><address {...owned('footer','contacts')}>{#each p.contacts as item}<p>{item.label} {#if item.href}<a href={item.href}>{item.text}</a>{:else}{item.text}{/if}</p>{/each}</address><nav aria-label="푸터 유틸리티" {...owned('footer','utilities')}>{#each p.utilityLinks as item}<a href={item.href}>{item.label}</a>{/each}</nav><nav aria-label="정책" {...owned('footer','policies')}><a {...owned('footer','privacy-link')} href={p.privacyPolicy.href}><strong>{p.privacyPolicy.label}</strong></a>{#each p.policyLinks as item}<a href={item.href}>{item.label}</a>{/each}</nav><p {...owned('footer','copyright')}>{p.copyrightText}</p>{#if p.institution}<div {...owned('footer','identifier')}><Identifier {...p.institution}/></div>{/if}</footer>
