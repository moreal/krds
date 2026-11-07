<script lang="ts">
import Tag from '@unofficial-krds/svelte/tag';
import { localRoute } from './shared';
let ids = $state<readonly string[]>([]);
</script>
<Tag items={[{ id: 'a', label: '서울', href: localRoute('seoul') }, { id: 'b', label: '부산', href: localRoute('busan') }]} mode="toggle" selectedIds={ids} onSelectionChange={(d) => ids = d.ids} />
<p role="status">선택 지역: {ids.map((id) => id === 'a' ? '서울' : '부산').join(', ') || '없음'}</p>
