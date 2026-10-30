<script setup lang="ts">
import { ref, computed, watch, nextTick, useId, onMounted } from 'vue';
import type { TutorialPanelContract, TutorialStopDetails } from '@unofficial-krds/contracts';
import { useOwned, restoreStop } from '../catalog-state';
import { useLayer } from '../catalog-layer';
import { restore } from '../modal/stack';
const p = withDefaults(defineProps<TutorialPanelContract & {
    startActionPresent?: boolean;
    openerId?: string;
}>(), { open: undefined, running: undefined, defaultOpen: undefined, defaultRunning: undefined, startActionPresent: true });
const emit = defineEmits<{
    start: [
        detail: {
            taskId: string;
            stepId: string;
        }
    ];
    openChange: [
        detail: {
            open: boolean;
        }
    ];
    taskChange: [
        detail: {
            id: string | null;
        }
    ];
    stepChange: [
        detail: {
            id: string | null;
        }
    ];
    activePanelChange: [
        detail: {
            value: 'help' | 'tutorial';
        }
    ];
    stop: [
        detail: TutorialStopDetails
    ];
}>();
const state = useOwned(() => p.open, () => p.defaultOpen, true, open => emit('openChange', { open }));
const running = useOwned(() => p.running, () => p.defaultRunning, false, () => { });
const active = useOwned(() => p.activePanel, () => p.defaultActivePanel, 'tutorial' as 'help' | 'tutorial', value => emit('activePanelChange', { value }));
const portal = ref<HTMLElement>(), dialog = ref<HTMLElement>(), opener = ref<HTMLButtonElement>();
let stopRequested = false;
onMounted(() => {
    if (p.open === undefined && p.defaultOpen === undefined)
        state.commit(!matchMedia('(max-width: 767px)').matches);
});
const layer = useLayer(state.value, portal, dialog, () => state.request(false), () => {
    if (!stopRequested)
        restore(document, opener.value ?? null, p.fallbackFocusId);
});
const id = useId();
function start() {
    if (running.value.value)
        return;
    const task = p.tasks.find(item => item.id === p.activeTaskId && item.steps.length) ?? p.tasks.find(item => item.steps.length);
    const step = task?.steps[0];
    if (!task || !step)
        return;
    running.commit(true);
    emit('start', { taskId: task.id, stepId: step.id });
}
function stop() {
    if (!running.value.value)
        return;
    stopRequested = true;
    if (!running.controlled) {
        running.commit(false);
        active.commit('tutorial');
        state.commit(true);
    }
    emit('stop', { reason: 'stop', running: false, returnTo: { panel: 'tutorial', open: true, startActionId: p.startActionId } });
    void nextTick(completeStop);
}
function completeStop() {
    if (stopRequested && !running.value.value) {
        stopRequested = false;
        void nextTick(() => restoreStop(p.startActionId, p.fallbackFocusId, opener.value));
    }
}
watch(running.value, completeStop, { flush: 'post' });
const task = computed(() => p.tasks.find(x => x.id === p.activeTaskId));
</script>
<template>
<div data-krds-host-shell="tutorial-panel" :data-krds-state="`${state.value.value?'open':'closed'} ${running.value.value?'running':'idle'}`">
<button ref="opener" :id="openerId" type="button" data-krds-part="opener" :aria-expanded="state.value.value" @click="state.request(true)" data-krds-component="tutorial-panel" data-krds-state="">튜토리얼 열기</button>
<Teleport to="body" :disabled="!layer.narrow.value">
<div v-if="state.value.value" ref="portal">
<div ref="dialog" tabindex="-1" :role="layer.narrow.value?'dialog':'complementary'" :aria-modal="layer.narrow.value?'true':undefined" aria-label="따라하기" data-krds-part="root" data-krds-component="tutorial-panel" :data-krds-state="`${state.value.value?'open':'closed'} ${running.value.value?'running':'idle'}`">
<header data-krds-part="header" data-krds-component="tutorial-panel" data-krds-state="">
<div role="tablist" data-krds-part="tabs" data-krds-component="tutorial-panel" data-krds-state="">
<button role="tab" type="button" :aria-selected="active.value.value==='help'" @click="active.request('help')">도움말</button>
<button role="tab" type="button" :aria-selected="active.value.value==='tutorial'" @click="active.request('tutorial')">튜토리얼</button>
</div>
<button type="button" data-krds-part="close" @click="state.request(false)" data-krds-component="tutorial-panel" data-krds-state="">튜토리얼 닫기</button>
</header>
<div :hidden="active.value.value!=='tutorial'">
<h2 data-krds-part="title" data-krds-component="tutorial-panel" data-krds-state="">따라하기</h2>
<button v-if="startActionPresent!==false" :id="startActionId" type="button" @click="start">따라하기 시작</button>
<button v-if="task" type="button" data-krds-part="back" @click="emit('taskChange',{id:null})" data-krds-component="tutorial-panel" data-krds-state="">목록으로</button>
<ul data-krds-part="task-list" data-krds-component="tutorial-panel" data-krds-state="">
<li v-for="item in tasks" :key="item.id" data-krds-part="task" data-krds-component="tutorial-panel" data-krds-state="">
<details :open="item.id===activeTaskId">
<summary>{{item.title}}</summary>
<ol data-krds-part="step-list" data-krds-component="tutorial-panel" data-krds-state="">
<li v-for="step in item.steps" :key="step.id" :aria-current="activeStepId===step.id?'step':undefined">
<button type="button" @click="emit('taskChange',{id:item.id});emit('stepChange',{id:step.id})">{{step.title}}</button>
<p>{{step.instruction}}</p>
</li>
</ol>
</details>
</li>
</ul>
</div>
<div :hidden="active.value.value!=='help'">
<slot name="help">
<p>진행 중에도 도움말을 확인할 수 있습니다.</p>
</slot>
</div>
<button v-if="running.value.value" type="button" data-krds-part="stop" @click="stop" data-krds-component="tutorial-panel" data-krds-state="">따라하기 중지</button>
</div>
</div>
</Teleport>
</div>
</template>
