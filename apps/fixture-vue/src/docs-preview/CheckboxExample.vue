<script setup lang="ts">
import { ref } from 'vue';
import { Button, Checkbox } from '@unofficial-krds/vue';
const agreed=ref(false);
const result=ref('');
function submit(event:Event){result.value=JSON.stringify(Object.fromEntries(new FormData((event.currentTarget as HTMLButtonElement).form!)));}
</script>
<template><div><form id="example-form" @reset="agreed=false;result=''"><Checkbox v-model="agreed" label="이용약관 동의" name="consent" value="agreed"/><Button variant="secondary" size="small" @click="submit">입력 확인</Button><output aria-label="입력 결과">{{result}}</output></form><p role="status">현재 값: {{agreed}}</p><div class="actions"><Button type="reset" form="example-form" variant="tertiary" size="small">초기화</Button></div></div></template>
