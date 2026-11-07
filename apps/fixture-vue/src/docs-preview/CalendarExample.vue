<script setup lang="ts">
import { ref } from 'vue';
import { Calendar } from '@unofficial-krds/vue';
const date=ref('2024-02-29');
</script>
<template><div><Calendar v-model="date" label="방문일" reference-date="2024-02-15"/><p role="status">{{date}}</p></div></template>
