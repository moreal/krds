<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { LinkContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: LinkContract  = $props();

</script>
{#if p.disabled}<a {...owned('link','root','disabled')} aria-disabled="true">{p.label}</a>{:else}<a {...owned('link','root',p.target==='_blank'&&'external')} href={p.href} target={p.target} rel={p.target==='_blank'?`${p.rel??''} noopener noreferrer`:p.rel} data-krds-appearance={p.appearance??'basic'} data-krds-size={p.size??'medium'} data-krds-underline={p.underline??true}>{p.label}{#if p.target==='_blank'}<span> (새 창)</span>{/if}</a>{/if}
