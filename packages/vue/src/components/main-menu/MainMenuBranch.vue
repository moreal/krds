<script setup lang="ts">
import type { NavigationItem } from '@unofficial-krds/contracts';
const p = defineProps<{
    item: NavigationItem;
    currentId?: string;
    path: readonly string[];
    prefix: string;
}>();
const emit = defineEmits<{
    toggle: [
        id: string
    ];
}>();
</script>
<template>
<li data-krds-component="main-menu" data-krds-part="item" :data-krds-state="path.includes(item.id)?'expanded':'collapsed'">
<a v-if="item.href" data-krds-component="main-menu" data-krds-part="link" :href="item.href" :aria-current="item.id===currentId?'page':undefined" :data-krds-state="item.id===currentId?'current':''">{{item.label}}</a>
<button v-if="item.children?.length" :id="`${prefix}-${item.id}`" type="button" data-krds-component="main-menu" data-krds-part="trigger" :aria-expanded="path.includes(item.id)" :aria-controls="`${prefix}-${item.id}-submenu`" :aria-current="path.includes(item.id)?'true':undefined" :data-krds-state="path.includes(item.id)?'expanded':'collapsed'" @click="emit('toggle',item.id)">{{item.label}}</button>
<span v-else-if="!item.href">{{item.label}}</span>
<div v-if="item.children?.length" :id="`${prefix}-${item.id}-submenu`" data-krds-component="main-menu" data-krds-part="submenu" :hidden="!path.includes(item.id)" :data-krds-state="path.includes(item.id)?'expanded':'collapsed'">
<h3 data-krds-component="main-menu" data-krds-part="submenu-title" data-krds-state="">{{item.label}}</h3>
<p v-if="item.description" data-krds-component="main-menu" data-krds-part="description" data-krds-state="">{{item.description}}</p>
<ul>
<MainMenuBranch v-for="child in item.children" :key="child.id" :item="child" :current-id="currentId" :path="path" :prefix="prefix" @toggle="emit('toggle',$event)"/>
</ul>
</div>
</li>
</template>
