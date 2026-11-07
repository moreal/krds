import asset0 from '../../public/local-assets/specimen-logo.svg?url';
import asset1 from '../../public/local-assets/specimen-landscape.svg?url';
import asset2 from '../../public/local-assets/specimen-icon-light.svg?url';
import asset3 from '../../public/local-assets/specimen-icon-dark.svg?url';
import asset4 from '../../public/local-assets/specimen-audio.wav?url';
import { useRef, useState, type ReactNode } from 'react';

import { Button, type ButtonProps } from '@unofficial-krds/react/button';

import { NativeSelect, type NativeSelectProps } from '@unofficial-krds/react/native-select';

import { Modal, type ModalProps } from '@unofficial-krds/react/modal';

import { Tabs, type TabsProps } from '@unofficial-krds/react/tabs';

import { Calendar, type CalendarProps } from '@unofficial-krds/react/calendar';

import { DateInput, type DateInputProps } from '@unofficial-krds/react/date-input';

import { Masthead, type MastheadProps } from '@unofficial-krds/react/masthead';

import { Identifier, type IdentifierProps } from '@unofficial-krds/react/identifier';

import { Header, type HeaderProps } from '@unofficial-krds/react/header';

import { Footer, type FooterProps } from '@unofficial-krds/react/footer';

import { SkipLink, type SkipLinkProps } from '@unofficial-krds/react/skip-link';

import { MainMenu, type MainMenuProps } from '@unofficial-krds/react/main-menu';

import { Breadcrumb, type BreadcrumbProps } from '@unofficial-krds/react/breadcrumb';

import { SideNavigation, type SideNavigationProps } from '@unofficial-krds/react/side-navigation';

import { InPageNavigation, type InPageNavigationProps } from '@unofficial-krds/react/in-page-navigation';

import { Pagination, type PaginationProps } from '@unofficial-krds/react/pagination';

import { StructuredList, type StructuredListProps } from '@unofficial-krds/react/structured-list';

import { CriticalAlert, type CriticalAlertProps } from '@unofficial-krds/react/critical-alert';

import { Disclosure, type DisclosureProps } from '@unofficial-krds/react/disclosure';

import { Badge, type BadgeProps } from '@unofficial-krds/react/badge';

import { Accordion, type AccordionProps } from '@unofficial-krds/react/accordion';

import { Image, type ImageProps } from '@unofficial-krds/react/image';

import { Carousel, type CarouselProps } from '@unofficial-krds/react/carousel';

import { Table, type TableProps } from '@unofficial-krds/react/table';

import { TextList, type TextListProps } from '@unofficial-krds/react/text-list';

import { Favicon, type FaviconProps } from '@unofficial-krds/react/favicon';

import { Link, type LinkProps } from '@unofficial-krds/react/link';

import { FAB, type FABProps } from '@unofficial-krds/react/fab';

import { RadioGroup, type RadioGroupProps } from '@unofficial-krds/react/radio-group';

import { Checkbox, type CheckboxProps } from '@unofficial-krds/react/checkbox';

import { Tag, type TagProps } from '@unofficial-krds/react/tag';

import { Switch, type SwitchProps } from '@unofficial-krds/react/switch';

import { StepIndicator, type StepIndicatorProps } from '@unofficial-krds/react/step-indicator';

import { Spinner, type SpinnerProps } from '@unofficial-krds/react/spinner';

import { HelpPanel, type HelpPanelProps } from '@unofficial-krds/react/help-panel';

import { TutorialPanel, type TutorialPanelProps } from '@unofficial-krds/react/tutorial-panel';

import { ContextualHelp, type ContextualHelpProps } from '@unofficial-krds/react/contextual-help';

import { CoachMark, type CoachMarkProps } from '@unofficial-krds/react/coach-mark';

import { Tooltip, type TooltipProps } from '@unofficial-krds/react/tooltip';

import { TTS, type TTSProps } from '@unofficial-krds/react/tts';

import { Textarea, type TextareaProps } from '@unofficial-krds/react/textarea';

import { TextInput, type TextInputProps } from '@unofficial-krds/react/text-input';

import { FileUpload, type FileUploadProps } from '@unofficial-krds/react/file-upload';

import { LanguageSwitcher, type LanguageSwitcherProps } from '@unofficial-krds/react/language-switcher';

import { Resize, type ResizeProps } from '@unofficial-krds/react/resize';

import { AccessibleMedia, type AccessibleMediaProps } from '@unofficial-krds/react/accessible-media';

import { VisuallyHidden, type VisuallyHiddenProps } from '@unofficial-krds/react/visually-hidden';

import { RangeSlider, type RangeSliderProps } from '@unofficial-krds/react/range-slider';

import { BackButton, type BackButtonProps } from '@unofficial-krds/react/back-button';

import { BottomSheet, type BottomSheetProps } from '@unofficial-krds/react/bottom-sheet';

import { QuantityToggle, type QuantityToggleProps } from '@unofficial-krds/react/quantity-toggle';

import { Toast, type ToastProps } from '@unofficial-krds/react/toast';

import { Snackbar, type SnackbarProps } from '@unofficial-krds/react/snackbar';

import { TabBar, type TabBarProps } from '@unofficial-krds/react/tab-bar';

import { appendFileUploadFormData } from '@unofficial-krds/react/file-upload';

export function ButtonExample(){return <Button type="button">저장</Button>;}

export function NativeSelectExample(){return <FormExample><NativeSelect label="지역" name="region" options={[{value:'seoul',label:'서울'},{value:'busan',label:'부산'}]} defaultValue="seoul"/></FormExample>;}

export function ModalExample(){return <Modal title="확인" trigger={<Button variant="secondary" size="small">열기</Button>}>변경 내용을 확인하세요.</Modal>;}

export function TabsExample(){return <Tabs label="안내" items={[{value:'overview',label:'개요',panel:<p>개요 내용</p>},{value:'details',label:'상세',panel:<p>상세 내용</p>}]}/>;}

export function CalendarExample(){return <Calendar referenceDate="2024-02-15"/>;}

export function DateInputExample(){return <DateInput label="방문일" name="visit" referenceDate="2024-02-15"/>;}

const MastheadExampleProps = {"governmentService": true} satisfies MastheadProps;

export function MastheadExample(){return <><SkipLink links={[{id:'main',label:'본문 바로가기',targetId:'main-content'}]}/><p role="note">공식 정부서비스를 가정한 배너 UI 예시입니다. 실제 공식 정부서비스가 아닙니다.</p><Masthead {...MastheadExampleProps}/><section id="main-content" tabIndex={-1}><h2>독립 로컬 예제</h2></section></>;}

const IdentifierExampleProps = {"institutionName": "독립 예제 운영기관", "logo": {"src": asset0, "alt": "독립 예제 운영기관"}, "relationshipText": "독립 예제 운영기관이 운영하는 예제 서비스입니다.", "theme": "light"} satisfies IdentifierProps;

export function IdentifierExample(){return <footer aria-label="예제 기관 정보"><p>로컬 예제 서비스 문의 안내</p><Identifier {...IdentifierExampleProps}/></footer>;}

const HeaderExampleProps = {"home": {"href": localRoute('home'), "label": "예제 서비스 홈", "logo": {"src": asset0, "alt": "예제 서비스 홈"}}, "utilityItems": [{"id": "policy", "label": "이용약관", "href": localRoute('policy')}], "mainNavigation": [{"id": "home", "label": "홈", "href": localRoute('home')}, {"id": "apply", "label": "신청", "children": [{"id": "apply-new", "label": "신규 신청", "href": localRoute('apply')}, {"id": "history", "label": "신청 내역", "href": localRoute('history')}]}, {"id": "support", "label": "지원", "href": localRoute('support')}], "actionLayout": "horizontal", "sticky": false} satisfies HeaderProps;

export function HeaderExample(){return <><Header {...HeaderExampleProps}/><section id="main-content" tabIndex={-1} style={{minHeight:800}}><h1>예제 신청 서비스</h1><p>지역별 신청 정보를 확인하세요.</p></section></>;}

const FooterExampleProps = {"serviceLogo": {"src": asset0, "alt": "예제 서비스"}, "contacts": [{"label": "예제 문의", "text": "로컬 예제 연락처"}], "utilityLinks": [{"id": "policy", "label": "이용약관", "href": localRoute('policy')}], "privacyPolicy": {"href": localRoute('privacy'), "label": "개인정보처리방침"}, "policyLinks": [{"id": "policy", "label": "이용약관", "href": localRoute('policy')}], "copyrightText": "Independent local specimen", "institution": {"institutionName": "독립 예제 운영기관", "logo": {"src": asset0, "alt": "독립 예제 운영기관"}, "theme": "light", "relationshipText": "독립 운영기관이 운영하는 예제 서비스입니다."}} satisfies FooterProps;

export function FooterExample(){return <Footer {...FooterExampleProps}/>;}

const SkipLinkExampleProps = {"links": [{"id": "main", "label": "본문 바로가기", "targetId": "main-content"}], "visibility": "visible"} satisfies SkipLinkProps;

export function SkipLinkExample(){return <><SkipLink {...SkipLinkExampleProps}/><p>본문 앞의 예제 안내</p><section id="main-content" tabIndex={-1}><h2>신청 본문</h2><Button variant="secondary" size="small">신청서 작성</Button></section></>;}

const MainMenuExampleProps = {"items": [{"id": "home", "label": "홈", "href": localRoute('home')}, {"id": "support", "label": "지원", "href": localRoute('support')}], "currentId": "apply-new", "defaultExpandedId": null, "defaultMobileOpen": false} satisfies MainMenuProps;

export function MainMenuExample(){return <MainMenu {...MainMenuExampleProps}/>;}

const BreadcrumbExampleProps = {"home": {"href": localRoute('home'), "label": "홈"}, "items": [{"id": "apply", "label": "신청", "href": localRoute('apply')}], "omitCurrent": true, "maxVisible": 4, "currentItem": {"id": "detail", "label": "신청 상세"}} satisfies BreadcrumbProps;

export function BreadcrumbExample(){return <Breadcrumb {...BreadcrumbExampleProps}/>;}

const SideNavigationExampleProps = {"items": [{"id": "home", "label": "홈", "href": localRoute('home')}, {"id": "apply", "label": "신청", "children": [{"id": "apply-new", "label": "신규 신청", "href": localRoute('apply')}, {"id": "history", "label": "신청 내역", "href": localRoute('history')}]}, {"id": "support", "label": "지원", "href": localRoute('support')}], "currentId": "apply-new", "defaultExpandedIds": ["apply"]} satisfies SideNavigationProps;

export function SideNavigationExample(){return <SideNavigation {...SideNavigationExampleProps}/>;}

const InPageNavigationExampleProps = {"sections": [{"id": "overview", "label": "신청 개요"}, {"id": "requirements", "label": "신청 조건"}], "title": "이 페이지의 구성", "activeId": "overview", "narrowMode": "inline"} satisfies InPageNavigationProps;

export function InPageNavigationExample(){const [activeId,setActiveId]=useState('overview');return <div className="preview-outline"><InPageNavigation {...InPageNavigationExampleProps} activeId={activeId} onActiveChange={({id})=>setActiveId(id)}/><article><section id="overview" style={{minHeight:800}} tabIndex={-1}><h2>신청 개요</h2><p>예제 신청 서비스의 개요입니다.</p></section><section id="requirements" style={{minHeight:800}} tabIndex={-1}><h2>신청 조건</h2><p>거주 지역과 제출 서류를 확인하세요.</p></section></article></div>;}

export function PaginationExample(){const [page,setPage]=useState(1);return <Pagination page={page} pageCount={12} hrefForPage={next=>localRoute(`results?page=${next}`)} onPageChange={({page})=>setPage(page)}/>;}

const StructuredListExampleProps = {"items": [{"id": "a", "title": "예제 신청 공고", "href": localRoute('notice/a'), "metadata": [{"label": "마감일", "value": "2026-11-30"}, {"label": "담당 부서", "value": "예제 부서"}]}, {"id": "b", "title": "다음 신청 공고", "href": localRoute('notice/b'), "metadata": [{"label": "마감일", "value": "2026-12-31"}]}], "variant": "list"} satisfies StructuredListProps;

export function StructuredListExample(){return <StructuredList {...StructuredListExampleProps}/>;}

const CriticalAlertExampleProps = {"urgency": "high", "label": "긴급 안내", "message": "예제 점검으로 신청이 잠시 중단됩니다.", "details": {"href": localRoute('maintenance'), "label": "점검 상세 안내", "destinationTitle": "점검 상세 안내"}} satisfies CriticalAlertProps;

export function CriticalAlertExample(){return <CriticalAlert {...CriticalAlertExampleProps}/>;}

const DisclosureExampleProps = {"label": "신청 도움말", "contentId": "application-help", "defaultOpen": false} satisfies DisclosureProps;

export function DisclosureExample(){return <Disclosure {...DisclosureExampleProps}>{"신청서를 작성하는 방법입니다."}</Disclosure>;}

const BadgeExampleProps = {"label": "진행 중", "appearance": "outline", "tone": "information", "size": "medium", "numeric": false} satisfies BadgeProps;

export function BadgeExample(){return <Badge {...BadgeExampleProps}/>;}

const AccordionExampleProps = {"items": [{"id": "eligibility", "title": "신청 자격", "content": "예제 신청 자격 안내"}, {"id": "documents", "title": "제출 서류", "content": "예제 제출 서류 안내"}], "defaultOpenIds": [], "multiple": true, "variant": "default"} satisfies AccordionProps;

export function AccordionExample(){return <Accordion {...AccordionExampleProps}/>;}

const ImageExampleProps = {"src": `${import.meta.env.BASE_URL}local-assets/example-landscape.svg`, "alt": "산과 강이 있는 독립 예제 그림", "width": 640, "height": 360, "loading": "eager"} satisfies ImageProps;

const ImageFailureProps = {...ImageExampleProps, "src": `${import.meta.env.BASE_URL}local-assets/intentional-missing-image.svg`, "alt": "불러올 수 없는 예제 그림"} satisfies ImageProps;

export function ImageExample(){return <div className="preview-images"><Image {...ImageExampleProps}/><Image {...ImageFailureProps}/></div>;}

const CarouselExampleProps = {"items": [{"id": "a", "label": "신청 안내", "content": "첫 번째 신청 안내"}, {"id": "b", "label": "서류 안내", "content": "두 번째 서류 안내"}, {"id": "c", "label": "문의 안내", "content": "세 번째 문의 안내"}], "defaultIndex": 0, "layout": "single", "autoplay": false, "intervalMs": 6000, "loop": false} satisfies CarouselProps;

export function CarouselExample(){const [requests,setRequests]=useState(0);return <><Carousel {...CarouselExampleProps} autoplay intervalMs={6000} onPlayingChange={()=>setRequests(n=>n+1)}/><p role="status">자동 재생 요청 {requests}회</p></>;}

const TableExampleProps = {"caption": "예제 신청 내역", "columns": [{"id": "name", "label": "신청명", "kind": "text"}, {"id": "count", "label": "수량", "kind": "number"}], "rows": [{"id": "a", "cells": {"name": "신청 가", "count": 2}}, {"id": "b", "cells": {"name": "신청 나", "count": 1}}]} satisfies TableProps;

export function TableExample(){return <Table {...TableExampleProps}/>;}

const TextListExampleProps = {"ordered": false, "marker": "dot", "items": [{"id": "one", "content": "신청 조건 확인"}, {"id": "two", "content": "제출 서류 준비"}]} satisfies TextListProps;

export function TextListExample(){return <TextList {...TextListExampleProps}/>;}

const FaviconExampleProps = {"light": {"href": asset2, "type": "image/svg+xml", "sizes": "any"}, "dark": {"href": asset3, "type": "image/svg+xml", "sizes": "any"}} satisfies FaviconProps;

export function FaviconExample(){return <><Favicon {...FaviconExampleProps}/><p>이 예제 문서의 탭 아이콘을 로컬 이미지로 설정했습니다.</p><img src={asset2} width="48" height="48" alt="로컬 예제 탭 아이콘 미리보기"/></>;}

const LinkExampleProps = {"href": localRoute('application'), "label": "신청 안내", "appearance": "basic", "size": "medium", "underline": true} satisfies LinkProps;

export function LinkExample(){return <Link {...LinkExampleProps}/>;}

const FABExampleProps = {"label": "새 신청", "icon": "plus", "defaultExpanded": false} satisfies FABProps;

export function FABExample(){const [count,setCount]=useState(0);return <><FAB {...FABExampleProps} onAction={()=>setCount(n=>n+1)}/><p role="status">새 신청 {count}건</p></>;}

const RadioGroupExampleProps = {"label": "거주 지역", "name": "region", "options": [{"value": "seoul", "label": "서울"}, {"value": "busan", "label": "부산"}, {"value": "jeju", "label": "제주", "disabled": true}], "defaultValue": null, "size": "medium", "appearance": "default"} satisfies RadioGroupProps;

export function RadioGroupExample(){return <FormExample><RadioGroup {...RadioGroupExampleProps}/></FormExample>;}

const CheckboxExampleProps = {"label": "이용약관 동의", "name": "consent", "defaultChecked": false, "indeterminate": false, "value": "agreed"} satisfies CheckboxProps;

export function CheckboxExample(){return <FormExample><Checkbox {...CheckboxExampleProps}/></FormExample>;}

const TagExampleProps = {"items": [{"id": "a", "label": "서울", "href": localRoute('seoul')}, {"id": "b", "label": "부산", "href": localRoute('busan')}], "mode": "static", "selectedIds": []} satisfies TagProps;

export function TagExample(){const [ids,setIds]=useState<readonly string[]>([]);return <><Tag {...TagExampleProps} mode="toggle" selectedIds={ids} onSelectionChange={({ids})=>setIds(ids)}/><p role="status">선택 지역: {ids.map(id=>id==='a'?'서울':'부산').join(', ')||'없음'}</p></>;}

const SwitchExampleProps = {"label": "예제 알림 받기", "name": "notification", "defaultChecked": false, "size": "medium"} satisfies SwitchProps;

export function SwitchExample(){return <FormExample><Switch {...SwitchExampleProps}/></FormExample>;}

const StepIndicatorExampleProps = {"steps": [{"id": "a", "label": "약관 확인", "status": "complete"}, {"id": "b", "label": "정보 입력", "status": "current"}, {"id": "c", "label": "신청 완료", "status": "pending"}], "mode": "sequential"} satisfies StepIndicatorProps;

export function StepIndicatorExample(){return <StepIndicator {...StepIndicatorExampleProps}/>;}

const SpinnerExampleProps = {"pending": true, "label": "신청 내역 불러오는 중", "completionMessage": "신청 내역을 불러왔습니다.", "size": "medium", "value": 40} satisfies SpinnerProps;

export function SpinnerExample(){const [done,setDone]=useState(false);return <><Spinner {...SpinnerExampleProps} pending={!done} value={done?100:40}/><Button variant="secondary" size="small" onClick={()=>setDone(true)} disabled={done}>작업 완료</Button></>;}

export function HelpPanelExample(){return <HelpPanel topics={[{id:'name',title:'이름 입력',content:'신청인 이름을 입력하세요.',relatedLinks:[]}]} defaultOpen/>;}

const TutorialPanelExampleProps = {"tasks": [{"id": "apply", "title": "예제 신청하기", "steps": [{"id": "one", "title": "이름 입력", "targetId": "applicant-name", "instruction": "신청인 이름을 입력하세요"}, {"id": "two", "title": "신청 저장", "targetId": "save-application", "instruction": "저장을 눌러 완료하세요"}]}], "activeTaskId": "apply", "activeStepId": null, "defaultOpen": true, "defaultActivePanel": "tutorial", "startActionId": "tutorial-start", "fallbackFocusId": "tutorial-fallback"} satisfies TutorialPanelProps;

export function TutorialPanelExample(){const [running,setRunning]=useState(false);const [step,setStep]=useState<string|null>(null);return <><div className="preview-tutorial"><div className="preview-tutorial-main"><TextInput id="applicant-name" name="applicant" label="신청인 이름" nativeAttributes={{'data-active-target':step==='one'} as object}/><div id="applicant-name-after"/><Button id="save-application" data-active-target={step==='two'}>신청 저장</Button><div id="save-application-after"/><p role="status">현재 대상: {step==='one'?'신청인 이름':step==='two'?'신청 저장':'없음'}</p></div><div aria-hidden="true"/></div><div className="preview-actions"><Button id="tutorial-fallback" variant="tertiary" size="small">도움말로 돌아가기</Button><TutorialPanel {...TutorialPanelExampleProps} running={running} activeStepId={step} onStart={({stepId})=>{setRunning(true);setStep(stepId);document.getElementById('applicant-name')?.focus();}} onStepChange={({id})=>{setStep(id);document.getElementById(id==='one'?'applicant-name':'save-application')?.focus();}} onStop={()=>{setRunning(false);setStep(null);}}/></div></>;}

const ContextualHelpExampleProps = {"title": "신청 자격 도움말", "content": "신청 자격에 관한 예제 설명입니다.", "triggerLabel": "신청 자격 도움말", "defaultOpen": false, "variant": "information", "placement": "bottom-start"} satisfies ContextualHelpProps;

export function ContextualHelpExample(){return <ContextualHelp {...ContextualHelpExampleProps}/>;}

export function CoachMarkExample(){const [open,setOpen]=useState(false);return <><Button id="example-tour-start" variant="secondary" size="small" onClick={()=>setOpen(true)}>따라하기 시작</Button><label htmlFor="example-target">신청인 이름</label><input id="example-target"/><div id="example-target-after"/><CoachMark steps={[{id:'name',targetId:'example-target',title:'이름 입력',instruction:'신청인 이름을 입력하세요.'}]} boundaries={[{targetId:'example-target',insertionBoundaryId:'example-target-after'}]} open={open} onOpenChange={({open})=>setOpen(open)} startActionId="example-tour-start"/></>;}

const TooltipExampleProps = {"text": "신청 도움말을 엽니다", "relationship": "description", "triggerLabel": "신청 도움말", "triggerId": "help-trigger", "textId": "help-tooltip", "defaultOpen": false, "placement": "bottom-start"} satisfies TooltipProps;

export function TooltipExample(){return <Tooltip {...TooltipExampleProps}/>;}

export function TTSExample(){const [state,setState]=useState<TTSProps['state']>('idle');return <><p role="note">로컬 음성 안내 시뮬레이션입니다. 실제 음성이나 외부 음성 서비스를 사용하지 않습니다.</p><TTS summary="이 페이지는 신청 방법을 안내합니다." locale="ko-KR" label="음성 안내" state={state} onRequest={({action})=>setState(action==='pause'?'paused':action==='stop'?'idle':'playing')}/></>;}

const TextareaExampleProps = {"label": "신청 사유", "name": "reason", "defaultValue": "", "rows": 5, "disabled": false, "readOnly": false} satisfies TextareaProps;

export function TextareaExample(){return <FormExample><Textarea {...TextareaExampleProps}/></FormExample>;}

const TextInputExampleProps = {"label": "신청인 이름", "name": "applicant", "defaultValue": "", "type": "text", "size": "medium", "status": "error", "autocomplete": "name", "errorId": "name-error"} satisfies TextInputProps;

export function TextInputExample(){const [note,setNote]=useState('');return <><FormExample><TextInput {...TextInputExampleProps} error="신청인 이름을 입력하세요." iconAction={{label:'이름 입력 안내',onAction:()=>setNote('이름 입력 안내를 열었습니다.')}}/></FormExample><p role="status">{note}</p></>;}

export function FileUploadExample(){const [files,setFiles]=useState<FileUploadProps['files']>([]);const [receipt,setReceipt]=useState('');const formRef=useRef<HTMLFormElement>(null);return <form ref={formRef}><FileUpload files={files} name="documents" label="첨부 서류" multiple accept=".txt,.pdf" onFilesChange={({value})=>setFiles(value)}/><Button variant="secondary" size="small" onClick={()=>{const data=appendFileUploadFormData(new FormData(formRef.current!),'documents',files);setReceipt(data.getAll('documents').map(value=>typeof value==='string'?value:value.name).join(', '));}}>제출</Button><p role="status">{receipt}</p></form>;}

export function LanguageSwitcherExample(){const [locale,setLocale]=useState('ko');return <><LanguageSwitcher currentLocale={locale} options={[{locale:'ko',nativeLabel:'한국어',translatedLabel:'한국어',href:localRoute('ko')},{locale:'en',nativeLabel:'English',translatedLabel:'영어',href:localRoute('en')}]} onLocaleRequest={({locale})=>setLocale(locale)}/><p lang={locale}>{locale==='ko'?'한국어 예제':'English example'}</p></>;}

export function ResizeExample(){const [value,setValue]=useState('100');return <><Resize value={value} onValueChange={({value})=>setValue(value)}/><section style={{fontSize:`${value}%`}}>확대된 예제 내용과 <Button variant="secondary" size="small">작업</Button></section></>;}

const AccessibleMediaExampleProps = {"media": {"kind": "audio", "src": asset4, "type": "audio/wav"}, "captionTracks": [], "transcript": {"content": "약 2초 동안 일정한 높이의 예제 신호음이 들립니다."}, "title": "로컬 예제 미디어", "controls": true, "autoplay": false} satisfies AccessibleMediaProps;

export function AccessibleMediaExample(){return <AccessibleMedia {...AccessibleMediaExampleProps}/>;}

const VisuallyHiddenExampleProps = {"id": "hidden-help", "content": "신청 내용을 확인하세요", "variant": "text", "lang": "ko"} satisfies VisuallyHiddenProps;

export function VisuallyHiddenExample(){return <><Button variant="secondary" size="small" aria-describedby="hidden-help">신청 확인</Button><VisuallyHidden {...VisuallyHiddenExampleProps}/></>;}

const RangeSliderExampleProps = {"label": "예제 비율", "name": "ratio", "min": 0, "max": 100, "step": 10, "defaultValue": 50} satisfies RangeSliderProps;

export function RangeSliderExample(){return <FormExample><RangeSlider {...RangeSliderExampleProps}/></FormExample>;}

export function BackButtonExample(){const [route,setRoute]=useState(localRoute('current'));return <><BackButton label="뒤로가기" canGoBack onBackRequest={()=>setRoute(localRoute('parent'))}/><p>{route}</p></>;}

const BottomSheetExampleProps = {"title": "지역 선택", "defaultOpen": true, "description": "예제 지역을 선택하세요", "dismissOnOutside": false} satisfies BottomSheetProps;

export function BottomSheetExample(){const [region,setRegion]=useState('seoul');return <><BottomSheet {...BottomSheetExampleProps} trigger={<Button variant="secondary" size="small">지역 선택 열기</Button>}><RadioGroup label="거주 지역" name="region" options={[{value:'seoul',label:'서울'},{value:'busan',label:'부산'}]} value={region} onValueChange={({value})=>setRegion(value??'seoul')}/></BottomSheet><p role="status">선택 지역: {region==='seoul'?'서울':'부산'}</p></>;}

const QuantityToggleExampleProps = {"label": "신청 수량", "name": "quantity", "min": 0, "max": 10, "step": 1, "defaultValue": 2, "unit": "개"} satisfies QuantityToggleProps;

export function QuantityToggleExample(){return <FormExample><QuantityToggle {...QuantityToggleExampleProps}/></FormExample>;}

export function ToastExample(){const [message,setMessage]=useState<ToastProps['message']>(null);const [saved,setSaved]=useState(false);return <><Button variant="secondary" size="small" onClick={()=>{setSaved(true);setMessage({id:'saved',text:'신청이 저장되었습니다.',tone:'information',persistentResultId:'example-saved-result'});}}>신청 저장</Button><p id="example-saved-result">{saved?'신청이 저장되었습니다.':'저장 전입니다.'}</p><Toast message={message} onDismiss={()=>setMessage(null)}/></>;}

export function SnackbarExample(){const [message,setMessage]=useState<SnackbarProps['message']>({id:'saved',title:'저장 완료',text:'신청이 저장되었습니다.'});const [result,setResult]=useState('저장된 신청');return <><Button id="snack-origin" variant="secondary" size="small" onClick={()=>setMessage({id:'saved',title:'저장 완료',text:'신청이 저장되었습니다.'})}>신청 저장</Button><p role="status">{result}</p><Snackbar message={message} action={{kind:'button',id:'undo',label:'실행 취소'}} onAction={()=>{setResult('저장을 취소했습니다.');setMessage(null);}} onDismiss={()=>setMessage(null)} durationMs={null} fallbackFocusId="snack-origin"/></>;}

const TabBarExampleProps = {"items": [{"id": "home", "label": "홈", "href": localRoute('home'), "icon": "home"}, {"id": "apply", "label": "신청", "href": localRoute('apply'), "icon": "document"}, {"id": "profile", "label": "내 정보", "href": localRoute('profile'), "icon": "person"}], "currentId": "home"} satisfies TabBarProps;

export function TabBarExample(){return <TabBar {...TabBarExampleProps}/>;}

export function localRoute(path: string) { const url = new URL(location.href); url.searchParams.set('route', path); return url.pathname + url.search; }
function FormExample({ children }: { children: ReactNode }) { const [result,setResult]=useState(''); const formRef=useRef<HTMLFormElement>(null); const read=()=>setResult(JSON.stringify(Object.fromEntries(new FormData(formRef.current!)))); return <form ref={formRef} onSubmit={e=>e.preventDefault()} onReset={()=>setResult('')} >{children}<output aria-label="입력 결과">{result}</output><div className="preview-actions"><Button variant="secondary" size="small" onClick={read}>입력 확인</Button><Button type="reset" variant="tertiary" size="small">입력 초기화</Button></div></form>; }
