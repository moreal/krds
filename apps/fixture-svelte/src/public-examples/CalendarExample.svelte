<script lang="ts">
import Calendar from '@unofficial-krds/svelte/calendar';
import type { CalendarProps } from '@unofficial-krds/svelte';
const props: CalendarProps = {label:"날짜",referenceDate:"2024-02-15"};
</script>
<section data-example="calendar"><Calendar {...props}/></section>
