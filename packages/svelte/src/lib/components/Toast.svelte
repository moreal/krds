<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { ToastContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: ToastContract & { style?:string } = $props();
import {notificationLife} from './notification-life.svelte.js';notificationLife(()=>p.message?JSON.stringify([p.message.id,p.message.text,p.message.tone,p.durationMs??(p.message.tone==='warning'?4000:3000)]):null,()=>p.durationMs??(p.message?.tone==='warning'?4000:3000),()=>false,generation=>{if(p.message)p.onDismiss({id:p.message.id,reason:'timeout',generation});});
</script>
{#if p.message}<div style={p.style} {...owned('toast','root','open',p.message.tone)}><p role="status" aria-live="polite" {...owned('toast','message','open',p.message.tone)}>{p.message.text}</p></div>{/if}
