# Bottom sheet · svelte {#bottom-sheet-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/BottomSheetExample.svelte.txt).


```svelte
<script lang="ts">
import BottomSheet from '@unofficial-krds/svelte/bottom-sheet';
import type { BottomSheetProps } from '@unofficial-krds/svelte';
const props: BottomSheetProps = {
  "title": "지역 선택",
  "defaultOpen": true,
  "description": "예제 지역을 선택하세요",
  "dismissOnOutside": false
};
</script>
<section data-example="bottom-sheet"><BottomSheet {...props}/></section>
```

