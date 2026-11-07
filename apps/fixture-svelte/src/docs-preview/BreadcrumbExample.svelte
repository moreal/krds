<script lang="ts">
import Breadcrumb from '@unofficial-krds/svelte/breadcrumb';
import type { BreadcrumbProps } from '@unofficial-krds/svelte';
import { localRoute } from './shared';
const props: BreadcrumbProps = { home: { href: localRoute('home'), label: '홈' }, items: [{ id: 'apply', label: '신청', href: localRoute('apply') }], omitCurrent: true, maxVisible: 4, currentItem: { id: 'detail', label: '신청 상세' } };
</script>
<Breadcrumb {...props} />
