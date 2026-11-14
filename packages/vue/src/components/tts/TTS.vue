<script setup lang="ts">
import { computed, onUnmounted } from 'vue';
import type { TTSContract } from '@unofficial-krds/contracts';
const p = defineProps<TTSContract>();
const playLabel = computed(() => `${p.label} ${p.state === 'paused' || p.state === 'error' ? '다시 재생' : '재생'}`);
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
<div data-krds-part="root" :data-krds-state="state" :data-krds-size="size??'small'" data-krds-component="tts">
<button type="button" :aria-label="playLabel" data-krds-part="play" :disabled="state==='unsupported'||state==='playing'" @click="request(state==='paused'?'resume':'play')" data-krds-component="tts" data-krds-state="">
<span v-if="iconOnly" aria-hidden="true">▶</span>
<span v-else data-krds-part="label" data-krds-component="tts" data-krds-state="">{{playLabel}}</span>
</button>
<template v-if="state==='playing'||state==='paused'">
<button type="button" :aria-label="`${label} 일시정지`" data-krds-part="pause" :disabled="state==='paused'" @click="request('pause')" data-krds-component="tts" data-krds-state="">
<span v-if="iconOnly" aria-hidden="true">Ⅱ</span>
<template v-else>{{label}} 일시정지</template>
</button>
<button type="button" :aria-label="`${label} 중지`" data-krds-part="stop" @click="request('stop')" data-krds-component="tts" data-krds-state="">
<span v-if="iconOnly" aria-hidden="true">■</span>
<template v-else>{{label}} 중지</template>
</button>
</template>
<span data-krds-part="status" role="status" data-krds-state="" data-krds-component="tts">{{state==='unsupported'?'음성 읽기를 지원하지 않습니다.':state==='error'?'읽기에 실패했습니다. 다시 시도하세요.':state==='playing'?'읽는 중':state==='paused'?'일시정지':''}}</span>
</div>
</template>
