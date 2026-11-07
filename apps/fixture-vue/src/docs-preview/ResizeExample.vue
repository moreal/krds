<script setup lang="ts">
import { ref } from 'vue';
import { Button, Resize } from '@unofficial-krds/vue';
const scale=ref('100');
</script>
<template><div><Resize :value="scale" @value-change="scale=$event.value"/><section class="resized" :style="{fontSize:`${Number(scale)/100*16}px`}">확대된 예제 내용과 <Button variant="secondary" size="small">작업</Button></section></div></template>
