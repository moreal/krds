import { createSignal } from 'solid-js';
import { Button, Calendar, DateInput, KrdsProvider, Modal, NativeSelect, Tabs } from '@krds-native/solid';

/** Compiled documentation examples use only the built public package. */
export function ControlledRegionExample() {
  const [region, setRegion] = createSignal('seoul');
  return <NativeSelect label="지역" name="region" value={region()}
    options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]}
    onValueChange={({ value }) => setRegion(value)} />;
}

export function VisitDateExample() {
  return <KrdsProvider locale="ko-KR"><form>
    <DateInput label="방문일" name="visitDate" defaultValue="2024-02-29" referenceDate="2024-02-01" />
    <Button type="submit">신청</Button><Button type="reset">초기화</Button>
  </form></KrdsProvider>;
}

export function RangeCalendarExample() {
  return <Calendar mode="range" label="방문 기간 선택" referenceDate="2024-02-15"
    defaultValue={{ start: '2024-02-12', end: '2024-02-18' }} />;
}

export function ConfirmationExample() {
  const [open, setOpen] = createSignal(false);
  return <><Button onClick={() => setOpen(true)}>열기</Button>
    <Modal title="확인" open={open()} onOpenChange={({ open }) => setOpen(open)}>
      <p>입력한 정보를 확인하세요.</p>
    </Modal>
  </>;
}

export function SectionsExample() {
  return <Tabs label="정보 구분" defaultValue="first" items={[
    { value: 'first', label: '첫 번째', content: <p>첫 번째 내용</p> },
    { value: 'second', label: '두 번째', content: <p>두 번째 내용</p> },
  ]} />;
}
