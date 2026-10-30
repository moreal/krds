# react · 54 components

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Exact current example bytes include the shared Masthead disclaimer correction. This compiler checkpoint does not accept the native source review, full behavior catalog, or final release candidate.

Source: [packages/react/examples/catalog.tsx](/sources/packages/react/examples/catalog.tsx.txt). SHA-256: `c632e819c3668069d082757708e3a0e371dbe894be820c3e68cda26346d10536`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/react exec tsc -p examples/tsconfig.json`. [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt) · [Original compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).


```tsx
import { useState } from 'react';

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

export function NativeSelectExample(){return <NativeSelect label="지역" name="region" options={[{value:'seoul',label:'서울'},{value:'busan',label:'부산'}]} defaultValue="seoul"/>;}

export function ModalExample(){return <Modal title="확인" trigger={<button type="button">열기</button>}>변경 내용을 확인하세요.</Modal>;}

export function TabsExample(){return <Tabs label="안내" items={[{value:'overview',label:'개요',panel:<p>개요 내용</p>},{value:'details',label:'상세',panel:<p>상세 내용</p>}]}/>;}

export function CalendarExample(){return <Calendar referenceDate="2024-02-15"/>;}

export function DateInputExample(){return <DateInput label="방문일" name="visit" referenceDate="2024-02-15"/>;}

const MastheadExampleProps = {"governmentService": true} satisfies MastheadProps;

export function MastheadExample(){return <><p role="note">공식 정부서비스를 가정한 배너 UI 예시입니다. 실제 공식 정부서비스가 아닙니다.</p><Masthead {...MastheadExampleProps}/></>;}

const IdentifierExampleProps = {"institutionName": "독립 예제 운영기관", "logo": {"src": "/local-assets/specimen-logo.svg", "alt": "독립 예제 운영기관"}, "relationshipText": "독립 예제 운영기관이 운영하는 예제 서비스입니다.", "theme": "light"} satisfies IdentifierProps;

export function IdentifierExample(){return <Identifier {...IdentifierExampleProps}/>;}

const HeaderExampleProps = {"home": {"href": "/local/home", "label": "예제 서비스 홈", "logo": {"src": "/local-assets/specimen-logo.svg", "alt": "예제 서비스 홈"}}, "utilityItems": [{"id": "policy", "label": "이용약관", "href": "/local/policy"}], "mainNavigation": [{"id": "home", "label": "홈", "href": "/local/home"}, {"id": "apply", "label": "신청", "children": [{"id": "apply-new", "label": "신규 신청", "href": "/local/apply"}, {"id": "history", "label": "신청 내역", "href": "/local/history"}]}, {"id": "support", "label": "지원", "href": "/local/support"}], "actionLayout": "horizontal", "sticky": false} satisfies HeaderProps;

export function HeaderExample(){return <Header {...HeaderExampleProps}/>;}

const FooterExampleProps = {"serviceLogo": {"src": "/local-assets/specimen-logo.svg", "alt": "예제 서비스"}, "contacts": [{"label": "예제 문의", "text": "로컬 예제 연락처"}], "utilityLinks": [{"id": "policy", "label": "이용약관", "href": "/local/policy"}], "privacyPolicy": {"href": "/local/privacy", "label": "개인정보처리방침"}, "policyLinks": [{"id": "policy", "label": "이용약관", "href": "/local/policy"}], "copyrightText": "Independent local specimen"} satisfies FooterProps;

export function FooterExample(){return <Footer {...FooterExampleProps}/>;}

const SkipLinkExampleProps = {"links": [{"id": "main", "label": "본문 바로가기", "targetId": "main-content"}], "visibility": "visible"} satisfies SkipLinkProps;

export function SkipLinkExample(){return <SkipLink {...SkipLinkExampleProps}/>;}

const MainMenuExampleProps = {"items": [{"id": "home", "label": "홈", "href": "/local/home"}, {"id": "support", "label": "지원", "href": "/local/support"}], "currentId": "apply-new", "defaultExpandedId": null, "defaultMobileOpen": false} satisfies MainMenuProps;

export function MainMenuExample(){return <MainMenu {...MainMenuExampleProps}/>;}

const BreadcrumbExampleProps = {"home": {"href": "/local/home", "label": "홈"}, "items": [{"id": "apply", "label": "신청", "href": "/local/apply"}], "omitCurrent": true, "maxVisible": 4, "currentItem": {"id": "detail", "label": "신청 상세"}} satisfies BreadcrumbProps;

export function BreadcrumbExample(){return <Breadcrumb {...BreadcrumbExampleProps}/>;}

const SideNavigationExampleProps = {"items": [{"id": "home", "label": "홈", "href": "/local/home"}, {"id": "apply", "label": "신청", "children": [{"id": "apply-new", "label": "신규 신청", "href": "/local/apply"}, {"id": "history", "label": "신청 내역", "href": "/local/history"}]}, {"id": "support", "label": "지원", "href": "/local/support"}], "currentId": "apply-new", "defaultExpandedIds": ["apply"]} satisfies SideNavigationProps;

export function SideNavigationExample(){return <SideNavigation {...SideNavigationExampleProps}/>;}

const InPageNavigationExampleProps = {"sections": [{"id": "overview", "label": "신청 개요"}, {"id": "requirements", "label": "신청 조건"}], "title": "이 페이지의 구성", "activeId": "overview", "narrowMode": "inline"} satisfies InPageNavigationProps;

export function InPageNavigationExample(){return <InPageNavigation {...InPageNavigationExampleProps}/>;}

export function PaginationExample(){const [page,setPage]=useState(1);return <Pagination page={page} pageCount={12} hrefForPage={next=>`/local/results?page=${next}`} onPageChange={({page})=>setPage(page)}/>;}

const StructuredListExampleProps = {"items": [{"id": "a", "title": "예제 신청 공고", "href": "/local/notice/a", "metadata": [{"label": "마감일", "value": "2026-11-30"}, {"label": "담당 부서", "value": "예제 부서"}]}, {"id": "b", "title": "다음 신청 공고", "href": "/local/notice/b", "metadata": [{"label": "마감일", "value": "2026-12-31"}]}], "variant": "list"} satisfies StructuredListProps;

export function StructuredListExample(){return <StructuredList {...StructuredListExampleProps}/>;}

const CriticalAlertExampleProps = {"urgency": "high", "label": "긴급 안내", "message": "예제 점검으로 신청이 잠시 중단됩니다.", "details": {"href": "/local/maintenance", "label": "점검 상세 안내", "destinationTitle": "점검 상세 안내"}} satisfies CriticalAlertProps;

export function CriticalAlertExample(){return <CriticalAlert {...CriticalAlertExampleProps}/>;}

const DisclosureExampleProps = {"label": "신청 도움말", "contentId": "application-help", "defaultOpen": false} satisfies DisclosureProps;

export function DisclosureExample(){return <Disclosure {...DisclosureExampleProps}>{"신청서를 작성하는 방법입니다."}</Disclosure>;}

const BadgeExampleProps = {"label": "진행 중", "appearance": "outline", "tone": "information", "size": "medium", "numeric": false} satisfies BadgeProps;

export function BadgeExample(){return <Badge {...BadgeExampleProps}/>;}

const AccordionExampleProps = {"items": [{"id": "eligibility", "title": "신청 자격", "content": "예제 신청 자격 안내"}, {"id": "documents", "title": "제출 서류", "content": "예제 제출 서류 안내"}], "defaultOpenIds": [], "multiple": true, "variant": "default"} satisfies AccordionProps;

export function AccordionExample(){return <Accordion {...AccordionExampleProps}/>;}

const ImageExampleProps = {"src": "/local-assets/specimen-landscape.svg", "alt": "산과 강이 있는 독립 예제 그림", "width": 640, "height": 360, "loading": "eager"} satisfies ImageProps;

export function ImageExample(){return <Image {...ImageExampleProps}/>;}

const CarouselExampleProps = {"items": [{"id": "a", "label": "신청 안내", "content": "첫 번째 신청 안내"}, {"id": "b", "label": "서류 안내", "content": "두 번째 서류 안내"}, {"id": "c", "label": "문의 안내", "content": "세 번째 문의 안내"}], "defaultIndex": 0, "layout": "single", "autoplay": false, "intervalMs": 6000, "loop": false} satisfies CarouselProps;

export function CarouselExample(){return <Carousel {...CarouselExampleProps}/>;}

const TableExampleProps = {"caption": "예제 신청 내역", "columns": [{"id": "name", "label": "신청명", "kind": "text"}, {"id": "count", "label": "수량", "kind": "number"}], "rows": [{"id": "a", "cells": {"name": "신청 가", "count": 2}}, {"id": "b", "cells": {"name": "신청 나", "count": 1}}]} satisfies TableProps;

export function TableExample(){return <Table {...TableExampleProps}/>;}

const TextListExampleProps = {"ordered": false, "marker": "dot", "items": [{"id": "one", "content": "신청 조건 확인"}, {"id": "two", "content": "제출 서류 준비"}]} satisfies TextListProps;

export function TextListExample(){return <TextList {...TextListExampleProps}/>;}

const FaviconExampleProps = {"light": {"href": "/local-assets/specimen-icon-light.svg", "type": "image/svg+xml", "sizes": "any"}, "dark": {"href": "/local-assets/specimen-icon-dark.svg", "type": "image/svg+xml", "sizes": "any"}} satisfies FaviconProps;

export function FaviconExample(){return <Favicon {...FaviconExampleProps}/>;}

const LinkExampleProps = {"href": "/local/application", "label": "신청 안내", "appearance": "basic", "size": "medium", "underline": true} satisfies LinkProps;

export function LinkExample(){return <Link {...LinkExampleProps}/>;}

const FABExampleProps = {"label": "새 신청", "icon": "plus", "defaultExpanded": false} satisfies FABProps;

export function FABExample(){return <FAB {...FABExampleProps}/>;}

const RadioGroupExampleProps = {"label": "거주 지역", "name": "region", "options": [{"value": "seoul", "label": "서울"}, {"value": "busan", "label": "부산"}, {"value": "jeju", "label": "제주", "disabled": true}], "defaultValue": null, "size": "medium", "appearance": "default"} satisfies RadioGroupProps;

export function RadioGroupExample(){return <RadioGroup {...RadioGroupExampleProps}/>;}

const CheckboxExampleProps = {"label": "이용약관 동의", "name": "consent", "defaultChecked": false, "indeterminate": false, "value": "agreed"} satisfies CheckboxProps;

export function CheckboxExample(){return <Checkbox {...CheckboxExampleProps}/>;}

const TagExampleProps = {"items": [{"id": "a", "label": "서울", "href": "/local/seoul"}, {"id": "b", "label": "부산", "href": "/local/busan"}], "mode": "static", "selectedIds": []} satisfies TagProps;

export function TagExample(){return <Tag {...TagExampleProps}/>;}

const SwitchExampleProps = {"label": "예제 알림 받기", "name": "notification", "defaultChecked": false, "size": "medium"} satisfies SwitchProps;

export function SwitchExample(){return <Switch {...SwitchExampleProps}/>;}

const StepIndicatorExampleProps = {"steps": [{"id": "a", "label": "약관 확인", "status": "complete"}, {"id": "b", "label": "정보 입력", "status": "current"}, {"id": "c", "label": "신청 완료", "status": "pending"}], "mode": "sequential"} satisfies StepIndicatorProps;

export function StepIndicatorExample(){return <StepIndicator {...StepIndicatorExampleProps}/>;}

const SpinnerExampleProps = {"pending": true, "label": "신청 내역 불러오는 중", "completionMessage": "신청 내역을 불러왔습니다.", "size": "medium", "value": 40} satisfies SpinnerProps;

export function SpinnerExample(){return <Spinner {...SpinnerExampleProps}/>;}

export function HelpPanelExample(){return <HelpPanel topics={[{id:'name',title:'이름 입력',content:'신청인 이름을 입력하세요.',relatedLinks:[]}]} defaultOpen/>;}

const TutorialPanelExampleProps = {"tasks": [{"id": "apply", "title": "예제 신청하기", "steps": [{"id": "one", "title": "이름 입력", "targetId": "applicant-name", "instruction": "신청인 이름을 입력하세요"}, {"id": "two", "title": "신청 저장", "targetId": "save-application", "instruction": "저장을 눌러 완료하세요"}]}], "activeTaskId": "apply", "activeStepId": null, "defaultRunning": false, "defaultOpen": true, "defaultActivePanel": "tutorial", "startActionId": "tutorial-start", "fallbackFocusId": "tutorial-fallback"} satisfies TutorialPanelProps;

export function TutorialPanelExample(){return <TutorialPanel {...TutorialPanelExampleProps}/>;}

const ContextualHelpExampleProps = {"title": "신청 자격 도움말", "content": "신청 자격에 관한 예제 설명입니다.", "triggerLabel": "신청 자격 도움말", "defaultOpen": false, "variant": "information", "placement": "bottom-start"} satisfies ContextualHelpProps;

export function ContextualHelpExample(){return <ContextualHelp {...ContextualHelpExampleProps}/>;}

export function CoachMarkExample(){const [open,setOpen]=useState(false);return <><button id="example-tour-start" type="button" onClick={()=>setOpen(true)}>따라하기 시작</button><label htmlFor="example-target">신청인 이름</label><input id="example-target"/><div id="example-target-after"/><CoachMark steps={[{id:'name',targetId:'example-target',title:'이름 입력',instruction:'신청인 이름을 입력하세요.'}]} boundaries={[{targetId:'example-target',insertionBoundaryId:'example-target-after'}]} open={open} onOpenChange={({open})=>setOpen(open)} startActionId="example-tour-start"/></>;}

const TooltipExampleProps = {"text": "신청 도움말을 엽니다", "relationship": "description", "triggerLabel": "신청 도움말", "triggerId": "help-trigger", "textId": "help-tooltip", "defaultOpen": false, "placement": "bottom-start"} satisfies TooltipProps;

export function TooltipExample(){return <Tooltip {...TooltipExampleProps}/>;}

export function TTSExample(){const [state,setState]=useState<TTSProps['state']>('idle');return <TTS summary="이 페이지는 신청 방법을 안내합니다." locale="ko-KR" label="음성 안내" state={state} onRequest={({action})=>setState(action==='pause'?'paused':action==='stop'?'idle':'playing')}/>;}

const TextareaExampleProps = {"label": "신청 사유", "name": "reason", "defaultValue": "", "rows": 5, "disabled": false, "readOnly": false} satisfies TextareaProps;

export function TextareaExample(){return <Textarea {...TextareaExampleProps}/>;}

const TextInputExampleProps = {"label": "신청인 이름", "name": "applicant", "defaultValue": "", "type": "text", "size": "medium", "status": "default", "autocomplete": "name"} satisfies TextInputProps;

export function TextInputExample(){return <TextInput {...TextInputExampleProps}/>;}

export function FileUploadExample(){const [files,setFiles]=useState<FileUploadProps['files']>([]);const [receipt,setReceipt]=useState('');return <form onSubmit={event=>{event.preventDefault();const data=appendFileUploadFormData(new FormData(event.currentTarget),'documents',files);setReceipt(data.getAll('documents').map(value=>typeof value==='string'?value:value.name).join(', '));}}><FileUpload files={files} name="documents" label="첨부 서류" multiple accept=".txt,.pdf" onFilesChange={({value})=>setFiles(value)}/><button type="submit">제출</button><p role="status">{receipt}</p></form>;}

export function LanguageSwitcherExample(){const [locale,setLocale]=useState('ko');return <><LanguageSwitcher currentLocale={locale} options={[{locale:'ko',nativeLabel:'한국어',translatedLabel:'한국어',href:'/local/ko'},{locale:'en',nativeLabel:'English',translatedLabel:'영어',href:'/local/en'}]} onLocaleRequest={({locale})=>setLocale(locale)}/><p lang={locale}>{locale==='ko'?'한국어 예제':'English example'}</p></>;}

export function ResizeExample(){const [value,setValue]=useState('100');return <><Resize value={value} onValueChange={({value})=>setValue(value)}/><section style={{fontSize:`${value}%`}}>확대된 예제 내용과 <button type="button">작업</button></section></>;}

const AccessibleMediaExampleProps = {"media": {"kind": "audio", "src": "/local-assets/specimen-audio.wav", "type": "audio/wav"}, "captionTracks": [], "transcript": {"content": "약 1초 동안 일정한 높이의 예제 신호음이 들립니다."}, "title": "로컬 예제 미디어", "controls": true, "autoplay": false} satisfies AccessibleMediaProps;

export function AccessibleMediaExample(){return <AccessibleMedia {...AccessibleMediaExampleProps}/>;}

const VisuallyHiddenExampleProps = {"id": "hidden-help", "content": "신청 내용을 확인하세요", "variant": "text", "lang": "ko"} satisfies VisuallyHiddenProps;

export function VisuallyHiddenExample(){return <VisuallyHidden {...VisuallyHiddenExampleProps}/>;}

const RangeSliderExampleProps = {"label": "예제 비율", "name": "ratio", "min": 0, "max": 100, "step": 10, "defaultValue": 50} satisfies RangeSliderProps;

export function RangeSliderExample(){return <RangeSlider {...RangeSliderExampleProps}/>;}

export function BackButtonExample(){const [route,setRoute]=useState('/local/current');return <><BackButton label="뒤로가기" canGoBack onBackRequest={()=>setRoute('/local/parent')}/><p>{route}</p></>;}

const BottomSheetExampleProps = {"title": "지역 선택", "defaultOpen": true, "description": "예제 지역을 선택하세요", "dismissOnOutside": false} satisfies BottomSheetProps;

export function BottomSheetExample(){return <BottomSheet {...BottomSheetExampleProps}/>;}

const QuantityToggleExampleProps = {"label": "신청 수량", "name": "quantity", "min": 0, "max": 10, "step": 1, "defaultValue": 2, "unit": "개"} satisfies QuantityToggleProps;

export function QuantityToggleExample(){return <QuantityToggle {...QuantityToggleExampleProps}/>;}

export function ToastExample(){const [message,setMessage]=useState<ToastProps['message']>({id:'saved',text:'신청이 저장되었습니다.',tone:'information',persistentResultId:'example-saved-result'});return <><p id="example-saved-result">신청이 저장되었습니다.</p><Toast message={message} onDismiss={()=>setMessage(null)}/></>;}

export function SnackbarExample(){const [message,setMessage]=useState<SnackbarProps['message']>({id:'saved',title:'저장 완료',text:'신청이 저장되었습니다.'});return <Snackbar message={message} onDismiss={()=>setMessage(null)} durationMs={null}/>;}

const TabBarExampleProps = {"items": [{"id": "home", "label": "홈", "href": "/local/home", "icon": "home"}, {"id": "apply", "label": "신청", "href": "/local/apply", "icon": "document"}, {"id": "profile", "label": "내 정보", "href": "/local/profile", "icon": "person"}], "currentId": "home"} satisfies TabBarProps;

export function TabBarExample(){return <TabBar {...TabBarExampleProps}/>;}
```

