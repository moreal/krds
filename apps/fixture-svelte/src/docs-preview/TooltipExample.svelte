<script lang="ts">
import Tooltip from '@unofficial-krds/svelte/tooltip';
import type { TooltipProps } from '@unofficial-krds/svelte';
const props: TooltipProps = { text: '신청 도움말을 엽니다', relationship: 'description', triggerLabel: '신청 도움말', triggerId: 'help-trigger', textId: 'help-tooltip', defaultOpen: false, placement: 'bottom-start' };
</script>
<Tooltip {...props} />
