<script setup lang="ts">
import { Image } from '@unofficial-krds/vue';
</script>
<template><div class="image-specimens"><Image src="/krds/previews/vue/local-assets/example-landscape.svg" alt="산과 강이 있는 독립 예제 그림" caption="직접 작성한 로컬 예제" :width="640" :height="360" loading="eager"/><Image src="/krds/previews/vue/local-assets/intentional-missing-image.svg" alt="불러올 수 없는 예제 그림" caption="불러오기 실패 예제" :width="640" :height="360"/></div></template>
