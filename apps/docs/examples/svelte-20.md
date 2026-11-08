# Accordion · svelte {#accordion-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/AccordionExample.svelte.txt).


```svelte
<script lang="ts">
import Accordion from '@unofficial-krds/svelte/accordion';
import type { AccordionProps } from '@unofficial-krds/svelte';
const props: AccordionProps = {
  "items": [
    {
      "id": "eligibility",
      "title": "신청 자격",
      "content": "예제 신청 자격 안내"
    },
    {
      "id": "documents",
      "title": "제출 서류",
      "content": "예제 제출 서류 안내"
    }
  ],
  "defaultOpenIds": [],
  "multiple": true,
  "variant": "default"
};
</script>
<section data-example="accordion"><Accordion {...props}/></section>
```

