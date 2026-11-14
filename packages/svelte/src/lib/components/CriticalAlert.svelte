<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { CriticalAlertContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: CriticalAlertContract  = $props();

</script>
<section {...owned('critical-alert','root')} data-krds-urgency={p.urgency} role="banner" aria-label={p.label}><span {...owned('critical-alert','icon')} aria-hidden="true">!</span><strong {...owned('critical-alert','label')}>{p.label}</strong><p {...owned('critical-alert','message')}>{p.message}</p>{#if p.details}<a {...owned('critical-alert','link')} href={p.details.href} title={p.details.destinationTitle}>{p.details.label}</a>{/if}</section>
