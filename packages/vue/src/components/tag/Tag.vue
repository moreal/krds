<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import type { TagContract } from '@unofficial-krds/contracts';
const p = defineProps<TagContract>();
const emit = defineEmits<{
    selectionChange: [
        detail: {
            ids: readonly string[];
        }
    ];
    remove: [
        detail: {
            id: string;
        }
    ];
    add: [
        detail: {
            id: string;
        }
    ];
    clear: [
    ];
}>();
const root = ref<HTMLElement>(), list = ref<HTMLElement>(), active = ref(p.items.find(x => !x.disabled)?.id);
let pending: {
    id: string;
    index: number;
} | null = null;
function targets() { return Array.from(root.value?.querySelectorAll<HTMLElement>('[data-tag-action]') ?? []).filter(el => !el.matches(':disabled') && el.getAttribute('aria-disabled') !== 'true'); }
function activationDown(event: KeyboardEvent) {
    if (!event.isComposing && ['Enter', ' '].includes(event.key)) {
        event.preventDefault();
    }
}
function activationUp(event: KeyboardEvent, id: string) {
    if (!event.isComposing && ['Enter', ' '].includes(event.key)) {
        event.preventDefault();
        activate(id);
    }
}
function key(e: KeyboardEvent) {
    if (e.isComposing || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key))
        return;
    e.preventDefault();
    const controls = targets(), i = controls.indexOf(document.activeElement as HTMLElement);
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? controls.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + controls.length) % controls.length;
    active.value = controls[next]?.dataset.tagAction;
    controls[next]?.focus();
}
function activate(id: string) {
    const item = p.items.find(x => x.id === id);
    if (!item || item.disabled)
        return;
    if (p.mode === 'toggle')
        emit('selectionChange', { ids: p.selectedIds?.includes(id) ? p.selectedIds.filter(x => x !== id) : [...p.selectedIds ?? [], id] });
    if (p.mode === 'removable') {
        pending = { id, index: p.items.findIndex(x => x.id === id) };
        emit('remove', { id });
    }
    if (p.mode === 'add-filter') {
        emit('add', { id });
        void nextTick(() => { const bar = p.appliedBarId ? document.getElementById(p.appliedBarId) : null; bar?.focus(); });
    }
}
watch(() => p.items, async (items) => {
    if (!items.some(item => item.id === active.value && !item.disabled))
        active.value = items.find(item => !item.disabled)?.id;
    if (!pending || items.some(x => x.id === pending!.id))
        return;
    const before = pending.index;
    pending = null;
    await nextTick();
    const enabled = items.filter(x => !x.disabled);
    const item = items.slice(0, before).reverse().find(x => !x.disabled) ?? enabled[0];
    active.value = item?.id;
    const target = targets().find(x => x.dataset.tagAction === item?.id);
    if (target)
        target.focus();
    else
        list.value?.focus();
});
</script>
<template>
<div ref="root" data-krds-part="root" :data-krds-mode="mode??'static'" :role="mode&&mode!=='static'?'group':undefined" :aria-label="mode&&mode!=='static'?'옵션 태그':undefined" data-krds-component="tag" data-krds-state="">
<ul ref="list" tabindex="-1" data-krds-part="list" @keydown="key" data-krds-component="tag" data-krds-state="">
<li v-for="item in items" :key="item.id" data-krds-part="item" :data-krds-state="selectedIds?.includes(item.id)?'selected':''" data-krds-component="tag">
<a v-if="mode==='link'" :data-tag-action="item.id" :href="item.disabled?undefined:item.href" :tabindex="!item.disabled&&active===item.id?0:-1" :aria-disabled="item.disabled||undefined">{{item.label}}</a>
<template v-else-if="mode==='removable'">
<span data-krds-part="label" data-krds-component="tag" data-krds-state="">{{item.label}}</span>
<button type="button" data-krds-part="remove" :data-tag-action="item.id" :disabled="item.disabled" :tabindex="!item.disabled&&active===item.id?0:-1" :aria-label="`${item.label} 옵션 삭제`" @keydown="activationDown" @keyup="activationUp($event,item.id)" @click="activate(item.id)" data-krds-component="tag" data-krds-state="">×</button>
</template>
<button v-else-if="mode==='toggle'||mode==='add-filter'" type="button" data-krds-part="label" :data-tag-action="item.id" :disabled="item.disabled" :tabindex="!item.disabled&&active===item.id?0:-1" :aria-pressed="mode==='toggle'?Boolean(selectedIds?.includes(item.id)):undefined" :aria-label="mode==='add-filter'?`${item.label} 필터 옵션 추가`:undefined" @keydown="activationDown" @keyup="activationUp($event,item.id)" @click="activate(item.id)" data-krds-component="tag" data-krds-state="">{{item.label}}</button>
<span v-else data-krds-part="label" data-krds-component="tag" data-krds-state="">{{item.label}}</span>
</li>
</ul>
<button v-if="mode==='removable'&&items.length" type="button" data-krds-part="clear" @click="emit('clear')" data-krds-component="tag" data-krds-state="">전체 삭제</button>
</div>
</template>
