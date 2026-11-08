# Quantity toggle · svelte {#quantity-toggle-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/QuantityToggleExample.svelte.txt).


```svelte
<script lang="ts">
import QuantityToggle from '@unofficial-krds/svelte/quantity-toggle';
import type { QuantityToggleProps } from '@unofficial-krds/svelte';
const props: QuantityToggleProps = {
  "label": "신청 수량",
  "name": "quantity",
  "min": 0,
  "max": 10,
  "step": 1,
  "unit": "개"
};
</script>
<section data-example="quantity-toggle"><QuantityToggle {...props}/></section>
```

