<script setup lang="ts">
import { ref, useId, watchEffect, onMounted, onUnmounted, nextTick } from 'vue';
import type { TableContract } from '@unofficial-krds/contracts';
const p = defineProps<TableContract>();
const emit = defineEmits<{
    sortChange: [
        detail: {
            columnId: string;
            direction: 'ascending' | 'descending';
        }
    ];
}>();
const id = useId();
const scroll = ref<HTMLElement>();
const overflow = ref(false);
let observer: ResizeObserver | undefined;
function measure() { overflow.value = Boolean(scroll.value && scroll.value.scrollWidth > scroll.value.clientWidth); }
onMounted(() => {
    observer = new ResizeObserver(measure);
    if (scroll.value)
        observer.observe(scroll.value);
    measure();
});
onUnmounted(() => observer?.disconnect());
watchEffect(() => {
    if (p.rowHeaderColumnId && !p.columns.some(x => x.id === p.rowHeaderColumnId))
        throw new TypeError('Unknown row header column');
    void nextTick(measure);
});
function requestSort(columnId: string) {
    if (!p.sort || !p.columns.find(x => x.id === columnId)?.sortable)
        return;
    emit('sortChange', { columnId, direction: p.sort.columnId === columnId && p.sort.direction === 'ascending' ? 'descending' : 'ascending' });
}
</script>
<template>
<div>
<div ref="scroll" data-krds-part="scroll-region" data-krds-state="" :tabindex="overflow?0:undefined" :role="overflow?'region':undefined" :aria-label="overflow?`${caption} 가로 스크롤`:undefined" style="overflow-x:auto" data-krds-component="table">
<table data-krds-part="root" data-krds-component="table" data-krds-state="">
<caption data-krds-part="caption" data-krds-component="table" data-krds-state="">{{caption}}</caption>
<thead data-krds-part="head" data-krds-component="table" data-krds-state="">
<tr data-krds-part="row" data-krds-component="table" data-krds-state="">
<th v-for="column in columns" :id="`${id}-col-${column.id}`" :key="column.id" scope="col" data-krds-part="header-cell" :style="{textAlign:column.kind==='number'?'end':'start'}" :aria-sort="sort?.columnId===column.id?sort.direction:undefined" data-krds-state="" data-krds-component="table">
<button v-if="p.sort&&column.sortable" type="button" :aria-label="column.label" data-krds-part="sort-trigger" @click="requestSort(column.id)" data-krds-component="table" :data-krds-state="p.sort.columnId===column.id?p.sort.direction:''">{{column.label}}<span v-if="p.sort.columnId!==column.id" aria-hidden="true"> ↕</span>
</button>
<template v-else>{{column.label}}</template>
</th>
</tr>
</thead>
<tbody data-krds-part="body" data-krds-component="table" data-krds-state="">
<tr v-for="row in rows" :key="row.id" data-krds-part="row" data-krds-component="table" data-krds-state="">
<template v-for="column in columns" :key="column.id">
<th v-if="column.id===rowHeaderColumnId" :id="`${id}-row-${row.id}`" scope="row" :headers="`${id}-col-${column.id}`" data-krds-part="header-cell" data-krds-component="table" data-krds-state="">{{row.cells[column.id]??'—'}}</th>
<td v-else data-krds-part="cell" :headers="[`${id}-col-${column.id}`,rowHeaderColumnId?`${id}-row-${row.id}`:''].filter(Boolean).join(' ')" :style="{textAlign:column.kind==='number'?'end':'start'}" data-krds-component="table" data-krds-state="">
<slot :name="column.id" :row="row">{{row.cells[column.id]??'—'}}</slot>
</td>
</template>
</tr>
</tbody>
</table>
</div>
<template v-if="overflow">
<button data-krds-part="scroll-previous" type="button" @click="scroll?.scrollBy({left:-200})" data-krds-component="table" data-krds-state="">표 왼쪽으로 이동</button>
<button data-krds-part="scroll-next" type="button" @click="scroll?.scrollBy({left:200})" data-krds-component="table" data-krds-state="">표 오른쪽으로 이동</button>
</template>
</div>
</template>
