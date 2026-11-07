<script setup lang="ts">
import { ref } from 'vue';
import { Button, BottomSheet, RadioGroup } from '@unofficial-krds/vue';
const region=ref<string|null>('seoul');
</script>
<template><div><BottomSheet title="지역 선택" description="예제 지역을 선택하세요" :default-open="true" :dismiss-on-outside="false"><template #trigger="{open:show}"><Button variant="secondary" size="small" @click="show">지역 선택 열기</Button></template><RadioGroup v-model="region" label="거주 지역" name="region" :options="[{value:'seoul',label:'서울'},{value:'busan',label:'부산'}]"/></BottomSheet><p role="status">선택 지역: {{region==='busan'?'부산':'서울'}}</p></div></template>
