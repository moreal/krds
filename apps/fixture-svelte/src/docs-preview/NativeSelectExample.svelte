<script lang="ts">
import NativeSelect from '@unofficial-krds/svelte/native-select';
import FormExample from './FormExample.svelte';
</script>
<FormExample><NativeSelect label="지역" name="region" options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]} defaultValue="seoul" /></FormExample>
