<script lang="ts">
import {controlOwnership} from './control-ownership.svelte.js';
const generatedId = $props.id();
import { untrack, tick, getContext } from 'svelte';
import type { ModalProps } from './types.js';
import { context, modalOwnedHeadingKey } from './context.js';
import { openModalDialog, modalDialogKeydown, modalOutsidePress } from './modal-state.js';
const provider = context();
let { open, defaultOpen, onOpenChange, onDismissReason, title, titleId, descriptionId, trigger, id = generatedId, description, children, actions, closeOnOutsideClick = false, showCloseButton = true, closeLabel, initialFocusId, returnFocusId, locale }: ModalProps = $props();
const ownership=controlOwnership(()=>open,untrack(()=>defaultOpen),'Modal');
// Only the Modal composed by the surface that owns this exact title id yields its visible heading (BottomSheet).
const ownedHeading=untrack(()=>titleId!=null&&getContext<string|undefined>(modalOwnedHeadingKey)===titleId);
let local = $state(untrack(() => defaultOpen ?? false));
let actual = $derived(ownership.read() === undefined ? local : open!);
let dialog = $state<HTMLDialogElement>()!;
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
    return openModalDialog(node, { doc, opener, initialFocusId: untrack(() => initialFocusId), returnFocusId: () => returnFocusId, requireCloseAction: !untrack(() => showCloseButton) });
});
const outsidePress = modalOutsidePress(() => dialog, () => closeOnOutsideClick, () => request(false, 'outside'));
const key = (event: KeyboardEvent) => modalDialogKeydown(dialog, event, () => request(false, 'escape'));
</script>
{@render trigger?.({open:triggerOpen,expanded:actual,controls:id})}
{#if actual}
<div data-krds-component="modal" data-krds-part="root" data-krds-state="open" dir={provider.direction} lang={(locale??provider.locale??'ko-KR').slice(0,2)} style="position:fixed;inset:0;z-index:1000">
 <div data-krds-component="modal" data-krds-part="backdrop" data-krds-state="open" style="background:transparent"></div>
 <!-- svelte-ignore a11y_no_redundant_roles (Explicit role keeps the cross-renderer DOM contract.) -->
 <dialog bind:this={dialog!} {id} role="dialog" aria-modal="true" aria-labelledby={titleId??`${id}-title`} aria-describedby={description!=null?descriptionId??`${id}-description`:undefined} tabindex="-1" data-krds-component="modal" data-krds-part="content" data-krds-state="open" onkeydown={key} oncancel={(event)=>event.preventDefault()} {...outsidePress}>
  {#if !ownedHeading}<h2 id={titleId??`${id}-title`} data-krds-component="modal" data-krds-part="title" data-krds-state="">{title}</h2>{/if}
  {#if !ownedHeading&&description!=null}<div id={descriptionId??`${id}-description`} data-krds-component="modal" data-krds-part="description" data-krds-state="">{description}</div>{/if}
  <div data-krds-component="modal" data-krds-part="body" data-krds-state="">{@render children?.({close:()=>request(false)})}</div>
  {#if actions}<div data-krds-component="modal" data-krds-part="actions" data-krds-state="">{@render actions({close:()=>request(false)})}</div>{/if}
  {#if showCloseButton}<button type="button" aria-label={closeLabel??((locale??provider.locale)==='en-US'?'Close':'닫기')} onclick={()=>request(false)} data-krds-component="modal" data-krds-part="close" data-krds-state=""><span aria-hidden="true">×</span></button>{/if}
 </dialog>
</div>
{/if}
<style>dialog::backdrop{background:rgb(0 0 0 / .5)}dialog{margin:0;}</style>
