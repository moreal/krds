<script lang="ts">
import Switch from '@unofficial-krds/svelte/switch';
import type { SwitchProps } from '@unofficial-krds/svelte';
const props: SwitchProps = {
  "label": "예제 알림 받기",
  "name": "notification",
  "defaultChecked": false,
  "size": "medium"
};
</script>
<section data-example="switch"><Switch {...props}/></section>
