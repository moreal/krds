<script setup lang="ts">
import { TextList } from '@unofficial-krds/vue';
</script>
<template><div><h2>순서 목록</h2><TextList ordered :items="[{id:'one',content:'신청서를 작성합니다.',children:[{id:'one-child',content:'필수 항목을 확인합니다.'}]},{id:'two',content:'제출합니다.'}]"/><h2>글머리 목록</h2><TextList :ordered="false" marker="dot" :items="[{id:'a',content:'신청 조건 확인'},{id:'b',content:'제출 서류 준비'}]"/></div></template>
