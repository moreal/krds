<script setup lang="ts">
import { watchEffect } from 'vue';
import { validateBadgeConfiguration } from './validation';
import type { BadgeContract } from '@unofficial-krds/contracts';
const p = defineProps<BadgeContract>();
watchEffect(() => validateBadgeConfiguration(p));
</script>
<template>
<span data-krds-part="root" :data-krds-state="[appearance??'outline',tone??'secondary',size??'medium',numeric?'numeric':''].filter(Boolean).join(' ')" :data-krds-appearance="appearance??'outline'" :data-krds-tone="tone??'secondary'" :data-krds-size="size??'medium'" data-krds-component="badge">{{label}}</span>
</template>
