<script lang="ts">
import Image from '@unofficial-krds/svelte/image';
import type { ImageProps } from '@unofficial-krds/svelte';
const props: ImageProps = {
  "src": "/local-assets/specimen-landscape.svg",
  "alt": "산과 강이 있는 독립 예제 그림",
  "width": 640,
  "height": 360,
  "loading": "eager"
};
</script>
<section data-example="image"><Image {...props}/></section>
