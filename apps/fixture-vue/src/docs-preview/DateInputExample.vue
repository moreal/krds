<script setup lang="ts">
import { ref } from 'vue';
import { DateInput } from '@unofficial-krds/vue';
const name=ref('');
const date=ref('2024-02-29');
</script>
<template><div><DateInput v-model="date" name="visit" label="방문일" reference-date="2024-02-15"/><p role="status">{{date}}</p></div></template>
