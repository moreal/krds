# Language switcher · svelte {#language-switcher-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/LanguageSwitcherExample.svelte.txt).


```svelte
<script lang="ts">
import LanguageSwitcher from '@unofficial-krds/svelte/language-switcher';
import type { LanguageSwitcherProps } from '@unofficial-krds/svelte';
const props: LanguageSwitcherProps = {
  "currentLocale": "ko",
  "options": [
    {
      "locale": "ko",
      "nativeLabel": "한국어",
      "translatedLabel": "한국어",
      "href": "/local/ko"
    },
    {
      "locale": "en",
      "nativeLabel": "English",
      "translatedLabel": "영어",
      "href": "/local/en"
    }
  ],
  "defaultOpen": false
};
</script>
<section data-example="language-switcher"><LanguageSwitcher {...props}/></section>
```

