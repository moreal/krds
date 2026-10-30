<script lang="ts">
import Carousel from '@unofficial-krds/svelte/carousel';
import type { CarouselProps } from '@unofficial-krds/svelte';
const props: CarouselProps = {
  "items": [
    {
      "id": "a",
      "label": "신청 안내",
      "content": "첫 번째 신청 안내"
    },
    {
      "id": "b",
      "label": "서류 안내",
      "content": "두 번째 서류 안내"
    },
    {
      "id": "c",
      "label": "문의 안내",
      "content": "세 번째 문의 안내"
    }
  ],
  "defaultIndex": 0,
  "layout": "single",
  "autoplay": false,
  "intervalMs": 6000,
  "loop": false
};
</script>
<section data-example="carousel"><Carousel {...props}/></section>
