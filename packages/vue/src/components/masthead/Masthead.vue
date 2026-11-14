<script setup lang="ts">
import type { MastheadContract } from '@unofficial-krds/contracts';
defineProps<MastheadContract>();
</script>
<template>
<div v-if="governmentService" data-krds-component="masthead" data-krds-part="root" data-krds-state="">
<p data-krds-component="masthead" data-krds-part="text" data-krds-state="">이 누리집은 대한민국 공식 전자정부 누리집입니다.</p>
</div>
</template>
