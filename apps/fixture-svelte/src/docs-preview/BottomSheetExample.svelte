<script lang="ts">
import BottomSheet from '@unofficial-krds/svelte/bottom-sheet';
import Button from '@unofficial-krds/svelte/button';
import RadioGroup from '@unofficial-krds/svelte/radio-group';
import type { BottomSheetProps } from '@unofficial-krds/svelte';
const props: BottomSheetProps = { title: '지역 선택', returnFocusId: 'sheet-opener', description: '예제 지역을 선택하세요', dismissOnOutside: false };
let region = $state('seoul');
let open = $state(true);
</script>
<Button id="sheet-opener" variant="secondary" size="small" aria-haspopup="dialog" aria-expanded={open} onclick={() => open = true}>지역 선택 열기</Button>
<BottomSheet {...props} {open} onOpenChange={(d) => open = d.open}>
  <RadioGroup label="거주 지역" name="region" options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]} value={region} onValueChange={({ value }) => region = value ?? 'seoul'} />
</BottomSheet>
<p role="status">선택 지역: {region === 'seoul' ? '서울' : '부산'}</p>
