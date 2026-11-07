<script lang="ts">
import StructuredList from '@unofficial-krds/svelte/structured-list';
import type { StructuredListProps } from '@unofficial-krds/svelte';
import { localRoute } from './shared';
const props: StructuredListProps = { items: [{ id: 'a', title: '예제 신청 공고', href: localRoute('notice/a'), metadata: [{ label: '마감일', value: '2026-11-30' }, { label: '담당 부서', value: '예제 부서' }] }, { id: 'b', title: '다음 신청 공고', href: localRoute('notice/b'), metadata: [{ label: '마감일', value: '2026-12-31' }] }], variant: 'list' };
</script>
<StructuredList {...props} />
