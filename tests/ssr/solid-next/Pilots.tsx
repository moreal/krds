import { createSignal } from 'solid-js';
import { Button, NativeSelect, Modal, Tabs, Calendar, DateInput } from '@unofficial-krds/solid-next';
export function Pilots() {
    const [count, setCount] = createSignal(0);
    return <main><h1>Solid 2 SSR pilots</h1><Button onClick={() => setCount(value => value + 1)}>Hydrated {count()}</Button><NativeSelect id="ssr-select" label="지역" options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]} defaultValue="seoul"/><Tabs id="ssr-tabs" label="정보" items={[{ value: 'a', label: '첫 번째', content: '첫 패널' }, { value: 'b', label: '두 번째', content: '둘째 패널' }]}/><Calendar id="ssr-calendar" label="날짜 선택" referenceDate="2024-02-01"/><DateInput id="ssr-date" label="날짜" defaultValue="2024-02-29"/><Modal id="ssr-modal" title="확인" defaultOpen={false}>닫힌 내용</Modal></main>;
}
