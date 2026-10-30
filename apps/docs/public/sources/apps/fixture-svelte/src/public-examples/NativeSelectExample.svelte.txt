<script lang="ts">
import NativeSelect from '@unofficial-krds/svelte/native-select';
import type { NativeSelectProps } from '@unofficial-krds/svelte';
const props: NativeSelectProps = { label: "지역", options: [{value:"seoul",label:"서울"}] };
</script>
<section data-example="native-select"><NativeSelect {...props}/></section>
