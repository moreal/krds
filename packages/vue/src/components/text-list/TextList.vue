<script setup lang="ts">
import type { TextListContract } from '@unofficial-krds/contracts';
withDefaults(defineProps<TextListContract & {
    level?: number;
}>(), { level: 1 });
</script>
<template>
<component :is="ordered?'ol':'ul'" :data-krds-part="level===1?'root':'nested-list'" :data-krds-state="`${ordered?'ordered':'unordered'} level-${level}`" :data-krds-marker="marker??'dot'" role="list" data-krds-component="text-list">
<li v-for="item in items" :key="item.id" data-krds-part="item" :data-krds-state="`level-${level}`" data-krds-component="text-list">
<slot :name="item.id">{{item.content}}</slot>
<TextList v-if="item.children?.length&&level<3" :items="item.children" :ordered="ordered" :marker="marker" :level="level+1"/>
</li>
</component>
</template>
