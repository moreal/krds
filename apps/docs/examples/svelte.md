# Svelte 예제 {#svelte-examples}

`@unofficial-krds/svelte` 패키지로 각 컴포넌트를 쓰는 예제 코드입니다.

## Masthead {#masthead}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/MastheadExample.svelte.txt)

```svelte
<script lang="ts">
import Masthead from '@unofficial-krds/svelte/masthead';
import type { MastheadProps } from '@unofficial-krds/svelte';
const props: MastheadProps = {
  "governmentService": false
};
</script>
<section data-example="masthead"><Masthead {...props}/></section>
```

## Identifier {#identifier}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/IdentifierExample.svelte.txt)

```svelte
<script lang="ts">
import Identifier from '@unofficial-krds/svelte/identifier';
import type { IdentifierProps } from '@unofficial-krds/svelte';
const props: IdentifierProps = {
  "institutionName": "독립 예제 운영기관",
  "logo": {
    "src": "/local-assets/specimen-logo.svg",
    "alt": "독립 예제 운영기관"
  },
  "relationshipText": "독립 예제 운영기관이 운영하는 예제 서비스입니다.",
  "theme": "light"
};
</script>
<section data-example="identifier"><Identifier {...props}/></section>
```

## Header {#header}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/HeaderExample.svelte.txt)

```svelte
<script lang="ts">
import Header from '@unofficial-krds/svelte/header';
import type { HeaderProps } from '@unofficial-krds/svelte';
const props: HeaderProps = {
  "home": {
    "href": "/local/home",
    "label": "예제 서비스 홈",
    "logo": {
      "src": "/local-assets/specimen-logo.svg",
      "alt": "예제 서비스 홈"
    }
  },
  "utilityItems": [
    {
      "id": "policy",
      "label": "이용약관",
      "href": "/local/policy"
    }
  ],
  "mainNavigation": [
    {
      "id": "home",
      "label": "홈",
      "href": "/local/home"
    },
    {
      "id": "apply",
      "label": "신청",
      "children": [
        {
          "id": "apply-new",
          "label": "신규 신청",
          "href": "/local/apply"
        },
        {
          "id": "history",
          "label": "신청 내역",
          "href": "/local/history"
        }
      ]
    },
    {
      "id": "support",
      "label": "지원",
      "href": "/local/support"
    }
  ],
  "actionLayout": "horizontal",
  "sticky": false
};
</script>
<section data-example="header"><Header {...props}/></section>
```

## Footer {#footer}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/FooterExample.svelte.txt)

```svelte
<script lang="ts">
import Footer from '@unofficial-krds/svelte/footer';
import type { FooterProps } from '@unofficial-krds/svelte';
const props: FooterProps = {
  "serviceLogo": {
    "src": "/local-assets/specimen-logo.svg",
    "alt": "예제 서비스"
  },
  "contacts": [
    {
      "label": "예제 문의",
      "text": "로컬 예제 연락처"
    }
  ],
  "utilityLinks": [
    {
      "id": "policy",
      "label": "이용약관",
      "href": "/local/policy"
    }
  ],
  "privacyPolicy": {
    "href": "/local/privacy",
    "label": "개인정보처리방침"
  },
  "policyLinks": [
    {
      "id": "policy",
      "label": "이용약관",
      "href": "/local/policy"
    }
  ],
  "copyrightText": "Independent local specimen"
};
</script>
<section data-example="footer"><Footer {...props}/></section>
```

## Skip link {#skip-link}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/SkipLinkExample.svelte.txt)

```svelte
<script lang="ts">
import SkipLink from '@unofficial-krds/svelte/skip-link';
import type { SkipLinkProps } from '@unofficial-krds/svelte';
const props: SkipLinkProps = {
  "links": [
    {
      "id": "main",
      "label": "본문 바로가기",
      "targetId": "main-content"
    }
  ],
  "visibility": "visible"
};
</script>
<section data-example="skip-link"><SkipLink {...props}/></section>
```

## Main menu {#main-menu}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/MainMenuExample.svelte.txt)

```svelte
<script lang="ts">
import MainMenu from '@unofficial-krds/svelte/main-menu';
import type { MainMenuProps } from '@unofficial-krds/svelte';
const props: MainMenuProps = {
  "items": [
    {
      "id": "home",
      "label": "홈",
      "href": "/local/home"
    },
    {
      "id": "support",
      "label": "지원",
      "href": "/local/support"
    }
  ],
  "currentId": "apply-new",
  "defaultExpandedId": null,
  "defaultMobileOpen": false
};
</script>
<section data-example="main-menu"><MainMenu {...props}/></section>
```

## Breadcrumb {#breadcrumb}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/BreadcrumbExample.svelte.txt)

```svelte
<script lang="ts">
import Breadcrumb from '@unofficial-krds/svelte/breadcrumb';
import type { BreadcrumbProps } from '@unofficial-krds/svelte';
const props: BreadcrumbProps = {
  "home": {
    "href": "/local/home",
    "label": "홈"
  },
  "items": [
    {
      "id": "apply",
      "label": "신청",
      "href": "/local/apply"
    }
  ],
  "omitCurrent": true,
  "maxVisible": 4,
  "currentItem": {
    "id": "detail",
    "label": "신청 상세"
  }
};
</script>
<section data-example="breadcrumb"><Breadcrumb {...props}/></section>
```

## Side navigation {#side-navigation}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/SideNavigationExample.svelte.txt)

```svelte
<script lang="ts">
import SideNavigation from '@unofficial-krds/svelte/side-navigation';
import type { SideNavigationProps } from '@unofficial-krds/svelte';
const props: SideNavigationProps = {
  "items": [
    {
      "id": "home",
      "label": "홈",
      "href": "/local/home"
    },
    {
      "id": "apply",
      "label": "신청",
      "children": [
        {
          "id": "apply-new",
          "label": "신규 신청",
          "href": "/local/apply"
        },
        {
          "id": "history",
          "label": "신청 내역",
          "href": "/local/history"
        }
      ]
    },
    {
      "id": "support",
      "label": "지원",
      "href": "/local/support"
    }
  ],
  "currentId": "apply-new",
  "defaultExpandedIds": [
    "apply"
  ]
};
</script>
<section data-example="side-navigation"><SideNavigation {...props}/></section>
```

## In-page navigation {#in-page-navigation}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/InPageNavigationExample.svelte.txt)

```svelte
<script lang="ts">
import InPageNavigation from '@unofficial-krds/svelte/in-page-navigation';
import type { InPageNavigationProps } from '@unofficial-krds/svelte';
const props: InPageNavigationProps = {
  "sections": [
    {
      "id": "overview",
      "label": "신청 개요"
    },
    {
      "id": "requirements",
      "label": "신청 조건"
    }
  ],
  "title": "이 페이지의 구성",
  "activeId": "overview",
  "narrowMode": "inline"
};
</script>
<section data-example="in-page-navigation"><InPageNavigation {...props}/></section>
```

## Pagination {#pagination}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/PaginationExample.svelte.txt)

```svelte
<script lang="ts">
import Pagination from '@unofficial-krds/svelte/pagination';
import type { PaginationProps } from '@unofficial-krds/svelte';
const props: PaginationProps = {
  "defaultPage": 1,
  "pageCount": 12,
  "variant": "number-links"
,
hrefForPage: page => `/local/list?page=${page}`
};
</script>
<section data-example="pagination"><Pagination {...props}/></section>
```

## Structured list {#structured-list}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/StructuredListExample.svelte.txt)

```svelte
<script lang="ts">
import StructuredList from '@unofficial-krds/svelte/structured-list';
import type { StructuredListProps } from '@unofficial-krds/svelte';
const props: StructuredListProps = {
  "items": [
    {
      "id": "a",
      "title": "예제 신청 공고",
      "href": "/local/notice/a",
      "metadata": [
        {
          "label": "마감일",
          "value": "2026-11-30"
        },
        {
          "label": "담당 부서",
          "value": "예제 부서"
        }
      ]
    },
    {
      "id": "b",
      "title": "다음 신청 공고",
      "href": "/local/notice/b",
      "metadata": [
        {
          "label": "마감일",
          "value": "2026-12-31"
        }
      ]
    }
  ],
  "variant": "list"
};
</script>
<section data-example="structured-list"><StructuredList {...props}/></section>
```

## Critical alerts {#critical-alert}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/CriticalAlertExample.svelte.txt)

```svelte
<script lang="ts">
import CriticalAlert from '@unofficial-krds/svelte/critical-alert';
import type { CriticalAlertProps } from '@unofficial-krds/svelte';
const props: CriticalAlertProps = {
  "urgency": "high",
  "label": "긴급 안내",
  "message": "예제 점검으로 신청이 잠시 중단됩니다.",
  "details": {
    "href": "/local/maintenance",
    "label": "점검 상세 안내",
    "destinationTitle": "점검 상세 안내"
  }
};
</script>
<section data-example="critical-alert"><CriticalAlert {...props}/></section>
```

## Calendar {#calendar}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/CalendarExample.svelte.txt)

```svelte
<script lang="ts">
import Calendar from '@unofficial-krds/svelte/calendar';
import type { CalendarProps } from '@unofficial-krds/svelte';
const props: CalendarProps = {label:"날짜",referenceDate:"2024-02-15"};
</script>
<section data-example="calendar"><Calendar {...props}/></section>
```

## Disclosure {#disclosure}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/DisclosureExample.svelte.txt)

```svelte
<script lang="ts">
import Disclosure from '@unofficial-krds/svelte/disclosure';
import type { DisclosureProps } from '@unofficial-krds/svelte';
const props: DisclosureProps = {
  "label": "신청 도움말",
  "contentId": "application-help",
  "defaultOpen": false
};
</script>
<section data-example="disclosure"><Disclosure {...props}/></section>
```

## Modal {#modal}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/ModalExample.svelte.txt)

```svelte
<script lang="ts">
import Modal from '@unofficial-krds/svelte/modal';
import type { ModalProps } from '@unofficial-krds/svelte';
const props: ModalProps = {title:"확인",defaultOpen:false};
</script>
<section data-example="modal"><Modal {...props}/></section>
```

## Badge {#badge}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/BadgeExample.svelte.txt)

```svelte
<script lang="ts">
import Badge from '@unofficial-krds/svelte/badge';
import type { BadgeProps } from '@unofficial-krds/svelte';
const props: BadgeProps = {
  "label": "진행 중",
  "appearance": "outline",
  "tone": "information",
  "size": "medium",
  "numeric": false
};
</script>
<section data-example="badge"><Badge {...props}/></section>
```

## Accordion {#accordion}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/AccordionExample.svelte.txt)

```svelte
<script lang="ts">
import Accordion from '@unofficial-krds/svelte/accordion';
import type { AccordionProps } from '@unofficial-krds/svelte';
const props: AccordionProps = {
  "items": [
    {
      "id": "eligibility",
      "title": "신청 자격",
      "content": "예제 신청 자격 안내"
    },
    {
      "id": "documents",
      "title": "제출 서류",
      "content": "예제 제출 서류 안내"
    }
  ],
  "defaultOpenIds": [],
  "multiple": true,
  "variant": "default"
};
</script>
<section data-example="accordion"><Accordion {...props}/></section>
```

## Image {#image}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/ImageExample.svelte.txt)

```svelte
<script lang="ts">
import Image from '@unofficial-krds/svelte/image';
import type { ImageProps } from '@unofficial-krds/svelte';
const props: ImageProps = {
  "src": "/local-assets/specimen-landscape.svg",
  "alt": "산과 강이 있는 독립 예제 그림",
  "width": 640,
  "height": 360,
  "loading": "eager"
};
</script>
<section data-example="image"><Image {...props}/></section>
```

## Carousel {#carousel}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/CarouselExample.svelte.txt)

```svelte
<script lang="ts">
import Carousel from '@unofficial-krds/svelte/carousel';
import type { CarouselProps } from '@unofficial-krds/svelte';
const props: CarouselProps = {
  "items": [
    {
      "id": "a",
      "label": "신청 안내",
      "content": "첫 번째 신청 안내"
    },
    {
      "id": "b",
      "label": "서류 안내",
      "content": "두 번째 서류 안내"
    },
    {
      "id": "c",
      "label": "문의 안내",
      "content": "세 번째 문의 안내"
    }
  ],
  "defaultIndex": 0,
  "layout": "single",
  "autoplay": false,
  "intervalMs": 6000,
  "loop": false
};
</script>
<section data-example="carousel"><Carousel {...props}/></section>
```

## Tab {#tabs}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TabsExample.svelte.txt)

```svelte
<script lang="ts">
import Tabs from '@unofficial-krds/svelte/tabs';
import type { TabsProps } from '@unofficial-krds/svelte';
const props: TabsProps = {label:"안내",items:[{value:"details",label:"상세",content:"상세 내용"}]};
</script>
<section data-example="tabs"><Tabs {...props}/></section>
```

## Table {#table}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TableExample.svelte.txt)

```svelte
<script lang="ts">
import Table from '@unofficial-krds/svelte/table';
import type { TableProps } from '@unofficial-krds/svelte';
const props: TableProps = {
  "caption": "예제 신청 내역",
  "columns": [
    {
      "id": "name",
      "label": "신청명",
      "kind": "text"
    },
    {
      "id": "count",
      "label": "수량",
      "kind": "number"
    }
  ],
  "rows": [
    {
      "id": "a",
      "cells": {
        "name": "신청 가",
        "count": 2
      }
    },
    {
      "id": "b",
      "cells": {
        "name": "신청 나",
        "count": 1
      }
    }
  ]
};
</script>
<section data-example="table"><Table {...props}/></section>
```

## Text list {#text-list}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TextListExample.svelte.txt)

```svelte
<script lang="ts">
import TextList from '@unofficial-krds/svelte/text-list';
import type { TextListProps } from '@unofficial-krds/svelte';
const props: TextListProps = {
  "ordered": false,
  "marker": "dot",
  "items": [
    {
      "id": "one",
      "content": "신청 조건 확인"
    },
    {
      "id": "two",
      "content": "제출 서류 준비"
    }
  ]
};
</script>
<section data-example="text-list"><TextList {...props}/></section>
```

## Favicon {#favicon}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/FaviconExample.svelte.txt)

```svelte
<script lang="ts">
import Favicon from '@unofficial-krds/svelte/favicon';
import type { FaviconProps } from '@unofficial-krds/svelte';
const props: FaviconProps = {
  "light": {
    "href": "/local-assets/specimen-icon-light.svg",
    "type": "image/svg+xml",
    "sizes": "any"
  },
  "dark": {
    "href": "/local-assets/specimen-icon-dark.svg",
    "type": "image/svg+xml",
    "sizes": "any"
  }
};
</script>
<section data-example="favicon"><Favicon {...props}/></section>
```

## Link {#link}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/LinkExample.svelte.txt)

```svelte
<script lang="ts">
import Link from '@unofficial-krds/svelte/link';
import type { LinkProps } from '@unofficial-krds/svelte';
const props: LinkProps = {
  "href": "/local/application",
  "label": "신청 안내",
  "appearance": "basic",
  "size": "medium",
  "underline": true
};
</script>
<section data-example="link"><Link {...props}/></section>
```

## Button {#button}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/ButtonExample.svelte.txt)

```svelte
<script lang="ts">
import Button from '@unofficial-krds/svelte/button';
import type { ButtonProps } from '@unofficial-krds/svelte';
const props: ButtonProps = { disabled: false };
</script>
<section data-example="button"><Button {...props}>저장</Button></section>
```

## FAB {#fab}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/FABExample.svelte.txt)

```svelte
<script lang="ts">
import FAB from '@unofficial-krds/svelte/fab';
import type { FABProps } from '@unofficial-krds/svelte';
const props: FABProps = {
  "label": "새 신청",
  "icon": "plus",
  "defaultExpanded": false
};
</script>
<section data-example="fab"><FAB {...props}/></section>
```

## Radio button {#radio-group}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/RadioGroupExample.svelte.txt)

```svelte
<script lang="ts">
import RadioGroup from '@unofficial-krds/svelte/radio-group';
import type { RadioGroupProps } from '@unofficial-krds/svelte';
const props: RadioGroupProps = {
  "label": "거주 지역",
  "name": "region",
  "options": [
    {
      "value": "seoul",
      "label": "서울"
    },
    {
      "value": "busan",
      "label": "부산"
    },
    {
      "value": "jeju",
      "label": "제주",
      "disabled": true
    }
  ],
  "size": "medium",
  "appearance": "default"
};
</script>
<section data-example="radio-group"><RadioGroup {...props}/></section>
```

## Checkbox {#checkbox}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/CheckboxExample.svelte.txt)

```svelte
<script lang="ts">
import Checkbox from '@unofficial-krds/svelte/checkbox';
import type { CheckboxProps } from '@unofficial-krds/svelte';
const props: CheckboxProps = {
  "label": "이용약관 동의",
  "name": "consent",
  "defaultChecked": false,
  "indeterminate": false,
  "value": "agreed"
};
</script>
<section data-example="checkbox"><Checkbox {...props}/></section>
```

## Select {#native-select}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/NativeSelectExample.svelte.txt)

```svelte
<script lang="ts">
import NativeSelect from '@unofficial-krds/svelte/native-select';
import type { NativeSelectProps } from '@unofficial-krds/svelte';
const props: NativeSelectProps = { label: "지역", options: [{value:"seoul",label:"서울"}] };
</script>
<section data-example="native-select"><NativeSelect {...props}/></section>
```

## Tag {#tag}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TagExample.svelte.txt)

```svelte
<script lang="ts">
import Tag from '@unofficial-krds/svelte/tag';
import type { TagProps } from '@unofficial-krds/svelte';
const props: TagProps = {
  "items": [
    {
      "id": "a",
      "label": "서울",
      "href": "/local/seoul"
    },
    {
      "id": "b",
      "label": "부산",
      "href": "/local/busan"
    }
  ],
  "mode": "static",
  "selectedIds": []
};
</script>
<section data-example="tag"><Tag {...props}/></section>
```

## Toggle switch {#switch}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/SwitchExample.svelte.txt)

```svelte
<script lang="ts">
import Switch from '@unofficial-krds/svelte/switch';
import type { SwitchProps } from '@unofficial-krds/svelte';
const props: SwitchProps = {
  "label": "예제 알림 받기",
  "name": "notification",
  "defaultChecked": false,
  "size": "medium"
};
</script>
<section data-example="switch"><Switch {...props}/></section>
```

## Step indicator {#step-indicator}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/StepIndicatorExample.svelte.txt)

```svelte
<script lang="ts">
import StepIndicator from '@unofficial-krds/svelte/step-indicator';
import type { StepIndicatorProps } from '@unofficial-krds/svelte';
const props: StepIndicatorProps = {
  "steps": [
    {
      "id": "a",
      "label": "약관 확인",
      "status": "complete"
    },
    {
      "id": "b",
      "label": "정보 입력",
      "status": "current"
    },
    {
      "id": "c",
      "label": "신청 완료",
      "status": "pending"
    }
  ],
  "mode": "sequential"
};
</script>
<section data-example="step-indicator"><StepIndicator {...props}/></section>
```

## Spinner {#spinner}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/SpinnerExample.svelte.txt)

```svelte
<script lang="ts">
import Spinner from '@unofficial-krds/svelte/spinner';
import type { SpinnerProps } from '@unofficial-krds/svelte';
const props: SpinnerProps = {
  "pending": true,
  "label": "신청 내역 불러오는 중",
  "completionMessage": "신청 내역을 불러왔습니다.",
  "size": "medium",
  "value": 40
};
</script>
<section data-example="spinner"><Spinner {...props}/></section>
```

## Help panel {#help-panel}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/HelpPanelExample.svelte.txt)

```svelte
<script lang="ts">
import HelpPanel from '@unofficial-krds/svelte/help-panel';
import type { HelpPanelProps } from '@unofficial-krds/svelte';
const props: HelpPanelProps = {
  "defaultOpen": true,
  "defaultSelectedTopicId": null,
  "topics": [
    {
      "id": "eligibility",
      "title": "신청 자격",
      "content": "예제 신청 자격 도움말",
      "relatedLinks": [
        {
          "id": "policy",
          "label": "이용약관",
          "href": "/local/policy"
        }
      ]
    },
    {
      "id": "documents",
      "title": "제출 서류",
      "content": "예제 제출 서류 도움말",
      "relatedLinks": []
    }
  ],
  "mode": "help",
  "fallbackFocusId": "panel-fallback"
};
</script>
<section data-example="help-panel"><HelpPanel {...props}/></section>
```

## Tutorial panel {#tutorial-panel}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TutorialPanelExample.svelte.txt)

```svelte
<script lang="ts">
import TutorialPanel from '@unofficial-krds/svelte/tutorial-panel';
import type { TutorialPanelProps } from '@unofficial-krds/svelte';
const props: TutorialPanelProps = {
  "tasks": [
    {
      "id": "apply",
      "title": "예제 신청하기",
      "steps": [
        {
          "id": "one",
          "title": "이름 입력",
          "targetId": "applicant-name",
          "instruction": "신청인 이름을 입력하세요"
        },
        {
          "id": "two",
          "title": "신청 저장",
          "targetId": "save-application",
          "instruction": "저장을 눌러 완료하세요"
        }
      ]
    }
  ],
  "activeTaskId": "apply",
  "activeStepId": null,
  "defaultRunning": false,
  "defaultOpen": true,
  "defaultActivePanel": "tutorial",
  "startActionId": "tutorial-start",
  "fallbackFocusId": "tutorial-fallback"
};
</script>
<section data-example="tutorial-panel"><TutorialPanel {...props}/></section>
```

## Contextual help {#contextual-help}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/ContextualHelpExample.svelte.txt)

```svelte
<script lang="ts">
import ContextualHelp from '@unofficial-krds/svelte/contextual-help';
import type { ContextualHelpProps } from '@unofficial-krds/svelte';
const props: ContextualHelpProps = {
  "title": "신청 자격 도움말",
  "content": "신청 자격에 관한 예제 설명입니다.",
  "triggerLabel": "신청 자격 도움말",
  "defaultOpen": false,
  "variant": "information",
  "placement": "bottom-start"
};
</script>
<section data-example="contextual-help"><ContextualHelp {...props}/></section>
```

## Coach mark {#coach-mark}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/CoachMarkExample.svelte.txt)

```svelte
<script lang="ts">
import CoachMark from '@unofficial-krds/svelte/coach-mark';
import type { CoachMarkProps } from '@unofficial-krds/svelte';
const props: CoachMarkProps = {
  "steps": [
    {
      "id": "one",
      "title": "이름 입력",
      "targetId": "applicant-name",
      "instruction": "신청인 이름을 입력하세요"
    }
  ],
  "boundaries": [
    {
      "targetId": "applicant-name",
      "insertionBoundaryId": "applicant-name-after"
    },
    {
      "targetId": "save-application",
      "insertionBoundaryId": "save-application-after"
    }
  ],
  "defaultOpen": true,
  "defaultStepId": "one",
  "startActionId": "tutorial-start",
  "fallbackFocusId": "coach-fallback"
,
onTargetAction: () => false
};
</script>
<section data-example="coach-mark"><CoachMark {...props}/></section>
```

## Tooltip {#tooltip}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TooltipExample.svelte.txt)

```svelte
<script lang="ts">
import Tooltip from '@unofficial-krds/svelte/tooltip';
import type { TooltipProps } from '@unofficial-krds/svelte';
const props: TooltipProps = {
  "text": "신청 도움말을 엽니다",
  "relationship": "description",
  "triggerLabel": "신청 도움말",
  "triggerId": "help-trigger",
  "textId": "help-tooltip",
  "defaultOpen": false,
  "placement": "bottom-start"
};
</script>
<section data-example="tooltip"><Tooltip {...props}/></section>
```

## TTS {#tts}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TTSExample.svelte.txt)

```svelte
<script lang="ts">
import TTS from '@unofficial-krds/svelte/tts';
import type { TTSProps } from '@unofficial-krds/svelte';
const props: TTSProps = {
  "summary": "이 페이지는 예제 신청 방법을 안내합니다.",
  "locale": "ko-KR",
  "state": "idle",
  "label": "음성 안내",
  "size": "small",
  "iconOnly": false
,
onRequest: () => {}
};
</script>
<section data-example="tts"><TTS {...props}/></section>
```

## Date input {#date-input}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/DateInputExample.svelte.txt)

```svelte
<script lang="ts">
import DateInput from '@unofficial-krds/svelte/date-input';
import type { DateInputProps } from '@unofficial-krds/svelte';
const props: DateInputProps = {label:"날짜",name:"date",referenceDate:"2024-02-15"};
</script>
<section data-example="date-input"><DateInput {...props}/></section>
```

## Textarea {#textarea}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TextareaExample.svelte.txt)

```svelte
<script lang="ts">
import Textarea from '@unofficial-krds/svelte/textarea';
import type { TextareaProps } from '@unofficial-krds/svelte';
const props: TextareaProps = {
  "label": "신청 사유",
  "name": "reason",
  "rows": 5,
  "disabled": false,
  "readOnly": false
};
</script>
<section data-example="textarea"><Textarea {...props}/></section>
```

## Text input {#text-input}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TextInputExample.svelte.txt)

```svelte
<script lang="ts">
import TextInput from '@unofficial-krds/svelte/text-input';
import type { TextInputProps } from '@unofficial-krds/svelte';
const props: TextInputProps = {
  "label": "신청인 이름",
  "name": "applicant",
  "type": "text",
  "size": "medium",
  "status": "default",
  "autocomplete": "name"
};
</script>
<section data-example="text-input"><TextInput {...props}/></section>
```

## File upload {#file-upload}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/FileUploadExample.svelte.txt)

```svelte
<script lang="ts">
import FileUpload from '@unofficial-krds/svelte/file-upload';
import type { FileUploadProps } from '@unofficial-krds/svelte';
const props: FileUploadProps = {
  "label": "첨부 서류",
  "name": "documents",
  "files": [],
  "multiple": false,
  "accept": ".txt,.pdf",
  "maxFiles": 3,
  "maxBytes": 1048576
,
onFilesChange: () => {}
};
</script>
<section data-example="file-upload"><FileUpload {...props}/></section>
```

## Language switcher {#language-switcher}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/LanguageSwitcherExample.svelte.txt)

```svelte
<script lang="ts">
import LanguageSwitcher from '@unofficial-krds/svelte/language-switcher';
import type { LanguageSwitcherProps } from '@unofficial-krds/svelte';
const props: LanguageSwitcherProps = {
  "currentLocale": "ko",
  "options": [
    {
      "locale": "ko",
      "nativeLabel": "한국어",
      "translatedLabel": "한국어",
      "href": "/local/ko"
    },
    {
      "locale": "en",
      "nativeLabel": "English",
      "translatedLabel": "영어",
      "href": "/local/en"
    }
  ],
  "defaultOpen": false
};
</script>
<section data-example="language-switcher"><LanguageSwitcher {...props}/></section>
```

## Resize {#resize}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/ResizeExample.svelte.txt)

```svelte
<script lang="ts">
import Resize from '@unofficial-krds/svelte/resize';
import type { ResizeProps } from '@unofficial-krds/svelte';
const props: ResizeProps = {
  "levels": [
    {
      "id": "90",
      "label": "작게",
      "percent": 90
    },
    {
      "id": "100",
      "label": "기본",
      "percent": 100
    },
    {
      "id": "110",
      "label": "조금 크게",
      "percent": 110
    },
    {
      "id": "120",
      "label": "크게",
      "percent": 120
    },
    {
      "id": "130",
      "label": "아주 크게",
      "percent": 130
    }
  ],
  "defaultOpen": false
};
</script>
<section data-example="resize"><Resize {...props}/></section>
```

## Accessible multimedia {#accessible-media}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/AccessibleMediaExample.svelte.txt)

```svelte
<script lang="ts">
import AccessibleMedia from '@unofficial-krds/svelte/accessible-media';
import type { AccessibleMediaProps } from '@unofficial-krds/svelte';
const props: AccessibleMediaProps = {
  "media": {
    "kind": "audio",
    "src": "/local-assets/specimen-audio.wav",
    "type": "audio/wav"
  },
  "captionTracks": [],
  "transcript": {
    "content": "약 1초 동안 일정한 높이의 예제 신호음이 들립니다."
  },
  "title": "로컬 예제 미디어",
  "controls": true,
  "autoplay": false
};
</script>
<section data-example="accessible-media"><AccessibleMedia {...props}/></section>
```

## Visually hidden {#visually-hidden}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/VisuallyHiddenExample.svelte.txt)

```svelte
<script lang="ts">
import VisuallyHidden from '@unofficial-krds/svelte/visually-hidden';
import type { VisuallyHiddenProps } from '@unofficial-krds/svelte';
const props: VisuallyHiddenProps = {
  "id": "hidden-help",
  "content": "신청 내용을 확인하세요",
  "variant": "text",
  "lang": "ko"
};
</script>
<section data-example="visually-hidden"><VisuallyHidden {...props}/></section>
```

## Range slider {#range-slider}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/RangeSliderExample.svelte.txt)

```svelte
<script lang="ts">
import RangeSlider from '@unofficial-krds/svelte/range-slider';
import type { RangeSliderProps } from '@unofficial-krds/svelte';
const props: RangeSliderProps = {
  "label": "예제 비율",
  "name": "ratio",
  "min": 0,
  "max": 100,
  "step": 10
};
</script>
<section data-example="range-slider"><RangeSlider {...props}/></section>
```

## Back button {#back-button}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/BackButtonExample.svelte.txt)

```svelte
<script lang="ts">
import BackButton from '@unofficial-krds/svelte/back-button';
import type { BackButtonProps } from '@unofficial-krds/svelte';
const props: BackButtonProps = {
  "label": "뒤로가기",
  "canGoBack": true,
  "dirty": false,
  "fallbackHref": "/local/parent"
,
onBackRequest: () => {}
};
</script>
<section data-example="back-button"><BackButton {...props}/></section>
```

## Bottom sheet {#bottom-sheet}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/BottomSheetExample.svelte.txt)

```svelte
<script lang="ts">
import BottomSheet from '@unofficial-krds/svelte/bottom-sheet';
import type { BottomSheetProps } from '@unofficial-krds/svelte';
const props: BottomSheetProps = {
  "title": "지역 선택",
  "defaultOpen": true,
  "description": "예제 지역을 선택하세요",
  "dismissOnOutside": false
};
</script>
<section data-example="bottom-sheet"><BottomSheet {...props}/></section>
```

## Quantity toggle {#quantity-toggle}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/QuantityToggleExample.svelte.txt)

```svelte
<script lang="ts">
import QuantityToggle from '@unofficial-krds/svelte/quantity-toggle';
import type { QuantityToggleProps } from '@unofficial-krds/svelte';
const props: QuantityToggleProps = {
  "label": "신청 수량",
  "name": "quantity",
  "min": 0,
  "max": 10,
  "step": 1,
  "unit": "개"
};
</script>
<section data-example="quantity-toggle"><QuantityToggle {...props}/></section>
```

## Toast {#toast}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/ToastExample.svelte.txt)

```svelte
<script lang="ts">
import Toast from '@unofficial-krds/svelte/toast';
import type { ToastProps } from '@unofficial-krds/svelte';
const props: ToastProps = {
  "message": {
    "id": "saved",
    "text": "신청이 저장되었습니다.",
    "tone": "information",
    "persistentResultId": "saved-result"
  },
  "durationMs": 3000
,
onDismiss: () => {}
};
</script>
<section data-example="toast"><Toast {...props}/></section>
```

## Snackbar {#snackbar}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/SnackbarExample.svelte.txt)

```svelte
<script lang="ts">
import Snackbar from '@unofficial-krds/svelte/snackbar';
import type { SnackbarProps } from '@unofficial-krds/svelte';
const props: SnackbarProps = {
  "message": {
    "id": "saved",
    "title": "저장 완료",
    "text": "예제 신청을 저장했습니다."
  },
  "durationMs": null
,
onDismiss: () => {}
};
</script>
<section data-example="snackbar"><Snackbar {...props}/></section>
```

## Tab bars {#tab-bar}

[소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TabBarExample.svelte.txt)

```svelte
<script lang="ts">
import TabBar from '@unofficial-krds/svelte/tab-bar';
import type { TabBarProps } from '@unofficial-krds/svelte';
const props: TabBarProps = {
  "items": [
    {
      "id": "home",
      "label": "홈",
      "href": "/local/home",
      "icon": "home"
    },
    {
      "id": "apply",
      "label": "신청",
      "href": "/local/apply",
      "icon": "document"
    },
    {
      "id": "profile",
      "label": "내 정보",
      "href": "/local/profile",
      "icon": "person"
    }
  ],
  "currentId": "home"
};
</script>
<section data-example="tab-bar"><TabBar {...props}/></section>
```
