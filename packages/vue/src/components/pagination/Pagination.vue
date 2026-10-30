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
const errorId = `${useId()}-pagination-error`, narrow = ref(false);
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
<nav :aria-label="variant==='load-more'?'결과 더보기':'페이지 이동'" data-krds-part="root" :data-krds-variant="variant??'number-links'" data-krds-component="pagination" data-krds-state="">
<template v-if="variant!=='load-more'">
<a data-krds-part="previous" :href="state.value.value>1?hrefForPage(state.value.value-1):undefined" :aria-disabled="state.value.value===1||undefined" data-krds-component="pagination" data-krds-state="">이전</a>
<ul data-krds-part="list" data-krds-component="pagination" data-krds-state="">
<li v-for="page in pages" :key="page" data-krds-part="item" :data-krds-state="page===state.value.value?'current':''" data-krds-component="pagination">
<span v-if="typeof page==='string'" aria-label="중간 페이지 생략">…</span>
<a v-else data-krds-part="link" :href="page===state.value.value?undefined:hrefForPage(page)" :aria-current="page===state.value.value?'page':undefined" data-krds-component="pagination" data-krds-state="">{{page}}</a>
</li>
</ul>
<a data-krds-part="next" :href="state.value.value<pageCount?hrefForPage(state.value.value+1):undefined" :aria-disabled="state.value.value===pageCount||undefined" data-krds-component="pagination" data-krds-state="">다음</a>
<template v-if="variant==='direct-page'">
<label>이동할 페이지<input ref="input" v-model="draft" data-krds-part="input" inputmode="numeric" :aria-invalid="invalid||undefined" :aria-describedby="errorId" @keydown.enter="enter" data-krds-component="pagination" data-krds-state=""/>
</label>
<span data-krds-part="count" data-krds-component="pagination" data-krds-state="">/ {{pageCount}}</span>
<button data-krds-part="go" type="button" @click="go" data-krds-component="pagination" data-krds-state="">이동</button>
<p v-if="invalid" :id="errorId" data-krds-part="total" data-krds-component="pagination" data-krds-state="">1에서 {{pageCount}} 사이의 페이지를 입력하세요.</p>
</template>
</template>
<template v-else-if="loadMore">
<button data-krds-part="load-more" type="button" :disabled="loadMore.pending||loadMore.shown>=loadMore.total" @click="loadMore.onLoadMore()" data-krds-component="pagination" data-krds-state="">{{loadMore.pending?'불러오는 중':'더 보기'}}</button>
<span data-krds-part="count" role="status" data-krds-component="pagination" data-krds-state="">{{loadMore.shown}} / {{loadMore.total}}</span>
</template>
</nav>
</template>
