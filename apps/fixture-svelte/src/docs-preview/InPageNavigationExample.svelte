<script lang="ts">
import InPageNavigation from '@unofficial-krds/svelte/in-page-navigation';
let activeId = $state('overview');
</script>
<div class="preview-outline">
  <InPageNavigation sections={[{ id: 'overview', label: '신청 개요' }, { id: 'requirements', label: '신청 조건' }]} title="이 페이지의 구성" narrowMode="inline" {activeId} onActiveChange={(d) => activeId = d.id} />
  <article>
    <section id="overview" style="min-height:500px" tabindex="-1"><h2>신청 개요</h2><p>예제 신청 서비스의 개요입니다.</p></section>
    <section id="requirements" style="min-height:500px" tabindex="-1"><h2>신청 조건</h2><p>거주 지역과 제출 서류를 확인하세요.</p></section>
  </article>
</div>
