import { component$, useSignal } from '@builder.io/qwik';
import { Carousel } from '../../src/components/carousel';
import { TutorialPanel } from '../../src/components/tutorial-panel';
import { Image } from '../../src/components/image';
import { TextInput } from '../../src/components/text-input';
import { Textarea } from '../../src/components/textarea';
import { RangeSlider } from '../../src/components/range-slider';
import { Checkbox } from '../../src/components/checkbox';
import { Switch } from '../../src/components/switch';
import { Disclosure } from '../../src/components/disclosure';
import { InPageNavigation } from '../../src/components/in-page-navigation';
import { CoachMark, CoachMarkOutlet } from '../../src/components/coach-mark';
import { Toast } from '../../src/components/toast';
import { Snackbar } from '../../src/components/snackbar';
import { Tooltip } from '../../src/components/tooltip';
import { MainMenu } from '../../src/components/main-menu';

/** Local-only resumability fixtures: SSR-rendered, paused, then resumed by qwikloader in a real browser. */
const items = [{ id: 'a', label: '신청 안내', content: '첫 번째 신청 안내' }, { id: 'b', label: '서류 안내', content: '두 번째 서류 안내' }, { id: 'c', label: '문의 안내', content: '세 번째 문의 안내' }];
export const CarouselResume = component$(() => {
  const requests = useSignal(0);
  return <><Carousel items={items} defaultIndex={0} layout="single" autoplay={true} intervalMs={6000} loop={false} onPlayingChange$={() => { requests.value++; }}/><p id="requests">{requests.value}</p></>;
});

const tasks = [{ id: 'apply', title: '신청하기', steps: [{ id: 'name', title: '신청인 이름', instruction: '이름을 입력하세요', targetId: 'applicant-name' }, { id: 'save', title: '신청 저장', instruction: '저장을 누르세요', targetId: 'save-application' }] }];
export const TutorialPanelResume = component$(() => {
  const running = useSignal(false), step = useSignal<string | null>(null);
  return <>
    <TutorialPanel defaultOpen={true} defaultActivePanel="tutorial" startActionId="tutorial-start" fallbackFocusId="tutorial-fallback" tasks={tasks} activeTaskId="apply" activeStepId={step.value} running={running.value}
      onStart$={(detail) => { step.value = detail.stepId; running.value = true; }}
      onStepChange$={(detail) => { step.value = detail.id; }}
      onStop$={() => { running.value = false; step.value = null; }}/>
    <p id="tutorial-status">{running.value ? `진행 중: ${step.value}` : '중지됨'}</p>
    <button id="tutorial-fallback" type="button">대체 초점</button>
  </>;
});

/** A failing source whose `error` fires while the container is still paused (the harness stalls the HTML stream after the figure). */
export const ImageResume = component$(() => <>
  <Image src="/missing-image.png" alt="불러오지 못한 안내 이미지" width={320} height={180} loading="eager"/>
  <Image src={"data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20"><rect width="40" height="20" fill="#888"/></svg>')} alt="불러온 안내 이미지" width={40} height={20} loading="eager"/>
</>);

/** Uncontrolled fields typed/toggled immediately after load, before the lazily imported handlers resolve. */
export const FieldsResume = component$(() => <form id="fields-form" preventdefault:submit>
  <TextInput label="이름"/>
  <Textarea label="내용"/>
  <RangeSlider label="음량" min={0} max={100} step={10} defaultValue={0}/>
  <Checkbox label="동의"/>
  <Switch label="알림"/>
  <button id="fields-reset" type="reset">초기화</button>
</form>);

/** Controlled fields whose host rejects some requests: the committed value must be restored. */
export const ControlledFieldsResume = component$(() => {
  const text = useSignal('가'), agreed = useSignal(false), notify = useSignal(false);
  return <>
    <TextInput label="숫자 거절" value={text.value} onValueChange$={(detail) => { if (!/\d/.test(detail.value)) text.value = detail.value; }}/>
    <Checkbox label="동의 거절" checked={agreed.value} onCheckedChange$={() => {}}/>
    <Switch label="알림 거절" checked={notify.value} onCheckedChange$={() => {}}/>
    <p id="controlled-text">{text.value}</p>
  </>;
});

/** Derived text inside spread-prop elements whose host re-renders repeatedly after resume (latent signal-text freeze check). */
const toastTexts = ['첫 번째 알림', '두 번째 알림', '세 번째 알림', '네 번째 알림'];
export const LatentTextResume = component$(() => {
  const toast = useSignal<{ id: string; text: string; tone: 'information' | 'warning'; persistentResultId: string } | null>({ id: 'notice', text: toastTexts[0], tone: 'information', persistentResultId: 'toast-result' }), step = useSignal(0);
  return <>
    <Disclosure label="신청 도움말" contentId="latent-help" defaultOpen={false}><p>도움말 내용</p></Disclosure>
    <Textarea label="메모" maxLength={100}/>
    <RangeSlider label="밝기" min={0} max={100} step={10} defaultValue={0}/>
    <RangeSlider label="채도" min={0} max={100} step={10} defaultValue={0} valueText$={(value) => `${value}퍼센트`}/>
    <button id="toast-next" type="button" onClick$={() => { step.value++; toast.value = { id: 'notice', text: toastTexts[step.value % 4], tone: step.value % 2 ? 'warning' : 'information', persistentResultId: 'toast-result' }; }}>알림 바꾸기</button>
    <Toast message={toast.value} durationMs={600000} onDismiss$={() => {}}/>
    <p id="toast-result">결과</p>
    <CoachMark defaultOpen={true} defaultStepId="one" startActionId="coach-start" fallbackFocusId="coach-fallback"
      steps={[{ id: 'one', title: '첫 단계', targetId: 'coach-target', instruction: '첫 안내' }, { id: 'two', title: '둘째 단계', targetId: 'coach-target', instruction: '둘째 안내' }, { id: 'three', title: '셋째 단계', targetId: 'coach-target', instruction: '셋째 안내' }]}
      boundaries={[{ targetId: 'coach-target', insertionBoundaryId: 'coach-target-after' }]}>
      <label for="coach-target">대상</label><input id="coach-target"/><div id="coach-target-after"><CoachMarkOutlet targetId="coach-target"/></div>
    </CoachMark>
    <button id="coach-start" type="button">시작</button><button id="coach-fallback" type="button">대체</button>
  </>;
});
export const LatentNavResume = component$(() => <>
  <InPageNavigation sections={[{ id: 'overview', label: '개요' }, { id: 'details', label: '세부' }]} title="이 페이지의 구성" narrowMode="disclosure"/>
  <section id="overview"><h2>개요</h2></section><section id="details"><h2>세부</h2></section>
</>);
export const LatentMenuResume = component$(() => <MainMenu items={[{ id: 'apply', label: '신청', children: [{ id: 'apply-new', label: '새 신청', children: [{ id: 'docs', label: '서류 안내', children: [{ id: 'docs-a', label: '서류 가', href: '#a' }] }, { id: 'contact', label: '문의 안내', children: [{ id: 'contact-a', label: '문의 가', href: '#c' }] }] }] }, { id: 'help', label: '도움', href: '#help' }]} defaultExpandedId={null} defaultMobileOpen={true}/>);

/** Controlled fields whose host also writes values from outside, and can lock (reject every request). */
export const HostDrivenResume = component$(() => {
  const text = useSignal('처음'), note = useSignal('메모'), level = useSignal(20), agreed = useSignal(false), notify = useSignal(false), locked = useSignal(false);
  return <>
    <TextInput label="호스트 이름" value={text.value} onValueChange$={(detail) => { if (!locked.value) text.value = detail.value; }}/>
    <Textarea label="호스트 내용" value={note.value} onValueChange$={(detail) => { if (!locked.value) note.value = detail.value; }}/>
    <RangeSlider label="호스트 수준" min={0} max={100} step={10} value={level.value} onValueChange$={(detail) => { if (!locked.value) level.value = detail.value; }}/>
    <Checkbox label="호스트 동의" checked={agreed.value} onCheckedChange$={(detail) => { if (!locked.value) agreed.value = detail.checked; }}/>
    <Switch label="호스트 알림" checked={notify.value} onCheckedChange$={(detail) => { if (!locked.value) notify.value = detail.checked; }}/>
    <button id="host-set" type="button" onClick$={() => { text.value = '외부 값'; note.value = '외부 내용'; level.value = 70; agreed.value = true; notify.value = true; }}>외부 설정</button>
    <button id="host-clear" type="button" onClick$={() => { text.value = ''; note.value = ''; level.value = 0; agreed.value = false; notify.value = false; }}>외부 지우기</button>
    <button id="host-lock" type="button" onClick$={() => { locked.value = !locked.value; }}>{locked.value ? '잠김' : '열림'}</button>
    <p id="host-state">{`${text.value}|${note.value}|${level.value}|${agreed.value}|${notify.value}`}</p>
  </>;
});

/** Controlled fields whose host handler throws (treated as a rejection that must not strand later requests). */
export const ThrowingResume = component$(() => {
  const agreed = useSignal(false), notify = useSignal(false), level = useSignal(0), name = useSignal('원래'), memo = useSignal('원래 메모');
  return <>
    <TextInput label="던지는 이름" value={name.value} onValueChange$={() => { throw new Error('host refused text'); }}/>
    <Textarea label="던지는 메모" value={memo.value} onValueChange$={() => { throw new Error('host refused textarea'); }}/>
    <RangeSlider label="던지는 수준" min={0} max={100} step={10} value={level.value} onValueChange$={() => { throw new Error('host refused range'); }}/>
    <Checkbox label="던지는 동의" checked={agreed.value} onCheckedChange$={() => { throw new Error('host refused checkbox'); }}/>
    <Switch label="던지는 알림" checked={notify.value} onCheckedChange$={() => { throw new Error('host refused switch'); }}/>
    <button id="throw-set" type="button" onClick$={() => { agreed.value = true; notify.value = true; level.value = 50; name.value = '외부 이름'; memo.value = '외부 메모'; }}>외부 설정</button>
  </>;
});

/** Inline object literal message, the idiomatic host form. */
const inlineTexts = ['첫 번째 안내', '두 번째 안내', '세 번째 안내'];
export const ToastInlineResume = component$(() => {
  const step = useSignal(0);
  return <>
    <button id="inline-next" type="button" onClick$={() => { step.value++; }}>안내 바꾸기</button>
    <Toast message={{ id: 'inline', text: inlineTexts[step.value % 3], tone: step.value % 2 ? 'warning' : 'information', persistentResultId: 'inline-result' }} durationMs={600000} onDismiss$={() => {}}/>
    <p id="inline-result">결과</p>
  </>;
});

/** A field the host unmounts and remounts after resume (boundary listeners must follow the component lifetime). */
export const MountedFieldResume = component$(() => {
  const shown = useSignal(true);
  return <>
    <button id="mount-toggle" type="button" onClick$={() => { shown.value = !shown.value; }}>{shown.value ? '숨기기' : '보이기'}</button>
    {shown.value && <TextInput label="탈착 이름"/>}
  </>;
});

/** Inline object literal Snackbar message (same hazard class as Toast). */
export const SnackbarInlineResume = component$(() => {
  const step = useSignal(0);
  return <>
    <button id="snackbar-next" type="button" onClick$={() => { step.value++; }}>알림 바꾸기</button>
    <Snackbar message={{ id: 'inline', title: inlineTexts[step.value % 3], text: `본문 ${step.value % 3}` }} durationMs={null} onDismiss$={() => {}}/>
  </>;
});

/** Tooltip between two focus stops, for keyboard departure and re-entry after an Escape dismissal. */
export const TooltipResume = component$(() => <>
  <button id="tooltip-before" type="button">앞</button>
  <Tooltip text="신청 도움말을 엽니다" relationship="description" triggerLabel="신청 도움말" triggerId="help-trigger" textId="help-tooltip" defaultOpen={false} placement="bottom-start"/>
  <button id="tooltip-after" type="button">뒤</button>
</>);
