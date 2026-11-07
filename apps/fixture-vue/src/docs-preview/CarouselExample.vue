<script setup lang="ts">
import { ref } from 'vue';
import { Carousel } from '@unofficial-krds/vue';
const requests=ref(0);
</script>
<template><div><Carousel :autoplay="true" :interval-ms="6000" :items="[{id:'one',label:'신청 안내',content:'첫 번째 신청 안내'},{id:'two',label:'서류 안내',content:'두 번째 서류 안내'},{id:'three',label:'문의 안내',content:'세 번째 문의 안내'}]" @playing-change="requests++"/><p role="status">자동 재생 요청 {{requests}}회</p></div></template>
