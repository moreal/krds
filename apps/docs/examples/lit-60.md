# lit · 컴포넌트 54개 {#lit-·-54-components}

공개 `@unofficial-krds/lit` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-lit/src/examples/catalog.ts.txt).


```ts
/** Compiler-checked public-package examples for every native web catalog element. */
import { Carousel, FAB, Tag, BackButton, TTS, Resize, AccessibleMedia, Toast, Snackbar, BottomSheet, ContextualHelp, Tooltip, HelpPanel, TutorialPanel, CoachMark, Header, Footer, SkipLink, MainMenu, Breadcrumb, SideNavigation, InPageNavigation, Pagination, StructuredList, LanguageSwitcher, TabBar, Masthead, Identifier, CriticalAlert, Badge, Image, Link, VisuallyHidden, Spinner, Disclosure, Accordion, TextList, Table, StepIndicator, Favicon, TextInput, Textarea, Checkbox, Switch, RadioGroup, RangeSlider, QuantityToggle, FileUpload, Button, NativeSelect, Modal, Tabs, Calendar, DateInput, registerKrdsElements } from '@unofficial-krds/lit';
import '@unofficial-krds/tokens/tokens.css';
export function createLitCatalogExamples(registry: CustomElementRegistry) {
    registerKrdsElements(registry);
    const exampleAccessibleMedia: AccessibleMedia = new AccessibleMedia();
    exampleAccessibleMedia.title = "로컬 신호음";
    exampleAccessibleMedia.media = { "kind": "audio", "src": "/local-assets/specimen-audio.wav", "type": "audio/wav" };
    exampleAccessibleMedia.transcript = { "content": "약 1초 동안 일정한 높이의 신호음이 들립니다." };
    const exampleAccordion: Accordion = new Accordion();
    exampleAccordion.items = [{ "id": "a", "title": "신청 안내", "content": "상세 안내" }];
    const exampleBackButton: BackButton = new BackButton();
    exampleBackButton.label = "뒤로";
    exampleBackButton.canGoBack = false;
    exampleBackButton.fallbackHref = "#home";
    const exampleBadge: Badge = new Badge();
    exampleBadge.label = "접수 중";
    const exampleBottomSheet: BottomSheet = new BottomSheet();
    exampleBottomSheet.title = "신청 조건";
    const exampleBreadcrumb: Breadcrumb = new Breadcrumb();
    exampleBreadcrumb.home = { "label": "홈", "href": "#home" };
    exampleBreadcrumb.items = [{ "id": "apply", "label": "신청" }];
    const exampleButton: Button = new Button();
    exampleButton.type = "button";
    exampleButton.textContent = '저장';
    const exampleCalendar: Calendar = new Calendar();
    exampleCalendar.label = "방문일";
    exampleCalendar.referenceDate = "2024-02-01";
    const exampleCarousel: Carousel = new Carousel();
    exampleCarousel.label = "소식";
    exampleCarousel.items = [{ "id": "a", "label": "첫 소식", "content": "로컬 소식" }, { "id": "b", "label": "다음 소식", "content": "다음 안내" }];
    const exampleCheckbox: Checkbox = new Checkbox();
    exampleCheckbox.label = "동의";
    exampleCheckbox.name = "consent";
    const exampleCoachMark: CoachMark = new CoachMark();
    exampleCoachMark.steps = [{ "id": "a", "title": "이름 입력", "targetId": "example-main", "instruction": "이름을 입력하세요" }];
    exampleCoachMark.boundaries = [{ "targetId": "example-main", "insertionBoundaryId": "example-after" }];
    exampleCoachMark.startActionId = "example-start";
    const exampleContextualHelp: ContextualHelp = new ContextualHelp();
    exampleContextualHelp.title = "신청 안내";
    exampleContextualHelp.content = "로컬 도움말";
    exampleContextualHelp.triggerLabel = "신청 도움말";
    const exampleCriticalAlert: CriticalAlert = new CriticalAlert();
    exampleCriticalAlert.urgency = "high";
    exampleCriticalAlert.label = "긴급 안내";
    exampleCriticalAlert.message = "작업 내용을 확인하세요";
    const exampleDateInput: DateInput = new DateInput();
    exampleDateInput.label = "방문일";
    exampleDateInput.name = "visit";
    const exampleDisclosure: Disclosure = new Disclosure();
    exampleDisclosure.label = "추가 안내";
    exampleDisclosure.contentId = "extra";
    exampleDisclosure.content = "상세 안내";
    const exampleFAB: FAB = new FAB();
    exampleFAB.label = "새 신청";
    exampleFAB.icon = "+";
    const exampleFavicon: Favicon = new Favicon();
    exampleFavicon.light = { "href": "/local-assets/specimen-icon-light.svg", "type": "image/svg+xml", "sizes": "16x16" };
    const exampleFileUpload: FileUpload = new FileUpload();
    exampleFileUpload.label = "증빙 서류";
    exampleFileUpload.name = "documents";
    exampleFileUpload.files = [];
    const exampleFooter: Footer = new Footer();
    exampleFooter.serviceLogo = { "src": "/local-assets/service-logo.svg", "alt": "예제 서비스" };
    exampleFooter.contacts = [{ "label": "전화", "text": "02-123", "href": "tel:02123" }];
    exampleFooter.utilityLinks = [];
    exampleFooter.privacyPolicy = { "label": "개인정보 처리방침", "href": "#privacy" };
    exampleFooter.policyLinks = [];
    exampleFooter.copyrightText = "독립 예제";
    const exampleHeader: Header = new Header();
    exampleHeader.home = { "label": "서비스 홈", "href": "#home", "logo": { "src": "/local-assets/service-logo.svg", "alt": "예제 서비스" } };
    exampleHeader.utilityItems = [];
    exampleHeader.mainNavigation = [{ "id": "apply", "label": "신청", "href": "#apply" }];
    const exampleHelpPanel: HelpPanel = new HelpPanel();
    exampleHelpPanel.topics = [{ "id": "a", "title": "신청 안내", "content": "로컬 도움말", "relatedLinks": [] }];
    exampleHelpPanel.defaultOpen = false;
    const exampleIdentifier: Identifier = new Identifier();
    exampleIdentifier.institutionName = "독립 예제 기관";
    exampleIdentifier.logo = { "src": "/local-assets/specimen-logo.svg", "alt": "독립 예제 기관" };
    exampleIdentifier.relationshipText = "독립 예제 운영 기관";
    const exampleImage: Image = new Image();
    exampleImage.src = "/local-assets/specimen-landscape.svg";
    exampleImage.alt = "파란 배경, 초록 영역과 세로 파란 띠";
    const exampleInPageNavigation: InPageNavigation = new InPageNavigation();
    exampleInPageNavigation.sections = [{ "id": "example-main", "label": "본문" }];
    const exampleLanguageSwitcher: LanguageSwitcher = new LanguageSwitcher();
    exampleLanguageSwitcher.currentLocale = "ko";
    exampleLanguageSwitcher.options = [{ "locale": "ko", "nativeLabel": "한국어", "translatedLabel": "한국어", "href": "#ko" }, { "locale": "en", "nativeLabel": "English", "translatedLabel": "영어", "href": "#en" }];
    const exampleLink: Link = new Link();
    exampleLink.label = "신청 안내";
    exampleLink.href = "#apply";
    const exampleMainMenu: MainMenu = new MainMenu();
    exampleMainMenu.items = [{ "id": "apply", "label": "신청", "href": "#apply" }];
    const exampleMasthead: Masthead = new Masthead();
    exampleMasthead.governmentService = false;
    const exampleModal: Modal = new Modal();
    exampleModal.title = "신청 확인";
    const exampleNativeSelect: NativeSelect = new NativeSelect();
    exampleNativeSelect.label = "지역";
    exampleNativeSelect.name = "region";
    exampleNativeSelect.options = [{ "value": "seoul", "label": "서울" }];
    const examplePagination: Pagination = new Pagination();
    examplePagination.pageCount = 3;
    examplePagination.hrefForPage = page => `#page-${page}`;
    const exampleQuantityToggle: QuantityToggle = new QuantityToggle();
    exampleQuantityToggle.label = "수량";
    exampleQuantityToggle.name = "quantity";
    exampleQuantityToggle.min = 1;
    exampleQuantityToggle.max = 5;
    const exampleRadioGroup: RadioGroup = new RadioGroup();
    exampleRadioGroup.label = "지역";
    exampleRadioGroup.name = "region";
    exampleRadioGroup.options = [{ "value": "seoul", "label": "서울" }, { "value": "busan", "label": "부산" }];
    const exampleRangeSlider: RangeSlider = new RangeSlider();
    exampleRangeSlider.label = "금액";
    exampleRangeSlider.name = "amount";
    exampleRangeSlider.min = 0;
    exampleRangeSlider.max = 10;
    exampleRangeSlider.step = 0.5;
    const exampleResize: Resize = new Resize();
    const exampleSideNavigation: SideNavigation = new SideNavigation();
    exampleSideNavigation.items = [{ "id": "apply", "label": "신청", "href": "#apply" }];
    exampleSideNavigation.currentId = "apply";
    const exampleSkipLink: SkipLink = new SkipLink();
    exampleSkipLink.links = [{ "id": "skip", "label": "본문 바로가기", "targetId": "example-main" }];
    const exampleSnackbar: Snackbar = new Snackbar();
    exampleSnackbar.message = null;
    const exampleSpinner: Spinner = new Spinner();
    exampleSpinner.label = "처리 중";
    exampleSpinner.pending = true;
    exampleSpinner.completionMessage = "완료";
    const exampleStepIndicator: StepIndicator = new StepIndicator();
    exampleStepIndicator.steps = [{ "id": "a", "label": "신청", "status": "current" }];
    const exampleStructuredList: StructuredList = new StructuredList();
    exampleStructuredList.items = [{ "id": "notice", "title": "신청 공고", "href": "#apply", "metadata": [{ "label": "담당", "value": null }] }];
    const exampleSwitch: Switch = new Switch();
    exampleSwitch.label = "알림";
    exampleSwitch.name = "notification";
    const exampleTabBar: TabBar = new TabBar();
    exampleTabBar.items = [{ "id": "home", "label": "홈", "href": "#home", "icon": "⌂" }, { "id": "apply", "label": "신청", "href": "#apply", "icon": "+" }, { "id": "my", "label": "내 정보", "href": "#my", "icon": "●" }];
    exampleTabBar.currentId = "home";
    const exampleTable: Table = new Table();
    exampleTable.caption = "신청 현황";
    exampleTable.columns = [{ "id": "title", "label": "제목", "kind": "text" }];
    exampleTable.rows = [{ "id": "a", "cells": { "title": "로컬 신청" } }];
    const exampleTabs: Tabs = new Tabs();
    exampleTabs.label = "신청 정보";
    exampleTabs.items = [{ "value": "a", "label": "기본 정보", "content": "로컬 안내" }];
    const exampleTag: Tag = new Tag();
    exampleTag.items = [{ "id": "a", "label": "서울" }];
    const exampleTextInput: TextInput = new TextInput();
    exampleTextInput.label = "이름";
    exampleTextInput.name = "person";
    const exampleTextList: TextList = new TextList();
    exampleTextList.items = [{ "id": "a", "content": "신청 안내" }];
    const exampleTextarea: Textarea = new Textarea();
    exampleTextarea.label = "신청 사유";
    exampleTextarea.name = "reason";
    const exampleToast: Toast = new Toast();
    exampleToast.message = null;
    const exampleTooltip: Tooltip = new Tooltip();
    exampleTooltip.text = "보충 설명";
    exampleTooltip.triggerLabel = "정보";
    exampleTooltip.triggerId = "example-info";
    exampleTooltip.textId = "example-tip";
    const exampleTTS: TTS = new TTS();
    exampleTTS.label = "안내 듣기";
    exampleTTS.summary = "로컬 신청 안내";
    exampleTTS.state = "idle";
    const exampleTutorialPanel: TutorialPanel = new TutorialPanel();
    exampleTutorialPanel.tasks = [{ "id": "apply", "title": "신청 방법", "steps": [{ "id": "a", "title": "이름 입력", "targetId": "example-main", "instruction": "이름을 입력하세요" }] }];
    exampleTutorialPanel.activeTaskId = "apply";
    exampleTutorialPanel.activeStepId = "a";
    exampleTutorialPanel.startActionId = "example-start";
    exampleTutorialPanel.defaultOpen = false;
    const exampleVisuallyHidden: VisuallyHidden = new VisuallyHidden();
    exampleVisuallyHidden.content = "보조 설명";
    return {
        'accessible-media': exampleAccessibleMedia,
        'accordion': exampleAccordion,
        'back-button': exampleBackButton,
        'badge': exampleBadge,
        'bottom-sheet': exampleBottomSheet,
        'breadcrumb': exampleBreadcrumb,
        'button': exampleButton,
        'calendar': exampleCalendar,
        'carousel': exampleCarousel,
        'checkbox': exampleCheckbox,
        'coach-mark': exampleCoachMark,
        'contextual-help': exampleContextualHelp,
        'critical-alert': exampleCriticalAlert,
        'date-input': exampleDateInput,
        'disclosure': exampleDisclosure,
        'fab': exampleFAB,
        'favicon': exampleFavicon,
        'file-upload': exampleFileUpload,
        'footer': exampleFooter,
        'header': exampleHeader,
        'help-panel': exampleHelpPanel,
        'identifier': exampleIdentifier,
        'image': exampleImage,
        'in-page-navigation': exampleInPageNavigation,
        'language-switcher': exampleLanguageSwitcher,
        'link': exampleLink,
        'main-menu': exampleMainMenu,
        'masthead': exampleMasthead,
        'modal': exampleModal,
        'native-select': exampleNativeSelect,
        'pagination': examplePagination,
        'quantity-toggle': exampleQuantityToggle,
        'radio-group': exampleRadioGroup,
        'range-slider': exampleRangeSlider,
        'resize': exampleResize,
        'side-navigation': exampleSideNavigation,
        'skip-link': exampleSkipLink,
        'snackbar': exampleSnackbar,
        'spinner': exampleSpinner,
        'step-indicator': exampleStepIndicator,
        'structured-list': exampleStructuredList,
        'switch': exampleSwitch,
        'tab-bar': exampleTabBar,
        'table': exampleTable,
        'tabs': exampleTabs,
        'tag': exampleTag,
        'text-input': exampleTextInput,
        'text-list': exampleTextList,
        'textarea': exampleTextarea,
        'toast': exampleToast,
        'tooltip': exampleTooltip,
        'tts': exampleTTS,
        'tutorial-panel': exampleTutorialPanel,
        'visually-hidden': exampleVisuallyHidden,
    };
}
```

