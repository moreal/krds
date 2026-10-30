<script lang="ts">
import CriticalAlert from '@unofficial-krds/svelte/critical-alert';
import type { CriticalAlertProps } from '@unofficial-krds/svelte';
const props: CriticalAlertProps = {
  "urgency": "high",
  "label": "긴급 안내",
  "message": "예제 점검으로 신청이 잠시 중단됩니다.",
  "details": {
    "href": "/local/maintenance",
    "label": "점검 상세 안내",
    "destinationTitle": "점검 상세 안내"
  }
};
</script>
<section data-example="critical-alert"><CriticalAlert {...props}/></section>
