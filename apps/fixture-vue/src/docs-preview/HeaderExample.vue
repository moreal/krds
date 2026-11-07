<script setup lang="ts">
import { ref } from 'vue';
import { Header, SkipLink, type NavigationItem } from '@unofficial-krds/vue';
const navigation: readonly NavigationItem[] = [{id:'home',label:'홈',href:'#local-home'},{id:'apply',label:'신청',children:[{id:'new',label:'신규 신청',href:'#local-apply'},{id:'history',label:'신청 내역',href:'#local-history'}]},{id:'support',label:'지원',href:'#local-support'}];
const logo = {src:'/krds/previews/vue/local-assets/specimen-logo.svg',alt:'독립 예제 운영기관'};
const searched=ref(0);
</script>
<template><div><SkipLink :links="[{id:'main',label:'본문 바로가기',targetId:'example-main'}]"/><Header :home="{href:'#local-home',label:'독립 예제 홈',logo}" :utility-items="[{id:'policy',label:'이용약관',href:'#local-policy'}]" :main-navigation="navigation" :search="{label:'검색',onRequest:()=>searched++}"/><main id="example-main" tabindex="-1" style="min-height:900px"><h1>예제 신청 서비스</h1><p>지역별 신청 정보를 확인하세요.</p><p role="status">검색 요청 {{searched}}회</p></main></div></template>
