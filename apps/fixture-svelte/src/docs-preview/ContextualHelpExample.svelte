<script lang="ts">
import ContextualHelp from '@unofficial-krds/svelte/contextual-help';
import type { ContextualHelpProps } from '@unofficial-krds/svelte';
const props: ContextualHelpProps = { title: '신청 자격 도움말', content: '신청 자격에 관한 예제 설명입니다.', triggerLabel: '신청 자격 도움말', defaultOpen: false, variant: 'information', placement: 'bottom-start' };
</script>
<ContextualHelp {...props} />
