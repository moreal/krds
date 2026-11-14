<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onDestroy, setContext } from 'svelte';
import type { BottomSheetContract } from '@unofficial-krds/contracts';
import { owned, control } from './catalog-state.svelte.js';
import { modalOwnedHeadingKey } from './context.js';
import Modal from './Modal.svelte';
let p: BottomSheetContract & { children?:Snippet; actions?:Snippet } = $props();
const id = $props.id();
const titleId=`${id}-title`,descriptionId=`${id}-description`;
// Shared sheet anatomy: the sheet composes the public Modal (which owns the native modal dialog, backdrop, focus and dismissal)
// and yields the Modal heading to its own header: handle, then header with title and close, then body.
setContext(modalOwnedHeadingKey,titleId);
let requestedReason:'close'|'escape'|'outside'|'drag'='close';
const open=control(()=>p.open,untrack(()=>p.defaultOpen),false,value=>p.onOpenChange?.({open:value,reason:requestedReason}));
let gesture:{id:number;y:number}|undefined;let dragged=false;let alive=true,revision=0;
onDestroy(()=>{alive=false;revision++;gesture=undefined;});
async function dismiss(reason:'close'|'escape'|'outside'|'drag'){if(!open.value)return;requestedReason=reason;const token=++revision;open.request(false);await tick();if(alive&&token===revision&&!open.value)p.onCancel?.();}
let modalReason:'close'|'escape'|'outside'='close';
</script>
<Modal title={p.title} {titleId} description={p.description} {descriptionId} open={open.value} onDismissReason={reason=>modalReason=reason} onOpenChange={()=>void dismiss(modalReason)} initialFocusId={p.initialFocusId} returnFocusId={p.returnFocusId} closeOnOutsideClick={p.dismissOnOutside} showCloseButton={false}>{#snippet children()}<div {...owned('bottom-sheet','root',open.value?'open':'closed')}><button type="button" {...owned('bottom-sheet','handle')} aria-label="시트 닫기" onclick={event=>{if(dragged&&event.detail!==0){dragged=false;event.preventDefault();return;}dragged=false;void dismiss('close');}} onpointerdown={e=>{dragged=false;if(e.button!==0)return;gesture={id:e.pointerId,y:e.clientY};try{e.currentTarget.setPointerCapture(e.pointerId);}catch{}}} onpointerup={e=>{const start=gesture;gesture=undefined;if(start?.id===e.pointerId&&e.clientY-start.y>80){dragged=true;void dismiss('drag');}}} onpointercancel={()=>{gesture=undefined;dragged=false;}} onlostpointercapture={()=>gesture=undefined}></button><div {...owned('bottom-sheet','header')}><h2 id={titleId} {...owned('bottom-sheet','title')}>{p.title}</h2><button type="button" {...owned('bottom-sheet','close')} onclick={()=>dismiss('close')}>닫기</button></div>{#if p.description!=null}<p id={descriptionId}>{p.description}</p>{/if}<div {...owned('bottom-sheet','body')}>{#if p.children}{@render p.children()}{/if}</div></div>{/snippet}{#snippet actions()}<div {...owned('bottom-sheet','actions')}>{#if p.actions}{@render p.actions()}{/if}</div>{/snippet}</Modal>
