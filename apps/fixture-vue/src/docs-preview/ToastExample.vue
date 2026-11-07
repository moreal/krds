<script setup lang="ts">
import { ref } from 'vue';
import { Button, Toast, type ToastMessage } from '@unofficial-krds/vue';
const toast=ref<ToastMessage|null>(null);
const saved=ref(false);
function save(){saved.value=true;toast.value={id:'saved',text:'신청이 저장되었습니다.',tone:'information',persistentResultId:'example-saved-result'};}
</script>
<template><div><Button variant="secondary" size="small" @click="save">신청 저장</Button><p id="example-saved-result">{{saved?'신청이 저장되었습니다.':'저장 전입니다.'}}</p><Toast :message="toast" @dismiss="toast=null"/></div></template>
