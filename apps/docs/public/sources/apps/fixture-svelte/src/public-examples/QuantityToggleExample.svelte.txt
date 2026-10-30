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
