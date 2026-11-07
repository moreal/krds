<script setup lang="ts">
import { Breadcrumb } from '@unofficial-krds/vue';
</script>
<template><div><Breadcrumb :home="{label:'홈',href:'#local-home'}" :items="[{id:'apply',label:'신청',href:'#local-apply'}]" :omit-current="false" :current-item="{id:'detail',label:'신청 상세'}"/></div></template>
