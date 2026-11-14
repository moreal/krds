<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { MastheadContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: MastheadContract  = $props();

</script>
{#if p.governmentService}<div {...owned('masthead','root')}><p {...owned('masthead','text')}>이 누리집은 대한민국 공식 전자정부 누리집입니다.</p></div>{/if}
