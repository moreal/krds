<script setup lang="ts">
import { ref } from 'vue';
import { FAB } from '@unofficial-krds/vue';
const count=ref(0);
</script>
<template><div><FAB label="새 신청" icon="plus" @action="count++"/><p role="status">새 신청 {{count}}건</p></div></template>
