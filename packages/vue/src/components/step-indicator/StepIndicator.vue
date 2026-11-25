<script setup lang="ts">
import { computed } from 'vue';
import type { StepIndicatorContract } from '@unofficial-krds/contracts';
const p = defineProps<StepIndicatorContract>();
const current = computed(() => p.steps.findIndex(step => step.status === 'current') + 1);
const emit = defineEmits<{
    stepRequest: [
        detail: {
            id: string;
        }
    ];
}>();
</script>
<template>
<div data-krds-component="step-indicator" data-krds-part="root" data-krds-state="" :data-krds-mode="mode??'sequential'">
<ol data-krds-component="step-indicator" data-krds-part="list" data-krds-state="" aria-label="진행 단계">
<li v-for="(step,index) in steps" :key="step.id" data-krds-component="step-indicator" data-krds-part="item" :data-krds-state="step.status" :aria-current="step.status==='current'?'step':undefined">
<span data-krds-component="step-indicator" data-krds-part="number" data-krds-state="">{{index+1}}</span>
<a v-if="step.href&&(mode==='adaptive'||step.status==='complete')" data-krds-component="step-indicator" data-krds-part="label" data-krds-state="" :href="step.href">{{step.label}}</a>
<button v-else-if="!step.href&&p.onStepRequest&&(mode==='adaptive'||step.status==='complete')" type="button" data-krds-component="step-indicator" data-krds-part="label" data-krds-state="" @click="emit('stepRequest',{id:step.id})">{{step.label}}</button>
<span v-else data-krds-component="step-indicator" data-krds-part="label" data-krds-state="">{{step.label}}</span>
<span data-krds-component="step-indicator" :data-krds-part="step.status==='complete'?'complete-indicator':'current-indicator'" data-krds-state="">{{step.status==='complete'?'완료':step.status==='current'?'현재 단계':'예정'}}</span>
</li>
</ol>
<p v-if="current>0" data-krds-component="step-indicator" data-krds-internal="summary">{{`${steps.length}단계 중 ${current}단계`}}</p>
</div>
</template>
