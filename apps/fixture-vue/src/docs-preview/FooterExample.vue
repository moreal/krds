<script setup lang="ts">
import { Footer } from '@unofficial-krds/vue';
const logo = {src:'/krds/previews/vue/local-assets/specimen-logo.svg',alt:'독립 예제 운영기관'};
const identity = {institutionName:'독립 예제 운영기관',logo,relationshipText:'독립 예제 운영기관이 운영하는 예제 서비스입니다.'};
</script>
<template><div><Footer :service-logo="logo" :contacts="[{label:'예제 문의',text:'example@example.test',href:'mailto:example@example.test'}]" :utility-links="[]" :privacy-policy="{label:'개인정보 처리방침',href:'#local-privacy'}" :policy-links="[]" copyright-text="독립 로컬 예제 콘텐츠" :institution="identity"/></div></template>
