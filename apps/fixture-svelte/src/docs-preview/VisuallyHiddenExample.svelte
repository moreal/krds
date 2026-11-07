<script lang="ts">
import Button from '@unofficial-krds/svelte/button';
import VisuallyHidden from '@unofficial-krds/svelte/visually-hidden';
import type { VisuallyHiddenProps } from '@unofficial-krds/svelte';
const props: VisuallyHiddenProps = { id: 'hidden-help', content: '신청 내용을 확인하세요', variant: 'text', lang: 'ko' };
</script>
<Button variant="secondary" size="small" aria-describedby="hidden-help">신청 확인</Button>
<VisuallyHidden {...props} />
