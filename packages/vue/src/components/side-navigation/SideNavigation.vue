<script setup lang="ts">
import { computed, ref, useId, nextTick, watch } from 'vue';
import type { SideNavigationContract, NavigationItem } from '@unofficial-krds/contracts';
import { useOwned } from '../catalog-state';
const p = defineProps<SideNavigationContract>();
const emit = defineEmits<{
    expandedChange: [
        detail: {
            ids: readonly string[];
        }
    ];
}>();
function pathTo(items: readonly NavigationItem[], key?: string): NavigationItem[] {
    for (const item of items) {
        if (item.id === key)
            return [item];
        const child = pathTo(item.children ?? [], key);
        if (child.length)
            return [item, ...child];
    }
    return [];
}
const currentPath = pathTo(p.items, p.currentId), context = ref(currentPath.length > 2 ? currentPath.slice(0, -2).map(item => item.id) : []);
const state = useOwned(() => p.expandedIds, () => p.defaultExpandedIds, currentPath.slice(0, -1).map(item => item.id) as readonly string[], ids => emit('expandedChange', { ids }));
const id = useId(), heading = ref<HTMLElement>();
const scope = computed(() => context.value.length ? pathTo(p.items, context.value.at(-1)).at(-1) : undefined);
const items = computed(() => scope.value?.children ?? p.items);
function toggle(key: string) { state.request(state.value.value.includes(key) ? state.value.value.filter(value => value !== key) : [...state.value.value, key]); }
function drill(item: NavigationItem) { context.value = [...context.value, item.id]; void nextTick(() => heading.value?.focus()); }
function back() { const previous = context.value.at(-1); context.value = context.value.slice(0, -1); void nextTick(() => document.getElementById(`${id}-${previous}-drill`)?.focus()); }
watch(state.value, (ids, old) => {
    for (const key of old ?? []) {
        const panel = document.getElementById(`${id}-${key}-children`);
        if (!ids.includes(key) && panel?.contains(document.activeElement))
            void nextTick(() => document.getElementById(`${id}-${key}`)?.focus());
    }
});
</script>
<template>
<nav data-krds-component="side-navigation" data-krds-part="root" data-krds-state="" :aria-label="title??'사이드 메뉴'">
<h2 v-if="scope||title" ref="heading" tabindex="-1" data-krds-component="side-navigation" data-krds-part="header" data-krds-state="">{{scope?.label??title}}</h2>
<button v-if="context.length" type="button" data-krds-component="side-navigation" data-krds-part="parent-link" data-krds-state="" @click="back">상위 메뉴</button>
<a v-else-if="parentLink" data-krds-component="side-navigation" data-krds-part="parent-link" data-krds-state="" :href="parentLink.href" :target="parentLink.target" :rel="parentLink.target==='_blank'?[parentLink.rel,'noopener noreferrer'].filter(Boolean).join(' '):parentLink.rel">{{parentLink.label}}<span v-if="parentLink.target==='_blank'"> (새 창)</span>
</a>
<ul data-krds-component="side-navigation" data-krds-part="list" data-krds-state="">
<li v-for="item in items" :key="item.id" data-krds-component="side-navigation" data-krds-part="item" :data-krds-state="item.children?.length&&state.value.value.includes(item.id)?'expanded':'collapsed'">
<a v-if="item.href" data-krds-component="side-navigation" data-krds-part="link" :data-krds-state="item.id===currentId?'current':''" :href="item.href" :aria-current="item.id===currentId?'page':undefined">{{item.label}}</a>
<span v-else-if="!item.children?.length">{{item.label}}</span>
<template v-if="item.children?.length">
<button :id="`${id}-${item.id}`" type="button" data-krds-component="side-navigation" data-krds-part="trigger" data-krds-state="" :aria-expanded="state.value.value.includes(item.id)" :aria-controls="`${id}-${item.id}-children`" @click="toggle(item.id)">{{item.label}} {{state.value.value.includes(item.id)?'접기':'펼치기'}}<span data-krds-component="side-navigation" data-krds-part="indicator" data-krds-state="" aria-hidden="true"></span></button>
<ul :id="`${id}-${item.id}-children`" :hidden="!state.value.value.includes(item.id)" data-krds-component="side-navigation" data-krds-part="submenu" data-krds-state="">
<li v-for="child in item.children" :key="child.id" data-krds-component="side-navigation" data-krds-part="item" data-krds-state="collapsed">
<a v-if="child.href" data-krds-component="side-navigation" data-krds-part="link" :data-krds-state="child.id===currentId?'current':''" :href="child.href" :aria-current="child.id===currentId?'page':undefined">{{child.label}}</a>
<span v-else-if="!child.children?.length">{{child.label}}</span>
<template v-if="child.children?.length">
<button :id="`${id}-${child.id}-drill`" type="button" data-krds-component="side-navigation" data-krds-part="trigger" data-krds-state="" aria-expanded="false" :aria-controls="`${id}-${child.id}-children`" @click="drill(child)">{{child.label}} 펼치기<span data-krds-component="side-navigation" data-krds-part="indicator" data-krds-state="" aria-hidden="true"></span></button>
<ul :id="`${id}-${child.id}-children`" hidden data-krds-component="side-navigation" data-krds-part="submenu" data-krds-state=""></ul>
</template>
</li>
</ul>
</template>
</li>
</ul>
</nav>
</template>
