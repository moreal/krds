# 컴포넌트 목록 {#component-catalog}

고정된 카탈로그에서 생성한 웹 적용 항목 54개입니다. 검색 버튼(또는 Ctrl/Cmd+K)으로 영문 이름, 한국어 이름, API, 키보드 안내를 검색합니다. 스플래시 화면(Splash screen)은 플랫폼 전용이므로 이 웹 카탈로그에서 제외합니다.

**지원 현황은 기록된 커버리지에서 가져옵니다.** export나 컴파일러 검사 성공만으로는 네이티브 동작이 검증되지 않습니다. Solid 2는 격리된 미리보기입니다. 안정 커버리지에 절대 포함되지 않습니다.

| 컴포넌트 | 한국어 이름 | 완료 종류 | 케이스 |
| --- | --- | --- | --- |
| [Masthead](./masthead) | 공식 배너 | component | `default` |
| [Identifier](./identifier) | 운영기관 식별자 | component | `light`, `dark` |
| [Header](./header) | 헤더 | composition | `vertical-actions`, `horizontal-actions`, `mobile-menu`, `sticky` |
| [Footer](./footer) | 푸터 | composition | `default`, `narrow` |
| [Skip link](./skip-link) | 건너뛰기 링크 | component | `visible`, `focus-revealed` |
| [Main menu](./main-menu) | 메인 메뉴 | composition | `desktop-links`, `desktop-dropdown`, `desktop-described`, `mobile-simple`, `mobile-sections`, `mobile-drilldown` |
| [Breadcrumb](./breadcrumb) | 브레드크럼 | component | `default`, `collapsed`, `narrow` |
| [Side navigation](./side-navigation) | 사이드 메뉴 | composition | `simple`, `with-header`, `mobile-dropdown` |
| [In-page navigation](./in-page-navigation) | 콘텐츠 내 탐색 | composition | `desktop-side`, `mobile-inline`, `mobile-disclosure` |
| [Pagination](./pagination) | 페이지네이션 | component | `number-links`, `direct-page`, `load-more` |
| [Structured list](./structured-list) | 구조화 목록 | composition | `list`, `table` |
| [Critical alerts](./critical-alert) | 긴급 공지 | component | `high-urgency`, `medium-urgency`, `low-urgency` |
| [Calendar](./calendar) | 달력 | component | `single`, `range` |
| [Disclosure](./disclosure) | 디스클로저 | component | `default` |
| [Modal](./modal) | 모달 | component | `default`, `scrolling` |
| [Badge](./badge) | 배지 | component | `outline`, `filled`, `pastel`, `numeric` |
| [Accordion](./accordion) | 아코디언 | component | `default`, `line` |
| [Image](./image) | 이미지 | component | `informative`, `decorative`, `complex-description`, `responsive` |
| [Carousel](./carousel) | 캐러셀 | component | `single`, `multiple`, `autoplay`, `manual`, `full-banner`, `element-banner` |
| [Tab](./tabs) | 탭 | component | `manual`, `automatic`, `horizontal`, `vertical` |
| [Table](./table) | 표 | component | `basic`, `sortable`, `narrow-scroll`, `narrow-stacked` |
| [Text list](./text-list) | 텍스트 목록 | component | `unordered-dot`, `unordered-dash`, `unordered-hollow`, `ordered` |
| [Favicon](./favicon) | 파비콘 | asset | `standard`, `extended`, `light`, `dark` |
| [Link](./link) | 링크 | component | `standalone`, `inline`, `group`, `external` |
| [Button](./button) | 버튼 | component | `primary`, `secondary`, `tertiary`, `text`, `icon`, `xsmall`, `small`, `medium`, `large`, `xlarge` |
| [FAB](./fab) | 플로팅 버튼 | component | `single-icon`, `extended-label`, `expandable` |
| [Radio button](./radio-group) | 라디오 버튼 | component | `default`, `chip`, `medium`, `large` |
| [Checkbox](./checkbox) | 체크박스 | component | `binary`, `mixed-parent`, `chip`, `medium`, `large` |
| [Select](./native-select) | 셀렉트 | component | `small`, `medium`, `large`, `invalid`, `disabled` |
| [Tag](./tag) | 태그 | component | `static`, `toggle`, `removable`, `add-filter`, `link` |
| [Toggle switch](./switch) | 토글 스위치 | component | `medium`, `large`, `with-help` |
| [Step indicator](./step-indicator) | 단계 표시기 | component | `sequential`, `adaptive`, `compact` |
| [Spinner](./spinner) | 스피너 | component | `determinate`, `indeterminate`, `inline`, `region` |
| [Help panel](./help-panel) | 도움 패널 | composition | `desktop-open`, `narrow-modal`, `initial`, `context-detail` |
| [Tutorial panel](./tutorial-panel) | 따라하기 패널 | composition | `task-overview`, `active-step`, `suspended-panel`, `narrow-modal` |
| [Contextual help](./contextual-help) | 맥락적 도움말 | component | `information`, `help`, `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right` |
| [Coach mark](./coach-mark) | 코치마크 | composition | `single`, `multi-step`, `action-gated` |
| [Tooltip](./tooltip) | 툴팁 | component | `information-icon`, `icon-button`, `vertical`, `box` |
| [TTS](./tts) | 음성지원 | integration | `page`, `region`, `play`, `icon`, `xsmall`, `small`, `medium` |
| [Date input](./date-input) | 날짜 입력 필드 | component | `single`, `range` |
| [Textarea](./textarea) | 텍스트 영역 (Textarea) | component | `default`, `limited`, `invalid`, `disabled`, `readonly` |
| [Text input](./text-input) | 텍스트 입력 필드 | component | `default`, `error`, `success`, `small`, `medium`, `large`, `icon-action` |
| [File upload](./file-upload) | 파일 업로드 | integration | `single`, `multiple`, `button`, `dropzone`, `pending`, `success`, `error` |
| [Language switcher](./language-switcher) | 언어 변경 | integration | `two-language-link`, `dropdown`, `separate-service` |
| [Resize](./resize) | 화면 크기 조정 | integration | `five-levels`, `custom-levels`, `narrow-reflow` |
| [Accessible multimedia](./accessible-media) | 접근 가능한 미디어 | composition | `audio`, `silent-video`, `multimedia`, `captions`, `description`, `transcript`, `sign-language` |
| [Visually hidden](./visually-hidden) | 숨긴 콘텐츠 | component | `text`, `interactive-overlay`, `aria-association` |
| [Range slider](./range-slider) | 범위슬라이드 | component | `single-value`, `disabled`, `discrete` |
| [Back button](./back-button) | 뒤로가기 버튼 | integration | `default`, `dirty-confirmation`, `no-history-fallback` |
| [Bottom sheet](./bottom-sheet) | 바텀시트 | component | `modal`, `short-content`, `select-cancel` |
| [Quantity toggle](./quantity-toggle) | 수량 토글 | component | `default`, `minimum`, `maximum`, `disabled` |
| [Toast](./toast) | 토스트 | component | `information`, `warning` |
| [Snackbar](./snackbar) | 스낵바 | component | `message`, `with-action`, `with-icon` |
| [Tab bars](./tab-bar) | 탭바 | component | `three-items`, `five-items`, `with-badge` |
