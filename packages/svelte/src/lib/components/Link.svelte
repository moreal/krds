<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { LinkContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: LinkContract  = $props();

</script>
<a style:text-decoration={p.underline===false?'none':undefined} {...owned('link','root',p.disabled?'disabled':p.target==='_blank'&&'external')} href={p.disabled?undefined:p.href} aria-disabled={p.disabled?'true':undefined} role={p.disabled?'link':undefined} target={p.disabled?undefined:p.target} rel={p.target==='_blank'?[...new Set(`${p.rel??''} noopener noreferrer`.trim().split(/\s+/))].join(' '):p.rel} data-krds-appearance={p.appearance??'basic'} data-krds-size={p.size??'medium'}><span {...owned('link','label')}>{p.label}</span>{#if p.target==='_blank'}<span {...owned('link','icon')}> (새 창)</span>{/if}</a>
