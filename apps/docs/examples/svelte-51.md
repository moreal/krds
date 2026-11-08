# Range slider · svelte {#range-slider-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/RangeSliderExample.svelte.txt).


```svelte
<script lang="ts">
import RangeSlider from '@unofficial-krds/svelte/range-slider';
import type { RangeSliderProps } from '@unofficial-krds/svelte';
const props: RangeSliderProps = {
  "label": "예제 비율",
  "name": "ratio",
  "min": 0,
  "max": 100,
  "step": 10
};
</script>
<section data-example="range-slider"><RangeSlider {...props}/></section>
```

