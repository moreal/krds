<script lang="ts">
import Button from '@unofficial-krds/svelte/button';
import Toast from '@unofficial-krds/svelte/toast';
import type { ToastProps } from '@unofficial-krds/svelte';
let message = $state<ToastProps['message']>(null);
let saved = $state(false);
</script>
<Button variant="secondary" size="small" onclick={() => { saved = true; message = { id: 'saved', text: '신청이 저장되었습니다.', tone: 'information', persistentResultId: 'example-saved-result' }; }}>신청 저장</Button>
<p id="example-saved-result">{saved ? '신청이 저장되었습니다.' : '저장 전입니다.'}</p>
<Toast {message} durationMs={3000} onDismiss={() => message = null} />
