import { createSignal, flush, onSettled, Show } from 'solid-js';
import { render } from '@solidjs/web';
import { Button, NativeSelect, Modal, Tabs, Calendar, DateInput } from '@unofficial-krds/solid-next';
import { createFixtureBridge } from '@unofficial-krds/test-contracts/driver';
import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/fonts.css';
import '@unofficial-krds/styles/all.css';
import './fixture.css';
import { ReviewFixture } from './review-fixture';
const route = new URL(location.href), component = decodeURIComponent(route.pathname.split('/')[2] ?? 'unknown'), caseId = route.searchParams.get('case') ?? 'default';
const initial: Record<string, unknown> = { value: component === 'native-select' ? 'seoul' : component === 'tabs' ? 'first' : null, disabled: component === 'button' && caseId === 'disabled', open: false, triggerVisible: true, accept: true, mode: 'single', referenceDate: '2024-02-01' };
if (caseId === 'range')
    initial.mode = 'range', initial.value = { start: null, end: null };
if(caseId==='year-one')initial.referenceDate='0001-01-02';
const bridge = createFixtureBridge('solid-next', initial);
function Fixture() {
    const [state, setState] = createSignal(initial);
    onSettled(() => {
        const unsubscribe = bridge.subscribe(next => {
            setState(next);
            flush();
        });
        return () => {
            unsubscribe();
            bridge.dispose();
        };
    });
    const event = (name: string, detail: unknown) => bridge.recordEvent(name, detail);
    const change = (detail: {
        value: unknown;
    }) => {
        event('valueChange', detail);
        if (state().accept !== false)
            void bridge.setState({ value: detail.value });
    };
    if (component === 'review') return <ReviewFixture scenario={caseId} />;
    const tabs = () => [{ value: 'first', label: '첫 번째', content: <p>첫 번째 내용</p> }, { value: 'second', label: '두 번째', content: <input aria-label="패널 입력"/> }, { value: 'disabled', label: '사용 불가', content: <p>사용 불가 내용</p>, disabled: true }, { value: 'third', label: '세 번째', content: <p>세 번째 내용</p> }];
    return <main><h1>Solid 2 native fixture</h1><p role="status" aria-label="Fixture health">ready</p>
 <Show when={state().mounted !== false}>{component === 'button' && <form onSubmit={e => {
                e.preventDefault();
                event('submit', {});
            }}><Button disabled={Boolean(state().disabled)} type={state().type as 'button' | 'submit' | 'reset' ?? 'button'} name="action" value="save" size={state().size as 'small' ?? 'medium'} onClick={() => event('click', {})}>저장</Button></form>}
 {component === 'native-select' && <form id="select-form" onSubmit={e => {
                e.preventDefault();
                event('submit', {});
            }}><NativeSelect id="region" name="region" label="지역" options={(state().options as {
                value: string;
                label: string;
                disabled?: boolean;
            }[]) ?? [{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }, { value: 'closed', label: '비활성', disabled: true }]} {...(caseId === 'form-reset' ? { defaultValue: 'seoul' } : { get value() {
                return String(state().value);
            } })} disabled={Boolean(state().disabled)} required={Boolean(state().required)} invalid={Boolean(state().invalid)} error={state().invalid?'선택을 확인하세요':undefined} size={state().size as 'small'|'medium'|'large' ?? 'medium'} onValueChange={change}/><Button type="reset">초기화</Button><Button type="submit">제출</Button></form>}
 {component === 'modal' && <>{state().triggerVisible !== false && <Button onClick={() => {
                    void bridge.setState({ open: true });
                }}>열기</Button>}<Button id="modal-fallback">다음 작업</Button><Modal title="확인" open={Boolean(state().open)} returnFocusId="modal-fallback" initialFocusId={state().initialFocusId as string | undefined} closeOnOutsideClick={Boolean(state().closeOnOutsideClick)} onOpenChange={detail => {
                event('openChange', detail);
                if (state().accept !== false)
                    void bridge.setState({ open: detail.open });
            }}><p>확인이 필요한 내용</p><Button>내용 작업</Button></Modal></>}
 {component === 'tabs' && <Tabs id="pilot-tabs" label="정보" items={tabs()} value={String(state().value)} activationMode={state().activationMode as 'manual' | 'automatic' ?? 'manual'} orientation={state().orientation as 'horizontal' | 'vertical' ?? 'horizontal'} onValueChange={change}/>}
 {component === 'calendar' && <Calendar {...({ mode: state().mode === 'range' ? 'range' : 'single', value: state().value, label: '날짜 선택', referenceDate: String(state().referenceDate), today: state().today, min: state().min, max: state().max, disabled: Boolean(state().disabled), locale: state().locale ?? 'ko-KR', onValueChange: change, onConfirm: caseId === 'selection-confirm' ? undefined : (detail: unknown) => event('confirm', detail), onCancel: () => event('cancel', {}) } as Parameters<typeof Calendar>[0])}/>}
 {component === 'date-input' && <form id="date-form" onSubmit={e => {
                e.preventDefault();
                event('submit', Object.fromEntries(new FormData(e.currentTarget)));
            }}><DateInput {...({ mode: state().mode === 'range' ? 'range' : 'single', ...(caseId === 'uncontrolled' ? {defaultValue:'2024-02-29'} : {value:state().value}), name: 'date', label: '날짜', referenceDate: '2024-02-01', today: state().today, min: state().min, max: state().max, disabled: Boolean(state().disabled), required: Boolean(state().required), locale: state().locale ?? 'ko-KR', withCalendar: state().withCalendar !== false, onValueChange: change } as Parameters<typeof DateInput>[0])}/><Button type="reset">초기화</Button><Button type="submit">제출</Button></form>}
 </Show></main>;
}
const dispose = render(() => <Fixture />, document.getElementById('app')!);
window.addEventListener('pagehide', dispose, { once: true });
