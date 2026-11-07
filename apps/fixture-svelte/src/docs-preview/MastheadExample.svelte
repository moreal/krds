<script lang="ts">
import Masthead from '@unofficial-krds/svelte/masthead';
import SkipLink from '@unofficial-krds/svelte/skip-link';
</script>
<SkipLink links={[{ id: 'main', label: '본문 바로가기', targetId: 'main-content' }]} />
<p role="note">공식 정부서비스를 가정한 배너 UI 예시입니다. 실제 공식 정부서비스가 아닙니다.</p>
<Masthead governmentService={true} />
<section id="main-content" tabindex="-1"><h2>독립 로컬 예제</h2></section>
