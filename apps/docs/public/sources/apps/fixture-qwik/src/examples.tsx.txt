import { component$, useSignal } from '@builder.io/qwik';
import { Button, Calendar, DateInput, KrdsProvider, Modal, NativeSelect, Tabs } from '@unofficial-krds/qwik';
import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/all.css';
import './fixture.css';
export default component$(() => {
    const reverseTabs = useSignal(false);
    const tabItems = [{ value: 'first', label: '자동 첫 번째', content: <input aria-label="패널 첫 입력" value="kept"/> }, { value: 'second', label: '자동 두 번째', content: <p>두 번째 내용</p> }];
    const defaultDate = useSignal('2024-02-29'), defaultRegion = useSignal('seoul'), baselineEvents = useSignal(0), calendarEvents = useSignal(0);
    const clicks = useSignal(0), submissions = useSignal(''), requests = useSignal(0), resetCanceled = useSignal(false), modal = useSignal(false), child = useSignal(false), reject = useSignal(false);
    return <main><h1>Qwik native production behavior</h1>
  <form id="button-form" preventdefault:submit onSubmit$={(event, form) => { submissions.value = JSON.stringify([...new FormData(form, (event as SubmitEvent).submitter as HTMLButtonElement)]); }} onReset$={event => {
            if (resetCanceled.value)
                event.preventDefault();
        }}>
   <label>양식 필드<input name="field" value="initial"/></label>
   <Button onClick$={() => clicks.value++}>일반 실행</Button><Button disabled onClick$={() => clicks.value++}>비활성 실행</Button><Button type="submit" name="action" value="save">전송 실행</Button><Button type="reset">양식 초기화</Button>
  </form><output aria-label="실행 수">{clicks.value}</output><output aria-label="제출 값">{submissions.value}</output>
  <form id="select-form"><NativeSelect id="absent-selection" name="empty" label="미선택 지역" options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]} defaultValue=""/><NativeSelect name="all-disabled" label="모두 비활성" options={[{ value: 'a', label: 'A', disabled: true }]}/><Button type="reset">선택 초기화</Button></form>
  <NativeSelect name="external" form="select-form" label="외부 양식 지역" options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]}/>
  <Button onClick$={() => reverseTabs.value = !reverseTabs.value}>탭 순서 변경</Button><section aria-label="자동 탭"><Tabs id="automatic-tabs" label="자동 정보" activationMode="automatic" value="first" onValueChange$={() => requests.value++} items={reverseTabs.value ? [...tabItems].reverse() : tabItems}/><output aria-label="자동 요청 수">{requests.value}</output></section>
  <form id="date-form" preventdefault:submit onSubmit$={(_, form) => submissions.value = JSON.stringify([...new FormData(form)])}>
   <DateInput id="uncontrolled-date" returnFocusId="nested-opener" label="방문일" name="visit" defaultValue="2024-02-29" referenceDate="2024-02-01" min="2024-02-01" max="2024-03-31"/>
   <DateInput id="range-date" label="방문 기간" mode="range" name="period" defaultValue={{ start: '2024-02-12', end: '2024-02-18' }} referenceDate="2024-02-01"/>
   <Button type="submit">날짜 전송</Button><Button type="reset">날짜 초기화</Button>
  </form>
  <Button id="nested-opener" onClick$={() => modal.value = true}>중첩 열기</Button><label><input type="checkbox" checked={reject.value} onChange$={(_, element) => reject.value = element.checked}/>닫기 거절</label><output aria-label="닫기 정책">{reject.value ? 'reject' : 'accept'}</output>
  <Modal id="parent-modal" title="부모 확인" open={modal.value} onOpenChange$={({ open }) => {
            if (!reject.value)
                modal.value = open;
        }}><Button onClick$={() => child.value = true}>자식 열기</Button><Modal id="child-modal" title="자식 확인" open={child.value} onOpenChange$={({ open }) => child.value = open}><p>자식 내용</p></Modal></Modal>
  <Button onClick$={() => { defaultDate.value = '2024-03-02'; defaultRegion.value = 'busan'; }}>기본값 변경</Button>
  <form id="baseline-form"><NativeSelect label="초기 지역" name="baseline-region" defaultValue={defaultRegion.value} options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]} onValueChange$={() => baselineEvents.value++}/><DateInput id="baseline-date" label="초기 날짜" name="baseline-date" withCalendar={false} defaultValue={defaultDate.value} onValueChange$={() => baselineEvents.value++}/><Button type="reset">기준 초기화</Button></form>
  <form id="canceled-form" preventdefault:reset><NativeSelect label="취소 지역" name="canceled-region" defaultValue="seoul" options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]} onValueChange$={() => baselineEvents.value++}/><DateInput id="canceled-date" label="취소 날짜" name="canceled-date" withCalendar={false} defaultValue="2024-02-29" onValueChange$={() => baselineEvents.value++}/><Button type="reset">취소된 초기화</Button></form><output aria-label="기준 이벤트 수">{baselineEvents.value}</output>
  <Calendar id="range-calendar" label="기간 달력" mode="range" defaultValue={{ start: null, end: null }} referenceDate="2024-02-01" onValueChange$={() => calendarEvents.value++}/><output aria-label="달력 이벤트 수">{calendarEvents.value}</output>
  <KrdsProvider locale="en-US" direction="rtl"><Calendar id="english-calendar" label="English dates" defaultValue="2024-02-29" today="2024-02-29" referenceDate="2024-02-01"/></KrdsProvider>
  <Calendar id="boundary-calendar" label="첫해 날짜" referenceDate="0001-01-01" min="0001-01-01" max="0001-01-31"/>
 </main>;
});
