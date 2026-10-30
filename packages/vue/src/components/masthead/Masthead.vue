<script setup lang="ts">
import type { MastheadContract } from '@unofficial-krds/contracts';
defineProps<MastheadContract>();
</script>
<template>
<div data-krds-part="root" data-krds-component="masthead" data-krds-state="">
<p v-if="!governmentService" data-krds-part="text" data-krds-component="masthead" data-krds-state="">비공식 독립 로컬 예제</p>
<p v-if="governmentService" data-krds-part="text" data-krds-component="masthead" data-krds-state="">이 누리집은 대한민국 공식 전자정부 누리집입니다.</p>
</div>
</template>
