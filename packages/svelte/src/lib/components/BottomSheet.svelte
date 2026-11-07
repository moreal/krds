<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onDestroy } from 'svelte';
import type { BottomSheetContract } from '@unofficial-krds/contracts';
import { owned, control } from './catalog-state.svelte.js';
import { context } from './context.js';
import { openModalDialog, modalDialogKeydown, modalOutsidePress } from './modal-state.js';
let p: BottomSheetContract & { children?:Snippet } = $props();
const id = $props.id();
const provider = context();
// The sheet owns its native modal <dialog> (the KRDS bottom-sheet content part) instead of nesting inside Modal's
// centred, transformed dialog: a transformed ancestor would become the containing block of the sheet's fixed layers.
let requestedReason:'close'|'escape'|'outside'|'drag'='close';
const open=control(()=>p.open,untrack(()=>p.defaultOpen),false,value=>p.onOpenChange?.({open:value,reason:requestedReason}));
let dialog=$state<HTMLDialogElement>();
let gesture:{id:number;y:number}|undefined;let alive=true,revision=0;
let initialEntry=untrack(()=>open.value);
onDestroy(()=>{alive=false;revision++;gesture=undefined;});
async function dismiss(reason:'close'|'escape'|'outside'|'drag'){if(!open.value)return;requestedReason=reason;const token=++revision;open.request(false);await tick();if(alive&&token===revision&&!open.value)p.onCancel?.();}
$effect(()=>{
 if(!open.value){initialEntry=false;return;}
 if(!dialog)return;
 const node=dialog;const doc=untrack(()=>provider.document)??node.ownerDocument;
 const opener=initialEntry?null:doc.activeElement instanceof HTMLElement?doc.activeElement:null;initialEntry=false;
 return openModalDialog(node,{doc,opener,initialFocusId:untrack(()=>p.initialFocusId),returnFocusId:()=>p.returnFocusId});
});
const outsidePress=modalOutsidePress(()=>dialog,()=>p.dismissOnOutside,()=>void dismiss('outside'));
const key=(event:KeyboardEvent)=>modalDialogKeydown(dialog,event,()=>void dismiss('escape'));
</script>
<div dir={provider.direction} {...owned('bottom-sheet','root',open.value?'open':'closed')}>
{#if open.value}
<dialog bind:this={dialog} dir={provider.direction} lang={(provider.locale??'ko-KR').slice(0,2)} id={`${id}-sheet`} tabindex="-1" aria-modal="true" aria-labelledby={`${id}-title`} aria-describedby={p.description?`${id}-description`:undefined} {...owned('bottom-sheet','content','open')} onkeydown={key} oncancel={event=>event.preventDefault()} {...outsidePress}>
 <div aria-hidden="true" {...owned('bottom-sheet','handle')} onpointerdown={e=>{if(e.button!==0)return;gesture={id:e.pointerId,y:e.clientY};try{e.currentTarget.setPointerCapture(e.pointerId);}catch{}}} onpointerup={e=>{const start=gesture;gesture=undefined;if(start?.id===e.pointerId&&e.clientY-start.y>80)void dismiss('drag');}} onpointercancel={()=>gesture=undefined} onlostpointercapture={()=>gesture=undefined}></div>
 <div {...owned('bottom-sheet','header')}><h2 id={`${id}-title`} {...owned('bottom-sheet','title')}>{p.title}</h2><button type="button" {...owned('bottom-sheet','close')} onclick={()=>dismiss('close')}>닫기</button></div>
 {#if p.description}<p id={`${id}-description`}>{p.description}</p>{/if}
 <div {...owned('bottom-sheet','body')}>{#if p.children}{@render p.children()}{/if}</div>
</dialog>
{/if}
</div>
<style>dialog{inset-block-start:auto;}</style>
