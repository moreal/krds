<script setup lang="ts">
import { ref } from 'vue';
import { Button, Modal } from '@unofficial-krds/vue';
const open=ref(false);
const saved=ref(0);
</script>
<template><div><Button @click="open=true">확인 창 열기</Button><Modal v-model="open" title="신청 확인"><p>신청 내용을 확인하세요.</p><template #actions="{close}"><Button data-krds-close @click="saved++;close()">확인</Button><Button data-krds-close @click="close">취소</Button></template></Modal><p role="status">저장 {{saved}}회</p></div></template>
