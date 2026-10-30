# vue · 6 components

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Refreshed native Vue SFC compiler checkpoint against public package exports; source bytes remain unchanged. Native behavioral and final-candidate acceptance remain separate.

Source: [apps/fixture-vue/src/ConsumerExample.vue](/sources/apps/fixture-vue/src/ConsumerExample.vue.txt). SHA-256: `c7c607e17cf50712e67b7d213ae574127363098d5d41e27b5f1a9ba23af01d36`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-vue typecheck`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).


```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button, Calendar, DateInput, KrdsProvider, Modal, NativeSelect, Tabs, type DateValue } from '@unofficial-krds/vue';
import ButtonSubpath from '@unofficial-krds/vue/button';
const region=ref('seoul');const date=ref<DateValue>('2024-02-29');const tab=ref('summary');const open=ref(false);
</script>
<template><KrdsProvider locale="ko-KR"><Button type="button" @click="open=true">열기</Button><ButtonSubpath>하위 경로</ButtonSubpath><NativeSelect v-model="region" label="지역" :options="[{value:'seoul',label:'서울'}]"/><Tabs v-model="tab" label="신청 정보" :items="[{value:'summary',label:'요약'}]"><template #summary><DateInput v-model="date" name="visit" label="방문일" reference-date="2024-02-15"/></template></Tabs><Calendar v-model="date" label="방문일" reference-date="2024-02-15"/><Modal v-model="open" title="확인"><template #default="{close}"><Button data-krds-close @click="close">취소</Button></template></Modal></KrdsProvider></template>
```

