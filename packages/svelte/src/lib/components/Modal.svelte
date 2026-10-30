<script lang="ts">
import {controlOwnership} from './control-ownership.svelte.js';
const generatedId = $props.id();
import { untrack, tick } from 'svelte';
import type { ModalProps } from './types.js';
import { context } from './context.js';
import { focusables, sequentialFocusables, registerModal, restoreFocus, topModal, ancestorChain } from './modal-state.js';
const provider = context();
let { open, defaultOpen, onOpenChange, onDismissReason, title, trigger, id = generatedId, description, children, actions, closeOnOutsideClick = false, showCloseButton = true, closeLabel, initialFocusId, returnFocusId, locale }: ModalProps = $props();
const ownership=controlOwnership(()=>open,untrack(()=>defaultOpen),'Modal');
let local = $state(untrack(() => defaultOpen ?? false));
let actual = $derived(ownership.read() === undefined ? local : open!);
let dialog = $state<HTMLDialogElement>()!;
let backdropStart = false;
let initialEntry = untrack(() => open ?? defaultOpen ?? false);
let requestedOpener: HTMLElement | null = null;
async function triggerOpen(event?: Event) {
    requestedOpener = event?.currentTarget instanceof HTMLElement ? event.currentTarget : null;
    request(true);
    await tick();
    if (!actual)
        requestedOpener = null;
}
const request = (next: boolean, reason:'close'|'escape'|'outside'='close') => {
    if (next === actual)
        return;
    if (open === undefined)
        local = next;
    if(!next)onDismissReason?.(reason);
    onOpenChange?.({ open: next });
};
$effect(() => {
    if (!actual) {
        initialEntry = false;
        return;
    }
    if (!dialog)
        return;
    const node = dialog;
    const doc = untrack(() => provider.document) ?? node.ownerDocument;
    const opener = requestedOpener ?? (initialEntry ? null : doc.activeElement instanceof HTMLElement ? doc.activeElement : null);
    initialEntry = false;
    requestedOpener = null;
    const ancestors = ancestorChain(opener);
    const release = registerModal(node);
    node.showModal();
    const targets = focusables(node);
    const focusId = untrack(() => initialFocusId);
    const target = focusId ? doc.getElementById(focusId) : node;
    const failure = !untrack(() => showCloseButton) && !targets.some(n => n.matches('button[type=button],input[type=button]'))
        ? 'Modal requires an enabled explicit close action'
        : !target || (target !== node && target !== targets[0])
            ? 'initialFocusId must identify dialog or first interactive element' : '';
    if (failure) {
        release();
        node.close();
        restoreFocus(doc, opener, returnFocusId, ancestors);
        throw new RangeError(failure);
    }
    target!.focus();
    return () => {
        release();
        node.close();
        restoreFocus(doc, opener, returnFocusId, ancestors);
    };
});
function outside(event: PointerEvent) {
    if (event.target !== dialog)
        return false;
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
}
function key(event: KeyboardEvent) {
    if (!topModal(dialog) || event.defaultPrevented || event.isComposing || event.keyCode === 229)
        return;
    if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        request(false,'escape');
    }
    else if (event.key === 'Tab') {
        const nodes = sequentialFocusables(dialog).sort((a,b) => a.tabIndex > 0 && b.tabIndex > 0 ? a.tabIndex-b.tabIndex : a.tabIndex > 0 ? -1 : b.tabIndex > 0 ? 1 : 0);
        const active = dialog.ownerDocument.activeElement;
        if (!nodes.length) {
            event.preventDefault();
            dialog.focus();
        }
        else {
            const index = nodes.indexOf(active as HTMLElement);
            event.preventDefault();
            nodes[event.shiftKey ? (index <= 0 ? nodes.length - 1 : index - 1) : (index + 1) % nodes.length].focus();
        }
    }
}
</script>
<div dir={provider.direction} data-krds-component="modal" data-krds-part="root" data-krds-state={actual?'open':'closed'}>
{@render trigger?.({open:triggerOpen,expanded:actual,controls:id})}
{#if actual}
 <dialog dir={provider.direction} lang={(locale??provider.locale??'ko-KR').slice(0,2)} bind:this={dialog!} {id} tabindex="-1" aria-modal="true" aria-labelledby={`${id}-title`} aria-describedby={description?`${id}-description`:undefined} data-krds-component="modal" data-krds-part="content" data-krds-state="open" onkeydown={key} oncancel={(event)=>event.preventDefault()} onpointercancel={()=>backdropStart=false} onlostpointercapture={()=>backdropStart=false} onpointerdown={(event)=>{backdropStart=outside(event)&&event.button===0;}} onpointerup={(event)=>{if(closeOnOutsideClick&&backdropStart&&outside(event)&&event.button===0&&topModal(dialog))request(false,'outside');backdropStart=false;}}>
  <h2 id={`${id}-title`} data-krds-component="modal" data-krds-part="title">{title}</h2>
  {#if description}
<p id={`${id}-description`} data-krds-component="modal" data-krds-part="description">{description}</p>{/if}
  <div data-krds-component="modal" data-krds-part="body">{@render children?.({close:()=>request(false)})}
</div>
  {#if actions}
<div data-krds-component="modal" data-krds-part="actions">{@render actions({close:()=>request(false)})}
</div>{/if}
  {#if showCloseButton}
<button type="button" data-krds-component="modal" data-krds-part="close" onclick={()=>request(false)}>{closeLabel??((locale??provider.locale)==='en-US'?'Close':'닫기')}</button>{/if}
 </dialog>
{/if}
</div>
<style>dialog::backdrop{background:rgb(0 0 0 / .5)}dialog{margin:0;}</style>
