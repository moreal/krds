<script lang="ts">
import Accordion from '@unofficial-krds/svelte/accordion';
import type { AccordionProps } from '@unofficial-krds/svelte';
const props: AccordionProps = { items: [{ id: 'eligibility', title: '신청 자격', content: '예제 신청 자격 안내' }, { id: 'documents', title: '제출 서류', content: '예제 제출 서류 안내' }], defaultOpenIds: [], multiple: true, variant: 'default' };
</script>
<Accordion {...props} />
