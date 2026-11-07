<script setup lang="ts">
import { CriticalAlert } from '@unofficial-krds/vue';

</script>
<template><div><CriticalAlert urgency="low" label="서비스 안내" message="이 페이지는 독립 로컬 예제입니다." :details="{label:'상세 안내',href:'#local-details',destinationTitle:'상세 안내'}"/></div></template>
