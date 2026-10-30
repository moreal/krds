<script setup lang="ts">
import { computed, ref, useId, nextTick, watch, onMounted } from 'vue';
import type { HelpPanelContract } from '@unofficial-krds/contracts';
import { useOwned } from '../catalog-state';
import { useLayer } from '../catalog-layer';
import { restore, canFocus } from '../modal/stack';
const p = withDefaults(defineProps<HelpPanelContract & {
    restoreDelegated?: boolean;
    openerId?: string;
    hideOpener?: boolean;
    hideTopicTriggers?: boolean;
}>(), { open: undefined, defaultOpen: undefined });
const emit = defineEmits<{
    openChange: [
        detail: {
            open: boolean;
        }
    ];
    topicChange: [
        detail: {
            id: string | null;
        }
    ];
}>();
const state = useOwned(() => p.open, () => p.defaultOpen, true, open => emit('openChange', { open }));
const selected = useOwned(() => p.selectedTopicId, () => p.defaultSelectedTopicId, null, id => emit('topicChange', { id }));
const topic = computed(() => p.topics.find(x => x.id === selected.value.value));
const id = useId();
const portal = ref<HTMLElement>(), dialog = ref<HTMLElement>(), opener = ref<HTMLButtonElement>();
let initiating: HTMLElement | null = null;
let ancestors: HTMLElement[] = [];
function returned() {
    if (p.restoreDelegated)
        return;
    const fallback = p.fallbackFocusId ? document.getElementById(p.fallbackFocusId) : null;
    const candidate = [opener.value, fallback, initiating, ...ancestors].find(canFocus);
    restore(document, candidate ?? null);
}
onMounted(() => {
    if (p.open === undefined && p.defaultOpen === undefined)
        state.commit(!matchMedia('(max-width: 767px)').matches);
});
const layer = useLayer(state.value, portal, dialog, () => state.request(false), returned);
function choose(key: string, event?: Event) {
    const source = event?.currentTarget;
    if (source instanceof HTMLElement && !dialog.value?.contains(source)) {
        initiating = source;
        ancestors = [];
        for (let parent = source.parentElement; parent; parent = parent.parentElement)
            ancestors.push(parent);
    }
    selected.request(key);
    state.request(true);
    void nextTick(() => dialog.value?.focus());
}
</script>
<template>
<div data-krds-host-shell="help-panel" :data-krds-state="state.value.value?'open':'closed'" :data-krds-mode="mode??'help'">
<button ref="opener" :id="openerId??`${id}-opener`" v-if="!hideOpener" type="button" data-krds-part="opener" :aria-expanded="state.value.value" @click="state.request(true)" data-krds-component="help-panel" data-krds-state="">도움말 열기</button>
<div v-if="!layer.narrow.value||!state.value.value">
<button v-for="item in topics" :key="item.id" type="button" data-krds-part="topic-trigger" :data-krds-state="selected.value.value===item.id?'active-topic':''" @click="choose(item.id,$event)" data-krds-component="help-panel">{{item.title}} 도움말</button>
</div>
<Teleport to="body" :disabled="!layer.narrow.value">
<div v-if="state.value.value" ref="portal">
<div ref="dialog" :id="id" tabindex="-1" :role="layer.narrow.value?'dialog':'complementary'" :aria-modal="layer.narrow.value?'true':undefined" aria-label="도움말" data-krds-part="root" data-krds-component="help-panel" data-krds-state="">
<header data-krds-part="header" data-krds-component="help-panel" data-krds-state="">
<h2 data-krds-part="title" data-krds-component="help-panel" data-krds-state="">도움말</h2>
<slot name="tabs"/>
<button type="button" data-krds-part="close" @click="state.request(false)" data-krds-component="help-panel" data-krds-state="">도움말 닫기</button>
</header>
<section data-krds-part="body" :data-krds-state="topic?'active-topic':''" data-krds-component="help-panel">
<div>
<button v-for="item in topics" :key="item.id" type="button" @click="choose(item.id,$event)">{{item.title}}</button>
<button v-for="item in topics" v-if="layer.narrow.value" :key="`${item.id}-context`" type="button" @click="choose(item.id,$event)">{{item.title}} 도움말</button>
</div>
<h3 v-if="topic">{{topic.title}}</h3>
<p>{{topic?.content??'항목 옆의 도움말을 선택하세요.'}}</p>
<slot :topic="topic"/>
</section>
<footer data-krds-part="related" data-krds-component="help-panel" data-krds-state="">
<ul v-if="topic">
<li v-for="link in topic.relatedLinks" :key="link.href">
<a :href="link.href" target="_blank" rel="noopener noreferrer">{{link.label}} (새 창)</a>
</li>
</ul>
</footer>
</div>
</div>
</Teleport>
</div>
</template>
