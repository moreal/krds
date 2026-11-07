<script lang="ts">
import Button from '@unofficial-krds/svelte/button';
let count = $state(0);
</script>
<Button type="button" onclick={() => count += 1}>신청하기</Button>
<p role="status">{count === 0 ? '아직 신청하지 않았습니다.' : `신청이 ${count}회 완료되었습니다.`}</p>
