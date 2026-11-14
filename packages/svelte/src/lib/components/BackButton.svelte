<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { BackButtonContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: BackButtonContract  = $props();
let pending=$state(false);async function back(event:MouseEvent){const opener=event.currentTarget as HTMLButtonElement;if(document.activeElement!==opener)opener.focus();if(pending||(!p.canGoBack&&!p.fallbackHref))return;pending=true;try{if(p.dirty&&!(await p.requestConfirmation?.()))return;p.onBackRequest({reason:p.dirty?'confirmed':'activate'});}finally{pending=false;}}
</script>
{#if !p.canGoBack&&p.fallbackHref&&!p.dirty}<a {...owned('back-button','root',pending&&'pending-confirmation')} href={p.fallbackHref} aria-busy={pending||undefined}>{p.label??'뒤로가기'}</a>{:else}<button type="button" {...owned('back-button','root',pending&&'pending-confirmation')} disabled={!p.canGoBack&&!p.fallbackHref} aria-busy={pending||undefined} onclick={back}><span {...owned('back-button','icon')} aria-hidden="true">←</span><span {...owned('back-button','label')}>{p.label??'뒤로가기'}</span></button>{/if}
