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
<div v-if="message" ref="root" data-krds-part="root" :data-krds-state="`open ${message.actionPending?'action-pending':''} ${message.error?'error':''}`" @pointerenter="hover=true" @pointerleave="hover=false" @focusin="focused=true" @focusout="focused=Boolean($event.relatedTarget&&root?.contains($event.relatedTarget as Node))" data-krds-component="snackbar">
<div data-krds-part="message" role="status" aria-live="polite" data-krds-component="snackbar" data-krds-state="">
<span v-if="message.icon" data-krds-part="icon" aria-hidden="true" data-krds-component="snackbar" data-krds-state="">{{message.icon}}</span>
<strong data-krds-part="title" data-krds-component="snackbar" data-krds-state="">{{message.title}}</strong>
<p>{{message.text}}</p>
<p v-if="message.error">{{message.error}}</p>
</div>
<a v-if="action?.kind==='link'" data-krds-part="action" :href="action.href" :target="action.target" :rel="action.target==='_blank'?[action.rel,'noopener noreferrer'].filter(Boolean).join(' '):action.rel" :aria-description="action.target==='_blank'?'새 창에서 열기':undefined" data-krds-component="snackbar" data-krds-state="">{{action.label}}</a>
<button v-else-if="action" data-krds-part="action" type="button" :disabled="message.actionPending" @click="requestAction()" data-krds-component="snackbar" data-krds-state="">{{p.action?.label}}</button>
<button data-krds-part="close" type="button" aria-label="알림 닫기" @click="close" data-krds-component="snackbar" data-krds-state="">닫기</button>
</div>
</template>
