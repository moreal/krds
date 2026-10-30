import { createSignal, Match, onCleanup, onMount, Show, Switch } from 'solid-js';
import { Button, Calendar, DateInput, KrdsProvider, Modal, NativeSelect, Tabs } from '@krds-native/solid';
import type { ButtonProps, NativeSelectProps } from '@krds-native/solid';
import { createFixtureBridge } from '@krds-native/test-contracts/driver';

/** Production native Solid fixture; bridge data stays outside the public adapter. */
export function FixtureApp(props: { componentId: string; caseId: string }) {
  const initialState = props.componentId === '__probe'
    ? { count: 0, label: 'Probe increment', disabled: false }
    : props.componentId === 'calendar' && props.caseId === 'selection-confirm'
    ? { value: null, referenceDate: '2024-02-01', min: '2024-02-01', max: '2024-03-31', disabled: false, rejectChanges: false }
    : ['date-input', 'calendar'].includes(props.componentId)
    ? { value: props.caseId.includes('range') ? { start: '2024-02-12', end: '2024-02-18' } : props.componentId === 'calendar' ? '2024-02-29' : null,
        referenceDate: '2024-02-15', today: '2024-02-15', disabled: props.caseId === 'disabled', invalid: props.caseId === 'invalid', rejectChanges: props.caseId === 'rejected' }
    : { value: props.componentId === 'tabs' ? 'first' : 'seoul', label: '저장', disabled: props.componentId === 'button' && props.caseId === 'disabled', invalid: false, rejectChanges: props.caseId === 'rejected', open: false, triggerVisible: true };
  const bridge = createFixtureBridge('solid', initialState);
  const [state, setState] = createSignal(bridge.getState());
  const [ready, setReady] = createSignal(false);
  const unsubscribe = bridge.subscribe(next => setState(next));
  onMount(() => setReady(true));
  onCleanup(() => { unsubscribe(); bridge.dispose(); });
  const increment = () => {
    const count = Number(state().count) + 1;
    void bridge.setState({ count });
    bridge.recordEvent('change', { value: count });
  };
  const selectOptions = [{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }];
  const selectChange = (detail: { value: string }) => {
    bridge.recordEvent('valueChange', detail);
    if (!state().rejectChanges) void bridge.setState({ value: detail.value });
  };
  const openChange = (detail: { open: boolean }) => {
    bridge.recordEvent('openChange', detail);
    if (!state().rejectChanges) void bridge.setState({ open: detail.open });
  };
  const dateChange = (detail: { value: string | null | { start: string | null; end: string | null } }) => {
    bridge.recordEvent('valueChange', detail);
    if (!state().rejectChanges) void bridge.setState({ value: detail.value });
  };
  const singleDate = () => typeof state().value === 'string' ? String(state().value) : null;
  const rangeDate = () => state().value as { start: string | null; end: string | null };
  const dateBound = (name: 'min' | 'max') => typeof state()[name] === 'string' ? String(state()[name]) : undefined;
  return (
    <KrdsProvider locale="ko-KR"><main>
      <h1>KRDS {props.componentId}</h1>
      <div role="status" aria-label="Fixture health">{ready() ? 'ready' : 'mounting'}</div>
      <Switch fallback={<p role="note">Component not implemented: {props.componentId}/{props.caseId}</p>}>
      <Match when={props.componentId === '__probe' && props.caseId === 'native-state'}>
        <button disabled={Boolean(state().disabled)} onClick={increment}>{String(state().label)}</button>
        <div role="status" aria-label="Probe value">{String(state().count)}</div>
      </Match>
      <Match when={props.componentId === 'button'}>
        <Button size={state().size as ButtonProps['size']} disabled={Boolean(state().disabled)} onClick={() => bridge.recordEvent('click', {})}>{String(state().label)}</Button>
      </Match>
      <Match when={props.componentId === 'native-select'}>
        <form>
          <Show when={props.caseId === 'form-reset'} fallback={
            <NativeSelect id="solid-region" name="region" label="지역" options={selectOptions}
              size={state().size as NativeSelectProps['size']} value={String(state().value)} onValueChange={selectChange} disabled={Boolean(state().disabled)}
              invalid={Boolean(state().invalid)} hint="거주 지역을 선택하세요" error={state().invalid ? '지역을 확인하세요' : undefined} />
          }>
            <NativeSelect id="solid-region" name="region" label="지역" options={selectOptions}
              size={state().size as NativeSelectProps['size']} defaultValue="seoul" onValueChange={selectChange} disabled={Boolean(state().disabled)} hint="거주 지역을 선택하세요" />
          </Show>
          <Button type="reset">초기화</Button>
        </form>
      </Match>
      <Match when={props.componentId === 'modal'}>
        <Show when={state().triggerVisible}><Button onClick={() => { if (!state().open) openChange({ open: true }); }}>열기</Button></Show>
        <Button id="solid-next-task">다음 작업</Button>
        <Modal id="solid-confirmation" title="확인" description="진행할 내용을 확인하세요" open={Boolean(state().open)}
          onOpenChange={openChange} closeOnOutsideClick={Boolean(state().closeOnOutsideClick)} returnFocusId="solid-next-task" actions={<Button onClick={() => openChange({ open: false })}>확인</Button>}>
          <Show when={props.caseId === 'nested-date'} fallback={<p>이 작업을 계속하시겠습니까?</p>}>
            <DateInput label="날짜" defaultValue="2024-02-29" referenceDate="2024-02-15" />
          </Show>
        </Modal>
      </Match>
      <Match when={props.componentId === 'tabs'}>
        <Tabs id="solid-sections" label="정보 구분" value={String(state().value)} onValueChange={selectChange}
          activationMode={props.caseId === 'automatic' ? 'automatic' : 'manual'}
          items={[
            { value: 'first', label: '첫 번째', content: <p>첫 번째 내용</p> },
            { value: 'second', label: '두 번째', content: <p>두 번째 내용</p> },
            { value: 'disabled', label: '사용 불가', content: <p>사용할 수 없는 내용</p>, disabled: true },
          ]} />
      </Match>
      <Match when={props.componentId === 'date-input'}>
        <form onSubmit={event => {
          event.preventDefault();
          bridge.recordEvent('submit', Object.fromEntries(new FormData(event.currentTarget)));
        }}>
          <Show when={props.caseId.includes('range')} fallback={
            <DateInput id="solid-date" label="날짜" name="visit" value={singleDate()} onValueChange={dateChange}
              disabled={Boolean(state().disabled)} invalid={Boolean(state().invalid)} error={state().invalid ? '날짜를 확인하세요' : undefined}
              returnFocusId="solid-next-task" referenceDate={String(state().referenceDate)} today={String(state().today)} min={dateBound('min')} max={dateBound('max')} />
          }>
            <DateInput id="solid-date-range" mode="range" label="방문 기간" name="visit" value={rangeDate()} onValueChange={dateChange}
              returnFocusId="solid-next-task" disabled={Boolean(state().disabled)} referenceDate={String(state().referenceDate)} today={String(state().today)} min={dateBound('min')} max={dateBound('max')} />
          </Show>
          <Button type="submit">제출</Button><Button type="reset">초기화</Button>
        </form>
        <Button id="solid-next-task">다음 작업</Button>
      </Match>
      <Match when={props.componentId === 'calendar'}>
        <Show when={props.caseId.includes('range')} fallback={
          <Calendar id="solid-calendar" label="날짜 선택" value={singleDate()} onValueChange={dateChange}
            onConfirm={detail => { if (props.caseId !== 'selection-confirm') bridge.recordEvent('confirm', detail); }} onCancel={() => bridge.recordEvent('cancel', {})}
            disabled={Boolean(state().disabled)} referenceDate={String(state().referenceDate)} today={typeof state().today === 'string' ? String(state().today) : undefined} min={dateBound('min')} max={dateBound('max')} />
        }>
          <Calendar id="solid-calendar-range" mode="range" label="기간 선택" value={rangeDate()} onValueChange={dateChange}
            onConfirm={detail => bridge.recordEvent('confirm', detail)} onCancel={() => bridge.recordEvent('cancel', {})}
            disabled={Boolean(state().disabled)} referenceDate={String(state().referenceDate)} today={String(state().today)} min={dateBound('min')} max={dateBound('max')} />
        </Show>
      </Match>
      </Switch>
    </main></KrdsProvider>
  );
}
