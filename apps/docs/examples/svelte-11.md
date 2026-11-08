# Side navigation · svelte {#side-navigation-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/SideNavigationExample.svelte.txt).


```svelte
<script lang="ts">
import SideNavigation from '@unofficial-krds/svelte/side-navigation';
import type { SideNavigationProps } from '@unofficial-krds/svelte';
const props: SideNavigationProps = {
  "items": [
    {
      "id": "home",
      "label": "홈",
      "href": "/local/home"
    },
    {
      "id": "apply",
      "label": "신청",
      "children": [
        {
          "id": "apply-new",
          "label": "신규 신청",
          "href": "/local/apply"
        },
        {
          "id": "history",
          "label": "신청 내역",
          "href": "/local/history"
        }
      ]
    },
    {
      "id": "support",
      "label": "지원",
      "href": "/local/support"
    }
  ],
  "currentId": "apply-new",
  "defaultExpandedIds": [
    "apply"
  ]
};
</script>
<section data-example="side-navigation"><SideNavigation {...props}/></section>
```

