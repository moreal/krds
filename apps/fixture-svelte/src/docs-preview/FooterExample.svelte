<script lang="ts">
import Footer from '@unofficial-krds/svelte/footer';
import type { FooterProps } from '@unofficial-krds/svelte';
import { assets, localRoute } from './shared';
const props: FooterProps = { serviceLogo: { src: assets.logo, alt: '예제 서비스' }, contacts: [{ label: '예제 문의', text: '로컬 예제 연락처' }], utilityLinks: [{ id: 'policy', label: '이용약관', href: localRoute('policy') }], privacyPolicy: { href: localRoute('privacy'), label: '개인정보처리방침' }, policyLinks: [{ id: 'policy', label: '이용약관', href: localRoute('policy') }], copyrightText: 'Independent local specimen', institution: { institutionName: '독립 예제 운영기관', logo: { src: assets.logo, alt: '독립 예제 운영기관' }, theme: 'light', relationshipText: '독립 운영기관이 운영하는 예제 서비스입니다.' } };
</script>
<Footer {...props} />
