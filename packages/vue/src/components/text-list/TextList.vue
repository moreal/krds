<script setup lang="ts">
import type { TextListContract } from '@unofficial-krds/contracts';
withDefaults(defineProps<TextListContract & {
    level?: number;
}>(), { level: 1 });
</script>
<template>
<component :is="ordered?'ol':'ul'" :data-krds-part="level===1?'root':'nested-list'" data-krds-state="" :data-krds-ordering="ordered?'ordered':'unordered'" :data-krds-marker="ordered?undefined:marker??'dot'" role="list" data-krds-component="text-list">
<li v-for="item in items" :key="item.id" data-krds-part="item" :data-krds-state="`level-${level}`" data-krds-component="text-list">
<div v-if="$slots[item.id]" data-krds-part="content" data-krds-component="text-list" data-krds-state="">
<slot :name="item.id"/>
</div>
<span v-else data-krds-part="content" data-krds-component="text-list" data-krds-state="">{{item.content}}</span>
<TextList v-if="item.children?.length&&level<3" :items="item.children" :ordered="ordered" :marker="marker" :level="level+1"/>
</li>
</component>
</template>
