<script lang="ts">
import SideNavigation from '@unofficial-krds/svelte/side-navigation';
import type { SideNavigationProps } from '@unofficial-krds/svelte';
import { localRoute } from './shared';
const props: SideNavigationProps = { items: [{ id: 'home', label: '홈', href: localRoute('home') }, { id: 'apply', label: '신청', children: [{ id: 'apply-new', label: '신규 신청', href: localRoute('apply') }, { id: 'history', label: '신청 내역', href: localRoute('history') }] }, { id: 'support', label: '지원', href: localRoute('support') }], currentId: 'apply-new', defaultExpandedIds: ['apply'] };
</script>
<SideNavigation {...props} />
