<script setup lang="ts">
import { SkipLink } from '@unofficial-krds/vue';
</script>
<template><div><SkipLink :links="[{id:'main',label:'본문 바로가기',targetId:'example-main'}]"/><div role="banner"><p>예제 서비스 머리말</p><a href="#local-home">예제 홈</a></div><main id="example-main" tabindex="-1"><h2>신청 본문</h2><p>본문 내용입니다.</p></main></div></template>
