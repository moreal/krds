<script lang="ts">
import Checkbox from '@unofficial-krds/svelte/checkbox';
import type { CheckboxProps } from '@unofficial-krds/svelte';
const props: CheckboxProps = {
  "label": "이용약관 동의",
  "name": "consent",
  "defaultChecked": false,
  "indeterminate": false,
  "value": "agreed"
};
</script>
<section data-example="checkbox"><Checkbox {...props}/></section>
