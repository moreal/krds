<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { BottomSheetContract } from '@unofficial-krds/contracts';
import { useOwned } from '../catalog-state';
import { useLayer } from '../catalog-layer';
import { restore } from '../modal/stack';
const p = withDefaults(defineProps<BottomSheetContract>(), { open: undefined, defaultOpen: undefined });
const emit = defineEmits<{
    openChange: [
        detail: {
            open: boolean;
            reason: 'close' | 'escape' | 'outside' | 'drag';
        }
    ];
    cancel: [
    ];
}>();
const reason = ref<'close' | 'escape' | 'outside' | 'drag'>('close');
const state = useOwned(() => p.open, () => p.defaultOpen, false, open => emit('openChange', { open, reason: reason.value }));
const portal = ref<HTMLElement>(), dialog = ref<HTMLElement>();
let opener: HTMLElement | null = null;
let pointerStart: number | null = null;
let dragged = false;
let cancelRequested = false;
watch(state.value, (value, old) => {
    if (!value && old && cancelRequested) {
        cancelRequested = false;
        emit('cancel');
    }
}, { flush: 'post' });
const forced = ref(true);
const layer = useLayer(state.value, portal, dialog, () => close('escape'), () => restore(document, opener, p.returnFocusId), true, () => p.initialFocusId ? document.getElementById(p.initialFocusId) : null, remember);
function remember() { opener = document.activeElement instanceof HTMLElement ? document.activeElement : null; }
function close(value: typeof reason.value) {
    reason.value = value;
    if (state.value.value) {
        cancelRequested = true;
        state.request(false);
    }
}
function down(e: PointerEvent) { pointerStart = e.clientY; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); }
function up(e: PointerEvent) {
    if (pointerStart !== null && e.clientY - pointerStart > 60) {
        dragged = true;
        close('drag');
    }
    pointerStart = null;
}
</script>
<template>
<slot name="trigger" :open="()=>{remember();state.request(true)}"/>
<Teleport v-if="state.value.value" to="body">
<div ref="portal" data-krds-part="root" data-krds-state="open" data-krds-component="bottom-sheet">
<div data-krds-part="backdrop" data-krds-state="open" @click.self="dismissOnOutside&&close('outside')" data-krds-component="bottom-sheet">
<section ref="dialog" role="dialog" aria-modal="true" :aria-label="title" tabindex="-1" data-krds-part="content" data-krds-state="open" data-krds-component="bottom-sheet">
<button type="button" data-krds-part="handle" aria-label="시트 닫기" @pointerdown="down" @pointerup="up" @pointercancel="pointerStart=null" @click="dragged?dragged=false:close('close')" data-krds-component="bottom-sheet" data-krds-state=""></button>
<h2 data-krds-part="title" data-krds-component="bottom-sheet" data-krds-state="">{{title}}</h2>
<p v-if="description" data-krds-part="body" data-krds-component="bottom-sheet" data-krds-state="">{{description}}</p>
<button type="button" data-krds-part="close" @click="close('close')" data-krds-component="bottom-sheet" data-krds-state="">닫기</button>
<div data-krds-part="body" data-krds-component="bottom-sheet" data-krds-state="">
<slot/>
</div>
</section>
</div>
</div>
</Teleport>
</template>
