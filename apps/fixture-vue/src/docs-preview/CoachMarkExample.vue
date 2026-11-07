<script setup lang="ts">
import { ref } from 'vue';
import { Button, CoachMark } from '@unofficial-krds/vue';
const open=ref(false);
</script>
<template><div><Button id="example-tour-start" variant="secondary" size="small" @click="open=true">따라하기 시작</Button><label for="example-target">신청인 이름</label><input id="example-target"/><div id="example-target-after"/><CoachMark :steps="[{id:'name',targetId:'example-target',title:'이름 입력',instruction:'신청인 이름을 입력하세요.'}]" :boundaries="[{targetId:'example-target',insertionBoundaryId:'example-target-after'}]" :open="open" start-action-id="example-tour-start" @open-change="open=$event.open"/></div></template>
