<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { IdentifierContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: IdentifierContract  = $props();

</script>
<section {...owned('identifier','root',p.theme??'light')} data-krds-theme={p.theme??'light'} aria-label={p.institutionName}><img {...owned('identifier','logo')} src={p.logo.src} alt={p.logo.alt}/><p {...owned('identifier','text')}>{p.relationshipText}</p></section>
