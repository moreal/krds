<script setup lang="ts">
import type { IdentifierContract } from '@unofficial-krds/contracts';
defineProps<IdentifierContract>();
</script>
<template>
<section data-krds-part="root" :data-krds-theme="theme??'light'" data-krds-component="identifier" data-krds-state="">
<img data-krds-part="logo" :src="logo.src" :alt="logo.alt"  data-krds-component="identifier" data-krds-state=""/>
<p data-krds-part="text" data-krds-component="identifier" data-krds-state="">{{relationshipText}}</p>
</section>
</template>
