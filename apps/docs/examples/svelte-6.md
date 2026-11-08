# Header · svelte {#header-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/HeaderExample.svelte.txt).


```svelte
<script lang="ts">
import Header from '@unofficial-krds/svelte/header';
import type { HeaderProps } from '@unofficial-krds/svelte';
const props: HeaderProps = {
  "home": {
    "href": "/local/home",
    "label": "예제 서비스 홈",
    "logo": {
      "src": "/local-assets/specimen-logo.svg",
      "alt": "예제 서비스 홈"
    }
  },
  "utilityItems": [
    {
      "id": "policy",
      "label": "이용약관",
      "href": "/local/policy"
    }
  ],
  "mainNavigation": [
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
  "actionLayout": "horizontal",
  "sticky": false
};
</script>
<section data-example="header"><Header {...props}/></section>
```

