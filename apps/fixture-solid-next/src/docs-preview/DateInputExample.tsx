import { createSignal } from 'solid-js';
import { Button, DateInput } from '@unofficial-krds/solid-next';
export function DateInputExample() {
 const [value, setValue] = createSignal<string | null>(null);
 return <section aria-label="날짜 입력 예제"><form onSubmit={e => e.preventDefault()}><DateInput mode="single" label="방문 날짜" name="visitDate" value={value()} referenceDate="2024-02-01" today="2024-02-01" onValueChange={detail => setValue(detail.value)} /></form><p role="status">입력한 날짜: {value() ?? '없음'}</p><div class="preview-actions"><Button variant="tertiary" size="small" onClick={() => setValue(null)}>초기화</Button></div></section>;
}
