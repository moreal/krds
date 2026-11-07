<script setup lang="ts">
import { Favicon } from '@unofficial-krds/vue';
</script>
<template><div><Favicon :light="{href:'/krds/previews/vue/local-assets/specimen-icon-light.svg',type:'image/svg+xml',sizes:'any'}" :dark="{href:'/krds/previews/vue/local-assets/specimen-icon-dark.svg',type:'image/svg+xml',sizes:'any'}"/><p>이 예제 문서의 탭 아이콘을 로컬 이미지로 설정했습니다.</p><img :src="'/krds/previews/vue/local-assets/specimen-icon-light.svg'" width="48" height="48" alt="로컬 예제 탭 아이콘 미리보기"/></div></template>
