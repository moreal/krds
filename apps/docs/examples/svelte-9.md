# Main menu · svelte {#main-menu-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/MainMenuExample.svelte.txt).


```svelte
<script lang="ts">
import MainMenu from '@unofficial-krds/svelte/main-menu';
import type { MainMenuProps } from '@unofficial-krds/svelte';
const props: MainMenuProps = {
  "items": [
    {
      "id": "home",
      "label": "홈",
      "href": "/local/home"
    },
    {
      "id": "support",
      "label": "지원",
      "href": "/local/support"
    }
  ],
  "currentId": "apply-new",
  "defaultExpandedId": null,
  "defaultMobileOpen": false
};
</script>
<section data-example="main-menu"><MainMenu {...props}/></section>
```

