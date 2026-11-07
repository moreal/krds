<script lang="ts">
import Link from '@unofficial-krds/svelte/link';
import type { LinkProps } from '@unofficial-krds/svelte';
import { localRoute } from './shared';
const props: LinkProps = { href: localRoute('application'), label: '신청 안내', appearance: 'basic', size: 'medium', underline: true };
</script>
<Link {...props} />
