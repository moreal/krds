<script setup lang="ts">
import { useId, watchEffect } from 'vue';
import type { TabBarContract } from '@unofficial-krds/contracts';
import Badge from '../badge/Badge.vue';
const p = defineProps<TabBarContract>();
const id = useId();
watchEffect(() => {
    if (p.items.length + (p.menuAction ? 1 : 0) > 5)
        throw new RangeError('Tab bar supports up to five total items');
});
</script>
<template>
<nav style="position:fixed;inset-inline:0;bottom:0;z-index:50" aria-label="하단 탐색" data-krds-part="root" data-krds-component="tab-bar" data-krds-state="">
<ul data-krds-part="list" data-krds-component="tab-bar" data-krds-state="">
<li v-for="item in items" :key="item.id" data-krds-part="item" :data-krds-state="item.id===currentId?'current':''" data-krds-component="tab-bar">
<a :aria-label="item.label" :aria-describedby="item.badge!==undefined?`${id}-${item.id}-badge`:undefined" data-krds-part="link" :href="item.href" :aria-current="item.id===currentId?'page':undefined" :data-krds-state="item.id===currentId?'current':''" data-krds-component="tab-bar">
<span data-krds-component="tab-bar" data-krds-part="icon" data-krds-state="" aria-hidden="true">
<slot name="icon" :item="item">
<svg viewBox="0 0 24 24" width="24" height="24" :fill="item.id===currentId?'currentColor':'none'" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round">
<path :d="item.icon==='home'?'M3 10 12 3l9 7v11h-6v-7H9v7H3Z':item.icon==='person'?'M8 7a4 4 0 1 0 8 0 4 4 0 1 0-8 0M4 22v-3a8 8 0 0 1 16 0v3Z':item.icon==='search'?'M10 3a7 7 0 1 0 0 14 7 7 0 1 0 0-14M15 15l6 6':'M6 3h9l4 4v14H6ZM9 11h7M9 15h7'"/>
</svg>
</slot>
</span>
<span v-if="item.id===currentId" data-krds-component="tab-bar" data-krds-part="indicator" data-krds-state="current" aria-hidden="true">●</span>
<span data-krds-part="label" data-krds-component="tab-bar" data-krds-state="">{{item.label}}</span>

</a>
<span v-if="item.badge!==undefined" :id="`${id}-${item.id}-badge`" data-krds-component="tab-bar" data-krds-part="badge" data-krds-state="" style="position:absolute;inset-inline-end:0.5rem;top:0;border:0;padding:0">
<Badge v-if="item.badge!==undefined" :label="String(item.badge)" numeric/>
</span>
</li>
<li v-if="menuAction">
<button data-krds-part="menu-trigger" type="button" @click="menuAction.onRequest()" data-krds-component="tab-bar" data-krds-state="">{{menuAction.label}}</button>
</li>
</ul>
</nav>
</template>
