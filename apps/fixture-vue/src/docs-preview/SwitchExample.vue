<script setup lang="ts">
import { ref } from 'vue';
import { Button, Switch } from '@unofficial-krds/vue';
const enabled=ref(false);
const result=ref('');
function submit(event:Event){result.value=JSON.stringify(Object.fromEntries(new FormData((event.currentTarget as HTMLButtonElement).form!)));}
</script>
<template><div><form id="example-form" @reset="enabled=false;result=''"><Switch v-model="enabled" label="알림 사용" name="notifications"/><Button variant="secondary" size="small" @click="submit">입력 확인</Button><output aria-label="입력 결과">{{result}}</output></form><p role="status">현재 값: {{enabled}}</p><div class="actions"><Button type="reset" form="example-form" variant="tertiary" size="small">초기화</Button></div></div></template>
