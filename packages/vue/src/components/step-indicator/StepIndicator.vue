<script setup lang="ts">
import type { StepIndicatorContract } from '@unofficial-krds/contracts';
const p = defineProps<StepIndicatorContract>();
const emit = defineEmits<{
    stepRequest: [
        detail: {
            id: string;
        }
    ];
}>();
</script>
<template>
<ol data-krds-component="step-indicator" data-krds-part="root" data-krds-state="" aria-label="진행 단계" :data-krds-mode="mode??'sequential'">
<li v-for="(step,index) in steps" :key="step.id" data-krds-component="step-indicator" data-krds-part="item" :data-krds-state="step.status" :aria-current="step.status==='current'?'step':undefined">
<span data-krds-component="step-indicator" data-krds-part="number" data-krds-state="">{{index+1}}</span>
<a v-if="step.href&&(mode==='adaptive'||step.status==='complete')" data-krds-component="step-indicator" data-krds-part="label" data-krds-state="" :href="step.href">{{step.label}}</a>
<button v-else-if="!step.href&&p.onStepRequest&&(mode==='adaptive'||step.status==='complete')" type="button" data-krds-component="step-indicator" data-krds-part="label" data-krds-state="" @click="emit('stepRequest',{id:step.id})">{{step.label}}</button>
<span v-else data-krds-component="step-indicator" data-krds-part="label" data-krds-state="">{{step.label}}</span>
<span data-krds-component="step-indicator" :data-krds-part="step.status==='complete'?'complete-indicator':'current-indicator'" data-krds-state="">{{step.status==='complete'?'완료':step.status==='current'?'현재 단계':'예정'}}</span>
</li>
</ol>
</template>
