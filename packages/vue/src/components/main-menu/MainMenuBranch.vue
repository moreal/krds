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
const containsCurrent = (item: NavigationItem): boolean => item.id === p.currentId || (item.children ?? []).some(containsCurrent);
</script>
<template>
<li data-krds-component="main-menu" data-krds-part="item" :data-krds-state="path.includes(item.id)?'expanded':'collapsed'">
<a v-if="item.href" data-krds-component="main-menu" data-krds-part="link" :data-krds-state="item.id===currentId?'current':''" :href="item.href" :aria-current="item.id===currentId?'page':undefined">{{item.label}}</a>
<span v-else-if="!item.children?.length">{{item.label}}</span>
<p v-if="!item.children?.length&&item.description" data-krds-component="main-menu" data-krds-part="description" data-krds-state="">{{item.description}}</p>
<template v-if="item.children?.length">
<button :id="`${prefix}-${item.id}`" type="button" data-krds-component="main-menu" data-krds-part="trigger" :data-krds-state="path.includes(item.id)?'expanded':'collapsed'" :aria-current="containsCurrent(item)?'true':undefined" :aria-label="item.label" :aria-controls="`${prefix}-${item.id}-submenu`" :aria-expanded="path.includes(item.id)" @click="emit('toggle',item.id)">{{item.label}}<span data-krds-component="main-menu" data-krds-part="indicator" data-krds-state="" aria-hidden="true"></span></button>
<ul :id="`${prefix}-${item.id}-submenu`" data-krds-component="main-menu" data-krds-part="submenu" :data-krds-state="path.includes(item.id)?'expanded':'collapsed'" :hidden="!path.includes(item.id)">
<li><h3 data-krds-component="main-menu" data-krds-part="submenu-title" data-krds-state="">{{item.label}}</h3><p v-if="item.description" data-krds-component="main-menu" data-krds-part="description" data-krds-state="">{{item.description}}</p></li>
<MainMenuBranch v-for="child in item.children" :key="child.id" :item="child" :current-id="currentId" :path="path" :prefix="prefix" @toggle="emit('toggle',$event)"/>
</ul>
</template>
</li>
</template>
