# tutorial-panel · svelte {#tutorial-panel-·-svelte}

이 컴파일러 체크포인트는 아래 소스를 생산자의 공개 빌드 패키지 검사에 묶습니다. 원래의 import와 로컬 상태를 포함합니다. 최신 네이티브 후보, 동작, SSR/resume, 릴리스를 인증하지 않습니다.

- Nx 버전 적용 완료 후 새로 만든 컴파일러 체크포인트입니다. 공개 @unofficial-krds/svelte 버전은 0.1.0입니다. 소스와 보존된 명령·로그 바이트는 해시로 고정됩니다. 컴파일 성공만으로는 네이티브 동작, SSR/하이드레이션/resume, 수동 검사, 최종 릴리스 인수가 인정되지 않습니다.

소스: [apps/fixture-svelte/src/public-examples/TutorialPanelExample.svelte](/sources/apps/fixture-svelte/src/public-examples/TutorialPanelExample.svelte.txt). SHA-256: `b5267b8375a597d171bfdc9e4fb3d0a37394c8f88a705754de228b2bdb079735`.

명령: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


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

