<script lang="ts">
import Header from '@unofficial-krds/svelte/header';
import SkipLink from '@unofficial-krds/svelte/skip-link';
import type { HeaderProps } from '@unofficial-krds/svelte';
import { assets, localRoute } from './shared';
const props: HeaderProps = { home: { href: localRoute('home'), label: '예제 서비스 홈', logo: { src: assets.logo, alt: '예제 서비스 홈' } }, utilityItems: [{ id: 'policy', label: '이용약관', href: localRoute('policy') }], mainNavigation: [{ id: 'home', label: '홈', href: localRoute('home') }, { id: 'apply', label: '신청', children: [{ id: 'apply-new', label: '신규 신청', href: localRoute('apply') }, { id: 'history', label: '신청 내역', href: localRoute('history') }] }, { id: 'support', label: '지원', href: localRoute('support') }], actionLayout: 'horizontal', sticky: false };
</script>
<SkipLink links={[{ id: 'main', label: '본문 바로가기', targetId: 'main-content' }]} />
<Header {...props} />
<section id="main-content" tabindex="-1" style="min-height:800px"><h1>예제 신청 서비스</h1><p>지역별 신청 정보를 확인하세요.</p></section>
