<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { CriticalAlertContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: CriticalAlertContract  = $props();

</script>
<header {...owned('critical-alert','root',p.urgency)}><span aria-hidden="true" {...owned('critical-alert','icon')}>!</span><h1 {...owned('critical-alert','label',p.urgency)}>{p.label}</h1><p {...owned('critical-alert','message')}>{p.message}</p>{#if p.details}<a {...owned('critical-alert','details')} href={p.details.href}>{p.details.label}</a>{/if}</header>
