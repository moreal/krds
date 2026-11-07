<script lang="ts">
import MainMenu from '@unofficial-krds/svelte/main-menu';
import type { MainMenuProps } from '@unofficial-krds/svelte';
import { localRoute } from './shared';
const props: MainMenuProps = { items: [{ id: 'home', label: '홈', href: localRoute('home') }, { id: 'support', label: '지원', href: localRoute('support') }], currentId: 'apply-new', defaultExpandedId: null, defaultMobileOpen: false };
</script>
<MainMenu {...props} />
