<script lang="ts">
import Button from '@unofficial-krds/svelte/button';
import Resize from '@unofficial-krds/svelte/resize';
let value = $state('100');
const levels = [{ id: '90', label: '작게', percent: 90 }, { id: '100', label: '기본', percent: 100 }, { id: '110', label: '조금 크게', percent: 110 }, { id: '120', label: '크게', percent: 120 }, { id: '130', label: '아주 크게', percent: 130 }];
</script>
<Resize {levels} {value} onValueChange={(d) => value = d.value} />
<section data-resize-content style:font-size={`${value}%`}>확대된 예제 내용과 <Button variant="tertiary" size="small">작업</Button></section>
