<script lang="ts">
import Toast from '@unofficial-krds/svelte/toast';
import type { ToastProps } from '@unofficial-krds/svelte';
const props: ToastProps = {
  "message": {
    "id": "saved",
    "text": "신청이 저장되었습니다.",
    "tone": "information",
    "persistentResultId": "saved-result"
  },
  "durationMs": 3000
,
onDismiss: () => {}
};
</script>
<section data-example="toast"><Toast {...props}/></section>
