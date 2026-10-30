<script setup lang="ts">
import { computed, reactive, onUnmounted, nextTick } from 'vue';
import { TutorialPanel, CoachMark, type CoachMarkStep, type TutorialStopDetails } from '@unofficial-krds/vue';
const p = defineProps<{
    componentId: 'tutorial-panel' | 'coach-mark';
    state: Record<string, any>;
    emit: (name: string, detail: unknown, next?: Record<string, any>) => void;
    patch: (next: Record<string, any>) => void;
}>();
const s = computed(() => p.state), host = computed(() => s.value.__host ?? {});
const tutorial = computed(() => p.componentId === 'tutorial-panel');
const linked = computed(() => tutorial.value || host.value.linkedTutorial === true);
const steps = computed<readonly CoachMarkStep[]>(() => s.value.steps ?? s.value.tasks?.find((task: any) => task.id === s.value.activeTaskId)?.steps ?? s.value.tasks?.[0]?.steps ?? []);
const tasks = computed(() => s.value.tasks ?? [{ id: 'apply', title: '예제 신청하기', steps: steps.value }]);
const running = computed(() => linked.value ? Boolean(s.value.running ?? s.value.defaultRunning ?? host.value.running ?? s.value.open ?? s.value.defaultOpen ?? tutorial.value) : Boolean(s.value.open ?? s.value.defaultOpen ?? false));
const panelOpen = computed(() => !linked.value ? false : tutorial.value ? Boolean(s.value.open ?? s.value.defaultOpen ?? true) : Boolean(s.value.__tutorialOpen ?? host.value.initialPanelOpen ?? host.value.panelOpen ?? (host.value.layout === 'narrow-modal')));
const activePanel = computed<'help' | 'tutorial'>(() => s.value.activePanel ?? s.value.__tutorialActivePanel ?? host.value.activePanel ?? (host.value.layout === 'narrow-modal' && !tutorial.value ? 'help' : 'tutorial'));
const currentStep = computed(() => tutorial.value ? s.value.activeStepId : s.value.stepId ?? s.value.defaultStepId ?? steps.value[0]?.id);
const boundaries = computed(() => s.value.boundaries ?? steps.value.map(step => ({ targetId: step.targetId, insertionBoundaryId: `${step.targetId}-after` })));
const narrowHelp = computed(() => linked.value && host.value.layout === 'narrow-modal' && !tutorial.value);
const values = reactive<Record<string, string>>({ ...host.value.targetInputs });
const result = reactive({ verified: false });
function panelChanged(detail: {
    open: boolean;
}) {
    if (tutorial.value)
        p.emit('openChange', detail, { open: detail.open });
    else
        p.patch({ __tutorialOpen: detail.open });
}
function panelSelected(detail: {
    value: 'help' | 'tutorial';
}) { p.emit('activePanelChange', detail, tutorial.value ? { activePanel: detail.value } : { __tutorialActivePanel: detail.value }); }
function stopped(detail: TutorialStopDetails) {
    p.emit('stop', detail);
    if (host.value.acceptStop === false || host.value.acceptRunningFalse === false)
        return;
    const next: Record<string, any> = { running: false };
    if (host.value.acceptOpenTrue !== false && host.value.acceptPanelExposure !== false)
        next[tutorial.value ? 'open' : '__tutorialOpen'] = true;
    if (host.value.acceptTutorialTab !== false && host.value.acceptPanelExposure !== false)
        next[tutorial.value ? 'activePanel' : '__tutorialActivePanel'] = 'tutorial';
    p.patch(next);
}
function stepChanged(detail: {
    id: string;
    reason: 'previous' | 'next' | 'target-action';
}) { p.emit('stepChange', detail, { [tutorial.value ? 'activeStepId' : 'stepId']: detail.id }); }
async function verify() { await nextTick(); return host.value.targetActionVerified === true && result.verified; }
function activateTarget() { result.verified = host.value.targetActionVerified === true; }
function start() { p.emit('openChange', { open: true }, { open: true }); }
function coachOpenChanged(detail: { open: boolean }) {
    p.emit('openChange', detail, detail.open || host.value.acceptStop !== false ? { open: detail.open } : undefined);
}
onUnmounted(() => {
    queueMicrotask(() => {
        const active = document.activeElement;
        if (!active || active === document.body) {
            const fallback = document.getElementById(s.value.fallbackFocusId);
            if (fallback instanceof HTMLElement && fallback.isConnected && !fallback.closest('[inert]'))
                fallback.focus();
        }
    });
});
</script>
<template>
<div>
<button v-if="!tutorial&&!host.linkedTutorial&&!panelOpen&&!running" :id="state.startActionId" type="button" @click="start">따라하기 시작</button>
<TutorialPanel v-if="linked" :tasks="tasks" :active-task-id="state.activeTaskId??'apply'" :active-step-id="currentStep??null" :open="panelOpen" :running="running" :active-panel="activePanel" :start-action-id="state.startActionId" :start-action-present="host.startActionPresent!==false" opener-id="tutorial-panel-opener" :fallback-focus-id="state.fallbackFocusId" @start="emit('start',$event,{running:true,activeTaskId:$event.taskId,activeStepId:$event.stepId})" @open-change="panelChanged" @active-panel-change="panelSelected" @task-change="emit('taskChange',$event,{activeTaskId:$event.id})" @step-change="emit('stepChange',$event,{activeStepId:$event.id})" @stop="stopped">
<template #help>
<button type="button" :id="`${state.fallbackFocusId}-inside`">도움말 내부 작업</button>
<template v-if="narrowHelp">
<template v-for="item in steps" :key="item.id">
<label :for="item.targetId">{{item.title}}</label>
<button v-if="item.requiresAction&&!host.targetRemoved" :id="item.targetId" type="button" @click="activateTarget">{{item.title}}</button>
<input v-else-if="!host.targetRemoved" :id="item.targetId" v-model="values[item.targetId]" :aria-label="item.title"/>
<span :id="boundaries.find((boundary:any)=>boundary.targetId===item.targetId)?.insertionBoundaryId"/>
</template>
</template>
</template>
</TutorialPanel>
<template v-if="!narrowHelp">
<template v-for="item in steps" :key="item.id">
<label :for="item.targetId">{{item.title}}</label>
<button v-if="item.requiresAction&&!host.targetRemoved" :id="item.targetId" type="button" @click="activateTarget">{{item.title}}</button>
<input v-else-if="!host.targetRemoved" :id="item.targetId" v-model="values[item.targetId]" :aria-label="item.title"/>
<span :id="boundaries.find((boundary:any)=>boundary.targetId===item.targetId)?.insertionBoundaryId"/>
</template>
</template>
<CoachMark :steps="steps" :boundaries="boundaries" :open="running" :step-id="currentStep??steps[0]?.id??''" :start-action-id="state.startActionId" :return-panel-opener-id="linked?'tutorial-panel-opener':undefined" :fallback-focus-id="state.fallbackFocusId" :on-target-action="verify" @step-change="stepChanged" v-on="linked?{stop:stopped}:{}" @open-change="coachOpenChanged"/>
</div>
</template>

<style scoped>
input{max-inline-size:100%;min-inline-size:0;box-sizing:border-box;}
</style>
