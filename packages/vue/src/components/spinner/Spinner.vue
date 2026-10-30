<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import type { SpinnerContract } from '@unofficial-krds/contracts';
const p = defineProps<SpinnerContract>();
watchEffect(() => {
    if (p.value !== undefined && (!Number.isFinite(p.value) || p.value < 0 || p.value > 100))
        throw new RangeError('Progress must be 0–100');
});
const state = computed(() => `${p.pending ? 'pending' : 'complete'} ${p.value === undefined ? 'indeterminate' : 'determinate'}`);
</script>
<template>
<div data-krds-part="root" :data-krds-state="state" :data-krds-size="size??'medium'" data-krds-component="spinner">
<span v-if="pending" data-krds-part="track" :data-krds-state="state" role="progressbar" :aria-label="label" :aria-valuemin="value===undefined?undefined:0" :aria-valuemax="value===undefined?undefined:100" :aria-valuenow="value" data-krds-component="spinner">
<span data-krds-part="indicator" :data-krds-state="state" aria-hidden="true" :style="{'--krds-progress':`${value??25}%`}" data-krds-component="spinner"/>
</span>
<span data-krds-part="status" :data-krds-state="pending?'pending':'complete'" role="status" aria-live="polite" data-krds-component="spinner">{{pending?label:completionMessage}}</span>
</div>
</template>
