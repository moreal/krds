<script setup lang="ts">
import { nextTick } from 'vue';
import type { StructuredListContract } from '@unofficial-krds/contracts';
const p = defineProps<StructuredListContract>();
const emit = defineEmits<{
    toolbarAction: [
        detail: {
            id: string;
        }
    ];
}>();
function select(id: string, event: Event) {
    const control = event.target as HTMLInputElement;
    const checked = control.checked;
    if (!p.selection)
        return;
    p.selection.onChange({ ids: checked ? [...p.selection.ids, id] : p.selection.ids.filter(x => x !== id) });
    control.checked = p.selection.ids.includes(id);
    void nextTick(() => { control.checked = p.selection?.ids.includes(id) ?? false; });
}
</script>
<template>
<section data-krds-part="root" :data-krds-variant="variant??'list'" data-krds-component="structured-list" :data-krds-state="items.length?'':'empty'">
<div data-krds-part="toolbar" data-krds-component="structured-list" data-krds-state="">
<slot name="toolbar">
<button v-for="action in toolbar" :key="action.id" type="button" :disabled="action.disabled" @click="emit('toolbarAction',{id:action.id})">{{action.label}}</button>
</slot>
<button v-if="sort" type="button" @click="sort.onChange({key:sort.key,direction:sort.direction==='ascending'?'descending':'ascending'})">정렬 {{sort.direction==='ascending'?'오름차순':'내림차순'}}</button>
</div>
<table v-if="variant==='table'" data-krds-part="list" data-krds-component="structured-list" data-krds-state="">
<caption>목록</caption>
<thead>
<tr>
<th scope="col">항목</th>
</tr>
</thead>
<tbody>
<tr v-for="item in items" :key="item.id" data-krds-component="structured-list" data-krds-part="item" :data-krds-state="selection?.ids.includes(item.id)?'selected':''">
<td>
<img v-if="item.image" data-krds-component="structured-list" data-krds-part="preview" data-krds-state="" :src="item.image.src" :alt="item.image.alt"/>
<div data-krds-component="structured-list" data-krds-part="content" data-krds-state="">
<h3>
<a v-if="item.href" data-krds-part="cta" :href="item.href" data-krds-component="structured-list" data-krds-state="">{{item.title}}</a>
<template v-else>{{item.title}}</template>
</h3>
<dl data-krds-part="metadata" data-krds-component="structured-list" data-krds-state="">
<div v-for="entry in item.metadata" :key="entry.label">
<dt>{{entry.label}}</dt>
<dd>{{entry.value??'—'}}</dd>
</div>
</dl>
<div data-krds-part="tags" data-krds-component="structured-list" data-krds-state="">
<span v-for="tag in item.tags" :key="tag">{{tag}}</span>
</div>
<slot :name="item.id" :item="item"/>
</div>
<input v-if="selection" type="checkbox" :data-selection-id="item.id" :aria-label="`${item.title} 선택`" :checked="selection.ids.includes(item.id)" @change="select(item.id,$event)"/>
<div v-if="$slots.actions" data-krds-part="actions" data-krds-component="structured-list" data-krds-state="">
<slot name="actions" :item="item"/>
</div>
</td>
</tr>
</tbody>
</table>
<ul v-else data-krds-part="list" data-krds-component="structured-list" data-krds-state="">
<li v-for="item in items" :key="item.id" data-krds-part="item" :data-krds-state="selection?.ids.includes(item.id)?'selected':''" data-krds-component="structured-list">
<img v-if="item.image" data-krds-component="structured-list" data-krds-part="preview" data-krds-state="" :src="item.image.src" :alt="item.image.alt"/>
<div data-krds-component="structured-list" data-krds-part="content" data-krds-state="">
<h3>
<a v-if="item.href" data-krds-part="cta" :href="item.href" data-krds-component="structured-list" data-krds-state="">{{item.title}}</a>
<template v-else>{{item.title}}</template>
</h3>
<dl data-krds-part="metadata" data-krds-component="structured-list" data-krds-state="">
<div v-for="entry in item.metadata" :key="entry.label">
<dt>{{entry.label}}</dt>
<dd>{{entry.value??'—'}}</dd>
</div>
</dl>
<div data-krds-part="tags" data-krds-component="structured-list" data-krds-state="">
<span v-for="tag in item.tags" :key="tag">{{tag}}</span>
</div>
<slot :name="item.id" :item="item"/>
</div>
<input v-if="selection" type="checkbox" :data-selection-id="item.id" :aria-label="`${item.title} 선택`" :checked="selection.ids.includes(item.id)" @change="select(item.id,$event)"/>
<div v-if="$slots.actions" data-krds-part="actions" data-krds-component="structured-list" data-krds-state="">
<slot name="actions" :item="item"/>
</div>
</li>
</ul>
<p v-if="!items.length" role="status">조회 결과가 없습니다.</p>
<div v-if="$slots.pagination" data-krds-part="pagination" data-krds-component="structured-list" data-krds-state="">
<slot name="pagination"/>
</div>
</section>
</template>
