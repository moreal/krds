<script setup lang="ts">
import type { LinkContract } from '@unofficial-krds/contracts';
const p = defineProps<LinkContract>();
const emit = defineEmits<{
    click: [
        event: MouseEvent
    ];
}>();
function activate(event: MouseEvent) {
    if (p.disabled) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
    }
    emit('click', event);
}
</script>
<template>
<a :style="{textDecoration:underline===false?'none':undefined}" data-krds-part="root" :href="disabled?undefined:href" :aria-disabled="disabled?'true':undefined" :role="disabled?'link':undefined" :target="disabled?undefined:target" :rel="target==='_blank'?[rel,'noopener noreferrer'].filter(Boolean).join(' '):rel" :data-krds-state="disabled?'disabled':target==='_blank'?'external':''" :data-krds-appearance="appearance??'basic'" :data-krds-size="size??'medium'" @click="activate" data-krds-component="link">
<span data-krds-part="label" data-krds-component="link" data-krds-state=""><slot>{{label}}</slot></span><span v-if="target==='_blank'" data-krds-part="icon" data-krds-component="link" data-krds-state=""> (새 창)</span>
</a>
</template>
