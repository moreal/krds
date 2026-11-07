<script lang="ts">
import Button from '@unofficial-krds/svelte/button';
import CoachMark from '@unofficial-krds/svelte/coach-mark';
let open = $state(false);
</script>
<Button id="example-tour-start" variant="secondary" size="small" onclick={() => open = true}>따라하기 시작</Button>
<label for="example-target">신청인 이름</label><input id="example-target" /><div id="example-target-after"></div>
<CoachMark steps={[{ id: 'one', targetId: 'example-target', title: '이름 입력', instruction: '신청인 이름을 입력하세요.' }]} boundaries={[{ targetId: 'example-target', insertionBoundaryId: 'example-target-after' }]} {open} onOpenChange={(d) => open = d.open} startActionId="example-tour-start" />
