<script setup lang="ts">
import { ref } from 'vue';
import { TTS, type TTSContract } from '@unofficial-krds/vue';
const speech=ref<TTSContract['state']>('idle');
function speechRequest(detail:Parameters<NonNullable<TTSContract['onRequest']>>[0]){speech.value=detail.action==='stop'?'idle':detail.action==='pause'?'paused':'playing';}
</script>
<template><div><p role="note">로컬 음성 안내 시뮬레이션입니다. 실제 음성이나 외부 음성 서비스를 사용하지 않습니다.</p><TTS summary="이 페이지는 신청 방법을 안내합니다." locale="ko-KR" :state="speech" label="음성 안내" @request="speechRequest"/><p role="status">요청 상태: {{speech}}</p></div></template>
