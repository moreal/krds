<script lang="ts">
import Textarea from '@unofficial-krds/svelte/textarea';
import type { TextareaProps } from '@unofficial-krds/svelte';
const props: TextareaProps = {
  "label": "신청 사유",
  "name": "reason",
  "rows": 5,
  "disabled": false,
  "readOnly": false
};
</script>
<section data-example="textarea"><Textarea {...props}/></section>
