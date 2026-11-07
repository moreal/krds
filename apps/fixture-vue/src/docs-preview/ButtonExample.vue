<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@unofficial-krds/vue';
const count=ref(0);
</script>
<template><div><Button @click="count++">신청하기</Button><p role="status">{{ count ? `신청이 ${count}회 완료되었습니다.` : "아직 신청하지 않았습니다." }}</p></div></template>
