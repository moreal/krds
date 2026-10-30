import { component$, useSignal } from '@builder.io/qwik';
import { Button, Calendar, DateInput, Modal, NativeSelect, Tabs, type DateValue } from '@unofficial-krds/qwik';
import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/all.css';
import './fixture.css';
/** No app startup/visible task and no client render call: this tree is paused on the server. */
export default component$(() => {
    const count = useSignal(0), region = useSignal('seoul'), open = useSignal(false), tab = useSignal('first'), date = useSignal<DateValue>('2024-02-29'), events = useSignal(0), reject = useSignal(false), mounted = useSignal(true);
    return <main><h1>Qwik production SSR resume</h1>
  <Button onClick$={() => count.value++}>첫 클릭</Button><output aria-label="클릭 수">{count.value}</output>
  <label><input type="checkbox" checked={reject.value} onChange$={(_, element) => reject.value = element.checked}/>변경 거절</label>
  {mounted.value && <section aria-label="Native pilots"><form id="resume-form" preventdefault:submit onSubmit$={() => count.value++}>
   <NativeSelect id="resume-region" name="region" label="지역" value={region.value} options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]} onValueChange$={({ value }) => {
                events.value++;
                if (!reject.value)
                    region.value = value;
            }}/>
   <DateInput id="resume-date" name="visit" label="날짜" value={date.value} referenceDate="2024-02-15" today="2024-02-15" onValueChange$={({ value }) => {
                events.value++;
                if (!reject.value)
                    date.value = value;
            }}/>
   <Button type="submit" name="action" value="save">제출</Button><Button type="reset">초기화</Button>
  </form>
  <Button id="resume-opener" onClick$={() => {
                if (!open.value) {
                    events.value++;
                    open.value = true;
                }
            }}>열기</Button><Button id="resume-fallback">다음 작업</Button>
  <Modal id="resume-modal" title="확인" open={open.value} returnFocusId="resume-fallback" onOpenChange$={({ open: next }) => {
                events.value++;
                if (!reject.value)
                    open.value = next;
            }}><p>서버에서 일시 정지한 대화 상자</p><Button onClick$={() => { events.value++; open.value = false; }}>확인</Button></Modal>
  <Tabs id="resume-tabs" label="정보 구분" value={tab.value} onValueChange$={({ value }) => {
                events.value++;
                if (!reject.value)
                    tab.value = value;
            }} items={[{ value: 'first', label: '첫 번째', content: <p>첫 번째 내용</p> }, { value: 'second', label: '두 번째', content: <label>보존된 입력<input value="local"/></label> }]}/>
  <Calendar id="resume-calendar" label="독립 날짜 선택" defaultValue={null} referenceDate="2024-02-15" min="2024-02-01" max="2024-03-31" onValueChange$={() => events.value++}/>
  </section>}
  <output aria-label="요청 정책">{reject.value ? 'reject' : 'accept'}</output><output aria-label="이벤트 수">{events.value}</output><Button onClick$={() => { date.value = '2024-03-02'; region.value = 'busan'; tab.value = 'second'; }}>외부 갱신</Button>
  <Button onClick$={() => { mounted.value = !mounted.value; }}>마운트 전환</Button>
 </main>;
});
