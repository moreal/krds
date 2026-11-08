---
title: 'Tab bars'
---

# Tab bars {#tab-bars}

탭바 · `TabBar`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_12_07.html) · [전체 명세](/sources/specs/components/tab-bar.md.txt) · [프레임워크 지원](../compatibility/)

## 네이티브 지원 현황 {#native-availability}

상태는 기록된 커버리지 기준입니다. [상태의 의미](../compatibility/#what-the-evidence-means)를 참고하세요.

| 프레임워크 | 패키지 버전 | 상태 | 예제 |
| --- | --- | --- | --- |
| react | `0.1.0` | planned | [react 예제](../compatibility/examples#react) |
| solid | `0.1.0` | planned | [solid 예제](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [svelte 예제](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [vue 예제](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [lit 예제](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [qwik 예제](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [angular 예제](../compatibility/examples#angular) |
| solid-next (미리보기) | `0.1.0-preview.0` | planned | [solid-next 예제](../compatibility/examples#solid-next) |

## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}

모든 프레임워크가 공유하는 의미 계약입니다. 콜백 이름과 detail 타입은 그대로 씁니다. 네이티브 콘텐츠, ref, 이벤트 전달은 각 어댑터가 맡습니다. 선택 속성의 기본값은 자동으로 채워지지 않으므로 아래 안내의 명시적 기본값을 씁니다.

```ts
export interface TabBarContract {
    items: readonly {
        id: string;
        label: string;
        href: string;
        icon: string;
        currentIcon?: string;
        badge?: string | number;
    }[];
    currentId: string;
    menuAction?: {
        label: string;
        onRequest: () => void;
    };
}
```

| 속성 / 콜백 | 필수 | 타입 | 역할 |
| --- | --- | --- | --- |
| `items` | 예 | `readonly {id: string; label: string; href: string; icon: string; currentIcon?: string; badge?: string \| number}[]` | 데이터 / 상태 |
| `currentId` | 예 | `string` | 데이터 / 상태 |
| `menuAction` | 아니요 | `{label: string; onRequest: () => void}` | 데이터 / 상태 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

웹 &lt;nav> 랜드마크에 크기가 같은 내비게이션 항목을 5개 이하로 두며, 각 항목은 아이콘과 짧은 레이블로 구성합니다. 현재 항목은 aria-current=page를 가지며 채운 아이콘과 윤곽 아이콘 또는 표시기로 구분합니다. 홈이 있으면 맨 앞(맨 왼쪽), 전체 메뉴가 있으면 맨 뒤(맨 오른쪽)에 둡니다. 선택적 Badge로 읽지 않음·새 항목 상태를 전달합니다.

### 의미 API {#plain-semantic-api}

독립 API: items {id,label,href,icon,currentIcon?,badge?}[], currentId, 선택적 마지막 항목 menuAction {label,onRequest}. 페이지 경로에는 실제 앵커를 쓰고, 이름 있는 버튼은 전체 메뉴를 여는 데만 씁니다. 이것은 내비게이션이며 role=tablist나 Tabs의 공통 상태 패널 API가 아닙니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 의미 변경 요청 하나를 냅니다. 비활성, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 0회 냅니다. 제어 거부 시 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고, 제어 props가 계속 우선합니다. 추가 필드는 렌더러·머신 객체를 노출하지 않습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

링크는 네이티브 Tab/Shift+Tab과 Enter, 전체 메뉴의 네이티브 버튼은 Enter/Space를 씁니다. 방향키나 탭 패널 자동 활성화는 추정하지 않습니다. 현재 경로는 호스트가 제공하며, 수동적인 prop 변경은 선택 이벤트를 내지 않습니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

하단에 고정하며 스크롤해도 숨기지 않습니다. 호스트가 그에 맞는 콘텐츠 하단 패딩·safe-area inset을 더합니다. 더 깊은 화면에서의 생략은 경로 설계에 따를 때만 허용합니다. 번역을 포함해 레이블은 말줄임하지 않습니다. 너비가 충분하면 MainMenu를 씁니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

폼·리셋·IME 동작은 없습니다. 메뉴 버튼은 type=button입니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 경로 맵·현재 페이지, 전체 메뉴 레이어, 배지 출처를 소유합니다. 완료는 실제 로컬 페이지 이동과 전체 메뉴 조합을 포함합니다. 배지는 정적 메타데이터이며 원격 알림 요구는 없습니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, list, item, link, icon, label, indicator, badge, menu-trigger; current.

렌더링되는 모든 소유 파트는 `data-krds-component="tab-bar"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 기준입니다. 위 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `three-items`, `five-items`, `with-badge`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-57) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_12_07.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
