# Carousel · svelte {#carousel-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/CarouselExample.svelte.txt).


```svelte
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
```

