<script lang="ts">
import Favicon from '@unofficial-krds/svelte/favicon';
import type { FaviconProps } from '@unofficial-krds/svelte';
import { assets } from './shared';
const props: FaviconProps = { light: { href: assets.iconLight, type: 'image/svg+xml', sizes: 'any' }, dark: { href: assets.iconDark, type: 'image/svg+xml', sizes: 'any' } };
</script>
<Favicon {...props} />
<p>이 예제 문서의 탭 아이콘을 로컬 이미지로 설정했습니다.</p>
<img src={assets.iconLight} width="48" height="48" alt="로컬 예제 탭 아이콘 미리보기" />
