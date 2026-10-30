<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import type { BackButtonContract } from '@unofficial-krds/contracts';
const p = defineProps<BackButtonContract>();
const emit = defineEmits<{
    backRequest: [
        detail: {
            reason: 'activate' | 'confirmed';
        }
    ];
}>();
const pending = ref(false);
let disposed = false;
onUnmounted(() => disposed = true);
async function activate() {
    if (pending.value || !p.canGoBack)
        return;
    if (p.dirty) {
        if (!p.requestConfirmation)
            throw new TypeError('Dirty navigation requires confirmation');
        pending.value = true;
        try {
            const allowed = await p.requestConfirmation();
            if (allowed && !disposed)
                emit('backRequest', { reason: 'confirmed' });
        }
        finally {
            pending.value = false;
        }
    }
    else
        emit('backRequest', { reason: 'activate' });
}
async function fallback(event: MouseEvent) {
    if (pending.value) {
        event.preventDefault();
        return;
    }
    if (!p.dirty || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
        return;
    event.preventDefault();
    if (!p.requestConfirmation)
        throw new TypeError('Dirty navigation requires confirmation');
    const destination = p.fallbackHref;
    pending.value = true;
    try {
        const allowed = await p.requestConfirmation();
        if (allowed && !disposed && destination && destination === p.fallbackHref && !p.canGoBack)
            window.location.assign(destination);
    }
    finally {
        pending.value = false;
    }
}
</script>
<template>
<a v-if="!canGoBack&&fallbackHref" data-krds-part="root" :href="fallbackHref" @click="fallback" :aria-disabled="pending||undefined" :data-krds-state="pending?'pending-confirmation':''" data-krds-component="back-button">{{label??'뒤로가기'}}</a>
<button v-else type="button" data-krds-part="root" :data-krds-state="pending?'pending-confirmation':!canGoBack?'disabled':''" :disabled="!canGoBack" :aria-disabled="pending||undefined" @click="activate" data-krds-component="back-button">{{label??'뒤로가기'}}</button>
</template>
