<script lang="ts">
import Disclosure from '@unofficial-krds/svelte/disclosure';
import type { DisclosureProps } from '@unofficial-krds/svelte';
const props: DisclosureProps = { label: '신청 도움말', contentId: 'application-help', defaultOpen: false };
</script>
<Disclosure {...props}>신청서를 작성하는 방법입니다.</Disclosure>
