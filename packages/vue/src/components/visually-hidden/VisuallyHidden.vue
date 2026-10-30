<script setup lang="ts">
import { computed, cloneVNode, useSlots, ref } from 'vue';
import type { VisuallyHiddenContract } from '@unofficial-krds/contracts';
defineProps<VisuallyHiddenContract>();
const focused = ref(false);
const slots = useSlots();
const overlay = computed(() => { const node = slots.default?.().find(node => typeof node.type === 'string' && ['input', 'button', 'select', 'textarea'].includes(node.type)); return node ? cloneVNode(node, { 'data-krds-component': 'visually-hidden', 'data-krds-part': 'overlay-control', 'data-krds-state': 'interactive-overlay', style: { position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, margin: 0 } }) : null; });
</script>
<template>
<span :id="id" :lang="lang" data-krds-part="root" :data-krds-state="variant??'text'" :data-krds-variant="variant??'text'" @focusin="focused=true" @focusout="focused=false" :style="variant==='interactive-overlay'?{position:'relative',display:'inline-grid'}:{position:'absolute',width:'1px',height:'1px',clipPath:'inset(50%)',overflow:'hidden',whiteSpace:'nowrap'}" data-krds-component="visually-hidden">
<template v-if="variant==='interactive-overlay'">
<span :style="{outline:focused?'2px solid currentColor':undefined,outlineOffset:'3px'}" data-krds-part="visible-surrogate" data-krds-component="visually-hidden" data-krds-state="">
<slot name="surrogate">{{content}}</slot>
</span>
<component :is="overlay"/>
</template>
<slot v-else>{{content}}</slot>
</span>
</template>
