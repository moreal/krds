<script setup lang="ts">
import { ref } from 'vue';
import { Button, Snackbar, type SnackbarMessage } from '@unofficial-krds/vue';
const message=ref<SnackbarMessage|null>(null);
const result=ref('저장 전입니다.');
const count=ref(0);
function save(){count.value++;result.value=`신청을 저장했습니다 (${count.value}회).`;message.value={id:'saved',title:'저장 완료',text:'신청이 저장되었습니다.'};}
</script>
<template><div><Button id="snack-origin" variant="secondary" size="small" @click="save">저장</Button><p role="status">{{result}}</p><Snackbar :message="message" :action="{kind:'link',id:'history',label:'신청 내역',href:'#local-history'}" :duration-ms="5000" fallback-focus-id="snack-origin" @dismiss="message=null"/></div></template>
