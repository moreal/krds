<script lang="ts">
import AccessibleMedia from '@unofficial-krds/svelte/accessible-media';
import type { AccessibleMediaProps } from '@unofficial-krds/svelte';
import { assets } from './shared';
const props: AccessibleMediaProps = { media: { kind: 'audio', src: assets.audio, type: 'audio/wav' }, captionTracks: [], transcript: { content: '약 2초 동안 일정한 높이의 예제 신호음이 들립니다.' }, title: '로컬 예제 미디어', controls: true, autoplay: false };
</script>
<AccessibleMedia {...props} />
