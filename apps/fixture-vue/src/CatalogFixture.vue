<script setup lang="ts">
import { onUnmounted, shallowRef } from 'vue';
import { createFixtureBridge } from '@unofficial-krds/test-contracts/driver';
import CatalogExamples from './CatalogExamples.vue';
import { catalogSeed, serializable } from './catalog-state';
const p = defineProps<{
    componentId: string;
    caseId: string;
}>();
const initial = catalogSeed(p.componentId, p.caseId);
const handles = new Map<string, File>();
const materials = initial.__host?.fileFixtures ?? [];
for (const record of initial.files ?? []) {
    const material = materials.find((item: any) => item.id === (record.fileFixtureId ?? record.id) || item.name === (record.file?.name ?? record.name)) ?? record.file ?? record;
    handles.set(record.id, new File([material.contents ?? material.text ?? 'local file'], material.name ?? 'example.txt', { type: material.type ?? 'text/plain', lastModified: 0 }));
}
const bridge = createFixtureBridge('vue', initial);
const state = shallowRef(bridge.getState() as Record<string, any>);
const originalSet = bridge.setState.bind(bridge);
bridge.setState = async (patch) => { const host = patch.__host as Record<string, unknown> | undefined; await originalSet({ ...patch, ...(host?.routeChange ? { __routeRemoved: true } : {}) }); };
const unsubscribe = bridge.subscribe(next => state.value = next);
function patch(next: Record<string, any>) {
    for (const record of next.files ?? [])
        if (record.file instanceof File)
            handles.set(record.id, record.file);
    void bridge.setState(serializable(next));
}
function emit(name: string, detail: unknown, next?: Record<string, any>) {
    if (next) {
        next = { ...next };
        for (const key of ['value', 'checked', 'open', 'index', 'playing', 'expandedId', 'expandedIds', 'expanded', 'mobileOpen', 'openIds', 'selectedTopicId', 'activePanel', 'stepId'])
            if (Object.prototype.hasOwnProperty.call(next, key) && initial[key] === undefined)
                delete next[key];
    }
    bridge.recordEvent(name, serializable(detail));
    const host = state.value.__host ?? {};
    if (next && host.acceptChanges !== false && !state.value.rejectChanges && !(name === 'openChange' && (detail as any).open === false && host.acceptClose === false))
        patch(next);
}
function nativeState() { return p.componentId === 'file-upload' ? { ...state.value, files: (state.value.files ?? []).map((record: any) => ({ ...record, file: handles.get(record.id) })).filter((record: any) => record.file) } : state.value; }
onUnmounted(() => { unsubscribe(); bridge.dispose(); handles.clear(); });
</script>
<template>
<div role="status" aria-label="Fixture health">ready</div>
<CatalogExamples :component-id="componentId" :state="nativeState()" :emit="emit" :patch="patch"/>
</template>
