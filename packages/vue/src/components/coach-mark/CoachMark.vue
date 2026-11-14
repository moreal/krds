<script setup lang="ts">
import { computed, ref, useId, watch, nextTick, onMounted, onUnmounted } from 'vue';
import type { CoachMarkContract, TutorialStopDetails } from '@unofficial-krds/contracts';
import { useOwned, restoreStop } from '../catalog-state';
const p = withDefaults(defineProps<CoachMarkContract & {
    returnPanelOpenerId?: string;
}>(), { open: undefined, defaultOpen: undefined });
const emit = defineEmits<{
    openChange: [
        detail: {
            open: boolean;
        }
    ];
    stepChange: [
        detail: {
            id: string;
            reason: 'previous' | 'next' | 'target-action';
        }
    ];
    stop: [
        detail: TutorialStopDetails
    ];
}>();
const state = useOwned(() => p.open, () => p.defaultOpen, false, open => emit('openChange', { open }));
const reason = ref<'previous' | 'next' | 'target-action'>('next');
const step = useOwned(() => p.stepId, () => p.defaultStepId, p.steps[0]?.id ?? '', id => emit('stepChange', { id, reason: reason.value }));
const current = computed(() => p.steps.find(x => x.id === step.value.value));
const boundary = ref<HTMLElement>(), target = ref<HTMLElement>(), missing = ref(false), pending = ref(false), heading = ref<HTMLElement>();
const rect = ref({ left: 0, top: 0, width: 0, height: 0 });
defineOptions({ inheritAttrs: false });
const uid = useId();
const ready = computed(() => !!target.value && !!boundary.value);
const titleId = computed(() => current.value ? `${current.value.id}-coach-title` : `${uid}-coach-title`);
let observer: MutationObserver | undefined;
let resize: ResizeObserver | undefined;
let generation = 0;
let mounted = false;
let saved: HTMLElement | null = null;
let stopped = false;
let enteredStep: string | undefined;
function enterStep() {
    const key = current.value?.id;
    if (key === enteredStep)
        return;
    enteredStep = key;
    void nextTick(() => {
        if (mounted && state.value.value && current.value?.id === key)
            heading.value?.focus();
    });
}
for (const item of p.steps)
    if (item.requiresAction && !p.onTargetAction)
        throw new TypeError('Action-gated coach requires host verifier');
function unbind() {
    enteredStep = undefined;
    generation++;
    pending.value = false;
    if (target.value) {
        target.value.removeEventListener('click', action);
        target.value.removeEventListener('change', action);
    }
    resize?.disconnect();
    target.value = undefined;
    boundary.value = undefined;
}
function measure() {
    if (!target.value)
        return;
    const box = target.value.getBoundingClientRect();
    rect.value = { left: box.left, top: box.top, width: box.width, height: box.height };
}
function resolve() {
    if (!mounted || !state.value.value)
        return;
    const related = current.value;
    if (!related)
        return;
    const record = p.boundaries.find(x => x.targetId === related.targetId);
    const nextTarget = document.getElementById(related.targetId);
    const nextBoundary = record ? document.getElementById(record.insertionBoundaryId) : null;
    const valid = nextTarget instanceof HTMLElement && nextBoundary instanceof HTMLElement && nextTarget.getRootNode() === nextBoundary.getRootNode() && nextTarget.nextElementSibling === nextBoundary;
    if (target.value === nextTarget && boundary.value === nextBoundary && valid) {
        enterStep();
        return;
    }
    unbind();
    missing.value = !valid;
    if (!valid)
        return;
    target.value = nextTarget;
    boundary.value = nextBoundary;
    target.value.addEventListener('click', action);
    target.value.addEventListener('change', action);
    resize = new ResizeObserver(measure);
    resize.observe(target.value);
    target.value.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    measure();
    enterStep();
}
async function action(e: Event) {
    const related = current.value;
    if (!state.value.value || !related?.requiresAction || pending.value || (e as InputEvent).isComposing)
        return;
    const native = e.target as HTMLElement;
    const isCheck = native.matches('input,textarea,select');
    if (isCheck && e.type !== 'change' || !isCheck && e.type !== 'click')
        return;
    pending.value = true;
    const token = generation, id = related.id, actualTarget = target.value;
    await nextTick();
    try {
        const accepted = await p.onTargetAction?.({ stepId: id, targetId: related.targetId });
        if (!mounted || token !== generation || !state.value.value || current.value?.id !== id || target.value !== actualTarget || !actualTarget?.isConnected)
            return;
        if (accepted === true)
            advance('target-action');
    }
    catch { /* A declined or failed host verifier does not advance. */ }
    finally {
        if (token === generation)
            pending.value = false;
    }
}
function advance(why: 'next' | 'target-action') {
    const index = p.steps.findIndex(x => x.id === step.value.value);
    if (current.value?.requiresAction && why !== 'target-action')
        return;
    const next = p.steps[index + 1];
    if (next) {
        reason.value = why;
        step.request(next.id);
    }
    else
        stop('finish');
}
function previous() {
    const index = p.steps.findIndex(x => x.id === step.value.value);
    if (index > 0) {
        reason.value = 'previous';
        step.request(p.steps[index - 1]!.id);
    }
}
function stop(why: 'stop' | 'finish' | 'target-removed' | 'route-change') {
    if (!state.value.value)
        return;
    stopped = true;
    if (p.onStop)
        emit('stop', { reason: why, running: false, returnTo: { panel: 'tutorial', open: true, startActionId: p.startActionId } });
    else
        state.request(false);
    void nextTick(() => {
        if (!state.value.value && stopped) {
            stopped = false;
            restoreStop(p.startActionId, p.fallbackFocusId, p.returnPanelOpenerId ? document.getElementById(p.returnPanelOpenerId) : saved);
        }
    });
}
function key(e: KeyboardEvent) {
    if (e.key === 'Escape' && state.value.value && !e.isComposing && !e.defaultPrevented) {
        e.preventDefault();
        stop('stop');
    }
}
watch([state.value, step.value], async ([open], [oldOpen]) => {
    generation++;
    if (!open) {
        unbind();
        if (oldOpen && stopped) {
            stopped = false;
            await nextTick();
            restoreStop(p.startActionId, p.fallbackFocusId, p.returnPanelOpenerId ? document.getElementById(p.returnPanelOpenerId) : saved);
        }
    }
    else {
        await nextTick();
        resolve();
    }
}, { flush: 'post' });
onMounted(() => { mounted = true; saved = document.activeElement instanceof HTMLElement ? document.activeElement : null; observer = new MutationObserver(resolve); observer.observe(document.body, { childList: true, subtree: true }); document.addEventListener('keydown', key); window.addEventListener('scroll', measure, true); window.addEventListener('resize', measure); resolve(); });
onUnmounted(() => { mounted = false; observer?.disconnect(); unbind(); document.removeEventListener('keydown', key); window.removeEventListener('scroll', measure, true); window.removeEventListener('resize', measure); });
</script>
<template>
<Teleport v-if="state.value.value&&(ready||missing)" :to="boundary" :disabled="!boundary">
<div v-bind="$attrs" data-krds-component="coach-mark" data-krds-part="root" :data-krds-state="!ready?'open missing-target':pending?'open waiting':'open current-step'">
<div v-if="target" data-krds-part="spotlight" data-krds-state="" aria-hidden="true" :style="{left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`}" data-krds-component="coach-mark"/>
<div data-krds-component="coach-mark" data-krds-part="popover" :data-krds-state="!ready?'missing-target':pending?'waiting':''" role="region" :aria-labelledby="titleId">
<h3 :id="titleId" ref="heading" tabindex="-1" data-krds-part="title" data-krds-component="coach-mark" data-krds-state="">{{current?.title}}</h3>
<p data-krds-part="instruction" data-krds-component="coach-mark" data-krds-state="">{{ready?current?.instruction:'대상을 찾을 수 없습니다. 따라하기를 중지하거나 화면을 확인하세요.'}}</p>
<p data-krds-part="position" data-krds-component="coach-mark" data-krds-state="">{{steps.findIndex(x=>x.id===current?.id)+1}} / {{steps.length}}</p>
<div data-krds-part="actions" data-krds-component="coach-mark" data-krds-state="">
<button type="button" data-krds-part="stop" @click="stop('stop')" data-krds-component="coach-mark" data-krds-state="">그만보기</button>
<button type="button" data-krds-part="previous" :hidden="steps[0]?.id===current?.id" :disabled="!ready" @click="previous" data-krds-component="coach-mark" data-krds-state="">이전</button>
<button type="button" data-krds-part="next" :disabled="current?.requiresAction||pending||!ready" @click="advance('next')" data-krds-component="coach-mark" data-krds-state="">{{steps.length===1?'확인':steps.at(-1)?.id===current?.id?'마치기':'다음'}}</button>
</div>
</div>
</div>
</Teleport>
</template>
