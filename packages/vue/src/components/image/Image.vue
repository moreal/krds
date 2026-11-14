<script setup lang="ts">
import { ref, watch } from 'vue';
import type { ImageContract } from '@unofficial-krds/contracts';
const p = defineProps<ImageContract>();
const state = ref('');
watch(() => p.src, () => state.value = '');
if (p.decorative && p.alt !== '')
    throw new TypeError('Decorative image requires empty alt');
</script>
<template>
<figure data-krds-part="figure" data-krds-state="" data-krds-component="image">
<img :data-krds-state="state" data-krds-part="root" :src="src" :alt="alt" :width="width" :height="height" :srcset="srcset" :sizes="sizes" :loading="loading??'lazy'" :aria-describedby="descriptionId" @load="state='loaded'" @error="state='error'" data-krds-component="image"/>
<figcaption v-if="caption" data-krds-part="caption" data-krds-component="image" data-krds-state="">{{caption}}</figcaption>
<span v-if="state==='error'" data-krds-part="description" data-krds-component="image" data-krds-state="">이미지를 불러올 수 없습니다.</span>
</figure>
</template>
