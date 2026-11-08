# Radio button · svelte {#radio-group-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/RadioGroupExample.svelte.txt).


```svelte
<script lang="ts">
import RadioGroup from '@unofficial-krds/svelte/radio-group';
import type { RadioGroupProps } from '@unofficial-krds/svelte';
const props: RadioGroupProps = {
  "label": "거주 지역",
  "name": "region",
  "options": [
    {
      "value": "seoul",
      "label": "서울"
    },
    {
      "value": "busan",
      "label": "부산"
    },
    {
      "value": "jeju",
      "label": "제주",
      "disabled": true
    }
  ],
  "size": "medium",
  "appearance": "default"
};
</script>
<section data-example="radio-group"><RadioGroup {...props}/></section>
```

