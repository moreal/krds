<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import type { TooltipContract } from '@unofficial-krds/contracts';
import { usePopupPosition } from '../popup-position';
import { useOwned } from '../catalog-state';
import { restore } from '../modal/stack';
const p = withDefaults(defineProps<TooltipContract>(), { open: undefined, defaultOpen: undefined });
const emit = defineEmits<{
    openChange: [
        detail: {
            open: boolean;
        }
    ];
}>();
if ((p.relationship ?? 'description') === 'description' && !p.triggerLabel)
    throw new TypeError('Description tooltip needs independent trigger label');
if (p.relationship === 'label' && p.triggerLabel)
    throw new TypeError('Label tooltip cannot have alternate label');
const state = useOwned(() => p.open, () => p.defaultOpen, false, open => emit('openChange', { open }));
const root = ref<HTMLElement>(), trigger = ref<HTMLButtonElement>(), popup = ref<HTMLElement>();
const position = usePopupPosition(state.value, trigger, popup, () => p.placement ?? 'bottom');
const suppressed = ref(false);
let escaped = false, departed = false, tabDeparture = false, mounted = false;
const touching = ref(false);
function show(event?: PointerEvent) {
    if (event && (event.pointerType === 'touch' || !matchMedia('(hover:hover)').matches))
        return;
    if (!suppressed.value)
        state.request(true);
}
function key(e: KeyboardEvent) {
    if (e.defaultPrevented || e.isComposing || e.keyCode === 229)
        return;
    if (e.key === 'Escape' && state.value.value) {
        const active = document.activeElement;
        const other = active instanceof Element ? active.closest('[data-krds-component=tooltip][data-krds-part=root]') : null;
        if (other && other !== root.value)
            return;
        e.preventDefault();
        escaped = true;
        state.request(false);
    }
    if (e.key === 'Tab' && document.activeElement === trigger.value && suppressed.value)
        tabDeparture = true;
}
function keyup(event: KeyboardEvent) {
    if (event.key === 'Tab')
        tabDeparture = false;
}
function blur(event: FocusEvent) {
    if (suppressed.value && tabDeparture && event.relatedTarget instanceof Element && event.relatedTarget !== trigger.value)
        departed = true;
    tabDeparture = false;
    state.request(false);
}
watch(state.value, open => {
    if (!open && escaped) {
        escaped = false;
        suppressed.value = true;
        departed = false;
        tabDeparture = false;
        void nextTick(() => {
            if (mounted)
                restore(document, trigger.value ?? null, p.fallbackFocusId);
        });
    }
}, { flush: 'post' });
function focus() {
    if (touching.value)
        return;
    if (suppressed.value && departed) {
        suppressed.value = false;
        departed = false;
    }
    show();
}
function pointerLeave(event: PointerEvent) {
    if (event.pointerType !== 'touch') {
        state.request(false);
    }
}
function outside(e: PointerEvent) {
    if (p.touchToggle && !root.value?.contains(e.target as Node))
        state.request(false);
}
onMounted(() => { mounted = true; document.addEventListener('keydown', key); document.addEventListener('keyup', keyup); document.addEventListener('pointerdown', outside); });
onUnmounted(() => {
    mounted = false;
    document.removeEventListener('keydown', key);
    document.removeEventListener('keyup', keyup);
    document.removeEventListener('pointerdown', outside);
    if (state.value.value)
        restore(document, trigger.value ?? null, p.fallbackFocusId);
});
</script>
<template>
<span ref="root" data-krds-part="root" :data-krds-state="suppressed?'suppressed':state.value.value?'open':'closed'" @pointerenter="show" @pointerleave="pointerLeave" data-krds-component="tooltip">
<button ref="trigger" :id="triggerId" type="button" tabindex="0" data-krds-part="trigger" :aria-label="relationship==='label'?undefined:triggerLabel" :aria-labelledby="relationship==='label'?textId:undefined" :aria-describedby="relationship==='label'?undefined:textId" @pointerdown="touching=$event.pointerType==='touch'" @focus="focus" @blur="blur" @click="touchToggle&&state.request(!state.value.value);touching=false" data-krds-component="tooltip" data-krds-state="">
<slot>ⓘ</slot>
</button>
<span ref="popup" :id="textId" role="tooltip" :hidden="!state.value.value&&relationship!=='label'" :data-krds-placement="position.placement.value" data-krds-part="popup" :data-krds-state="state.value.value?'open':'closed'" :style="state.value.value?position.style.value:{position:'absolute',width:'1px',height:'1px',clipPath:'inset(50%)',overflow:'hidden',whiteSpace:'nowrap',display:relationship==='label'?'inline-block':undefined}" data-krds-component="tooltip">{{text}}</span>
</span>
</template>
