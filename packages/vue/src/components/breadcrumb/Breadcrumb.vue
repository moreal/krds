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
const limit = computed(() => Math.max(2, Math.min(p.maxVisible ?? 4, narrow.value ? 2 : Infinity)));
const omitted = computed(() => p.items.length + 1 > limit.value ? p.items.slice(0, -(limit.value - 1)) : []);
const visible = computed(() => omitted.value.length ? p.items.slice(-(limit.value - 1)) : p.items);
</script>
<template>
<nav aria-label="브레드크럼" data-krds-part="root" data-krds-component="breadcrumb" data-krds-state="">
<ol data-krds-part="list" data-krds-component="breadcrumb" data-krds-state="">
<li data-krds-part="item" data-krds-component="breadcrumb" data-krds-state="">
<a data-krds-part="home" :href="home.href" :target="home.target" :rel="home.target==='_blank'?[home.rel,'noopener noreferrer'].filter(Boolean).join(' '):home.rel" data-krds-component="breadcrumb" data-krds-state="">{{home.label}}<span v-if="home.target==='_blank'"> (새 창)</span>
</a>
</li>
<li v-if="omitted.length" data-krds-part="item" data-krds-component="breadcrumb" data-krds-state="">
<span data-krds-part="separator" aria-hidden="true" data-krds-component="breadcrumb" data-krds-state=""> / </span><span data-krds-part="ellipsis" role="img" :aria-label="`생략된 경로: ${omitted.map(item=>item.label).join(', ')}`" data-krds-component="breadcrumb" data-krds-state="">…</span>
</li>
<li v-for="item in visible" :key="item.id" data-krds-part="item" data-krds-component="breadcrumb" data-krds-state="">
<span data-krds-part="separator" aria-hidden="true" data-krds-component="breadcrumb" data-krds-state=""> / </span><a v-if="item.href" data-krds-part="link" :href="item.href" data-krds-component="breadcrumb" data-krds-state="">{{item.label}}</a><span v-else data-krds-part="link" data-krds-component="breadcrumb" data-krds-state="">{{item.label}}</span>
</li>
<li v-if="omitCurrent===false&&currentItem" data-krds-part="item" data-krds-component="breadcrumb" data-krds-state="">
<span data-krds-part="separator" aria-hidden="true" data-krds-component="breadcrumb" data-krds-state=""> / </span><span data-krds-part="link" aria-current="page" data-krds-component="breadcrumb" data-krds-state="">{{currentItem.label}}</span>
</li>
</ol>
</nav>
</template>
