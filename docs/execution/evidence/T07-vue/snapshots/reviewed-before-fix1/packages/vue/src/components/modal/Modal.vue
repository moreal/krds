<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useSlots, useId, watch, watchEffect } from 'vue';
import { controlContract } from '../control';
import { useKrds } from '../context';
import { enter, leave, top, focusables, usable, restore, type ModalEntry } from './stack';
const p = withDefaults(defineProps<{
    open?: boolean;
    modelValue?: boolean;
    defaultOpen?: boolean;
    title?: string;
    description?: string;
    id?: string;
    titleId?: string;
    descriptionId?: string;
    closeLabel?: string;
    showCloseButton?: boolean;
    closeOnOutsideClick?: boolean;
    initialFocusId?: string;
    returnFocusId?: string;
}>(), { open: undefined, modelValue: undefined, defaultOpen: undefined, showCloseButton: true, closeOnOutsideClick: false });
controlContract(() => ({ value: p.open, modelValue: p.modelValue, defaultValue: p.defaultOpen }));
watchEffect(() => { if ([p.open,p.modelValue,p.defaultOpen].some(value => value !== undefined && typeof value !== 'boolean')) throw new TypeError('Modal state must be boolean'); });
const slots = useSlots();
if (!p.title && !slots.title) throw new TypeError('Modal needs a visible title.');
const emit = defineEmits<{
    'update:modelValue': [
        open: boolean
    ];
    openChange: [
        detail: {
            open: boolean;
        }
    ];
}>();
const context = useKrds();
const id = p.id ?? useId();
const local = ref(p.defaultOpen ?? false);
const actual = computed(() => p.modelValue ?? p.open ?? local.value);
const portal = ref<HTMLElement>();
const dialog = ref<HTMLElement>();
let entry: ModalEntry | undefined;
let opener: HTMLElement | null = null;
let ancestors: HTMLElement[] = [];
let doc: Document | undefined;
let started = false;
let activationTarget: HTMLElement | null = null;
let activationTimer: ReturnType<typeof setTimeout> | undefined;
// WebKit can activate a native button without moving document.activeElement.
function rememberActivation(event: MouseEvent) {
  const candidate = event.target instanceof Element ? event.target.closest<HTMLElement>('button,input,select,textarea,a[href],[tabindex]') : null;
  activationTarget = candidate;
  if (activationTimer !== undefined) clearTimeout(activationTimer);
  activationTimer = setTimeout(() => { activationTarget = null; activationTimer = undefined; }, 0);
}
function request(open: boolean) { if (actual.value === open)
    return; if (p.open === undefined && p.modelValue === undefined)
    local.value = open; emit('update:modelValue', open); emit('openChange', { open }); }
function cleanup() { if (!entry || !doc)
    return; doc.removeEventListener('keydown', key); doc.removeEventListener('focusin', focus); leave(doc, entry); entry = undefined; restore(doc, opener, p.returnFocusId, ancestors); opener = null; }
function key(e: KeyboardEvent) { if (!entry || !doc || !top(doc, entry) || e.defaultPrevented || e.isComposing || e.keyCode === 229)
    return; if (e.key === 'Escape') {
    e.preventDefault();
    e.stopPropagation();
    request(false);
}
else if (e.key === 'Tab') {
    const list = focusables(entry.dialog);
    const index = list.indexOf(doc.activeElement as HTMLElement);
    if (!list.length) {
        e.preventDefault();
        entry.dialog.focus();
    }
    else if (e.shiftKey && index <= 0) {
        e.preventDefault();
        list.at(-1)!.focus();
    }
    else if (!e.shiftKey && (index < 0 || index === list.length - 1)) {
        e.preventDefault();
        list[0]!.focus();
    }
} }
function focus(e: FocusEvent) { if (entry && doc && top(doc, entry) && !entry.dialog.contains(e.target as Node))
    entry.dialog.focus(); }
async function activate(captureOpener = true) { doc = context.document(); if (!doc || !actual.value)
    return; opener = captureOpener ? activationTarget ?? (doc.activeElement instanceof HTMLElement && doc.activeElement !== doc.body ? doc.activeElement : null) : null; ancestors = []; let ancestor = opener?.parentElement; while (ancestor) { ancestors.push(ancestor); ancestor = ancestor.parentElement; } await nextTick(); if (!actual.value || !portal.value || !dialog.value)
    return; entry = { portal: portal.value, dialog: dialog.value }; enter(doc, entry); doc.addEventListener('keydown', key); doc.addEventListener('focusin', focus); const list = focusables(entry.dialog); if (!p.showCloseButton && !list.some(x => x.matches('[data-krds-close]')))
    throw new TypeError('Modal needs an explicit close action'); let target: HTMLElement = entry.dialog; if (p.initialFocusId) {
    const found = doc.getElementById(p.initialFocusId);
    if (found !== entry.dialog && found !== list[0])
        throw new RangeError('Initial focus must target dialog or first interactive element');
    if (!usable(found))
        throw new RangeError('Initial focus target unavailable');
    target = found;
} target.focus(); }
watch(actual, (open) => { if (!started)
    return; if (open)
    void activate();
else
    cleanup(); }, { flush: 'post' });
onMounted(() => {
  started = true;
  doc = context.document();
  doc?.addEventListener('click', rememberActivation, true);
  if (actual.value) void activate(false);
});
onUnmounted(() => {
  doc?.removeEventListener('click', rememberActivation, true);
  if (activationTimer !== undefined) clearTimeout(activationTimer);
  cleanup();
});
let pointer = false;
function down(e: PointerEvent) { pointer = e.target === e.currentTarget && e.button === 0 && e.isPrimary; }
function up(e: PointerEvent) { const dismiss = pointer && e.target === e.currentTarget && e.button === 0 && e.isPrimary; pointer = false; if (dismiss && p.closeOnOutsideClick)
    request(false); }
defineExpose({ open: () => request(true), close: () => request(false) });
</script>
<template>
<slot name="trigger" :open="()=>request(true)" :is-open="actual" />
<Teleport v-if="actual" :to="context.document()?.body??'body'">
<div ref="portal" data-krds-component="modal" data-krds-part="root" data-krds-state="open" :dir="context.direction.value">
<div data-krds-component="modal" data-krds-part="backdrop" data-krds-state="open" @pointerdown="down" @pointerup="up">
<section :id="id" ref="dialog" role="dialog" aria-modal="true" tabindex="-1" data-krds-component="modal" data-krds-part="content" data-krds-state="open" :aria-labelledby="titleId??`${id}-title`" :aria-describedby="description||$slots.description?descriptionId??`${id}-description`:undefined">
<h2 :id="titleId??`${id}-title`" data-krds-component="modal" data-krds-part="title">
<slot name="title">{{title}}</slot>
</h2>
<div v-if="description||$slots.description" :id="descriptionId??`${id}-description`" data-krds-component="modal" data-krds-part="description">
<slot name="description">{{description}}</slot>
</div>
<div data-krds-component="modal" data-krds-part="body">
<slot :close="()=>request(false)" />
</div>
<div v-if="$slots.actions" data-krds-component="modal" data-krds-part="actions">
<slot name="actions" :close="()=>request(false)" />
</div>
<button v-if="showCloseButton" type="button" data-krds-component="modal" data-krds-part="close" :aria-label="closeLabel??(context.locale.value==='en-US'?'Close':'닫기')" @click="request(false)">{{closeLabel??(context.locale.value==='en-US'?'Close':'닫기')}}</button>
</section>
</div>
</div>
</Teleport>
</template>
