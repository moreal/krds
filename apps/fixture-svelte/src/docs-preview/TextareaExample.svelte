<script lang="ts">
import Textarea from '@unofficial-krds/svelte/textarea';
import type { TextareaProps } from '@unofficial-krds/svelte';
import FormExample from './FormExample.svelte';
const props: TextareaProps = { label: '신청 사유', name: 'reason', defaultValue: '', rows: 5, disabled: false, readOnly: false };
</script>
<FormExample><Textarea {...props} /></FormExample>
