<script setup lang="ts">
import { watchEffect } from 'vue';
import type { SpinnerContract } from '@unofficial-krds/contracts';
const p = defineProps<SpinnerContract>();
watchEffect(() => {
    if (p.value !== undefined && (!Number.isFinite(p.value) || p.value < 0 || p.value > 100))
        throw new RangeError('Progress must be 0–100');
});
</script>
<template>
<div data-krds-component="spinner" data-krds-part="root" :data-krds-state="pending?'pending':'complete'" :aria-busy="pending" :data-krds-size="size??'medium'">
<progress v-if="pending" data-krds-component="spinner" data-krds-part="indicator" :data-krds-state="value===undefined?'indeterminate':'determinate'" :aria-label="label" max="100" :value="value" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="value"/>
<span data-krds-component="spinner" data-krds-part="label" data-krds-state=""><span role="status" aria-live="polite" data-krds-component="spinner" data-krds-part="status" data-krds-state="">{{pending?label:completionMessage}}</span></span>
</div>
</template>
