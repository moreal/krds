import { createSignal } from 'solid-js';
import { Button, NativeSelect } from '@unofficial-krds/solid';
export function NativeSelectExample() {
  const [value, setValue] = createSignal('seoul');
  return <section aria-label="셀렉트 예제"><form onReset={() => setValue('seoul')}><NativeSelect label="지역" name="region" value={value()} options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }, { value: 'closed', label: '비활성', disabled: true }]} onValueChange={detail => setValue(detail.value)} /><p role="status">선택한 지역: {value() === 'seoul' ? '서울' : '부산'}</p><div class="preview-actions"><Button type="reset" variant="secondary" size="small">초기화</Button></div></form></section>;
}
