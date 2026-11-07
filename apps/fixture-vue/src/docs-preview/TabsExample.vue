<script setup lang="ts">
import { ref } from 'vue';
import { Tabs } from '@unofficial-krds/vue';
const tab=ref('summary');
</script>
<template><div><Tabs v-model="tab" label="신청 정보" :items="[{value:'summary',label:'요약'},{value:'details',label:'상세'}]"><template #summary>신청 요약입니다.</template><template #details>신청 상세 내용입니다.</template></Tabs></div></template>
