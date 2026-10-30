<script setup lang="ts">
import { ref } from 'vue';
import { Button, Calendar, DateInput, KrdsProvider, Modal, NativeSelect, Tabs, type DateValue } from '@unofficial-krds/vue';
import ButtonSubpath from '@unofficial-krds/vue/button';
const region=ref('seoul');const date=ref<DateValue>('2024-02-29');const tab=ref('summary');const open=ref(false);
</script>
<template><KrdsProvider locale="ko-KR"><Button type="button" @click="open=true">열기</Button><ButtonSubpath>하위 경로</ButtonSubpath><NativeSelect v-model="region" label="지역" :options="[{value:'seoul',label:'서울'}]"/><Tabs v-model="tab" label="신청 정보" :items="[{value:'summary',label:'요약'}]"><template #summary><DateInput v-model="date" name="visit" label="방문일" reference-date="2024-02-15"/></template></Tabs><Calendar v-model="date" label="방문일" reference-date="2024-02-15"/><Modal v-model="open" title="확인"><template #default="{close}"><Button data-krds-close @click="close">취소</Button></template></Modal></KrdsProvider></template>
