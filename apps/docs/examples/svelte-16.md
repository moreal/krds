# Calendar · svelte {#calendar-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/CalendarExample.svelte.txt).


```svelte
<script lang="ts">
import Calendar from '@unofficial-krds/svelte/calendar';
import type { CalendarProps } from '@unofficial-krds/svelte';
const props: CalendarProps = {label:"날짜",referenceDate:"2024-02-15"};
</script>
<section data-example="calendar"><Calendar {...props}/></section>
```

