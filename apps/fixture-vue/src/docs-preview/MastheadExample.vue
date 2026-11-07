<script setup lang="ts">
import { Masthead, SkipLink } from '@unofficial-krds/vue';
</script>
<template><div><SkipLink :links="[{id:'main',label:'본문 바로가기',targetId:'example-main'}]"/><p role="note">공식 정부서비스를 가정한 배너 UI 예시입니다. 실제 정부 서비스가 아닌 디자인 시뮬레이션입니다.</p><Masthead :government-service="true"/><main id="example-main" tabindex="-1"><h2>독립 로컬 예제</h2></main></div></template>
