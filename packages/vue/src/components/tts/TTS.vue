<script setup lang="ts">
import { computed, onUnmounted } from 'vue';
import type { TTSContract } from '@unofficial-krds/contracts';
const p = defineProps<TTSContract>();
const playLabel = computed(() => `${p.label} ${p.state === 'paused' || p.state === 'error' ? '다시 재생' : '재생'}`);
const hiddenLabel = { position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap' } as const;
const emit = defineEmits<{
    request: [
        detail: {
            action: 'play' | 'pause' | 'resume' | 'stop';
            summary: string;
            locale: string;
        }
    ];
}>();
function request(action: 'play' | 'pause' | 'resume' | 'stop') { emit('request', { action, summary: p.summary, locale: p.locale }); }
onUnmounted(() => {
    if (p.state === 'playing' || p.state === 'paused')
        request('stop');
});
</script>
<template>
<div data-krds-part="root" :data-krds-state="state" :data-krds-size="size??'small'" :data-krds-icon-only="iconOnly||undefined" data-krds-component="tts">
<span :style="iconOnly?hiddenLabel:undefined" data-krds-part="label" data-krds-component="tts" data-krds-state="">{{label}}</span>
<button type="button" :aria-label="playLabel" data-krds-part="play" :disabled="state==='unsupported'||state==='playing'" @click="request(state==='paused'?'resume':'play')" data-krds-component="tts" data-krds-state="">
<svg v-if="iconOnly" aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
<path d="M5 8h4l5-4v16l-5-4H5zM17 8q4 4 0 8" fill="none" stroke="currentColor" stroke-width="2"/>
</svg>
<span v-else>{{playLabel}}</span>
</button>
<button type="button" :aria-label="`${label} 일시정지`" data-krds-part="pause" :disabled="state!=='playing'" @click="request('pause')" data-krds-component="tts" data-krds-state="">{{label}} 일시정지</button>
<button type="button" :aria-label="`${label} 중지`" data-krds-part="stop" :disabled="!['playing','paused'].includes(state)" @click="request('stop')" data-krds-component="tts" data-krds-state="">{{label}} 중지</button>
<p data-krds-part="status" :data-krds-state="state" data-krds-component="tts">{{state==='unsupported'?'읽어주기를 지원하지 않습니다.':state==='error'?'읽어주기에 실패했습니다.':state==='playing'?'재생 중':state==='paused'?'일시 정지됨':'대기 중'}}</p>
</div>
</template>
