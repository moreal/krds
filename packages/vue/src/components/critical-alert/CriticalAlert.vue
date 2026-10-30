<script setup lang="ts">
import type { CriticalAlertContract } from '@unofficial-krds/contracts';
defineProps<CriticalAlertContract>();
</script>
<template>
<section data-krds-part="root" :data-krds-state="urgency" :data-krds-urgency="urgency" role="banner" :aria-label="label" data-krds-component="critical-alert">
<span data-krds-part="icon" aria-hidden="true" data-krds-component="critical-alert" data-krds-state="">!</span>
<strong data-krds-part="label" :data-krds-state="urgency" data-krds-component="critical-alert">{{label}}</strong>
<p data-krds-part="message" data-krds-component="critical-alert" data-krds-state="">{{message}}</p>
<a v-if="details" data-krds-part="link" :href="details.href" :title="details.destinationTitle" data-krds-component="critical-alert" data-krds-state="">{{details.label}}</a>
</section>
</template>
