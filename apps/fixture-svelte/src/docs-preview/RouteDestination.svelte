<script lang="ts">
let { route, back }: { route: string; back: string } = $props();
</script>
<section><h1>로컬 예제 목적지</h1><p role="status">{route}</p><a href={back}>예제로 돌아가기</a></section>
