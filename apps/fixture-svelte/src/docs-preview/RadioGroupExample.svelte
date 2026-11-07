<script lang="ts">
import RadioGroup from '@unofficial-krds/svelte/radio-group';
import type { RadioGroupProps } from '@unofficial-krds/svelte';
import FormExample from './FormExample.svelte';
const props: RadioGroupProps = { label: '거주 지역', name: 'region', options: [{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }, { value: 'jeju', label: '제주', disabled: true }], defaultValue: null, size: 'medium', appearance: 'default' };
</script>
<FormExample><RadioGroup {...props} /></FormExample>
