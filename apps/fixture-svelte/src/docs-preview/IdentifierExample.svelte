<script lang="ts">
import Identifier from '@unofficial-krds/svelte/identifier';
import type { IdentifierProps } from '@unofficial-krds/svelte';
import { assets } from './shared';
const props: IdentifierProps = { institutionName: '독립 예제 운영기관', logo: { src: assets.logo, alt: '독립 예제 운영기관' }, relationshipText: '독립 예제 운영기관이 운영하는 예제 서비스입니다.', theme: 'light' };
</script>
<footer aria-label="예제 기관 정보"><p>로컬 예제 서비스 문의 안내</p><Identifier {...props} /></footer>
