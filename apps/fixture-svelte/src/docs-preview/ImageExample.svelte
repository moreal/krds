<script lang="ts">
import Image from '@unofficial-krds/svelte/image';
import type { ImageProps } from '@unofficial-krds/svelte';
import { assets } from './shared';
const loaded: ImageProps = { src: assets.landscape, alt: '산과 강이 있는 독립 예제 그림', width: 640, height: 360, loading: 'eager' };
// Declared absent reference: the file is never deployed, so it truly 404s and the alternative text stays visible.
const failing: ImageProps = { src: assets.missing, alt: '불러올 수 없는 예제 그림', width: 640, height: 360, loading: 'eager' };
</script>
<Image {...loaded} />
<Image {...failing} />
