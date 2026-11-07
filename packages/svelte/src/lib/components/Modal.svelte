<script lang="ts">
import {controlOwnership} from './control-ownership.svelte.js';
const generatedId = $props.id();
import { untrack, tick } from 'svelte';
import type { ModalProps } from './types.js';
import { context } from './context.js';
import { openModalDialog, modalDialogKeydown, modalOutsidePress } from './modal-state.js';
const provider = context();
let { open, defaultOpen, onOpenChange, onDismissReason, title, trigger, id = generatedId, description, children, actions, closeOnOutsideClick = false, showCloseButton = true, closeLabel, initialFocusId, returnFocusId, locale }: ModalProps = $props();
const ownership=controlOwnership(()=>open,untrack(()=>defaultOpen),'Modal');
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
<div dir={provider.direction} data-krds-component="modal" data-krds-part="root" data-krds-state={actual?'open':'closed'}>
{@render trigger?.({open:triggerOpen,expanded:actual,controls:id})}
{#if actual}
 <dialog dir={provider.direction} lang={(locale??provider.locale??'ko-KR').slice(0,2)} bind:this={dialog!} {id} tabindex="-1" aria-modal="true" aria-labelledby={`${id}-title`} aria-describedby={description?`${id}-description`:undefined} data-krds-component="modal" data-krds-part="content" data-krds-state="open" onkeydown={key} oncancel={(event)=>event.preventDefault()} {...outsidePress}>
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
