<script setup lang="ts">
import { computed, ref, useId, nextTick, onMounted, onUnmounted, watchEffect, watch } from 'vue';
import type { MainMenuContract } from '@unofficial-krds/contracts';
import { useOwned, uniqueIds } from '../catalog-state';
import Modal from '../modal/Modal.vue';
import MainMenuBranch from './MainMenuBranch.vue';
const p = withDefaults(defineProps<MainMenuContract>(), { mobileOpen: undefined, defaultMobileOpen: undefined });
const emit = defineEmits<{
    expandedChange: [
        detail: {
            id: string | null;
        }
    ];
    mobileOpenChange: [
        detail: {
            open: boolean;
        }
    ];
    queryChange: [
        detail: {
            value: string;
        }
    ];
}>();
const expanded = useOwned(() => p.expandedId, () => p.defaultExpandedId, null, id => emit('expandedChange', { id }));
const mobile = useOwned(() => p.mobileOpen, () => p.defaultMobileOpen, false, open => emit('mobileOpenChange', { open }));
const id = useId(), root = ref<HTMLElement>(), narrow = ref(false);
let pendingReturn: { expected: string | null; triggerId: string; initiator: Element | null } | undefined;
let media: MediaQueryList | undefined;
const showMobile = computed(() => narrow.value || mobile.value.value);
function findPath(items: readonly import('@unofficial-krds/contracts').NavigationItem[], key: string | null): string[] {
    for (const item of items) {
        if (item.id === key)
            return [item.id];
        const child = findPath(item.children ?? [], key);
        if (child.length)
            return [item.id, ...child];
    }
    return [];
}
const path = computed(() => findPath(p.items, expanded.value.value));
// Deeper data remains reachable through progressive context. Each displayed
// tree contains at most the parent, its children and their children.
const context = computed(() => {
    let items = p.items;
    let label: string | undefined;
    for (const ancestorId of path.value.slice(0, -2)) {
        const ancestor = items.find(item => item.id === ancestorId);
        label = ancestor?.label;
        items = ancestor?.children ?? [];
    }
    return { items, label };
});
watch(() => context.value.items, () => {
    if (typeof document === 'undefined')
        return;
    const active = document.activeElement;
    if (!(active instanceof HTMLElement))
        return;
    const scope = root.value?.contains(active) ? root.value : active.closest<HTMLElement>('[data-krds-component="main-menu"][data-krds-part="mobile-content"]');
    if (!scope)
        return;
    const activeId = active.id;
    void nextTick(() => {
        if (!scope.isConnected || active.isConnected)
            return;
        const replacement = activeId ? document.getElementById(activeId) : null;
        const target = replacement && scope.contains(replacement) && replacement.getClientRects().length ? replacement : scope.querySelector<HTMLElement>('[data-krds-part="back"]');
        target?.focus();
    });
}, { flush: 'pre' });
function toggle(key: string) {
    pendingReturn = undefined;
    if (expanded.value.value === key)
        expanded.request(path.value.at(-2) ?? null);
    else
        expanded.request(key);
}
function responsive() {
    const hadFocus = Boolean(root.value?.contains(document.activeElement));
    narrow.value = media?.matches ?? false;
    if (hadFocus && narrow.value)
        void nextTick(() => root.value?.querySelector<HTMLButtonElement>('[data-krds-part="mobile-trigger"]')?.focus());
}
onMounted(() => { media = matchMedia('(max-width: 767px)'); responsive(); media.addEventListener('change', responsive); });
onUnmounted(() => { pendingReturn = undefined; media?.removeEventListener('change', responsive); });
watchEffect(() => { for (const value of [p.label, p.mobileTriggerId, p.mobileTriggerLabel])
    if (value !== undefined && !value.trim())
        throw new TypeError('Navigation identifiers and labels must be nonempty'); });
uniqueIds(p.items);
function close(e: KeyboardEvent) {
    if (e.key !== 'Escape' || e.isComposing || e.defaultPrevented || expanded.value.value === null)
        return;
    e.preventDefault();
    pendingReturn = { expected: null, triggerId: `${id}-${path.value[0]}`, initiator: document.activeElement };
    expanded.request(null);
}
function mobileBack() {
    const previous = expanded.value.value;
    const next = path.value.at(-2) ?? null;
    pendingReturn = { expected: next, triggerId: `${id}-${previous}`, initiator: document.activeElement };
    expanded.request(next);
}
watch(expanded.value, value => {
    const request = pendingReturn;
    pendingReturn = undefined;
    if (!request || value !== request.expected || document.activeElement !== request.initiator)
        return;
    void nextTick(() => {
        if (root.value?.isConnected)
            document.getElementById(request.triggerId)?.focus();
    });
}, { flush: 'pre' });
</script>
<template>
<nav ref="root" data-krds-component="main-menu" data-krds-part="root" :data-krds-state="expanded.value.value?'expanded':'collapsed'" :aria-label="label??'메인 메뉴'" @keydown="close">
<template v-if="showMobile">
<slot name="mobile-trigger" :open="mobile.value.value" :open-menu="()=>mobile.request(true)">
<button :id="mobileTriggerId" type="button" data-krds-component="main-menu" data-krds-part="mobile-trigger" :data-krds-state="mobile.value.value?'expanded':'collapsed'" :aria-expanded="mobile.value.value" @click="mobile.request(true)">{{mobileTriggerLabel??'전체 메뉴'}}</button>
</slot>
</template>
<button v-if="!showMobile&&context.label" type="button" data-krds-component="main-menu" data-krds-part="back" data-krds-state="" @click="mobileBack">이전 메뉴</button>
<p v-if="!showMobile&&context.label">{{context.label}} 하위 메뉴</p>
<ul v-if="!showMobile" data-krds-component="main-menu" data-krds-part="list" data-krds-state="">
<MainMenuBranch v-for="item in context.items" :key="item.id" :item="item" :current-id="currentId" :path="path" :prefix="id" @toggle="toggle"/>
</ul>
<Modal :open="mobile.value.value" title="전체 메뉴" @open-change="mobile.request($event.open)">
<div data-krds-component="main-menu" data-krds-part="mobile-content" data-krds-state="mobile-open">
<label v-if="query!==undefined">메뉴 검색<input :value="query" @input="emit('queryChange',{value:($event.target as HTMLInputElement).value})"/>
</label>
<button v-if="expanded.value.value" type="button" data-krds-component="main-menu" data-krds-part="back" data-krds-state="" @click="mobileBack">이전 메뉴</button>
<p v-if="context.label">{{context.label}} 하위 메뉴</p>
<ul>
<MainMenuBranch v-for="item in context.items" :key="item.id" :item="item" :current-id="currentId" :path="path" :prefix="id" @toggle="toggle"/>
</ul>
</div>
</Modal>
</nav>
</template>
