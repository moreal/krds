<script setup lang="ts">
import { ref } from 'vue';
import { BackButton } from '@unofficial-krds/vue';
const route=ref('신청 상세');
</script>
<template><div><BackButton label="이전 화면" :can-go-back="true" @back-request="route='신청 안내'"/><p role="status">현재 화면: {{route}}</p></div></template>
