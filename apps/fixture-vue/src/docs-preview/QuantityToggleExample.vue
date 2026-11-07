<script setup lang="ts">
import { ref } from 'vue';
import { Button, QuantityToggle } from '@unofficial-krds/vue';
const quantity=ref(2);
const result=ref('');
function submit(event:Event){result.value=JSON.stringify(Object.fromEntries(new FormData((event.currentTarget as HTMLButtonElement).form!)));}
</script>
<template><div><form id="example-form" @reset="quantity=2;result=''"><QuantityToggle v-model="quantity" label="신청 수량" name="quantity" :min="0" :max="3" :step="1" unit="개"/><Button variant="secondary" size="small" @click="submit">입력 확인</Button><output aria-label="입력 결과">{{result}}</output></form><p role="status">현재 값: {{quantity}}</p><div class="actions"><Button type="reset" form="example-form" variant="tertiary" size="small">초기화</Button></div></div></template>
