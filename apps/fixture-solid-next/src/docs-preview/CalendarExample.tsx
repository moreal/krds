import { createSignal } from 'solid-js';
import { Calendar, Button } from '@unofficial-krds/solid-next';
export function CalendarExample() {
 const [value, setValue] = createSignal<string | null>(null);
 return <section aria-label="달력 예제"><Calendar mode="single" label="방문 날짜" value={value()} referenceDate="2024-02-01" today="2024-02-01" onValueChange={detail => setValue(detail.value)} /><p role="status">선택한 날짜: {value() ?? '없음'}</p><div class="preview-actions"><Button variant="tertiary" size="small" onClick={() => setValue(null)}>초기화</Button></div></section>;
}
