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
<ol data-krds-part="root" :data-krds-mode="mode??'sequential'" data-krds-component="step-indicator" data-krds-state="">
<li v-for="(step,index) in steps" :key="step.id" data-krds-part="item" :data-krds-state="step.status" :aria-current="step.status==='current'?'step':undefined" data-krds-component="step-indicator">
<span data-krds-part="number" :data-krds-state="step.status" data-krds-component="step-indicator">{{index+1}}</span>
<a v-if="step.href&&(mode==='adaptive'||step.status!=='pending')" data-krds-part="label" :href="step.href" data-krds-component="step-indicator" data-krds-state="">{{step.label}}</a>
<button v-else-if="p.onStepRequest&&(mode==='adaptive'||step.status!=='pending')" type="button" data-krds-part="label" @click="emit('stepRequest',{id:step.id})" data-krds-component="step-indicator" data-krds-state="">{{step.label}}</button>
<span v-else data-krds-part="label" data-krds-component="step-indicator" data-krds-state="">{{step.label}}</span>
<span v-if="step.status==='complete'" data-krds-part="complete-indicator" data-krds-state="complete" data-krds-component="step-indicator">완료</span>
<span v-if="step.status==='current'" data-krds-part="current-indicator" data-krds-state="current" data-krds-component="step-indicator">현재 단계</span>
<span v-if="index<steps.length-1" data-krds-part="connector" aria-hidden="true" data-krds-component="step-indicator" data-krds-state="">→</span>
</li>
</ol>
</template>
