<script setup lang="ts">
import { ref } from 'vue';
import { TabBar } from '@unofficial-krds/vue';
const tab=ref('summary');
</script>
<template><div><TabBar :items="[{id:'home',label:'홈',href:'#local-home',icon:'home'},{id:'apply',label:'신청',href:'#local-apply',icon:'document'}]" current-id="home"/></div></template>
