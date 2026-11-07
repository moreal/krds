<script lang="ts">
import Checkbox from '@unofficial-krds/svelte/checkbox';
import type { CheckboxProps } from '@unofficial-krds/svelte';
import FormExample from './FormExample.svelte';
const props: CheckboxProps = { label: '이용약관 동의', name: 'consent', defaultChecked: false, indeterminate: false, value: 'agreed' };
</script>
<FormExample><Checkbox {...props} /></FormExample>
