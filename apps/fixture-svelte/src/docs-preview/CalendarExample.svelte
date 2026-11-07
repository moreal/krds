<script lang="ts">
import Calendar from '@unofficial-krds/svelte/calendar';
let confirmed = $state<string | null>(null);
</script>
<Calendar label="신청일" referenceDate="2024-02-15" onConfirm={(d) => confirmed = d.value as string | null} />
<p role="status">확정한 날짜: {confirmed ?? '없음'}</p>
