# Coach mark · svelte {#coach-mark-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/CoachMarkExample.svelte.txt).


```svelte
<script lang="ts">
import CoachMark from '@unofficial-krds/svelte/coach-mark';
import type { CoachMarkProps } from '@unofficial-krds/svelte';
const props: CoachMarkProps = {
  "steps": [
    {
      "id": "one",
      "title": "이름 입력",
      "targetId": "applicant-name",
      "instruction": "신청인 이름을 입력하세요"
    }
  ],
  "boundaries": [
    {
      "targetId": "applicant-name",
      "insertionBoundaryId": "applicant-name-after"
    },
    {
      "targetId": "save-application",
      "insertionBoundaryId": "save-application-after"
    }
  ],
  "defaultOpen": true,
  "defaultStepId": "one",
  "startActionId": "tutorial-start",
  "fallbackFocusId": "coach-fallback"
,
onTargetAction: () => false
};
</script>
<section data-example="coach-mark"><CoachMark {...props}/></section>
```

