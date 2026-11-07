<script setup lang="ts">
import { computed, ref } from 'vue';
import { Tag } from '@unofficial-krds/vue';
const selected=ref<readonly string[]>([]);
const labels:Record<string,string>={a:'서울',b:'부산'};
const text=computed(()=>selected.value.map(id=>labels[id]).join(', ')||'없음');
</script>
<template><div><Tag :items="[{id:'a',label:'서울'},{id:'b',label:'부산'}]" mode="toggle" :selected-ids="selected" @selection-change="selected=$event.ids"/><p role="status">선택 지역: {{text}}</p></div></template>
