<script setup lang="ts">
import { nextTick } from 'vue';
import type { StructuredListContract } from '@unofficial-krds/contracts';
import Badge from '../badge/Badge.vue';
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
<section data-krds-part="root" :data-krds-variant="variant??'list'" data-krds-component="structured-list" data-krds-state="">
<div v-if="sort||toolbar?.length||$slots.toolbar" data-krds-part="toolbar" data-krds-component="structured-list" data-krds-state="">
<button v-if="sort" type="button" @click="sort.onChange({key:sort.key,direction:sort.direction==='ascending'?'descending':'ascending'})">정렬</button>
<slot name="toolbar">
<button v-for="action in toolbar" :key="action.id" type="button" :disabled="action.disabled" @click="emit('toolbarAction',{id:action.id})">{{action.label}}</button>
</slot>
</div>
<p v-if="!items.length" role="status" data-krds-part="content" data-krds-component="structured-list" data-krds-state="">조회 결과가 없습니다.</p>
<ul v-else-if="variant!=='table'" data-krds-part="list" data-krds-component="structured-list" data-krds-state="">
<li v-for="item in items" :key="item.id" data-krds-part="item" :data-krds-state="selection?.ids.includes(item.id)?'selected':''" data-krds-component="structured-list">
<label v-if="selection">
<input type="checkbox" :checked="selection.ids.includes(item.id)" @change="select(item.id,$event)"/>{{item.title}} 선택</label>
<img v-if="item.image" :src="item.image.src" :alt="item.image.alt"/>
<div data-krds-component="structured-list" data-krds-part="content" data-krds-state="">
<h3>
<a v-if="item.href" data-krds-part="cta" :href="item.href" data-krds-component="structured-list" data-krds-state="">{{item.title}}</a>
<span v-else>{{item.title}}</span>
</h3>
<dl data-krds-part="metadata" data-krds-component="structured-list" data-krds-state="">
<template v-for="entry in item.metadata" :key="entry.label">
<dt>{{entry.label}}</dt>
<dd>{{entry.value??'—'}}</dd>
</template>
</dl>
<Badge v-for="tag in item.tags" :key="tag" :label="tag"/>
<slot :name="item.id" :item="item"/>
</div>
<div data-krds-part="actions" data-krds-component="structured-list" data-krds-state="">
<slot name="actions" :item="item"/>
</div>
</li>
</ul>
<table v-if="variant==='table'&&items.length">
<caption>조회 결과</caption>
<thead>
<tr>
<th v-if="selection" scope="col">선택</th>
<th scope="col">제목</th>
<th scope="col">분류 정보</th>
<th scope="col">작업</th>
</tr>
</thead>
<tbody data-krds-component="structured-list" data-krds-part="list" data-krds-state="">
<tr v-for="item in items" :key="item.id" data-krds-component="structured-list" data-krds-part="item" :data-krds-state="selection?.ids.includes(item.id)?'selected':''">
<td v-if="selection">
<label>
<input type="checkbox" :checked="selection.ids.includes(item.id)" @change="select(item.id,$event)"/>{{item.title}} 선택</label>
</td>
<th scope="row" data-krds-component="structured-list" data-krds-part="content" data-krds-state="">
<a v-if="item.href" :href="item.href">{{item.title}}</a>
<span v-else>{{item.title}}</span>
</th>
<td data-krds-component="structured-list" data-krds-part="metadata" data-krds-state="">
<dl>
<template v-for="entry in item.metadata" :key="entry.label">
<dt>{{entry.label}}</dt>
<dd>{{entry.value??'—'}}</dd>
</template>
</dl>
</td>
<td data-krds-component="structured-list" data-krds-part="actions" data-krds-state="">
<slot name="actions" :item="item"/>
</td>
</tr>
</tbody>
</table>
<div v-if="$slots.pagination" data-krds-part="pagination" data-krds-component="structured-list" data-krds-state="">
<slot name="pagination"/>
</div>
</section>
</template>
