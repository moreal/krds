# Help panel · svelte {#help-panel-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/HelpPanelExample.svelte.txt).


```svelte
<script lang="ts">
import HelpPanel from '@unofficial-krds/svelte/help-panel';
import type { HelpPanelProps } from '@unofficial-krds/svelte';
const props: HelpPanelProps = {
  "defaultOpen": true,
  "defaultSelectedTopicId": null,
  "topics": [
    {
      "id": "eligibility",
      "title": "신청 자격",
      "content": "예제 신청 자격 도움말",
      "relatedLinks": [
        {
          "id": "policy",
          "label": "이용약관",
          "href": "/local/policy"
        }
      ]
    },
    {
      "id": "documents",
      "title": "제출 서류",
      "content": "예제 제출 서류 도움말",
      "relatedLinks": []
    }
  ],
  "mode": "help",
  "fallbackFocusId": "panel-fallback"
};
</script>
<section data-example="help-panel"><HelpPanel {...props}/></section>
```

