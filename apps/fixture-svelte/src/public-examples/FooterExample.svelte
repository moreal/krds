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
