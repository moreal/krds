<script setup lang="ts">
import { ref, useId } from 'vue';
import type { AccessibleMediaContract } from '@unofficial-krds/contracts';
const p = defineProps<AccessibleMediaContract>();
const state = ref('paused');
const transcriptId = `${useId()}-transcript`;
</script>
<template>
<figure data-krds-part="root" :data-krds-state="state" :data-krds-kind="media.kind" data-krds-component="accessible-media">
<figcaption>{{title}}</figcaption>
<component :is="media.kind==='audio'?'audio':'video'" data-krds-part="media" data-krds-state="" controls preload="metadata" :aria-label="title" :aria-describedby="transcriptId" :poster="media.poster" @play="state='playing'" @pause="state='paused'" @ended="state='ended'" @error="state='error'" data-krds-component="accessible-media">
<source :src="media.src" :type="media.type"/>
<track v-for="track in captionTracks" :key="track.lang" data-krds-part="caption-track" kind="captions" :src="track.src" :srclang="track.lang" :label="track.label" data-krds-component="accessible-media" data-krds-state=""/>
<track v-if="descriptionTrack" kind="descriptions" :src="descriptionTrack.src" :srclang="descriptionTrack.lang" :label="descriptionTrack.label"/>
</component>
<section :aria-label="`${title} 대체 정보`" data-krds-part="alternatives" data-krds-component="accessible-media" data-krds-state="">
<div v-if="transcript.content!==undefined" :id="transcriptId" data-krds-component="accessible-media" data-krds-part="transcript" data-krds-state="">{{transcript.content}}</div>
<a v-else :id="transcriptId" data-krds-component="accessible-media" data-krds-part="transcript" data-krds-state="" :href="transcript.href">대본 읽기</a>
<a v-if="signLanguageSource" data-krds-part="sign-language" :href="signLanguageSource" data-krds-component="accessible-media" data-krds-state="">수어 영상</a>
</section>
<p v-if="state==='error'" role="status">미디어를 재생할 수 없습니다. 대본을 확인하세요.</p>
</figure>
</template>
