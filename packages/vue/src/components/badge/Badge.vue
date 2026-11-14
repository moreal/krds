<script setup lang="ts">
import { watchEffect } from 'vue';
import { validateBadgeConfiguration } from './validation';
import type { BadgeContract } from '@unofficial-krds/contracts';
const p = defineProps<BadgeContract>();
watchEffect(() => validateBadgeConfiguration(p));
</script>
<template>
<span data-krds-part="root" :data-krds-state="numeric?'numeric':''" :data-krds-appearance="appearance??'outline'" :data-krds-tone="tone??'secondary'" :data-krds-size="size??'medium'" data-krds-component="badge"><span data-krds-part="label" data-krds-component="badge" data-krds-state="">{{label}}</span></span>
</template>
