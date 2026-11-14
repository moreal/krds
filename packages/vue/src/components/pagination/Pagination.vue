<script setup lang="ts">
import { computed, ref, watch, nextTick, useId, onMounted, onUnmounted } from 'vue';
import type { PaginationContract } from '@unofficial-krds/contracts';
import { useOwned, useNativeReset, focusDestination } from '../catalog-state';
const p = defineProps<PaginationContract>();
const emit = defineEmits<{
    pageChange: [
        detail: {
            page: number;
        }
    ];
}>();
const state = useOwned(() => p.page, () => p.defaultPage, 1, page => emit('pageChange', { page }));
const draft = ref(String(state.value.value)), invalid = ref(false), input = ref<HTMLInputElement>();
const uid = useId(), errorId = `${uid}-pagination-error`, inputId = `${uid}-pagination-input`, narrow = ref(false);
let media: MediaQueryList | undefined;
function responsive() { narrow.value = media?.matches ?? false; }
onMounted(() => { media = matchMedia('(max-width: 767px)'); responsive(); media.addEventListener('change', responsive); });
onUnmounted(() => media?.removeEventListener('change', responsive));
const pages = computed(() => {
    const count = p.pageCount, limit = narrow.value ? 7 : 11;
    if (count <= limit)
        return Array.from({ length: count }, (_, i) => i + 1);
    const length = limit - 4;
    let start = Math.max(2, state.value.value - Math.floor(length / 2));
    let end = Math.min(count - 1, start + length - 1);
    start = Math.max(2, end - length + 1);
    return [1, ...(start > 2 ? ['gap-before'] : []), ...Array.from({ length: end - start + 1 }, (_, i) => start + i), ...(end < count - 1 ? ['gap-after'] : []), count];
});
useNativeReset(input, () => { draft.value = String(state.value.value); invalid.value = false; }, () => {
    if (input.value)
        input.value.value = draft.value;
});
function enter(event: KeyboardEvent) {
    if (event.isComposing || event.keyCode === 229)
        return;
    event.preventDefault();
    go();
}
watch(state.value, value => { draft.value = String(value); invalid.value = false; });
function go() {
    const page = Number(draft.value);
    if (!/^\d+$/.test(draft.value) || !Number.isInteger(page) || page < 1 || page > p.pageCount) {
        invalid.value = true;
        return;
    }
    invalid.value = false;
    state.request(page);
}
watch(() => p.loadMore?.shown, async (value, old) => {
    if (value !== undefined && old !== undefined && value > old && p.loadMore?.firstNewItemId) {
        await nextTick();
        focusDestination(p.loadMore.firstNewItemId);
    }
});
</script>
<template>
<nav data-krds-component="pagination" data-krds-part="root" data-krds-state="" :data-krds-variant="variant??'number-links'" :aria-label="variant==='load-more'?'결과 더보기':'페이지 이동'">
<template v-if="variant!=='load-more'">
<a v-if="state.value.value>1" data-krds-component="pagination" data-krds-part="previous" data-krds-state="" :href="hrefForPage(state.value.value-1)" rel="prev">이전</a>
<ol data-krds-component="pagination" data-krds-part="list" data-krds-state="">
<li v-for="page in pages" :key="page" data-krds-component="pagination" data-krds-part="item" data-krds-state="">
<span v-if="typeof page==='string'" data-krds-component="pagination" data-krds-part="ellipsis" data-krds-state="">…</span>
<a v-else data-krds-component="pagination" data-krds-part="link" :data-krds-state="page===state.value.value?'current':''" :href="page===state.value.value?undefined:hrefForPage(page)" :tabindex="page===state.value.value?-1:undefined" :aria-current="page===state.value.value?'page':undefined">{{page}}</a>
</li>
</ol>
<a v-if="state.value.value<pageCount" data-krds-component="pagination" data-krds-part="next" data-krds-state="" :href="hrefForPage(state.value.value+1)" rel="next">다음</a>
<template v-if="variant==='direct-page'">
<label :for="inputId">페이지</label><input :id="inputId" ref="input" v-model="draft" data-krds-component="pagination" data-krds-part="input" :data-krds-state="invalid?'invalid':''" inputmode="numeric" type="text" :aria-invalid="invalid||undefined" :aria-describedby="invalid?errorId:undefined" @keydown.enter="enter"/>
<span data-krds-component="pagination" data-krds-part="total" data-krds-state="">/ {{pageCount}}</span><button type="button" data-krds-component="pagination" data-krds-part="go" data-krds-state="" @click="go">이동</button>
<p v-if="invalid" :id="errorId" role="status">1부터 {{pageCount}} 사이의 페이지를 입력하세요.</p>
</template>
</template>
<template v-else-if="loadMore">
<p data-krds-component="pagination" data-krds-part="count" data-krds-state="" role="status">{{loadMore.shown}} / {{loadMore.total}}</p><button type="button" data-krds-component="pagination" data-krds-part="load-more" :data-krds-state="loadMore.pending?'pending':''" :disabled="loadMore.pending||loadMore.shown>=loadMore.total" @click="loadMore.onLoadMore()">더 보기</button>
</template>
</nav>
</template>
