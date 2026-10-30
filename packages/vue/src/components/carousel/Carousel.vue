<script setup lang="ts">
import { computed, nextTick, ref, onMounted, onUnmounted, watch, useId } from 'vue';
import type { CarouselContract } from '@unofficial-krds/contracts';
import { useOwned, uniqueIds } from '../catalog-state';
const p = withDefaults(defineProps<CarouselContract>(), { playing: undefined, defaultPlaying: undefined });
const emit = defineEmits<{
    indexChange: [
        detail: {
            index: number;
            reason: 'previous' | 'next' | 'indicator' | 'swipe' | 'timer';
        }
    ];
    playingChange: [
        detail: {
            playing: boolean;
            reason: 'play' | 'stop' | 'navigation';
        }
    ];
}>();
const indexReason = ref<'previous' | 'next' | 'indicator' | 'swipe' | 'timer'>('next'), playReason = ref<'play' | 'stop' | 'navigation'>('play');
const index = useOwned(() => p.index, () => p.defaultIndex, 0, value => emit('indexChange', { index: value, reason: indexReason.value }));
const playing = useOwned(() => p.playing, () => p.defaultPlaying, p.autoplay ?? false, value => emit('playingChange', { playing: value, reason: playReason.value }));
const root = ref<HTMLElement>(), hover = ref(false), latched = ref(false), hidden = ref(false), reduced = ref(false), mounted = ref(false), fraction = ref(false);
const id = useId();
let timer: ReturnType<typeof setInterval> | undefined, motionMedia: MediaQueryList | undefined, widthMedia: MediaQueryList | undefined;
let gesture: {
    id: number;
    x: number;
    y: number;
} | undefined;
const activeIndex = computed(() => Math.max(0, Math.min(index.value.value, Math.max(0, p.items.length - 1))));
const visibleCount = computed(() => p.layout === 'multiple' && !fraction.value ? Math.min(2, p.items.length) : Math.min(1, p.items.length));
const visibleIds = computed(() => { const start = Math.min(activeIndex.value, Math.max(0, p.items.length - visibleCount.value)); return p.items.slice(start, start + visibleCount.value).map(item => item.id); });
const canAdvance = computed(() => mounted.value && playing.value.value && p.items.length > 1 && (p.loop || activeIndex.value < p.items.length - 1) && !hover.value && !latched.value && !hidden.value && !reduced.value);
function visibility() { hidden.value = document.hidden; }
function motion() { reduced.value = motionMedia?.matches ?? false; }
function width() { fraction.value = widthMedia?.matches ?? false; }
function cleanup() {
    if (timer !== undefined) {
        clearInterval(timer);
        timer = undefined;
    }
}
function protectFocus() {
    const active = document.activeElement, slide = active instanceof HTMLElement ? active.closest<HTMLElement>('[data-krds-component="carousel"][data-krds-part="slide"]') : null;
    if (slide && root.value?.contains(slide) && !visibleIds.value.includes(slide.dataset.slideId ?? '')) {
        const button = root.value.querySelector<HTMLButtonElement>('[data-krds-part="play-pause"]');
        if (button)
            button.focus();
        else {
            const old = root.value.getAttribute('tabindex');
            root.value.tabIndex = -1;
            root.value.focus();
            if (old === null)
                root.value.removeAttribute('tabindex');
            else
                root.value.setAttribute('tabindex', old);
        }
    }
}
watch([visibleIds, () => p.items.map(item => item.id).join('\u0000')], protectFocus, { flush: 'pre' });
watch(() => p.items, items => uniqueIds(items), { deep: true, immediate: true });
function requestIndex(value: number, reason: typeof indexReason.value) {
    if (!p.items.length)
        return;
    const next = p.loop ? (value + p.items.length) % p.items.length : Math.max(0, Math.min(p.items.length - 1, value));
    if (next === activeIndex.value)
        return;
    if (reason !== 'timer') {
        latched.value = true;
        playReason.value = 'navigation';
        playing.request(false);
    }
    indexReason.value = reason;
    index.request(next);
}
function stopIntent() { latched.value = true; playReason.value = 'stop'; playing.request(false); }
function toggle() {
    if (canAdvance.value)
        stopIntent();
    else {
        latched.value = false;
        playReason.value = 'play';
        playing.request(true);
    }
}
function focus(event: FocusEvent) {
    if (!root.value?.contains(event.relatedTarget as Node))
        latched.value = true;
}
function down(event: PointerEvent) {
    if (event.button !== 0 || gesture || (event.target as Element).closest('a,button,input,select,textarea'))
        return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
}
function move(event: PointerEvent) {
    if (!gesture || gesture.id !== event.pointerId)
        return;
    const x = event.clientX - gesture.x, y = event.clientY - gesture.y;
    if (Math.abs(x) > 12 && Math.abs(x) > Math.abs(y)) {
        if (event.cancelable)
            event.preventDefault();
        try {
            (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
        }
        catch { /* Pointer may have been canceled by the browser's vertical scroll. */ }
    }
}
function up(event: PointerEvent) {
    if (!gesture || gesture.id !== event.pointerId)
        return;
    const x = event.clientX - gesture.x, y = event.clientY - gesture.y;
    gesture = undefined;
    if (Math.abs(x) >= 40 && Math.abs(x) > Math.abs(y))
        requestIndex(activeIndex.value + (x < 0 ? 1 : -1), 'swipe');
}
watch(canAdvance, active => {
    cleanup();
    if (active)
        timer = setInterval(() => {
            if (canAdvance.value)
                requestIndex(activeIndex.value + 1, 'timer');
        }, p.intervalMs ?? 6000);
});
onMounted(() => { mounted.value = true; hidden.value = document.hidden; motionMedia = matchMedia('(prefers-reduced-motion: reduce)'); widthMedia = matchMedia('(max-width: 1023px)'); motion(); width(); motionMedia.addEventListener('change', motion); widthMedia.addEventListener('change', width); document.addEventListener('visibilitychange', visibility); });
onUnmounted(() => { mounted.value = false; gesture = undefined; cleanup(); motionMedia?.removeEventListener('change', motion); widthMedia?.removeEventListener('change', width); document.removeEventListener('visibilitychange', visibility); });
</script>
<template>
<section ref="root" role="region" aria-roledescription="캐러셀" aria-label="주요 소식" data-krds-component="carousel" data-krds-part="root" :data-krds-state="canAdvance?'playing':'paused'" :data-krds-layout="layout??'single'" @pointerenter="hover=true" @pointerleave="hover=false" @focusin="focus">
<button v-if="items.length>1" type="button" data-krds-component="carousel" data-krds-part="play-pause" :data-krds-state="canAdvance?'playing':'paused'" @click="toggle">{{canAdvance?'정지':'재생'}}</button>
<button v-if="items.length>1&&playing.value.value&&!canAdvance" type="button" data-krds-component="carousel" data-krds-part="stop-intent" data-krds-state="paused" @click="stopIntent">자동 재생 중지</button>
<div data-krds-component="carousel" data-krds-part="viewport" :data-krds-state="canAdvance?'playing':'paused'" style="touch-action:pan-y" @pointerdown="down" @pointermove="move" @pointerup="up" @pointercancel="gesture=undefined">
<div data-krds-component="carousel" data-krds-part="list" data-krds-state="" :style="{display:'grid',gridTemplateColumns:`repeat(${Math.max(1,visibleCount)},minmax(0,1fr))`}">
<div v-for="(item,i) in items" :id="`${id}-${item.id}`" :key="item.id" data-krds-component="carousel" data-krds-part="slide" :data-slide-id="item.id" :data-slide-index="i" :data-krds-state="visibleIds.includes(item.id)?'active':'hidden'" role="group" aria-roledescription="슬라이드" :aria-label="`${i+1} / ${items.length}: ${item.label}`" :hidden="!visibleIds.includes(item.id)" :inert="!visibleIds.includes(item.id)">
<slot :name="item.id">{{item.content}}</slot>
</div>
</div>
</div>
<template v-if="items.length>1">
<button type="button" data-krds-component="carousel" data-krds-part="previous" data-krds-state="" aria-label="이전 슬라이드" :disabled="!loop&&activeIndex===0" @click="requestIndex(activeIndex-1,'previous')">이전</button>
<div v-if="!fraction" data-krds-component="carousel" data-krds-part="indicators" data-krds-state="">
<button v-for="(item,i) in items" :key="item.id" type="button" data-krds-component="carousel" data-krds-part="indicator" :data-krds-state="i===activeIndex?'active':''" :aria-label="`슬라이드 ${i+1}`" :aria-current="i===activeIndex?'true':undefined" @click="requestIndex(i,'indicator')" @keydown="['ArrowLeft','ArrowRight'].includes($event.key)&&!$event.isComposing&&requestIndex(activeIndex+($event.key==='ArrowRight'?1:-1),'indicator')">{{i+1}}</button>
</div>
<span v-else data-krds-component="carousel" data-krds-part="position" data-krds-state="">{{activeIndex+1}} / {{items.length}}</span>
<button type="button" data-krds-component="carousel" data-krds-part="next" data-krds-state="" aria-label="다음 슬라이드" :disabled="!loop&&activeIndex===items.length-1" @click="requestIndex(activeIndex+1,'next')">다음</button>
</template>
</section>
</template>
