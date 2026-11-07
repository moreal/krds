<script setup lang="ts">
import { ref } from 'vue';
import { InPageNavigation } from '@unofficial-krds/vue';
const active=ref('overview');
</script>
<template><div class="preview-outline"><InPageNavigation :sections="[{id:'overview',label:'신청 개요'},{id:'requirements',label:'신청 조건'}]" title="이 페이지의 구성" :active-id="active" narrow-mode="inline" @active-change="active=$event.id"/><article><section id="overview" style="min-height:500px" tabindex="-1"><h2>신청 개요</h2><p>예제 신청 서비스의 개요입니다.</p></section><section id="requirements" style="min-height:500px" tabindex="-1"><h2>신청 조건</h2><p>거주 지역과 제출 서류를 확인하세요.</p></section></article></div></template>
