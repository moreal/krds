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
