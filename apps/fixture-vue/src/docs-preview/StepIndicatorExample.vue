<script setup lang="ts">
import { StepIndicator } from '@unofficial-krds/vue';
</script>
<template><div><StepIndicator mode="sequential" :steps="[{id:'a',label:'약관 확인',status:'complete'},{id:'b',label:'정보 입력',status:'current'},{id:'c',label:'신청 완료',status:'pending'}]"/></div></template>
