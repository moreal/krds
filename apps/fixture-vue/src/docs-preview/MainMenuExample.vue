<script setup lang="ts">
import { MainMenu, type NavigationItem } from '@unofficial-krds/vue';
const navigation: readonly NavigationItem[] = [{id:'home',label:'홈',href:'#local-home'},{id:'support',label:'지원',href:'#local-support'},{id:'apply',label:'신청',children:[{id:'new',label:'신규 신청',href:'#local-apply'}]}];
</script>
<template><div><MainMenu :items="navigation" current-id="home"/></div></template>
