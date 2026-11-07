<script lang="ts">
import Button from '@unofficial-krds/svelte/button';
import SkipLink from '@unofficial-krds/svelte/skip-link';
import type { SkipLinkProps } from '@unofficial-krds/svelte';
const props: SkipLinkProps = { links: [{ id: 'main', label: '본문 바로가기', targetId: 'main-content' }], visibility: 'focus-revealed' };
</script>
<SkipLink {...props} />
<p>본문 앞의 예제 안내</p>
<section id="main-content" tabindex="-1"><h2>신청 본문</h2><Button variant="secondary" size="small">신청서 작성</Button></section>
