<script setup lang="ts">
import { ref } from 'vue';
import { NativeSelect } from '@unofficial-krds/vue';
const region=ref('seoul');
</script>
<template><div><NativeSelect v-model="region" label="지역" :options="[{value:'seoul',label:'서울'},{value:'busan',label:'부산'}]"/><p role="status">{{region}}</p></div></template>
