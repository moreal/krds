<script setup lang="ts">
import { ref } from 'vue';
import { Button, Textarea } from '@unofficial-krds/vue';
const reason=ref('');
const result=ref('');
function submit(event:Event){result.value=JSON.stringify(Object.fromEntries(new FormData((event.currentTarget as HTMLButtonElement).form!)));}
</script>
<template><div><form id="example-form" @reset="reason='';result=''"><Textarea v-model="reason" label="신청 사유" name="reason" :max-length="500"/><Button variant="secondary" size="small" @click="submit">입력 확인</Button><output aria-label="입력 결과">{{result}}</output></form><p role="status">현재 값: {{reason}}</p><div class="actions"><Button type="reset" form="example-form" variant="tertiary" size="small">초기화</Button></div></div></template>
