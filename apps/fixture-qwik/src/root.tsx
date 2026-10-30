import {PatternRoute,patternRouteForUrl}from './examples/pattern-route';
import { FullCatalogFixture } from './full-catalog-fixture';
import { $, component$, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { createFixtureBridge } from '@unofficial-krds/test-contracts/driver';
import { Button, Calendar, DateInput, Modal, NativeSelect, Tabs, type DateValue } from '@unofficial-krds/qwik';
import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/all.css';
import './fixture.css';
export default component$(() => {
    const state = useStore<Record<string, any>>({ ready: false, component: '', caseId: '', value: 'seoul', label: '저장', disabled: false, invalid: false, rejectChanges: false, open: false, triggerVisible: true });
    useVisibleTask$(({ cleanup }) => {
        const pattern=patternRouteForUrl(location.href);if(pattern){state.pattern=pattern;state.ready=true;return;}const component = decodeURIComponent(location.pathname.split('/')[2] ?? ''), caseId = new URLSearchParams(location.search).get('case') ?? 'default';
        state.component = component;
        state.caseId = caseId;
        if(!['__probe','button','native-select','modal','tabs','date-input','calendar'].includes(component)){state.catalog=true;state.ready=true;return;}
        const initial: Record<string, unknown> = component === '__probe' ? { count: 0, label: 'Probe increment', disabled: false } : component === 'calendar' && caseId === 'selection-confirm' ? { value: null, referenceDate: '2024-02-01', min: '2024-02-01', max: '2024-03-31', disabled: false, rejectChanges: false } : ['date-input', 'calendar'].includes(component) ? { value: caseId.includes('range') ? { start: '2024-02-12', end: '2024-02-18' } : component === 'calendar' ? '2024-02-29' : null, referenceDate: '2024-02-15', today: '2024-02-15', disabled: caseId === 'disabled', invalid: caseId === 'invalid', rejectChanges: caseId === 'rejected' } : { value: component === 'tabs' ? 'first' : 'seoul', label: '저장', disabled: component === 'button' && caseId === 'disabled', invalid: false, rejectChanges: caseId === 'rejected', open: false, triggerVisible: true };
        const bridge = createFixtureBridge('qwik', initial), unsubscribe = bridge.subscribe(next => Object.assign(state, next));
        state.ready = true;
        cleanup(() => { unsubscribe(); bridge.dispose(); });
    });
    const valueChange = $(async (detail: {
        value: DateValue;
    }) => {
        const bridge = window.__KRDS_FIXTURE__!;
        bridge.recordEvent('valueChange', detail);
        if (!state.rejectChanges)
            await bridge.setState({ value: detail.value });
    });
    const selectChange = $(async (detail: {
        value: string;
    }) => {
        const bridge = window.__KRDS_FIXTURE__!;
        bridge.recordEvent('valueChange', detail);
        if (!state.rejectChanges)
            await bridge.setState({ value: detail.value });
    });
    const openChange = $(async (detail: {
        open: boolean;
    }) => {
        const bridge = window.__KRDS_FIXTURE__!;
        bridge.recordEvent('openChange', detail);
        if (!state.rejectChanges)
            await bridge.setState({ open: detail.open });
    });
    const options = [{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }];
    if(state.pattern)return <PatternRoute {...state.pattern}/>;
    const Tag=state.catalog?'div':'main';
    return <Tag><h1 data-krds-host="fixture-title">KRDS Qwik {state.component}</h1>{!state.catalog&&<div role="status" aria-label="Fixture health">{state.ready ? 'ready' : 'mounting'}</div>}
  {state.ready&&state.catalog&&<FullCatalogFixture componentId={state.component} caseId={state.caseId}/>}
  {state.ready && state.component === '__probe' && <><button disabled={state.disabled} onClick$={async () => { const bridge = window.__KRDS_FIXTURE__!, count = Number(bridge.getState().count ?? 0) + 1; bridge.recordEvent('change', { value: count }); await bridge.setState({ count }); }}>{state.label}</button><div role="status" aria-label="Probe value">{state.count}</div></>}
  {state.ready && state.component === 'button' && <Button disabled={state.disabled} size={state.size} onClick$={() => window.__KRDS_FIXTURE__!.recordEvent('click', {})}>{state.label}</Button>}
  {state.ready && state.component === 'native-select' && <form><NativeSelect id="qwik-region" name="region" label="지역" options={options} {...(state.caseId === 'form-reset' ? { defaultValue: 'seoul' } : { value: String(state.value) })} onValueChange$={selectChange} disabled={state.disabled} invalid={state.invalid} hint="거주 지역을 선택하세요" error={state.invalid ? '지역을 확인하세요' : undefined}/><Button type="reset">초기화</Button></form>}
  {state.ready && state.component === 'modal' && <>{state.triggerVisible && <Button onClick$={() => {
                    if (!state.open)
                        return openChange({ open: true });
                }}>열기</Button>}<Button id="qwik-next-task">다음 작업</Button><Modal id="qwik-confirmation" title="확인" description="진행할 내용을 확인하세요" open={state.open} onOpenChange$={openChange} closeOnOutsideClick={state.closeOnOutsideClick} returnFocusId="qwik-next-task" actions={<Button onClick$={() => openChange({ open: false })}>확인</Button>}><p>이 작업을 계속하시겠습니까?</p></Modal></>}
  {state.ready && state.component === 'tabs' && <Tabs id="qwik-sections" label="정보 구분" value={String(state.value)} onValueChange$={selectChange} activationMode={state.caseId === 'automatic' ? 'automatic' : 'manual'} items={[{ value: 'first', label: '첫 번째', content: <p>첫 번째 내용</p> }, { value: 'second', label: '두 번째', content: <p>두 번째 내용</p> }, { value: 'disabled', label: '사용 불가', content: <p>사용할 수 없는 내용</p>, disabled: true }]}/>}
  {state.ready && state.component === 'date-input' && <><form preventdefault:submit onSubmit$={(_, form) => window.__KRDS_FIXTURE__!.recordEvent('submit', Object.fromEntries(new FormData(form)))}><DateInput id="qwik-date" label={state.caseId.includes('range') ? '방문 기간' : '날짜'} name="visit" mode={state.caseId.includes('range') ? 'range' : 'single'} value={state.value} onValueChange$={valueChange} disabled={state.disabled} invalid={state.invalid} error={state.invalid ? '날짜를 확인하세요' : undefined} returnFocusId="qwik-next-task" referenceDate={state.referenceDate} today={state.today} min={state.min} max={state.max}/><Button type="submit">제출</Button><Button type="reset">초기화</Button></form><Button id="qwik-next-task">다음 작업</Button></>}
  {state.ready && state.component === 'calendar' && <Calendar id="qwik-calendar" label="날짜 선택" mode={state.caseId.includes('range') ? 'range' : 'single'} value={state.value} onValueChange$={valueChange} onConfirm$={detail => {
                if (state.caseId !== 'selection-confirm')
                    window.__KRDS_FIXTURE__!.recordEvent('confirm', detail);
            }} onCancel$={() => window.__KRDS_FIXTURE__!.recordEvent('cancel', {})} disabled={state.disabled} referenceDate={state.referenceDate} today={state.today} min={state.min} max={state.max}/>}
 </Tag>;
});
