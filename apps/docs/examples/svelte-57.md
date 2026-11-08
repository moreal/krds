# Tab bars · svelte {#tab-bar-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TabBarExample.svelte.txt).


```svelte
<script lang="ts">
import TabBar from '@unofficial-krds/svelte/tab-bar';
import type { TabBarProps } from '@unofficial-krds/svelte';
const props: TabBarProps = {
  "items": [
    {
      "id": "home",
      "label": "홈",
      "href": "/local/home",
      "icon": "home"
    },
    {
      "id": "apply",
      "label": "신청",
      "href": "/local/apply",
      "icon": "document"
    },
    {
      "id": "profile",
      "label": "내 정보",
      "href": "/local/profile",
      "icon": "person"
    }
  ],
  "currentId": "home"
};
</script>
<section data-example="tab-bar"><TabBar {...props}/></section>
```

