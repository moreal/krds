<script setup lang="ts">
import { Identifier } from '@unofficial-krds/vue';
const logo = {src:'/krds/previews/vue/local-assets/specimen-logo.svg',alt:'독립 예제 운영기관'};
const identity = {institutionName:'독립 예제 운영기관',logo,relationshipText:'독립 예제 운영기관이 운영하는 예제 서비스입니다.'};
</script>
<template><div><footer><p>독립 예제 서비스 정보</p><Identifier v-bind="identity"/></footer></div></template>
