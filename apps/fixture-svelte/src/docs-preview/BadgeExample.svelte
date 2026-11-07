<script lang="ts">
import Badge from '@unofficial-krds/svelte/badge';
import type { BadgeProps } from '@unofficial-krds/svelte';
const props: BadgeProps = { label: '진행 중', appearance: 'outline', tone: 'information', size: 'medium', numeric: false };
</script>
<Badge {...props} />
