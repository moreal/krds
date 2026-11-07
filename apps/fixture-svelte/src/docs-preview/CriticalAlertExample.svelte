<script lang="ts">
import CriticalAlert from '@unofficial-krds/svelte/critical-alert';
import type { CriticalAlertProps } from '@unofficial-krds/svelte';
import { localRoute } from './shared';
const props: CriticalAlertProps = { urgency: 'high', label: '긴급 안내', message: '예제 점검으로 신청이 잠시 중단됩니다.', details: { href: localRoute('maintenance'), label: '점검 상세 안내', destinationTitle: '점검 상세 안내' } };
</script>
<CriticalAlert {...props} />
