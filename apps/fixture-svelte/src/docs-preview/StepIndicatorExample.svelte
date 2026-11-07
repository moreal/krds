<script lang="ts">
import StepIndicator from '@unofficial-krds/svelte/step-indicator';
import type { StepIndicatorProps } from '@unofficial-krds/svelte';
const props: StepIndicatorProps = { steps: [{ id: 'a', label: '약관 확인', status: 'complete' }, { id: 'b', label: '정보 입력', status: 'current' }, { id: 'c', label: '신청 완료', status: 'pending' }], mode: 'sequential' };
</script>
<StepIndicator {...props} />
