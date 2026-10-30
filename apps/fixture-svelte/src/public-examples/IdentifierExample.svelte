<script lang="ts">
import Identifier from '@unofficial-krds/svelte/identifier';
import type { IdentifierProps } from '@unofficial-krds/svelte';
const props: IdentifierProps = {
  "institutionName": "독립 예제 운영기관",
  "logo": {
    "src": "/local-assets/specimen-logo.svg",
    "alt": "독립 예제 운영기관"
  },
  "relationshipText": "독립 예제 운영기관이 운영하는 예제 서비스입니다.",
  "theme": "light"
};
</script>
<section data-example="identifier"><Identifier {...props}/></section>
