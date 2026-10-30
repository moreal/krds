<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import type { BreadcrumbContract } from '@unofficial-krds/contracts';
const p = withDefaults(defineProps<BreadcrumbContract>(), { omitCurrent: true });
if (p.omitCurrent === false && !p.currentItem)
    throw new TypeError('Explicit current item required');
const narrow = ref(false);
let media: MediaQueryList | undefined;
function responsive() { narrow.value = media?.matches ?? false; }
onMounted(() => { media = matchMedia('(max-width: 767px)'); responsive(); media.addEventListener('change', responsive); });
onUnmounted(() => media?.removeEventListener('change', responsive));
const limit = computed(() => p.maxVisible ?? (narrow.value ? 2 : 4));
const omitted = computed(() => p.items.length > limit.value);
const visible = computed(() => omitted.value ? p.items.slice(-(Math.max(2, limit.value) - 1)) : p.items);
</script>
<template>
<nav aria-label="브레드크럼" data-krds-part="root" data-krds-component="breadcrumb" data-krds-state="">
<ol data-krds-part="list" data-krds-component="breadcrumb" data-krds-state="">
<li data-krds-part="item" data-krds-component="breadcrumb" data-krds-state="">
<a data-krds-part="link" :href="home.href" :target="home.target" :rel="home.target==='_blank'?[home.rel,'noopener noreferrer'].filter(Boolean).join(' '):home.rel" data-krds-component="breadcrumb" data-krds-state="">{{home.label}}<span v-if="home.target==='_blank'"> (새 창)</span>
</a>
</li>
<li v-if="omitted" data-krds-part="ellipsis" data-krds-state="collapsed" data-krds-component="breadcrumb">
<span aria-label="중간 경로 생략">…</span>
</li>
<li v-for="item in visible" :key="item.id" data-krds-part="item" data-krds-component="breadcrumb" data-krds-state="">
<span data-krds-part="separator" aria-hidden="true" data-krds-component="breadcrumb" data-krds-state="">›</span>
<a v-if="item.href" data-krds-part="link" :href="item.href" data-krds-component="breadcrumb" data-krds-state="">{{item.label}}</a>
<span v-else>{{item.label}}</span>
</li>
<li v-if="omitCurrent===false&&currentItem" data-krds-part="item" data-krds-state="current" aria-current="page" data-krds-component="breadcrumb">
<span data-krds-part="separator" aria-hidden="true" data-krds-component="breadcrumb" data-krds-state="">›</span>{{currentItem.label}}</li>
</ol>
</nav>
</template>
