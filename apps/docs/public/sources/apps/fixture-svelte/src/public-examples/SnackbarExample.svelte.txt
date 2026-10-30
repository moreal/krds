<script lang="ts">
import Snackbar from '@unofficial-krds/svelte/snackbar';
import type { SnackbarProps } from '@unofficial-krds/svelte';
const props: SnackbarProps = {
  "message": {
    "id": "saved",
    "title": "저장 완료",
    "text": "예제 신청을 저장했습니다."
  },
  "durationMs": null
,
onDismiss: () => {}
};
</script>
<section data-example="snackbar"><Snackbar {...props}/></section>
