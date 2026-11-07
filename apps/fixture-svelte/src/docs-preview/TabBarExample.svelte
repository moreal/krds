<script lang="ts">
import TabBar from '@unofficial-krds/svelte/tab-bar';
import type { TabBarProps } from '@unofficial-krds/svelte';
import { localRoute } from './shared';
const props: TabBarProps = { items: [{ id: 'home', label: '홈', href: localRoute('home'), icon: 'home' }, { id: 'apply', label: '신청', href: localRoute('apply'), icon: 'document' }, { id: 'profile', label: '내 정보', href: localRoute('profile'), icon: 'person' }], currentId: 'home' };
</script>
<div style="min-height:900px"><p>긴 예제 화면의 본문입니다.</p></div>
<TabBar {...props} />
