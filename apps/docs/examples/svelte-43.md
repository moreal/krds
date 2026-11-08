# Date input · svelte {#date-input-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/DateInputExample.svelte.txt).


```svelte
<script lang="ts">
import DateInput from '@unofficial-krds/svelte/date-input';
import type { DateInputProps } from '@unofficial-krds/svelte';
const props: DateInputProps = {label:"날짜",name:"date",referenceDate:"2024-02-15"};
</script>
<section data-example="date-input"><DateInput {...props}/></section>
```

