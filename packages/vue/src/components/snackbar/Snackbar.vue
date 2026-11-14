<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import type { SnackbarContract } from '@unofficial-krds/contracts';
import { useNotificationLife } from '../notification-life';
import { canFocus, restore } from '../modal/stack';
const p = defineProps<SnackbarContract>();
const emit = defineEmits<{
    dismiss: [
        detail: {
            id: string;
            reason: 'close' | 'timeout';
            generation: number;
        }
    ];
    action: [
        detail: {
            id: string;
            generation: number;
            actionId: string;
        }
    ];
}>();
const root = ref<HTMLElement>(), hover = ref(false), focused = ref(false);
let initiator: HTMLElement | null = null;
let savedFocused = false;
const duration = computed(() => p.durationMs ?? null);
const generation = useNotificationLife(() => p.message ? JSON.stringify([p.message.id, p.message.title, p.message.text, p.message.error, p.action?.kind, p.action?.id, p.action?.label, p.action?.kind === 'link' ? p.action.href : null, duration.value]) : null, () => duration.value, () => hover.value || focused.value || Boolean(p.message?.actionPending), value => {
    if (p.message)
        emit('dismiss', { id: p.message.id, reason: 'timeout', generation: value });
});
function close() {
    if (p.message)
        emit('dismiss', { id: p.message.id, reason: 'close', generation: generation.value });
}
function requestAction() {
    if (p.message && p.action && !p.message.actionPending)
        emit('action', { id: p.message.id, generation: generation.value, actionId: p.action.id });
}
watch(() => [p.message?.id, p.action?.kind, p.action?.id, p.action?.kind === 'link' ? p.action.href : undefined], async (value, old) => {
    savedFocused = Boolean(root.value?.contains(document.activeElement));
    if (value[0] && !old?.[0])
        initiator = canFocus(document.activeElement) ? document.activeElement : null;
    await nextTick();
    focused.value = Boolean(root.value?.contains(document.activeElement));
    if (savedFocused && (!value[0] || !canFocus(document.activeElement))) {
        restore(document, initiator, p.fallbackFocusId);
    }
}, { flush: 'pre' });
onMounted(() => { initiator = canFocus(document.activeElement) ? document.activeElement : null; });
onUnmounted(() => {
    if (root.value?.contains(document.activeElement))
        restore(document, initiator, p.fallbackFocusId);
});
</script>
<template>
<div v-if="message" ref="root" data-krds-component="snackbar" data-krds-part="root" :data-krds-state="message.actionPending?'open action-pending':message.error?'open error':'open'" @pointerenter="hover=true" @pointerleave="hover=false" @focusin="focused=true" @focusout="focused=Boolean($event.relatedTarget&&root?.contains($event.relatedTarget as Node))">
<div role="status" aria-live="polite" aria-atomic="true">
<span v-if="message.icon" data-krds-component="snackbar" data-krds-part="icon" data-krds-state="" aria-hidden="true">{{message.icon}}</span>
<strong data-krds-component="snackbar" data-krds-part="title" data-krds-state="">{{message.title}}</strong>
<p data-krds-component="snackbar" data-krds-part="message" data-krds-state="">{{message.text}}</p>
<p v-if="message.error">{{message.error}}</p>
</div>
<a v-if="action?.kind==='link'" data-krds-component="snackbar" data-krds-part="action" data-krds-state="" :href="action.href" :target="action.target" :rel="action.target==='_blank'?[action.rel,'noopener noreferrer'].filter(Boolean).join(' '):action.rel">{{action.label}}{{action.target==='_blank'?' (새 창)':''}}</a>
<button v-else-if="action" type="button" data-krds-component="snackbar" data-krds-part="action" data-krds-state="" :disabled="message.actionPending" @click="requestAction()">{{p.action?.label}}</button>
<button type="button" data-krds-component="snackbar" data-krds-part="close" data-krds-state="" aria-label="알림 닫기" @click="close">닫기</button>
</div>
</template>
