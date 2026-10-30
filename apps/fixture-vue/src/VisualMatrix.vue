<script setup lang="ts">
import { ref } from 'vue';
import { Button, NativeSelect, DateInput, Tabs, Calendar, Modal } from '@unofficial-krds/vue';
const open=ref(false);
const sizes=['xsmall','small','medium','large','xlarge'] as const;
</script>
<template>
<section aria-label="Native Vue visual matrix" style="display:grid;gap:1rem;max-width:100%">
<h1>Vue 네이티브 파일럿</h1>
<div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap"><Button v-for="size in sizes" :key="size" :size="size">{{size}}</Button><Button disabled>비활성화</Button><Button variant="icon" aria-label="정보"><template #icon>ⓘ</template></Button></div>
<NativeSelect label="지역" size="small" :options="[{value:'seoul',label:'서울'}]" hint="지역을 선택하세요"/>
<NativeSelect label="큰 선택" size="large" :options="[{value:'seoul',label:'서울'}]" invalid error="선택을 확인하세요"/>
<NativeSelect label="비활성 지역" :options="[{value:'seoul',label:'서울'}]" disabled/>
<DateInput label="방문일" default-value="2024-02-29" invalid error="날짜를 확인하세요" reference-date="2024-02-15"/>
<DateInput label="비활성 날짜" default-value="2024-02-29" disabled/>
<DateInput mode="range" label="신청 기간" :default-value="{start:'2024-02-12',end:'2024-02-18'}" reference-date="2024-02-15"/>
<Tabs label="지역 정보" :items="[{value:'first',label:'첫 번째'},{value:'second',label:'두 번째'},{value:'third',label:'사용 불가',disabled:true}]"><template #first>신청 안내</template><template #second><input aria-label="상세 입력"/></template></Tabs>
<Calendar mode="range" label="방문 범위" :default-value="{start:'2024-02-12',end:'2024-02-18'}" reference-date="2024-02-15" today="2024-02-15" min="2024-02-03" max="2024-03-10"/>
<Button @click="open=true">모달 열기</Button>
<Modal v-model="open" title="신청 확인"><p>이 모달은 작은 화면에서도 스크롤할 수 있습니다.</p><label for="modal-note">메모</label><input id="modal-note"/><template #actions="{close}"><Button data-krds-close @click="close">취소</Button></template></Modal>
</section>
</template>
