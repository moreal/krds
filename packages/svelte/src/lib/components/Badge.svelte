<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { BadgeContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: BadgeContract  = $props();
$effect(()=>{if(p.tone&&!['secondary','gray','point','danger','warning','success','information','disabled'].includes(p.tone))throw new TypeError('Unsupported badge tone');});
</script>
<span data-krds-size={p.size??'medium'} {...owned('badge','root',p.appearance??'outline',p.tone??'information',p.size??'medium',p.numeric&&'numeric')}>{p.label}</span>
