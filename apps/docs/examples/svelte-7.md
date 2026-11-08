# Footer · svelte {#footer-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/FooterExample.svelte.txt).


```svelte
<script lang="ts">
import Footer from '@unofficial-krds/svelte/footer';
import type { FooterProps } from '@unofficial-krds/svelte';
const props: FooterProps = {
  "serviceLogo": {
    "src": "/local-assets/specimen-logo.svg",
    "alt": "예제 서비스"
  },
  "contacts": [
    {
      "label": "예제 문의",
      "text": "로컬 예제 연락처"
    }
  ],
  "utilityLinks": [
    {
      "id": "policy",
      "label": "이용약관",
      "href": "/local/policy"
    }
  ],
  "privacyPolicy": {
    "href": "/local/privacy",
    "label": "개인정보처리방침"
  },
  "policyLinks": [
    {
      "id": "policy",
      "label": "이용약관",
      "href": "/local/policy"
    }
  ],
  "copyrightText": "Independent local specimen"
};
</script>
<section data-example="footer"><Footer {...props}/></section>
```

