<script lang="ts">
import BackButton from '@unofficial-krds/svelte/back-button';
import type { BackButtonProps } from '@unofficial-krds/svelte';
const props: BackButtonProps = {
  "label": "뒤로가기",
  "canGoBack": true,
  "dirty": false,
  "fallbackHref": "/local/parent"
,
onBackRequest: () => {}
};
</script>
<section data-example="back-button"><BackButton {...props}/></section>
