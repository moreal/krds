<script setup lang="ts">
import { ref } from 'vue';
import { Button, StructuredList } from '@unofficial-krds/vue';
const saved=ref(0);
</script>
<template><div><StructuredList :items="[{id:'a',title:'예제 신청 공고',href:'#local-notice-a',metadata:[{label:'마감일',value:'2026-11-30'},{label:'담당 부서',value:'예제 부서'}]},{id:'b',title:'다음 신청 공고',href:'#local-notice-b',metadata:[{label:'마감일',value:'2026-12-31'}]}]"><template #actions><Button variant="secondary" size="small" @click="saved++">저장</Button></template></StructuredList><p role="status">저장한 공고 {{saved}}건</p></div></template>
