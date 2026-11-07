<script lang="ts">
import Button from '@unofficial-krds/svelte/button';
import Snackbar from '@unofficial-krds/svelte/snackbar';
import type { SnackbarProps } from '@unofficial-krds/svelte';
const saved = { id: 'saved', title: '저장 완료', text: '예제 신청을 저장했습니다.' };
let message = $state<SnackbarProps['message']>(saved);
let result = $state('저장된 신청');
</script>
<Button id="snack-origin" variant="secondary" size="small" onclick={() => message = saved}>신청 저장</Button>
<p role="status">{result}</p>
<Snackbar {message} action={{ kind: 'button', id: 'undo', label: '실행 취소' }} onAction={() => { result = '저장을 취소했습니다.'; message = null; }} onDismiss={() => message = null} durationMs={null} fallbackFocusId="snack-origin" />
