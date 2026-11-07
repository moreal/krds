<script setup lang="ts">
import { ref } from 'vue';
import { Button, Spinner } from '@unofficial-krds/vue';
const done=ref(false);
</script>
<template><div><Spinner :pending="!done" label="신청 내역 불러오는 중" completion-message="신청 내역을 불러왔습니다." :value="done ? 100 : 40"/><Button variant="secondary" size="small" :disabled="done" @click="done=true">작업 완료</Button></div></template>
