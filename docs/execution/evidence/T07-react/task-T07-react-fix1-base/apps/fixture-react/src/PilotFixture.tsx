import { useState } from 'react';
import { Button, Calendar, DateInput, Modal, NativeSelect, Tabs } from '@unofficial-krds/react';
import type { FixtureBridge } from '@unofficial-krds/test-contracts';
export function PilotFixture({ componentId, caseId, state, bridge }: { componentId: string; caseId: string; state: Record<string, unknown>; bridge?: FixtureBridge }) {
  const [open, setOpen] = useState(false);
  const record = (detail: { value: unknown }) => bridge?.recordEvent('valueChange', detail);
  if (componentId === 'button') return <Button disabled={state.disabled !== false} onClick={() => bridge?.recordEvent('click', {})}>저장</Button>;
  if (componentId === 'native-select') return <form onSubmit={event => event.preventDefault()}><NativeSelect label="지역" name="region" options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]} {...(caseId === 'controlled' ? { value: String(state.value ?? 'seoul') } : { defaultValue: 'seoul' })} onValueChange={detail => { record(detail); if (caseId === 'controlled') void bridge?.setState({ value: detail.value }); }} /><Button type="reset">초기화</Button></form>;
  if (componentId === 'modal') return <>
    <Button id="modal-fallback">다음 작업</Button>
    <Modal trigger={state.triggerVisible !== false ? <Button>열기</Button> : null} open={open} title="확인" returnFocusId="modal-fallback" onOpenChange={detail => { setOpen(detail.open); bridge?.recordEvent('openChange', detail); }}>내용</Modal>
  </>;
  if (componentId === 'tabs') return <Tabs label="정보" defaultValue="first" items={[{ value: 'first', label: '첫 번째', panel: '첫 번째 내용' }, { value: 'second', label: '두 번째', panel: '두 번째 내용' }]} onValueChange={record} />;
  if (componentId === 'calendar') return <Calendar label="날짜" referenceDate="2024-02-15" onValueChange={record} />;
  if (componentId === 'date-input') return <DateInput label="날짜" name="date" referenceDate="2024-02-15" {...(caseId === 'timezone-invariance' ? { value: typeof state.value === 'string' ? state.value : null } : {})} onValueChange={record} />;
  return <p role="note">Component not implemented: {componentId}/{caseId}</p>;
}
