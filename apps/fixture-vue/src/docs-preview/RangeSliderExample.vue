<script setup lang="ts">
import { ref } from 'vue';
import { Button, RangeSlider } from '@unofficial-krds/vue';
const volume=ref(50);
const result=ref('');
function submit(event:Event){result.value=JSON.stringify(Object.fromEntries(new FormData((event.currentTarget as HTMLButtonElement).form!)));}
</script>
<template><div><form id="example-form" @reset="volume=50;result=''"><RangeSlider v-model="volume" label="알림 음량" name="volume" :min="0" :max="100" :step="10"/><Button variant="secondary" size="small" @click="submit">입력 확인</Button><output aria-label="입력 결과">{{result}}</output></form><p role="status">현재 값: {{volume}}</p><div class="actions"><Button type="reset" form="example-form" variant="tertiary" size="small">초기화</Button></div></div></template>
