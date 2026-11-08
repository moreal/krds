# Tab · svelte {#tabs-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TabsExample.svelte.txt).


```svelte
<script lang="ts">
import Tabs from '@unofficial-krds/svelte/tabs';
import type { TabsProps } from '@unofficial-krds/svelte';
const props: TabsProps = {label:"안내",items:[{value:"details",label:"상세",content:"상세 내용"}]};
</script>
<section data-example="tabs"><Tabs {...props}/></section>
```

