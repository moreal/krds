import { component$, useSignal } from '@builder.io/qwik';
import { Button, Calendar, DateInput, Modal, NativeSelect, Tabs, type DateValue } from '@unofficial-krds/qwik';
import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/all.css';
export interface PilotStoryProps {
    component: string;
    disabled?: boolean;
    value?: DateValue;
    open?: boolean;
    invalid?: boolean;
    errorMessage?: string;
    mode?: 'single' | 'range';
    referenceDate?: string;
    today?: string;
}
/** Story state only. Behaviors are exercised in separate siheom and production tests. */
export const PilotStory = component$<PilotStoryProps>((props) => {
    const region = useSignal(typeof props.value === 'string' ? props.value : 'seoul'), tab = useSignal('first'), open = useSignal(props.open ?? false), date = useSignal<DateValue>(props.value ?? null);
    return <div style={{ padding: '1.5rem', maxWidth: '56rem' }}>
  {props.component === 'button' && <Button disabled={props.disabled}>저장</Button>}
  {props.component === 'native-select' && <NativeSelect label="지역" name="region" value={region.value} onValueChange$={({ value }) => region.value = value} options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]}/>}
  {props.component === 'modal' && <><Button onClick$={() => open.value = true}>열기</Button><Modal title="확인" open={open.value} onOpenChange$={({ open: next }) => open.value = next} description="변경 내용을 확인하세요"><p>진행할 내용을 확인하세요.</p><Button onClick$={() => open.value = false}>확인</Button></Modal></>}
  {props.component === 'tabs' && <Tabs label="정보 구분" value={tab.value} onValueChange$={({ value }) => tab.value = value} items={[{ value: 'first', label: '첫 번째', content: <p>첫 번째 내용</p> }, { value: 'second', label: '두 번째', content: <p>두 번째 내용</p> }]}/>}
  {props.component === 'date-input' && <DateInput label="날짜" value={date.value} onValueChange$={({ value }) => date.value = value} invalid={props.invalid} error={props.errorMessage} referenceDate="2024-02-15"/>}
  {props.component === 'calendar' && <Calendar label="기간 선택" mode="range" value={props.value ?? { start: '2024-02-12', end: '2024-02-18' }} referenceDate="2024-02-15" today="2024-02-15"/>}
 </div>;
});
