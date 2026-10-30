<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import type { InPageNavigationContract } from '@unofficial-krds/contracts';
import { focusDestination } from '../catalog-state';
const p = defineProps<InPageNavigationContract>();
const emit = defineEmits<{
    activeChange: [
        detail: {
            id: string;
            reason: 'scroll' | 'activation';
        }
    ];
}>();
const current = ref(p.activeId ?? p.sections[0]?.id);
const narrow = ref(false), expanded = ref(true);
let disclosureInitialized = false;
let media: MediaQueryList | undefined;
function responsive() {
    narrow.value = media?.matches ?? false;
    if (narrow.value && p.narrowMode === 'disclosure' && !disclosureInitialized) {
        expanded.value = false;
        disclosureInitialized = true;
    }
}
let observer: IntersectionObserver | undefined, mutations: MutationObserver | undefined;
const observed = new Map<string, HTMLElement>();
let alive = false, scheduled = false, scrolled = false;
let activationId: string | undefined;
function scroll() { scrolled = true; }
function hierarchy(items: readonly import('@unofficial-krds/contracts').InPageSection[]): readonly import('@unofficial-krds/contracts').InPageSection[] { return items.flatMap(item => [item, ...hierarchy(item.children ?? [])]); }
function rebind() {
    if (!alive || !observer)
        return;
    const ids = new Set(hierarchy(p.sections).map(item => item.id));
    for (const [id, node] of observed) {
        if (!ids.has(id) || document.getElementById(id) !== node) {
            observer.unobserve(node);
            observed.delete(id);
        }
    }
    for (const id of ids) {
        const node = document.getElementById(id);
        if (node && !observed.has(id)) {
            scrolled = false;
            observed.set(id, node);
            observer.observe(node);
        }
    }
    if (!p.activeId && !ids.has(current.value ?? ''))
        current.value = hierarchy(p.sections)[0]?.id;
}
function schedule() {
    if (scheduled)
        return;
    scheduled = true;
    void nextTick(() => { scheduled = false; rebind(); });
}
watch(() => p.sections, schedule, { deep: true });
onMounted(() => {
    media = matchMedia('(max-width: 767px)');
    responsive();
    media.addEventListener('change', responsive);
    alive = true;
    window.addEventListener('scroll', scroll, true);
    observer = new IntersectionObserver(entries => {
        if (!scrolled)
            return;
        scrolled = false;
        const visible = entries.filter(entry => entry.isIntersecting && observed.get(entry.target.id) === entry.target).sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
        const entry = visible[0];
        if (entry?.target.id === activationId) {
            activationId = undefined;
            return;
        }
        activationId = undefined;
        if (entry && entry.target.id !== (p.activeId ?? current.value)) {
            current.value = entry.target.id;
            emit('activeChange', { id: entry.target.id, reason: 'scroll' });
        }
    }, { rootMargin: '0px 0px -60% 0px' });
    mutations = new MutationObserver(schedule);
    mutations.observe(document.body, { childList: true, subtree: true });
    rebind();
});
onUnmounted(() => { alive = false; media?.removeEventListener('change', responsive); window.removeEventListener('scroll', scroll, true); observer?.disconnect(); mutations?.disconnect(); observed.clear(); });
function activate(e: MouseEvent | KeyboardEvent, id: string) {
    if (e instanceof KeyboardEvent && (e.isComposing || e.key !== ' ' && e.key !== 'Enter'))
        return;
    e.preventDefault();
    activationId = id;
    if (e instanceof KeyboardEvent)
        focusDestination(id);
    else
        document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
    if ((p.activeId ?? current.value) !== id) {
        current.value = id;
        emit('activeChange', { id, reason: 'activation' });
    }
}
</script>
<template>
<nav data-krds-part="root" :aria-label="title??'이 페이지의 구성'" data-krds-component="in-page-navigation" data-krds-state="">
<h2 data-krds-part="title" data-krds-component="in-page-navigation" data-krds-state="">{{title??'이 페이지의 구성'}}</h2>
<button v-if="narrowMode==='disclosure'&&narrow" type="button" data-krds-part="disclosure-trigger" :aria-expanded="expanded" @click="expanded=!expanded" data-krds-component="in-page-navigation" data-krds-state="">구성 {{expanded?'접기':'펼치기'}}</button>
<ul data-krds-part="list" :hidden="narrowMode==='disclosure'&&narrow&&!expanded" data-krds-component="in-page-navigation" data-krds-state="">
<li v-for="section in sections" :key="section.id" data-krds-part="item" data-krds-component="in-page-navigation" data-krds-state="">
<a data-krds-part="link" :href="`#${section.id}`" :aria-current="section.id===(activeId??current)?'location':undefined" :data-krds-state="section.id===(activeId??current)?'active':''" @click="activate($event,section.id)" @keydown="activate($event,section.id)" data-krds-component="in-page-navigation">{{section.label}}</a>
<ul v-if="section.children">
<li v-for="child in section.children" :key="child.id">
<a data-krds-part="link" :href="`#${child.id}`" :aria-current="child.id===(activeId??current)?'location':undefined" @click="activate($event,child.id)" @keydown="activate($event,child.id)" data-krds-component="in-page-navigation" data-krds-state="">{{child.label}}</a>
<ul v-if="child.children?.length">
<li v-for="grandchild in child.children" :key="grandchild.id">
<a data-krds-part="link" :href="`#${grandchild.id}`" :aria-current="grandchild.id===(activeId??current)?'location':undefined" :data-krds-state="grandchild.id===(activeId??current)?'active':''" @click="activate($event,grandchild.id)" @keydown="activate($event,grandchild.id)" data-krds-component="in-page-navigation">{{grandchild.label}}</a>
</li>
</ul>
</li>
</ul>
</li>
</ul>
</nav>
</template>
