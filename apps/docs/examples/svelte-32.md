# Select · svelte {#native-select-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/NativeSelectExample.svelte.txt).


```svelte
<script lang="ts">
import NativeSelect from '@unofficial-krds/svelte/native-select';
import type { NativeSelectProps } from '@unofficial-krds/svelte';
const props: NativeSelectProps = { label: "지역", options: [{value:"seoul",label:"서울"}] };
</script>
<section data-example="native-select"><NativeSelect {...props}/></section>
```

