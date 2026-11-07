<script setup lang="ts">
import { ref, useId } from 'vue';
import type { AccessibleMediaContract } from '@unofficial-krds/contracts';
const p = defineProps<AccessibleMediaContract>();
const state = ref('paused');
const transcriptId = `${useId()}-transcript`;
</script>
<template>
<figure data-krds-part="root" :data-krds-state="state" :data-krds-kind="media.kind" data-krds-component="accessible-media">
<figcaption data-krds-part="description" data-krds-component="accessible-media" data-krds-state="">{{title}}</figcaption>
<component :is="media.kind==='audio'?'audio':'video'" data-krds-part="media" :data-krds-state="state" controls preload="metadata" :aria-label="title" :aria-describedby="transcriptId" :poster="media.poster" @play="state='playing'" @pause="state='paused'" @ended="state='ended'" @error="state='error'" data-krds-component="accessible-media">
<source :src="media.src" :type="media.type"/>
<track v-for="track in captionTracks" :key="track.lang" data-krds-part="caption-track" kind="captions" :src="track.src" :srclang="track.lang" :label="track.label" default data-krds-component="accessible-media" data-krds-state=""/>
<track v-if="descriptionTrack" data-krds-part="description" kind="descriptions" :src="descriptionTrack.src" :srclang="descriptionTrack.lang" :label="descriptionTrack.label" data-krds-component="accessible-media" data-krds-state=""/>
</component>
<section :aria-label="`${title} 대체 정보`" data-krds-part="alternatives" data-krds-component="accessible-media" data-krds-state="">
<section aria-label="대본">
<a v-if="transcript.href" :id="transcriptId" data-krds-component="accessible-media" data-krds-part="transcript" data-krds-state="" :href="transcript.href">{{title}} 대본</a>
<p v-else :id="transcriptId" data-krds-component="accessible-media" data-krds-part="transcript" data-krds-state="">{{transcript.content}}</p>
</section>
<video v-if="signLanguageSource" data-krds-part="sign-language" :src="signLanguageSource" controls preload="metadata" :aria-label="`${title} 수어 영상`" data-krds-component="accessible-media" data-krds-state=""/>
<p v-if="state==='error'" role="status">미디어를 불러올 수 없습니다. 대본을 확인하세요.</p>
</section>
</figure>
</template>
