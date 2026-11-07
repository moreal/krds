import asset0 from '../../public/local-assets/specimen-logo.svg?url';
import asset1 from '../../public/local-assets/service-logo.svg?url';
import asset2 from '../../public/local-assets/specimen-landscape.svg?url';
import asset3 from '../../public/local-assets/specimen-icon-light.svg?url';
import asset4 from '../../public/local-assets/specimen-icon-dark.svg?url';
import asset5 from '../../public/local-assets/specimen-audio.wav?url';
import { createEffect, createSignal, type JSX } from 'solid-js';
import * as K from '@unofficial-krds/solid';

export function localRoute(path: string) { return `${location.pathname}${location.search}#local-${path}`; }
function FormExample(props: { children: JSX.Element }) {
  // The docs sandbox blocks form submission, so results are read from FormData in a click handler.
  const [result, setResult] = createSignal('');
  let form!: HTMLFormElement;
  return <form ref={form} onSubmit={event => event.preventDefault()} onReset={() => setResult('')}>{props.children}<output aria-label="입력 결과">{result()}</output><div class="preview-actions"><K.Button type="button" variant="tertiary" size="small" onClick={() => setResult(JSON.stringify(Object.fromEntries(new FormData(form))))}>입력 확인</K.Button><K.Button type="reset" variant="secondary" size="small">입력 초기화</K.Button></div></form>;
}

const AccessibleMediaProps = {"media": {"kind": "audio", "src": asset5, "type": "audio/wav"}, "captionTracks": [], "transcript": {"content": "약 2초 동안 일정한 높이의 예제 신호음이 들립니다."}, "title": "로컬 예제 미디어", "controls": true, "autoplay": false} satisfies K.AccessibleMediaProps;
const AccordionProps = {"items": [{"id": "eligibility", "title": "신청 자격", "content": "예제 신청 자격 안내"}, {"id": "documents", "title": "제출 서류", "content": "예제 제출 서류 안내"}], "defaultOpenIds": [], "multiple": true, "variant": "default"} satisfies K.AccordionProps;
const BadgeProps = {"label": "진행 중", "appearance": "outline", "tone": "information", "size": "medium", "numeric": false} satisfies K.BadgeProps;
const BreadcrumbProps = {"home": {"href": localRoute('home'), "label": "홈"}, "items": [{"id": "apply", "label": "신청", "href": localRoute('apply')}], "omitCurrent": true, "maxVisible": 4, "currentItem": {"id": "detail", "label": "신청 상세"}} satisfies K.BreadcrumbProps;
const BottomSheetProps = {"title": "지역 선택", "description": "예제 지역을 선택하세요", "dismissOnOutside": false} satisfies Partial<K.BottomSheetProps>;
const CarouselProps = {"items": [{"id": "a", "label": "신청 안내", "content": "첫 번째 신청 안내"}, {"id": "b", "label": "서류 안내", "content": "두 번째 서류 안내"}, {"id": "c", "label": "문의 안내", "content": "세 번째 문의 안내"}], "defaultIndex": 0, "layout": "single", "autoplay": true, "intervalMs": 6000, "loop": false} satisfies Partial<K.CarouselProps>;
const CheckboxProps = {"label": "이용약관 동의", "name": "consent", "defaultChecked": false, "indeterminate": false, "value": "agreed"} satisfies K.CheckboxProps;
const ContextualHelpProps = {"title": "신청 자격 도움말", "content": "신청 자격에 관한 예제 설명입니다.", "triggerLabel": "신청 자격 도움말", "defaultOpen": false, "variant": "information", "placement": "bottom-start"} satisfies K.ContextualHelpProps;
const CriticalAlertProps = {"urgency": "high", "label": "긴급 안내", "message": "예제 점검으로 신청이 잠시 중단됩니다.", "details": {"href": localRoute('maintenance'), "label": "점검 상세 안내", "destinationTitle": "점검 상세 안내"}} satisfies K.CriticalAlertProps;
const DisclosureProps = {"label": "신청 도움말", "contentId": "application-help", "defaultOpen": false} satisfies K.DisclosureProps;
const FABProps = {"label": "새 신청", "icon": "plus", "defaultExpanded": false} satisfies K.FABProps;
const FaviconProps = {"light": {"href": asset3, "type": "image/svg+xml", "sizes": "any"}, "dark": {"href": asset4, "type": "image/svg+xml", "sizes": "any"}} satisfies K.FaviconProps;
const FooterProps = {"serviceLogo": {"src": asset0, "alt": "예제 서비스"}, "contacts": [{"label": "예제 문의", "text": "로컬 예제 연락처"}], "utilityLinks": [{"id": "policy", "label": "이용약관", "href": localRoute('policy')}], "privacyPolicy": {"href": localRoute('privacy'), "label": "개인정보처리방침"}, "policyLinks": [{"id": "policy", "label": "이용약관", "href": localRoute('policy')}], "copyrightText": "Independent local specimen", "institution": {"institutionName": "독립 예제 운영기관", "logo": {"src": asset0, "alt": "독립 예제 운영기관"}, "theme": "light", "relationshipText": "독립 운영기관이 운영하는 예제 서비스입니다."}} satisfies K.FooterProps;
const HeaderProps = {"home": {"href": localRoute('home'), "label": "예제 서비스 홈", "logo": {"src": asset0, "alt": "예제 서비스 홈"}}, "utilityItems": [{"id": "policy", "label": "이용약관", "href": localRoute('policy')}], "mainNavigation": [{"id": "home", "label": "홈", "href": localRoute('home')}, {"id": "apply", "label": "신청", "children": [{"id": "apply-new", "label": "신규 신청", "href": localRoute('apply')}, {"id": "history", "label": "신청 내역", "href": localRoute('history')}]}, {"id": "support", "label": "지원", "href": localRoute('support')}], "actionLayout": "horizontal", "sticky": false} satisfies K.HeaderProps;
const IdentifierProps = {"institutionName": "독립 예제 운영기관", "logo": {"src": asset0, "alt": "독립 예제 운영기관"}, "relationshipText": "독립 예제 운영기관이 운영하는 예제 서비스입니다.", "theme": "light"} satisfies K.IdentifierProps;
const ImageProps = {"src": `${import.meta.env.BASE_URL}local-assets/example-landscape.svg`, "alt": "산과 강이 있는 독립 예제 그림", "width": 640, "height": 360, "loading": "eager"} satisfies K.ImageProps;
const ImageFailureProps = {"src": `${import.meta.env.BASE_URL}local-assets/intentional-missing-image.svg`, "alt": "불러올 수 없는 예제 그림", "width": 640, "height": 360, "loading": "eager"} satisfies K.ImageProps;
const InPageNavigationProps = {"sections": [{"id": "overview", "label": "신청 개요"}, {"id": "requirements", "label": "신청 조건"}], "title": "이 페이지의 구성", "narrowMode": "inline"} satisfies Partial<K.InPageNavigationProps>;
const LinkProps = {"href": localRoute('application'), "label": "신청 안내", "appearance": "basic", "size": "medium", "underline": true} satisfies K.LinkProps;
const MainMenuProps = {"items": [{"id": "home", "label": "홈", "href": localRoute('home')}, {"id": "support", "label": "지원", "href": localRoute('support')}], "currentId": "apply-new", "defaultExpandedId": null, "defaultMobileOpen": false} satisfies K.MainMenuProps;
const MastheadProps = {"governmentService": true} satisfies K.MastheadProps;
const QuantityToggleProps = {"label": "신청 수량", "name": "quantity", "min": 0, "max": 10, "step": 1, "defaultValue": 2, "unit": "개"} satisfies K.QuantityToggleProps;
const RadioGroupProps = {"label": "거주 지역", "name": "region", "options": [{"value": "seoul", "label": "서울"}, {"value": "busan", "label": "부산"}, {"value": "jeju", "label": "제주", "disabled": true}], "defaultValue": null, "size": "medium", "appearance": "default"} satisfies K.RadioGroupProps;
const RangeSliderProps = {"label": "예제 비율", "name": "ratio", "min": 0, "max": 100, "step": 10, "defaultValue": 50} satisfies K.RangeSliderProps;
const SideNavigationProps = {"items": [{"id": "home", "label": "홈", "href": localRoute('home')}, {"id": "apply", "label": "신청", "children": [{"id": "apply-new", "label": "신규 신청", "href": localRoute('apply')}, {"id": "history", "label": "신청 내역", "href": localRoute('history')}]}, {"id": "support", "label": "지원", "href": localRoute('support')}], "currentId": "apply-new", "defaultExpandedIds": ["apply"]} satisfies K.SideNavigationProps;
const SkipLinkProps = {"links": [{"id": "main", "label": "본문 바로가기", "targetId": "main-content"}], "visibility": "focus-revealed"} satisfies K.SkipLinkProps;
const SpinnerProps = {"pending": true, "label": "신청 내역 불러오는 중", "completionMessage": "신청 내역을 불러왔습니다.", "size": "medium", "value": 40} satisfies K.SpinnerProps;
const StepIndicatorProps = {"steps": [{"id": "a", "label": "약관 확인", "status": "complete"}, {"id": "b", "label": "정보 입력", "status": "current"}, {"id": "c", "label": "신청 완료", "status": "pending"}], "mode": "sequential"} satisfies K.StepIndicatorProps;
const StructuredListProps = {"items": [{"id": "a", "title": "예제 신청 공고", "href": localRoute('notice/a'), "metadata": [{"label": "마감일", "value": "2026-11-30"}, {"label": "담당 부서", "value": "예제 부서"}]}, {"id": "b", "title": "다음 신청 공고", "href": localRoute('notice/b'), "metadata": [{"label": "마감일", "value": "2026-12-31"}]}], "variant": "list"} satisfies K.StructuredListProps;
const SwitchProps = {"label": "예제 알림 받기", "name": "notification", "defaultChecked": false, "size": "medium"} satisfies K.SwitchProps;
const TabBarProps = {"items": [{"id": "home", "label": "홈", "href": localRoute('home'), "icon": "home"}, {"id": "apply", "label": "신청", "href": localRoute('apply'), "icon": "document"}, {"id": "profile", "label": "내 정보", "href": localRoute('profile'), "icon": "person"}], "currentId": "home"} satisfies K.TabBarProps;
const TableProps = {"caption": "예제 신청 내역", "columns": [{"id": "name", "label": "신청명", "kind": "text"}, {"id": "count", "label": "수량", "kind": "number"}], "rows": [{"id": "a", "cells": {"name": "신청 가", "count": 2}}, {"id": "b", "cells": {"name": "신청 나", "count": 1}}]} satisfies K.TableProps;
const TagProps = {"items": [{"id": "a", "label": "서울", "href": localRoute('seoul')}, {"id": "b", "label": "부산", "href": localRoute('busan')}]} satisfies K.TagProps;
const TextInputProps = {"label": "신청인 이름", "name": "applicant", "defaultValue": "", "type": "text", "size": "medium", "status": "error", "autocomplete": "name", "errorId": "name-error"} satisfies K.TextInputProps;
const TextListProps = {"ordered": true, "marker": "dot", "items": [{"id": "one", "content": "신청 조건 확인"}, {"id": "two", "content": "제출 서류 준비"}]} satisfies K.TextListProps;
const TextareaProps = {"label": "신청 사유", "name": "reason", "defaultValue": "", "rows": 5, "disabled": false, "readOnly": false} satisfies K.TextareaProps;
const TooltipProps = {"text": "신청 도움말을 엽니다", "relationship": "description", "triggerLabel": "신청 도움말", "triggerId": "help-trigger", "textId": "help-tooltip", "defaultOpen": false, "placement": "bottom-start"} satisfies K.TooltipProps;
const VisuallyHiddenProps = {"id": "hidden-help", "content": "신청 내용을 확인하세요", "variant": "text", "lang": "ko"} satisfies K.VisuallyHiddenProps;
const TutorialPanelProps = {"tasks": [{"id": "apply", "title": "예제 신청하기", "steps": [{"id": "one", "title": "이름 입력", "targetId": "applicant-name", "instruction": "신청인 이름을 입력하세요"}, {"id": "two", "title": "신청 저장", "targetId": "save-application", "instruction": "저장을 눌러 완료하세요"}]}], "activeTaskId": "apply", "startActionId": "tutorial-start", "fallbackFocusId": "tutorial-fallback"} satisfies Partial<K.TutorialPanelProps>;
const HelpPanelProps = {"defaultOpen": true, "defaultSelectedTopicId": null, "topics": [{"id": "eligibility", "title": "신청 자격", "content": "예제 신청 자격 도움말", "relatedLinks": [{"id": "policy", "label": "이용약관", "href": localRoute('policy')}]}, {"id": "documents", "title": "제출 서류", "content": "예제 제출 서류 도움말", "relatedLinks": []}], "mode": "help", "fallbackFocusId": "panel-fallback"} satisfies Partial<K.HelpPanelProps>;
const CoachMarkProps = {"steps": [{"id": "one", "title": "이름 입력", "targetId": "applicant-name", "instruction": "신청인 이름을 입력하세요"}], "boundaries": [{"targetId": "applicant-name", "insertionBoundaryId": "applicant-name-after"}, {"targetId": "save-application", "insertionBoundaryId": "save-application-after"}], "defaultStepId": "one", "startActionId": "tutorial-start", "fallbackFocusId": "coach-fallback"} satisfies Partial<K.CoachMarkProps>;
const FileUploadProps = {"label": "첨부 서류", "name": "documents", "multiple": false, "accept": ".txt,.pdf", "maxFiles": 3, "maxBytes": 1048576} satisfies Partial<K.FileUploadProps>;
const LanguageSwitcherProps = {"options": [{"locale": "ko", "nativeLabel": "한국어", "translatedLabel": "한국어", "href": localRoute('ko')}, {"locale": "en", "nativeLabel": "English", "translatedLabel": "영어", "href": localRoute('en')}], "defaultOpen": false} satisfies Partial<K.LanguageSwitcherProps>;
const ResizeProps = {"levels": [{"id": "90", "label": "작게", "percent": 90}, {"id": "100", "label": "기본", "percent": 100}, {"id": "110", "label": "조금 크게", "percent": 110}, {"id": "120", "label": "크게", "percent": 120}, {"id": "130", "label": "아주 크게", "percent": 130}]} satisfies Partial<K.ResizeProps>;
const TTSProps = {"summary": "이 페이지는 예제 신청 방법을 안내합니다.", "locale": "ko-KR", "label": "음성 안내", "size": "small", "iconOnly": false} satisfies Partial<K.TTSProps>;
const BackButtonProps = {"label": "뒤로가기", "canGoBack": true, "dirty": false, "fallbackHref": localRoute('parent')} satisfies Partial<K.BackButtonProps>;
const SnackbarProps = {"message": {"id": "saved", "title": "저장 완료", "text": "예제 신청을 저장했습니다."}, "durationMs": null} satisfies Partial<K.SnackbarProps>;
const ToastProps = {"durationMs": 3000} satisfies Partial<K.ToastProps>;
const PaginationProps = {"pageCount": 12} satisfies Partial<K.PaginationProps>;
export function AccessibleMediaExample() { return <K.AccessibleMedia {...AccessibleMediaProps} />; }
export function AccordionExample() { return <K.Accordion {...AccordionProps} />; }
export function BadgeExample() { return <K.Badge {...BadgeProps} />; }
export function BreadcrumbExample() { return <K.Breadcrumb {...BreadcrumbProps} />; }
export function CriticalAlertExample() { return <K.CriticalAlert {...CriticalAlertProps} />; }
export function DisclosureExample() { return <K.Disclosure {...DisclosureProps}>신청서를 작성하는 방법입니다.</K.Disclosure>; }
export function ContextualHelpExample() { return <K.ContextualHelp {...ContextualHelpProps} />; }
export function FooterExample() { return <K.Footer {...FooterProps} />; }
export function HeaderExample() { return <><K.SkipLink links={[{ id: 'main', label: '본문 바로가기', targetId: 'main-content' }]} /><K.Header {...HeaderProps} /><main id="main-content" tabIndex={-1} style={{ 'min-height': '400px' }}><h1>예제 신청 서비스</h1><p>지역별 신청 정보를 확인하세요.</p></main></>; }
export function IdentifierExample() { return <footer aria-label="예제 기관 정보"><p>로컬 예제 서비스 문의 안내</p><K.Identifier {...IdentifierProps} /></footer>; }
export function ImageExample() { return <><K.Image {...ImageProps} /><K.Image {...ImageFailureProps} /></>; }
export function LinkExample() { return <K.Link {...LinkProps} />; }
export function MainMenuExample() { return <K.MainMenu {...MainMenuProps} />; }
export function MastheadExample() { return <><K.SkipLink links={[{ id: 'main', label: '본문 바로가기', targetId: 'main-content' }]} /><p role="note">공식 정부서비스를 가정한 배너 UI 예시입니다. 실제 공식 정부서비스가 아닙니다.</p><K.Masthead {...MastheadProps} /><section id="main-content" tabIndex={-1}><h2>독립 로컬 예제</h2></section></>; }
export function SideNavigationExample() { return <K.SideNavigation {...SideNavigationProps} />; }
export function SkipLinkExample() { return <><K.SkipLink {...SkipLinkProps} /><p>본문 앞의 예제 안내</p><section id="main-content" tabIndex={-1}><h2>신청 본문</h2><K.Button variant="tertiary" size="small" type="button">신청서 작성</K.Button></section></>; }
export function StepIndicatorExample() { return <K.StepIndicator {...StepIndicatorProps} />; }
export function StructuredListExample() { return <K.StructuredList {...StructuredListProps} />; }
export function TabBarExample() { return <K.TabBar {...TabBarProps} />; }
export function TableExample() { return <K.Table {...TableProps} />; }
export function TextListExample() { return <K.TextList {...TextListProps} />; }
export function TooltipExample() { return <K.Tooltip {...TooltipProps} />; }
export function VisuallyHiddenExample() { return <><K.Button variant="tertiary" size="small" type="button" aria-describedby="hidden-help">신청 확인</K.Button><K.VisuallyHidden {...VisuallyHiddenProps} /></>; }
export function FaviconExample() { return <><K.Favicon {...FaviconProps} /><p>이 예제 문서의 탭 아이콘을 로컬 이미지로 설정했습니다.</p><img src={asset3} width="48" height="48" alt="로컬 예제 탭 아이콘 미리보기" /></>; }
export function InPageNavigationExample() {
  const [activeId, setActiveId] = createSignal('overview');
  return <div class="preview-outline"><K.InPageNavigation {...InPageNavigationProps} activeId={activeId()} onActiveChange={({ id }) => setActiveId(id)} /><article><section id="overview" style={{ 'min-height': '500px' }} tabIndex={-1}><h2>신청 개요</h2><p>예제 신청 서비스의 개요입니다.</p></section><section id="requirements" style={{ 'min-height': '500px' }} tabIndex={-1}><h2>신청 조건</h2><p>거주 지역과 제출 서류를 확인하세요.</p></section></article></div>;
}
export function PaginationExample() { const [page, setPage] = createSignal(1); return <K.Pagination page={page()} pageCount={12} variant="number-links" hrefForPage={next => localRoute(`results?page=${next}`)} onPageChange={({ page }) => setPage(page)} />; }
export function CarouselExample() { const [requests, setRequests] = createSignal(0); return <><K.Carousel {...CarouselProps} onPlayingChange={() => setRequests(n => n + 1)} /><p role="status">자동 재생 요청 {requests()}회</p></>; }
export function FABExample() { const [count, setCount] = createSignal(0); return <><K.FAB {...FABProps} onAction={() => setCount(n => n + 1)} /><p role="status">새 신청 {count()}건</p></>; }
export function RadioGroupExample() { return <FormExample><K.RadioGroup {...RadioGroupProps} /></FormExample>; }
export function CheckboxExample() { return <FormExample><K.Checkbox {...CheckboxProps} /></FormExample>; }
export function SwitchExample() { return <FormExample><K.Switch {...SwitchProps} /></FormExample>; }
export function TextareaExample() { return <FormExample><K.Textarea {...TextareaProps} /></FormExample>; }
export function TextInputExample() { const [icon, setIcon] = createSignal(0); return <FormExample><K.TextInput {...TextInputProps} iconAction={{ label: '입력 도움말 열기', onAction: () => setIcon(n => n + 1) }} /><p id="name-error">신청인 이름을 입력하세요</p><p role="status">아이콘 동작 {icon()}회</p></FormExample>; }
export function RangeSliderExample() { return <FormExample><K.RangeSlider {...RangeSliderProps} /></FormExample>; }
export function QuantityToggleExample() { return <FormExample><K.QuantityToggle {...QuantityToggleProps} /></FormExample>; }
export function TagExample() {
  const [ids, setIds] = createSignal<readonly string[]>([]);
  return <><K.Tag items={[{ id: 'a', label: '서울', href: localRoute('seoul') }, { id: 'b', label: '부산', href: localRoute('busan') }]} mode="toggle" selectedIds={ids()} onSelectionChange={({ ids }) => setIds(ids)} /><p role="status">선택 지역: {ids().map(id => id === 'a' ? '서울' : '부산').join(', ') || '없음'}</p></>;
}
export function SpinnerExample() { const [done, setDone] = createSignal(false); return <><K.Spinner {...SpinnerProps} pending={!done()} value={done() ? 100 : 40} /><K.Button variant="tertiary" size="small" type="button" onClick={() => setDone(true)} disabled={done()}>작업 완료</K.Button></>; }
export function HelpPanelExample() {
  return <><K.Button variant="tertiary" size="small" id="panel-fallback" type="button">도움말 밖 이동 위치</K.Button><K.HelpPanel topics={[{ id: 'eligibility', title: '신청 자격', content: '예제 신청 자격 도움말', relatedLinks: [{ id: 'policy', label: '이용약관', href: localRoute('policy') }] }, { id: 'documents', title: '제출 서류', content: '예제 제출 서류 도움말', relatedLinks: [] }]} defaultOpen={true} mode="help" fallbackFocusId="panel-fallback" /></>;
}
export function TutorialPanelExample() {
  const [running, setRunning] = createSignal(false);
  const [step, setStep] = createSignal<string | null>(null);
  const [task, setTask] = createSignal<string | null>('apply');
  const focusTarget = (id: string | null) => document.getElementById(id === 'one' ? 'applicant-name' : id === 'two' ? 'save-application' : '')?.focus();
  createEffect(() => { for (const [id, key] of [['applicant-name', 'one'], ['save-application', 'two']] as const) { const el = document.getElementById(id); if (step() === key) el?.setAttribute('data-active-target', 'true'); else el?.removeAttribute('data-active-target'); } });
  return <div class="preview-outline preview-outline-panel"><div><K.TextInput id="applicant-name" name="applicant" label="신청인 이름" /><div id="applicant-name-after" /><K.Button id="save-application" type="button">신청 저장</K.Button><div id="save-application-after" /><p role="status">현재 대상: {step() === 'one' ? '신청인 이름' : step() === 'two' ? '신청 저장' : '없음'}</p><K.TutorialPanel {...TutorialPanelProps} defaultOpen={true} running={running()} activeTaskId={task()} activeStepId={step()} onTaskChange={({ id }) => { setTask(id); if (id === null) { setStep(null); setRunning(false); } }} onStart={({ taskId, stepId }) => { setTask(taskId); setRunning(true); setStep(stepId); focusTarget(stepId); }} onStepChange={({ id }) => { setStep(id); focusTarget(id); }} onStop={() => { setRunning(false); setStep(null); }} /><K.Button id="tutorial-fallback" type="button" variant="secondary">도움말로 돌아가기</K.Button></div></div>;
}
export function CoachMarkExample() {
  const [open, setOpen] = createSignal(false);
  return <><K.Button variant="tertiary" size="small" id="tutorial-start" type="button" onClick={() => setOpen(true)}>따라하기 시작</K.Button><label for="applicant-name">신청인 이름</label><input id="applicant-name" /><div id="applicant-name-after" /><K.Button variant="tertiary" size="small" type="button" id="save-application">신청 저장</K.Button><div id="save-application-after" /><K.Button variant="tertiary" size="small" type="button" id="coach-fallback">대체 포커스</K.Button><K.CoachMark {...CoachMarkProps} open={open()} onOpenChange={({ open }) => setOpen(open)} /></>;
}
export function TTSExample() {
  const [state, setState] = createSignal<K.TTSProps['state']>('idle');
  return <><p role="note">로컬 음성 안내 시뮬레이션입니다. 실제 음성이나 외부 음성 서비스를 사용하지 않습니다.</p><K.TTS {...TTSProps} state={state()} onRequest={({ action }) => setState(action === 'pause' ? 'paused' : action === 'stop' ? 'idle' : 'playing')} /></>;
}
export function FileUploadExample() {
  const [files, setFiles] = createSignal<K.FileUploadProps['files']>([]);
  const [receipt, setReceipt] = createSignal('');
  let form!: HTMLFormElement;
  return <form ref={form} onSubmit={event => event.preventDefault()}><K.FileUpload {...FileUploadProps} files={files()} onFilesChange={({ value }) => setFiles(value)} /><K.Button variant="tertiary" size="small" type="button" onClick={() => { const data = K.appendCommittedFiles(new FormData(form), 'documents', files()); setReceipt(data.getAll('documents').map(value => typeof value === 'string' ? value : value.name).join(', ')); }}>제출</K.Button><p role="status">{receipt()}</p></form>;
}
export function LanguageSwitcherExample() {
  const [locale, setLocale] = createSignal('ko');
  return <><K.LanguageSwitcher {...LanguageSwitcherProps} currentLocale={locale()} onLocaleRequest={({ locale }) => setLocale(locale)} /><p lang={locale()}>{locale() === 'ko' ? '한국어 예제' : 'English example'}</p></>;
}
export function ResizeExample() {
  const [value, setValue] = createSignal('100');
  const percent = () => ResizeProps.levels.find(level => level.id === value())?.percent ?? 100;
  return <><K.Resize {...ResizeProps} value={value()} onValueChange={({ value }) => setValue(value)} /><section style={{ 'font-size': `${percent()}%` }}>확대된 예제 내용과 <K.Button variant="tertiary" size="small" type="button">작업</K.Button></section></>;
}
export function BackButtonExample() { const [route, setRoute] = createSignal(localRoute('current')); return <><K.BackButton {...BackButtonProps} onBackRequest={() => setRoute(localRoute('parent'))} /><p>이동 경로: {route()}</p></>; }
export function BottomSheetExample() {
  const [open, setOpen] = createSignal(true);
  const [region, setRegion] = createSignal<string | null>('seoul');
  return <><K.Button variant="tertiary" size="small" id="sheet-opener" type="button" onClick={() => setOpen(true)}>지역 선택 열기</K.Button><p role="status">선택 지역: {region() === 'seoul' ? '서울' : '부산'}</p><K.BottomSheet {...BottomSheetProps} open={open()} returnFocusId="sheet-opener" onOpenChange={({ open }) => setOpen(open)}><K.RadioGroup label="거주 지역" name="region" options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]} value={region()} onValueChange={({ value }) => setRegion(value)} /></K.BottomSheet></>;
}
export function ToastExample() {
  const [message, setMessage] = createSignal<K.ToastProps['message']>(null);
  const [saved, setSaved] = createSignal(false);
  return <><K.Button variant="tertiary" size="small" type="button" onClick={() => { setSaved(true); setMessage({ id: 'saved', text: '신청이 저장되었습니다.', tone: 'information', persistentResultId: 'example-saved-result' }); }}>신청 저장</K.Button><p id="example-saved-result">{saved() ? '신청이 저장되었습니다.' : '저장 전입니다.'}</p><K.Toast {...ToastProps} message={message()} onDismiss={() => setMessage(null)} /></>;
}
export function SnackbarExample() {
  const [message, setMessage] = createSignal<K.SnackbarProps['message']>({ id: 'saved', title: '저장 완료', text: '예제 신청을 저장했습니다.' });
  const [result, setResult] = createSignal('저장된 신청');
  return <><K.Button variant="tertiary" size="small" id="snack-origin" type="button" onClick={() => setMessage({ id: 'saved', title: '저장 완료', text: '예제 신청을 저장했습니다.' })}>신청 저장</K.Button><p role="status">{result()}</p><K.Snackbar message={message()} action={{ kind: 'button', id: 'undo', label: '실행 취소' }} onAction={() => { setResult('저장을 취소했습니다.'); setMessage(null); }} onDismiss={() => setMessage(null)} durationMs={null} fallbackFocusId="snack-origin" /></>;
}
