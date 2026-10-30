<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { FaviconContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: FaviconContract  = $props();

</script>
<svelte:head><link rel="icon" href={p.light.href} type={p.light.type} sizes={p.light.sizes} media={p.dark?'(prefers-color-scheme: light)':undefined}/>{#if p.dark}<link rel="icon" href={p.dark.href} type={p.dark.type} sizes={p.dark.sizes} media="(prefers-color-scheme: dark)"/>{/if}{#if p.touchIcon}<link rel="apple-touch-icon" href={p.touchIcon.href} sizes={p.touchIcon.sizes}/>{/if}</svelte:head>
