<script lang="ts">
import Button from '@unofficial-krds/svelte/button';
import Spinner from '@unofficial-krds/svelte/spinner';
let done = $state(false);
</script>
<Spinner pending={!done} value={done ? 100 : 40} label="신청 내역 불러오는 중" completionMessage="신청 내역을 불러왔습니다." size="medium" />
<Button variant="secondary" size="small" disabled={done} onclick={() => done = true}>작업 완료</Button>
