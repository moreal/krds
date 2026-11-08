# Image · svelte {#image-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/ImageExample.svelte.txt).


```svelte
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
```

