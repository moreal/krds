<script setup lang="ts">
import { ref } from 'vue';
import { Button, TextInput } from '@unofficial-krds/vue';
const name=ref('');
const result=ref('');
const clears=ref(0);
function submit(event:Event){result.value=JSON.stringify(Object.fromEntries(new FormData((event.currentTarget as HTMLButtonElement).form!)));}
</script>
<template><div><form id="example-form" @reset="name='';result='';clears=0"><TextInput v-model="name" label="신청인 이름" name="applicant" autocomplete="name" help-id="applicant-help" :icon-action="{label:'입력 지우기',onAction:()=>{name='';clears++;}}"/><p id="applicant-help">주민등록상 이름을 입력하세요.</p><Button variant="secondary" size="small" @click="submit">입력 확인</Button><output aria-label="입력 결과">{{result}}</output></form><p role="status">현재 값: {{name}} (지우기 {{clears}}회)</p><div class="actions"><Button type="reset" form="example-form" variant="tertiary" size="small">초기화</Button></div></div></template>
