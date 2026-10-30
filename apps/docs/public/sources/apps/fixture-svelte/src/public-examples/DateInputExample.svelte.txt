<script lang="ts">
import DateInput from '@unofficial-krds/svelte/date-input';
import type { DateInputProps } from '@unofficial-krds/svelte';
const props: DateInputProps = {label:"날짜",name:"date",referenceDate:"2024-02-15"};
</script>
<section data-example="date-input"><DateInput {...props}/></section>
