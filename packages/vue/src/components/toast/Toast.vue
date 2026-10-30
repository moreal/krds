<script setup lang="ts">
import { computed } from 'vue';
import type { ToastContract } from '@unofficial-krds/contracts';
import { useNotificationLife } from '../notification-life';
const p = defineProps<ToastContract>();
const emit = defineEmits<{
    dismiss: [
        detail: {
            id: string;
            reason: 'timeout';
            generation: number;
        }
    ];
}>();
const duration = computed(() => p.durationMs ?? (p.message?.tone === 'warning' ? 4000 : 3000));
useNotificationLife(() => p.message ? JSON.stringify([p.message.id, p.message.text, p.message.tone, duration.value]) : null, () => duration.value, () => false, generation => {
    if (p.message)
        emit('dismiss', { id: p.message.id, reason: 'timeout', generation });
});
</script>
<template>
<div v-if="message" data-krds-part="root" :data-krds-state="`open ${message.tone}`" :data-krds-tone="message.tone" data-krds-component="toast">
<p data-krds-part="message" :data-krds-state="message.tone" role="status" aria-live="polite" data-krds-component="toast">{{message.text}}</p>
</div>
</template>
