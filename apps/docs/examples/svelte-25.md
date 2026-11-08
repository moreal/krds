# Text list · svelte {#text-list-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TextListExample.svelte.txt).


```svelte
<script lang="ts">
import TextList from '@unofficial-krds/svelte/text-list';
import type { TextListProps } from '@unofficial-krds/svelte';
const props: TextListProps = {
  "ordered": false,
  "marker": "dot",
  "items": [
    {
      "id": "one",
      "content": "신청 조건 확인"
    },
    {
      "id": "two",
      "content": "제출 서류 준비"
    }
  ]
};
</script>
<section data-example="text-list"><TextList {...props}/></section>
```

