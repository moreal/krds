<script lang="ts">
import Spinner from '@unofficial-krds/svelte/spinner';
import type { SpinnerProps } from '@unofficial-krds/svelte';
const props: SpinnerProps = {
  "pending": true,
  "label": "신청 내역 불러오는 중",
  "completionMessage": "신청 내역을 불러왔습니다.",
  "size": "medium",
  "value": 40
};
</script>
<section data-example="spinner"><Spinner {...props}/></section>
