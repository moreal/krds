<script setup lang="ts">
import { ref } from 'vue';
import { Button, RadioGroup } from '@unofficial-krds/vue';
const choice=ref<string|null>(null);
const changes=ref(0);
const result=ref('');
function change(value:string|null){choice.value=value;changes.value++;}
function submit(event:Event){result.value=JSON.stringify(Object.fromEntries(new FormData((event.currentTarget as HTMLButtonElement).form!)));}
</script>
<template><div><form id="example-form" @reset="choice=null;changes=0;result=''"><RadioGroup :model-value="choice" label="거주 지역" name="region" :options="[{label:'서울',value:'seoul'},{label:'부산',value:'busan'},{label:'제주',value:'jeju',disabled:true}]" @update:model-value="change"/><Button variant="secondary" size="small" @click="submit">입력 확인</Button><output aria-label="입력 결과">{{result}}</output></form><p role="status">현재 값: {{choice}} (변경 {{changes}}회)</p><div class="actions"><Button type="reset" form="example-form" variant="tertiary" size="small">초기화</Button></div></div></template>
