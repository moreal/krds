<script lang="ts">
import QuantityToggle from '@unofficial-krds/svelte/quantity-toggle';
import type { QuantityToggleProps } from '@unofficial-krds/svelte';
import FormExample from './FormExample.svelte';
const props: QuantityToggleProps = { label: '신청 수량', name: 'quantity', min: 0, max: 10, step: 1, defaultValue: 2, unit: '개' };
</script>
<FormExample><QuantityToggle {...props} /></FormExample>
