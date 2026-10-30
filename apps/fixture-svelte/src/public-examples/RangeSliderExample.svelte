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
