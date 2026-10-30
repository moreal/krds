# qwik · 54 components

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Current Masthead-disclaimer source-byte compiler checkpoint. Qwik source-review and nested-QRL repairs remain active. TypeScript success does not establish optimizer output, production serialization/resume, first-lazy-event behavior, or native acceptance.

Source: [apps/fixture-qwik/src/catalog-examples.tsx](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt). SHA-256: `5c118523600304d9f4dde9c12c99b882a7ffc42552761954f549ae2b559420e0`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-qwik exec tsc -p tsconfig.examples.json --noEmit`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).


```tsx
import { component$,useSignal,useId,noSerialize } from '@builder.io/qwik';
import * as K from "@unofficial-krds/qwik";
const logo = { src: '/local-assets/specimen-logo.svg', alt: '독립 예제 운영기관' };
const home = { label: '예제 서비스 홈', href: '/local/home', logo: { src: '/local-assets/service-logo.svg', alt: '예제 서비스 홈' } };
const links = [{ id: 'home', label: '홈', href: '/local/home' }, { id: 'help', label: '도움말', href: '/local/help' }];
const options = [{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }];
export const MastheadExample = component$(() => { return <section aria-label="공식 배너의 비공식 예제"><p>공식 정부서비스를 가정한 배너 UI 예시입니다. 실제 공식 정부서비스가 아닙니다.</p><K.Masthead governmentService={true}/></section>; });
export const IdentifierExample = component$(() => { return <footer><K.Identifier institutionName="독립 예제 운영기관" logo={logo} relationshipText="독립 예제 운영기관이 운영하는 예제 서비스입니다."/></footer>; });
export const HeaderExample = component$(() => { return <K.Header home={home} utilityItems={links} mainNavigation={links}/>; });
export const FooterExample = component$(() => { return <K.Footer serviceLogo={home.logo} contacts={[{ label: '이메일', text: 'local@example.invalid', href: 'mailto:local@example.invalid' }]} utilityLinks={links} privacyPolicy={{ label: '개인정보 처리방침', href: '/local/privacy' }} policyLinks={[]} copyrightText="Independent local example"/>; });
export const SkipLinkExample = component$(() => { return <><K.SkipLink links={[{ id: 'main', label: '본문 바로가기', targetId: 'example-main' }]}/><main id="example-main"><h1>본문</h1><button>본문 작업</button></main></>; });
export const MainMenuExample = component$(() => { return <K.MainMenu items={[...links, { id: 'apply', label: '신청', children: [{ id: 'new', label: '신규 신청', href: '/local/apply' }] }]}/>; });
export const BreadcrumbExample = component$(() => { return <K.Breadcrumb home={home} items={[{ id: 'apply', label: '신청', href: '/local/apply' }]} currentItem={{ id: 'detail', label: '신청 상세' }} omitCurrent={false}/>; });
export const SideNavigationExample = component$(() => { return <K.SideNavigation title="신청 안내" items={links} currentId="home"/>; });
export const InPageNavigationExample = component$(() => { return <><K.InPageNavigation sections={[{ id: 'example-overview', label: '개요' }]}/><section id="example-overview" tabIndex={-1}><h2>개요</h2></section></>; });
export const PaginationExample = component$(() => { return <K.Pagination pageCount={12} hrefForPage$={page => `/local/results?page=${page}`}/>; });
export const StructuredListExample = component$(() => { return <K.StructuredList title="신청 공고" items={[{ id: 'one', title: '예제 공고', href: '/local/notice', metadata: [{ label: '마감일', value: null }] }]}/>; });
export const CriticalAlertExample = component$(() => { return <K.CriticalAlert urgency="high" label="긴급 안내" message="예제 서비스 점검 중입니다."/>; });
export const DisclosureExample = component$(() => { const id = useId(); return <K.Disclosure label="신청 도움말" contentId={id}><p>신청서를 작성하는 방법입니다.</p></K.Disclosure>; });
export const BadgeExample = component$(() => { return <K.Badge label="접수 완료" tone="success" appearance="pastel"/>; });
export const AccordionExample = component$(() => { return <K.Accordion items={[{ id: 'eligibility', title: '신청 자격', content: '신청 자격을 확인하세요.' }, { id: 'documents', title: '제출 서류', content: '필요한 서류를 준비하세요.' }]}/>; });
export const ImageExample = component$(() => { return <K.Image src="/local-assets/specimen-landscape.svg" alt="파란 하늘과 초록 산, 가운데 강을 표현한 예제 그림" width={640} height={360} caption="독립 예제 그림"/>; });
export const CarouselExample = component$(() => { return <K.Carousel items={[{ id: 'one', label: '신청 안내', content: '신청을 시작하세요.' }, { id: 'two', label: '서류 안내', content: '서류를 준비하세요.' }]}/>; });
export const TableExample = component$(() => { return <K.Table caption="신청 내역" rowHeaderColumnId="name" columns={[{ id: 'name', label: '신청명', kind: 'text' }, { id: 'count', label: '수량', kind: 'number' }]} rows={[{ id: 'one', cells: { name: '예제 신청', count: 2 } }]}/>; });
export const TextListExample = component$(() => { return <K.TextList ordered={true} items={[{ id: 'one', content: '신청 조건 확인' }, { id: 'two', content: '제출 서류 준비' }]}/>; });
export const FaviconExample = component$(() => { return <K.Favicon light={{ href: '/local-assets/specimen-icon-light.svg', type: 'image/svg+xml', sizes: 'any' }} dark={{ href: '/local-assets/specimen-icon-dark.svg', type: 'image/svg+xml', sizes: 'any' }}/>; });
export const LinkExample = component$(() => { return <K.Link href="/local/application" label="신청 안내"/>; });
export const FABExample = component$(() => { const result = useSignal(''); return <><K.FAB label="새 신청" icon="+" onAction$={() => result.value = '새 신청을 시작했습니다.'}/><output>{result.value}</output></>; });
export const RadioGroupExample = component$(() => { return <form><K.RadioGroup label="거주 지역" name="region" options={options}/><button type="reset">초기화</button></form>; });
export const CheckboxExample = component$(() => { return <form><K.Checkbox label="이용약관 동의" name="consent" value="agreed"/><button type="reset">초기화</button></form>; });
export const TagExample = component$(() => { const items = useSignal([{ id: 'seoul', label: '서울' }, { id: 'busan', label: '부산' }]); return <K.Tag mode="removable" items={items.value} onRemove$={({ id }) => items.value = items.value.filter(item => item.id !== id)}/>; });
export const SwitchExample = component$(() => { return <form><K.Switch label="예제 알림" name="notifications"/><button type="reset">초기화</button></form>; });
export const StepIndicatorExample = component$(() => { return <K.StepIndicator steps={[{ id: 'terms', label: '약관 확인', status: 'complete' }, { id: 'form', label: '정보 입력', status: 'current' }, { id: 'done', label: '완료', status: 'pending' }]}/>; });
export const SpinnerExample = component$(() => { return <K.Spinner pending={true} value={40} label="처리 중" completionMessage="처리했습니다."/>; });
const topics = [{ id: 'eligibility', title: '신청 자격', content: '예제 신청 자격 도움말', relatedLinks: links }];
export const HelpPanelExample = component$(() => { return <K.HelpPanel defaultOpen={false} topics={topics}/>; });
export const TutorialPanelExample = component$(() => { const running = useSignal(false); return <K.TutorialPanel defaultOpen={false} tasks={[{ id: 'apply', title: '신청하기', steps: [{ id: 'name', title: '이름 입력', targetId: 'example-name', instruction: '이름을 입력하세요.' }] }]} activeTaskId="apply" activeStepId="name" running={running.value} startActionId="example-tutorial-start" onStart$={() => running.value = true} onStop$={() => running.value = false}/>; });
export const ContextualHelpExample = component$(() => { return <K.ContextualHelp title="신청 자격" content="신청 조건을 확인하세요." triggerLabel="신청 자격 도움말"/>; });
export const CoachMarkExample = component$(() => { const open = useSignal(false); return <><button id="example-tour-start" onClick$={() => open.value = true}>따라하기 시작</button><label for="example-tour-name">이름</label><input id="example-tour-name"/><span id="example-tour-name-after"/><K.CoachMark open={open.value} onOpenChange$={({ open:next }) => open.value = next} steps={[{ id: 'name', targetId: 'example-tour-name', title: '이름 입력', instruction: '신청인 이름을 입력하세요.' }]} boundaries={[{ targetId: 'example-tour-name', insertionBoundaryId: 'example-tour-name-after' }]} startActionId="example-tour-start"/></>; });
export const TooltipExample = component$(() => { const id = useId(); return <K.Tooltip triggerId={`${id}-trigger`} textId={`${id}-text`} triggerLabel="신청 도움말" text="신청 도움말을 엽니다."/>; });
export const TTSExample = component$(() => { const state = useSignal<K.TTSProps['state']>('idle'); return <><p>실제 음성을 호출하지 않는 로컬 상태 모의입니다.</p><K.TTS label="음성 안내" summary="신청 방법을 안내합니다." locale="ko-KR" state={state.value} onRequest$={({ action }) => state.value = action === 'play' || action === 'resume' ? 'playing' : action === 'pause' ? 'paused' : 'idle'}/></>; });
export const TextareaExample = component$(() => { return <form><K.Textarea label="신청 사유" name="reason" maxLength={200}/><button type="reset">초기화</button></form>; });
export const TextInputExample = component$(() => { return <form><K.TextInput label="신청인 이름" name="name" autocomplete="name"/><button type="reset">초기화</button></form>; });
export const FileUploadExample = component$(() => { const files = useSignal<K.FileUploadProps['files']>([]); const receipt = useSignal(''); return <form preventdefault:submit onSubmit$={(event,form) => { event.preventDefault(); const data = K.appendCommittedFiles(new FormData(form), 'documents', files.value); receipt.value = data.getAll('documents').map(file => file instanceof File ? file.name : '').join(', '); }}><K.FileUpload label="첨부 서류" name="documents" files={files.value} multiple={true} onFilesChange$={({ value }) => files.value = value.map(record => ({...record,file:noSerialize(record.file)!}))}/><button type="submit">제출</button><output>{receipt.value}</output></form>; });
export const LanguageSwitcherExample = component$(() => { const locale = useSignal('ko'); return <><K.LanguageSwitcher currentLocale={locale.value} options={[{ locale: 'ko', nativeLabel: '한국어', translatedLabel: '한국어', href: '/local/ko' }, { locale: 'en', nativeLabel: 'English', translatedLabel: '영어', href: '/local/en' }]} onLocaleRequest$={({ locale:next }) => locale.value = next}/><p lang={locale.value}>{locale.value === 'ko' ? '한국어 로컬 예제' : 'English local example'}</p></>; });
export const ResizeExample = component$(() => { const scale = useSignal('100'); return <><K.Resize value={scale.value} onValueChange$={({ value }) => scale.value = value}/><p style={{ 'font-size': `${16 * Number(scale.value) / 100}px` }}>화면 크기 예제</p></>; });
export const AccessibleMediaExample = component$(() => { return <K.AccessibleMedia title="독립 예제 신호음" media={{ kind: 'audio', src: '/local-assets/specimen-audio.wav', type: 'audio/wav' }} transcript={{ content: '약 1초 동안 일정한 높이의 예제 신호음이 들립니다.' }}/>; });
export const VisuallyHiddenExample = component$(() => { const id = useId(); return <><K.VisuallyHidden id={id} content="입력 내용을 확인하고 제출하세요."/><button aria-describedby={id}>신청 제출</button></>; });
export const RangeSliderExample = component$(() => { return <form><K.RangeSlider label="비율" name="ratio" min={0} max={100} step={10} defaultValue={50}/><button type="reset">초기화</button></form>; });
export const BackButtonExample = component$(() => { const route = useSignal('/local/current'); return <><K.BackButton canGoBack={true} onBackRequest$={() => route.value = '/local/parent'}/><output>{route.value}</output></>; });
export const BottomSheetExample = component$(() => { const open = useSignal(false); return <><button onClick$={() => open.value = true}>지역 선택</button><K.BottomSheet title="지역 선택" open={open.value} onOpenChange$={({ open:next }) => open.value = next}><p>지역 선택 예제입니다.</p></K.BottomSheet></>; });
export const QuantityToggleExample = component$(() => { return <form><K.QuantityToggle label="신청 수량" name="quantity" min={0} max={10} defaultValue={2}/><button type="reset">초기화</button></form>; });
export const ToastExample = component$(() => { const message = useSignal<K.ToastProps['message']>(null); const result = useSignal(''); return <><button onClick$={() => { result.value = '신청이 저장되었습니다.'; message.value = { id: 'saved', text: '신청이 저장되었습니다.', tone: 'information', persistentResultId: 'example-result' }; }}>신청 저장</button><p id="example-result">{result.value}</p><K.Toast message={message.value} onDismiss$={() => message.value = null}/></>; });
export const SnackbarExample = component$(() => { const message = useSignal<K.SnackbarProps['message']>({ id: 'saved', title: '저장 완료', text: '예제 신청을 저장했습니다.' }); return <K.Snackbar message={message.value} onDismiss$={() => message.value = null}/>; });
export const TabBarExample = component$(() => { return <K.TabBar currentId="home" items={[{ id: 'home', label: '홈', href: '/local/home', icon: '⌂' }, { id: 'apply', label: '신청', href: '/local/apply', icon: '+' }, { id: 'profile', label: '내 정보', href: '/local/profile', icon: '○' }]}/>; });
export const ButtonExample=component$(()=>{const count=useSignal(0);return <><K.Button onClick$={()=>count.value++}>저장</K.Button><output>{count.value}</output></>;});
export const NativeSelectExample=component$(()=><form><K.NativeSelect label="거주 지역" name="region" options={options} defaultValue="seoul"/><button type="reset">초기화</button></form>);
export const ModalExample=component$(()=>{const open=useSignal(false);return <><K.Button onClick$={()=>open.value=true}>확인 열기</K.Button><K.Modal title="신청 확인" open={open.value} onOpenChange$={({open:next})=>open.value=next}><p>신청 내용을 확인하세요.</p></K.Modal></>;});
export const TabsExample=component$(()=><K.Tabs label="신청 정보" items={[{value:'overview',label:'개요',content:<p>신청 개요</p>},{value:'documents',label:'서류',content:<p>제출 서류</p>}]} defaultValue="overview"/>);
export const CalendarExample=component$(()=><K.Calendar label="방문일 선택" referenceDate="2024-02-15" defaultValue="2024-02-29"/>);
export const DateInputExample=component$(()=><form><K.DateInput label="방문일" name="visit" referenceDate="2024-02-15" defaultValue="2024-02-29"/><button type="reset">초기화</button></form>);
```

