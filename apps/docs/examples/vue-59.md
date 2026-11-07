# vue · 컴포넌트 6개 {#vue-·-6-components}

이 컴파일러 체크포인트는 아래 소스를 생산자의 공개 빌드 패키지 검사에 묶습니다. 원래의 import와 로컬 상태를 포함합니다. 최신 네이티브 후보, 동작, SSR/resume, 릴리스를 인증하지 않습니다.

- Nx 버전 적용 완료 후 새로 만든 컴파일러 체크포인트입니다. 공개 @unofficial-krds/vue 버전은 0.1.0입니다. 소스와 보존된 명령·로그 바이트는 해시로 고정됩니다. 컴파일 성공만으로는 네이티브 동작, SSR/하이드레이션/resume, 수동 검사, 최종 릴리스 인수가 인정되지 않습니다.

소스: [apps/fixture-vue/src/ConsumerExample.vue](/sources/apps/fixture-vue/src/ConsumerExample.vue.txt). SHA-256: `c7c607e17cf50712e67b7d213ae574127363098d5d41e27b5f1a9ba23af01d36`.

명령: `node tools/yarn.mjs workspace @unofficial-krds/fixture-vue typecheck`. [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).


```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button, Calendar, DateInput, KrdsProvider, Modal, NativeSelect, Tabs, type DateValue } from '@unofficial-krds/vue';
import ButtonSubpath from '@unofficial-krds/vue/button';
const region=ref('seoul');const date=ref<DateValue>('2024-02-29');const tab=ref('summary');const open=ref(false);
</script>
<template><KrdsProvider locale="ko-KR"><Button type="button" @click="open=true">열기</Button><ButtonSubpath>하위 경로</ButtonSubpath><NativeSelect v-model="region" label="지역" :options="[{value:'seoul',label:'서울'}]"/><Tabs v-model="tab" label="신청 정보" :items="[{value:'summary',label:'요약'}]"><template #summary><DateInput v-model="date" name="visit" label="방문일" reference-date="2024-02-15"/></template></Tabs><Calendar v-model="date" label="방문일" reference-date="2024-02-15"/><Modal v-model="open" title="확인"><template #default="{close}"><Button data-krds-close @click="close">취소</Button></template></Modal></KrdsProvider></template>
```

