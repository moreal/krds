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
