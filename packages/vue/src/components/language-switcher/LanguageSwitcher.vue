<script setup lang="ts">
import { ref, useId, onMounted, onUnmounted, nextTick } from 'vue';
import type { LanguageSwitcherContract } from '@unofficial-krds/contracts';
import { useOwned } from '../catalog-state';
const p = withDefaults(defineProps<LanguageSwitcherContract>(), { open: undefined, defaultOpen: undefined });
const emit = defineEmits<{
    openChange: [
        detail: {
            open: boolean;
        }
    ];
    localeRequest: [
        detail: {
            locale: string;
            href: string;
        }
    ];
}>();
const state = useOwned(() => p.open, () => p.defaultOpen, false, open => emit('openChange', { open }));
const id = useId(), root = ref<HTMLElement>(), trigger = ref<HTMLButtonElement>();
function outside(e: PointerEvent) {
    if (!root.value?.contains(e.target as Node))
        state.request(false);
}
function key(e: KeyboardEvent) {
    if (e.key === 'Escape' && !e.isComposing && !e.defaultPrevented && state.value.value) {
        e.preventDefault();
        state.request(false);
        void nextTick(() => {
            if (!state.value.value)
                trigger.value?.focus();
        });
    }
}
onMounted(() => document.addEventListener('pointerdown', outside));
onUnmounted(() => document.removeEventListener('pointerdown', outside));
</script>
<template>
<div ref="root" data-krds-part="root" :data-krds-state="state.value.value?'open':'closed'" @keydown="key" data-krds-component="language-switcher">
<button v-if="options.length>=3" ref="trigger" type="button" data-krds-part="trigger" :aria-expanded="state.value.value" :aria-controls="id" @click="state.request(!state.value.value)" data-krds-component="language-switcher" data-krds-state="">언어: {{options.find(option=>option.locale===currentLocale)?.nativeLabel??currentLocale}}</button>
<ul :id="id" data-krds-part="list" :hidden="options.length>=3&&!state.value.value" data-krds-component="language-switcher" data-krds-state="">
<li v-for="option in options" :key="option.locale">
<a :aria-label="option.nativeLabel" :aria-description="option.separateService?'새 창에서 별도 서비스 열기':undefined" data-krds-part="option" :href="option.href" :lang="option.locale" :aria-current="option.locale===currentLocale?'true':undefined" :target="option.separateService?'_blank':undefined" :rel="option.separateService?'noopener noreferrer':undefined" @click="emit('localeRequest',{locale:option.locale,href:option.href})" data-krds-component="language-switcher" data-krds-state="">{{option.nativeLabel}}<span v-if="option.translatedLabel!==option.nativeLabel"> ({{option.translatedLabel}})</span>
<span v-if="option.separateService"> (새 창)</span>
</a>
</li>
</ul>
</div>
</template>
