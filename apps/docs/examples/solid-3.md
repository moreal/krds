# solid · 48 components

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/solid version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-solid/src/catalog-examples.tsx](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt). SHA-256: `92672a7d08d81ba64f999450da0ec3355091fabfdf211bfc44175157632b739f`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-solid typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).


```tsx
import { createSignal, createUniqueId } from 'solid-js';
import * as K from '@unofficial-krds/solid';
const logo={src:'/local-assets/specimen-logo.svg',alt:'독립 예제 운영기관'};
const home={label:'예제 서비스 홈',href:'/local/home',logo:{src:'/local-assets/service-logo.svg',alt:'예제 서비스 홈'}};
const links=[{id:'home',label:'홈',href:'/local/home'},{id:'help',label:'도움말',href:'/local/help'}];
const options=[{value:'seoul',label:'서울'},{value:'busan',label:'부산'}];
export function MastheadExample(){return <section aria-label="공식 배너의 비공식 예제"><p>비공식 독립 로컬 예제</p><K.Masthead governmentService={true}/></section>;}
export function IdentifierExample(){return <footer><K.Identifier institutionName="독립 예제 운영기관" logo={logo} relationshipText="독립 예제 운영기관이 운영하는 예제 서비스입니다."/></footer>;}
export function HeaderExample(){return <K.Header home={home} utilityItems={links} mainNavigation={links}/>;}
export function FooterExample(){return <K.Footer serviceLogo={home.logo} contacts={[{label:'이메일',text:'local@example.invalid',href:'mailto:local@example.invalid'}]} utilityLinks={links} privacyPolicy={{label:'개인정보 처리방침',href:'/local/privacy'}} policyLinks={[]} copyrightText="Independent local example"/>;}
export function SkipLinkExample(){return <><K.SkipLink links={[{id:'main',label:'본문 바로가기',targetId:'example-main'}]}/><main id="example-main"><h1>본문</h1><button>본문 작업</button></main></>;}
export function MainMenuExample(){return <K.MainMenu items={[...links,{id:'apply',label:'신청',children:[{id:'new',label:'신규 신청',href:'/local/apply'}]}]}/>;}
export function BreadcrumbExample(){return <K.Breadcrumb home={home} items={[{id:'apply',label:'신청',href:'/local/apply'}]} currentItem={{id:'detail',label:'신청 상세'}} omitCurrent={false}/>;}
export function SideNavigationExample(){return <K.SideNavigation title="신청 안내" items={links} currentId="home"/>;}
export function InPageNavigationExample(){return <><K.InPageNavigation sections={[{id:'example-overview',label:'개요'}]}/><section id="example-overview" tabIndex={-1}><h2>개요</h2></section></>;}
export function PaginationExample(){return <K.Pagination pageCount={12} hrefForPage={page=>`/local/results?page=${page}`}/>;}
export function StructuredListExample(){return <K.StructuredList title="신청 공고" items={[{id:'one',title:'예제 공고',href:'/local/notice',metadata:[{label:'마감일',value:null}]}]}/>;}
export function CriticalAlertExample(){return <K.CriticalAlert urgency="high" label="긴급 안내" message="예제 서비스 점검 중입니다."/>;}
export function DisclosureExample(){const id=createUniqueId();return <K.Disclosure label="신청 도움말" contentId={id}><p>신청서를 작성하는 방법입니다.</p></K.Disclosure>;}
export function BadgeExample(){return <K.Badge label="접수 완료" tone="success" appearance="pastel"/>;}
export function AccordionExample(){return <K.Accordion items={[{id:'eligibility',title:'신청 자격',content:'신청 자격을 확인하세요.'},{id:'documents',title:'제출 서류',content:'필요한 서류를 준비하세요.'}]}/>;}
export function ImageExample(){return <K.Image src="/local-assets/specimen-landscape.svg" alt="파란 하늘과 초록 산, 가운데 강을 표현한 예제 그림" width={640} height={360} caption="독립 예제 그림"/>;}
export function CarouselExample(){return <K.Carousel items={[{id:'one',label:'신청 안내',content:'신청을 시작하세요.'},{id:'two',label:'서류 안내',content:'서류를 준비하세요.'}]}/>;}
export function TableExample(){return <K.Table caption="신청 내역" rowHeaderColumnId="name" columns={[{id:'name',label:'신청명',kind:'text'},{id:'count',label:'수량',kind:'number'}]} rows={[{id:'one',cells:{name:'예제 신청',count:2}}]}/>;}
export function TextListExample(){return <K.TextList ordered={true} items={[{id:'one',content:'신청 조건 확인'},{id:'two',content:'제출 서류 준비'}]}/>;}
export function FaviconExample(){return <K.Favicon light={{href:'/local-assets/specimen-icon-light.svg',type:'image/svg+xml',sizes:'any'}} dark={{href:'/local-assets/specimen-icon-dark.svg',type:'image/svg+xml',sizes:'any'}}/>;}
export function LinkExample(){return <K.Link href="/local/application" label="신청 안내"/>;}
export function FABExample(){const [result,setResult]=createSignal('');return <><K.FAB label="새 신청" icon="+" onAction={()=>setResult('새 신청을 시작했습니다.')}/><output>{result()}</output></>;}
export function RadioGroupExample(){return <form><K.RadioGroup label="거주 지역" name="region" options={options}/><button type="reset">초기화</button></form>;}
export function CheckboxExample(){return <form><K.Checkbox label="이용약관 동의" name="consent" value="agreed"/><button type="reset">초기화</button></form>;}
export function TagExample(){const [items,setItems]=createSignal([{id:'seoul',label:'서울'},{id:'busan',label:'부산'}]);return <K.Tag mode="removable" items={items()} onRemove={({id})=>setItems(items().filter(item=>item.id!==id))}/>;}
export function SwitchExample(){return <form><K.Switch label="예제 알림" name="notifications"/><button type="reset">초기화</button></form>;}
export function StepIndicatorExample(){return <K.StepIndicator steps={[{id:'terms',label:'약관 확인',status:'complete'},{id:'form',label:'정보 입력',status:'current'},{id:'done',label:'완료',status:'pending'}]}/>;}
export function SpinnerExample(){return <K.Spinner pending={true} value={40} label="처리 중" completionMessage="처리했습니다."/>;}
const topics=[{id:'eligibility',title:'신청 자격',content:'예제 신청 자격 도움말',relatedLinks:links}];
export function HelpPanelExample(){return <K.HelpPanel defaultOpen={false} topics={topics}/>;}
export function TutorialPanelExample(){const [running,setRunning]=createSignal(false);return <K.TutorialPanel defaultOpen={false} tasks={[{id:'apply',title:'신청하기',steps:[{id:'name',title:'이름 입력',targetId:'example-name',instruction:'이름을 입력하세요.'}]}]} activeTaskId="apply" activeStepId="name" running={running()} startActionId="example-tutorial-start" onStart={()=>setRunning(true)} onStop={()=>setRunning(false)}/>;}
export function ContextualHelpExample(){return <K.ContextualHelp title="신청 자격" content="신청 조건을 확인하세요." triggerLabel="신청 자격 도움말"/>;}
export function CoachMarkExample(){const [open,setOpen]=createSignal(false);return <><button id="example-tour-start" onClick={()=>setOpen(true)}>따라하기 시작</button><label for="example-tour-name">이름</label><input id="example-tour-name"/><span id="example-tour-name-after"/><K.CoachMark open={open()} onOpenChange={({open})=>setOpen(open)} steps={[{id:'name',targetId:'example-tour-name',title:'이름 입력',instruction:'신청인 이름을 입력하세요.'}]} boundaries={[{targetId:'example-tour-name',insertionBoundaryId:'example-tour-name-after'}]} startActionId="example-tour-start"/></>;}
export function TooltipExample(){const id=createUniqueId();return <K.Tooltip triggerId={`${id}-trigger`} textId={`${id}-text`} triggerLabel="신청 도움말" text="신청 도움말을 엽니다."/>;}
export function TTSExample(){const [state,setState]=createSignal<K.TTSProps['state']>('idle');return <><p>실제 음성을 호출하지 않는 로컬 상태 모의입니다.</p><K.TTS label="음성 안내" summary="신청 방법을 안내합니다." locale="ko-KR" state={state()} onRequest={({action})=>setState(action==='play'||action==='resume'?'playing':action==='pause'?'paused':'idle')}/></>;}
export function TextareaExample(){return <form><K.Textarea label="신청 사유" name="reason" maxLength={200}/><button type="reset">초기화</button></form>;}
export function TextInputExample(){return <form><K.TextInput label="신청인 이름" name="name" autocomplete="name"/><button type="reset">초기화</button></form>;}
export function FileUploadExample(){const [files,setFiles]=createSignal<K.FileUploadProps['files']>([]);const [receipt,setReceipt]=createSignal('');return <form onSubmit={event=>{event.preventDefault();const data=K.appendCommittedFiles(new FormData(event.currentTarget),'documents',files());setReceipt(data.getAll('documents').map(file=>file instanceof File?file.name:'').join(', '));}}><K.FileUpload label="첨부 서류" name="documents" files={files()} multiple={true} onFilesChange={({value})=>setFiles(value)}/><button type="submit">제출</button><output>{receipt()}</output></form>;}
export function LanguageSwitcherExample(){const [locale,setLocale]=createSignal('ko');return <><K.LanguageSwitcher currentLocale={locale()} options={[{locale:'ko',nativeLabel:'한국어',translatedLabel:'한국어',href:'/local/ko'},{locale:'en',nativeLabel:'English',translatedLabel:'영어',href:'/local/en'}]} onLocaleRequest={({locale})=>setLocale(locale)}/><p lang={locale()}>{locale()==='ko'?'한국어 로컬 예제':'English local example'}</p></>;}
export function ResizeExample(){const [scale,setScale]=createSignal('100');return <><K.Resize value={scale()} onValueChange={({value})=>setScale(value)}/><p style={{'font-size':`${16*Number(scale())/100}px`}}>화면 크기 예제</p></>;}
export function AccessibleMediaExample(){return <K.AccessibleMedia title="독립 예제 신호음" media={{kind:'audio',src:'/local-assets/specimen-audio.wav',type:'audio/wav'}} transcript={{content:'약 1초 동안 일정한 높이의 예제 신호음이 들립니다.'}}/>;}
export function VisuallyHiddenExample(){const id=createUniqueId();return <><K.VisuallyHidden id={id} content="입력 내용을 확인하고 제출하세요."/><button aria-describedby={id}>신청 제출</button></>;}
export function RangeSliderExample(){return <form><K.RangeSlider label="비율" name="ratio" min={0} max={100} step={10} defaultValue={50}/><button type="reset">초기화</button></form>;}
export function BackButtonExample(){const [route,setRoute]=createSignal('/local/current');return <><K.BackButton canGoBack={true} onBackRequest={()=>setRoute('/local/parent')}/><output>{route()}</output></>;}
export function BottomSheetExample(){const [open,setOpen]=createSignal(false);return <><button onClick={()=>setOpen(true)}>지역 선택</button><K.BottomSheet title="지역 선택" open={open()} onOpenChange={({open})=>setOpen(open)}><p>지역 선택 예제입니다.</p></K.BottomSheet></>;}
export function QuantityToggleExample(){return <form><K.QuantityToggle label="신청 수량" name="quantity" min={0} max={10} defaultValue={2}/><button type="reset">초기화</button></form>;}
export function ToastExample(){const [message,setMessage]=createSignal<K.ToastProps['message']>(null);const [result,setResult]=createSignal('');return <><button onClick={()=>{setResult('신청이 저장되었습니다.');setMessage({id:'saved',text:'신청이 저장되었습니다.',tone:'information',persistentResultId:'example-result'});}}>신청 저장</button><p id="example-result">{result()}</p><K.Toast message={message()} onDismiss={()=>setMessage(null)}/></>;}
export function SnackbarExample(){const [message,setMessage]=createSignal<K.SnackbarProps['message']>({id:'saved',title:'저장 완료',text:'예제 신청을 저장했습니다.'});return <K.Snackbar message={message()} onDismiss={()=>setMessage(null)}/>;}
export function TabBarExample(){return <K.TabBar currentId="home" items={[{id:'home',label:'홈',href:'/local/home',icon:'⌂'},{id:'apply',label:'신청',href:'/local/apply',icon:'+'},{id:'profile',label:'내 정보',href:'/local/profile',icon:'○'}]}/>;}
```

