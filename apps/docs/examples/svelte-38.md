# Tutorial panel · svelte {#tutorial-panel-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TutorialPanelExample.svelte.txt).


```svelte
<script lang="ts">
import TutorialPanel from '@unofficial-krds/svelte/tutorial-panel';
import type { TutorialPanelProps } from '@unofficial-krds/svelte';
const props: TutorialPanelProps = {
  "tasks": [
    {
      "id": "apply",
      "title": "예제 신청하기",
      "steps": [
        {
          "id": "one",
          "title": "이름 입력",
          "targetId": "applicant-name",
          "instruction": "신청인 이름을 입력하세요"
        },
        {
          "id": "two",
          "title": "신청 저장",
          "targetId": "save-application",
          "instruction": "저장을 눌러 완료하세요"
        }
      ]
    }
  ],
  "activeTaskId": "apply",
  "activeStepId": null,
  "defaultRunning": false,
  "defaultOpen": true,
  "defaultActivePanel": "tutorial",
  "startActionId": "tutorial-start",
  "fallbackFocusId": "tutorial-fallback"
};
</script>
<section data-example="tutorial-panel"><TutorialPanel {...props}/></section>
```

