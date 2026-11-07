<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Pagination } from '@unofficial-krds/vue';
const hash=ref(location.hash);
const sync=()=>{hash.value=location.hash;};
onMounted(()=>addEventListener('hashchange',sync));
onUnmounted(()=>removeEventListener('hashchange',sync));
const page=computed(()=>{const match=/^#local-results-(\d+)$/.exec(hash.value);return match?Math.min(12,Math.max(1,Number(match[1]))):1;});
</script>
<template><div><Pagination :page="page" :page-count="12" :href-for-page="next=>`#local-results-${next}`"/><p role="status">현재 {{page}}쪽</p></div></template>
