---
title: 'Help panel'
---

# Help panel {#help-panel}

도움 패널 · `HelpPanel`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_08_01.html) · [전체 명세](/sources/specs/components/help-panel.md.txt) · [프레임워크 지원](../compatibility/)

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
export interface HelpPanelContract extends ControlledOpen {
    topics: readonly HelpTopic[];
    selectedTopicId?: string | null;
    defaultSelectedTopicId?: string | null;
    onTopicChange?: (detail: {
        id: string | null;
    }) => void;
    mode?: 'help' | 'tutorial';
    fallbackFocusId?: string;
}

export interface ControlledOpen {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (detail: OpenChangeDetails) => void;
}

export interface OpenChangeDetails {
    open: boolean;
}

export interface HelpTopic {
    id: string;
    title: string;
    content: string;
    relatedLinks: readonly LinkData[];
}

export interface LinkData {
    id?: string;
    label: string;
    href: string;
    target?: string;
    rel?: string;
}
```

| 속성 / 콜백 | 필수 | 타입 | 역할 |
| --- | --- | --- | --- |
| `open` | 아니요 | `boolean` | 데이터 / 상태 |
| `defaultOpen` | 아니요 | `boolean` | 데이터 / 상태 |
| `onOpenChange` | 아니요 | `(detail: OpenChangeDetails) => void` | 이벤트 |
| `topics` | 예 | `readonly HelpTopic[]` | 데이터 / 상태 |
| `selectedTopicId` | 아니요 | `string \| null` | 데이터 / 상태 |
| `defaultSelectedTopicId` | 아니요 | `string \| null` | 데이터 / 상태 |
| `onTopicChange` | 아니요 | `(detail: {id: string \| null}) => void` | 이벤트 |
| `mode` | 아니요 | `'help' \| 'tutorial'` | 데이터 / 상태 |
| `fallbackFocusId` | 아니요 | `string` | 데이터 / 상태 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

본문 뒤에 열기 버튼과 도움 패널이 옵니다. 패널 헤더에는 선택 도움말/따라하기 탭과 닫기 버튼이 있습니다. 내용은 초기 안내 또는 맥락별 제목/본문이며, 구분선과 관련 링크/도움 채널 푸터가 이어집니다. 관련 필드·섹션 옆의 맥락 아이콘 트리거는 고유한 이름을 가집니다. 섹션 제목은 연결된 레이블과 일치해야 합니다.

### 의미 API {#plain-semantic-api}

독립 API입니다. open/defaultOpen(넓은 레이아웃에서 true), selectedTopicId/defaultSelectedTopicId=null, onOpenChange({open}), onTopicChange({id}), topics {id,title,content,relatedLinks}[], 조합 시 mode=help|tutorial, `fallbackFocusId?`를 씁니다. 닫았다 다시 열어도 마지막 주제를 보존합니다. 내용은 명시적 맥락 트리거에서만 바뀝니다. 패널 열기 버튼은 별도의 지속되는 “패널 열기” 버튼입니다. 이번 열기를 시작한 맥락 주제 아이콘이 그 역할을 하지 않습니다.

[파일럿 제어/리셋 규약](/sources/specs/components/README.md.txt)은 선언된 각 제어 필드에 적용됩니다. prop이 우선하고, 기본값은 한 번만 읽으며, 제어와 기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 사용자 요청은 변경당 하나이며, 마운트·prop·리셋 콜백은 없습니다. 거부된 제어 닫기는 보이는 패널과 그 좁은 화면 모달 격리·트랩을 유지하며 초점 복귀를 앞당기지 않습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

열면 패널 컨테이너 자체에 초점이 갑니다. 데스크톱 패널은 트랩 없이 Tab으로 벗어날 수 있습니다. 좁은 화면 표현은 실제로 열려 있는 동안 모달(Modal)과 같은 초기 컨테이너 초점, 격리, 스크롤 잠금, 최상위 Escape, Tab 순환을 씁니다. 링크는 새 창으로 열리며 그 목적을 알려야 합니다.

**두 모드 모두에서 복원 소유자는 HelpPanel 하나뿐입니다.** 공식 닫기 동작은 별개의 패널 열기 버튼으로 돌아갑니다([L1265–1278](https://www.krds.go.kr/html/site/component/component_08_01.html)). 좁은 패널을 남아 있는 주제 아이콘이 열었더라도 마찬가지입니다. 하위 수준의 네이티브 격리/트랩/진입 기본 요소를 재사용하되 자동 복귀는 끄거나 이 조합에 위임합니다. 공개 Modal 계약을 인스턴스로 만든 뒤 returnFocusId나 두 번째 초점 호출로 저장된 사용 가능한 열기 버튼을 덮어쓰지 않습니다. 공개 [Modal 실제 열기 버튼 규칙](/sources/specs/components/modal.md.txt)은 바뀌지 않습니다. 이 명시적 조합 적응은 좁은 화면 모달 표현([L1004–1005](https://www.krds.go.kr/html/site/component/component_08_01.html))과 함께 HelpPanel의 더 구체적인 공식 목적지를 보존합니다.

실제 true→false 전환이 수용되면 먼저 이 패널의 격리와 스크롤 잠금을 해제합니다. 그런 다음 초점을 정확히 한 번 옮깁니다. 순서는 다음과 같습니다. 사용 가능한 패널 열기 버튼, 없으면 사용 가능한 fallbackFocusId, 없으면 저장된 시작 주제 아이콘(사용 가능할 때), 없으면 그 아이콘에서 가장 가까운 사용 가능한 초점 가능 상위 요소, 없으면 임시 tabindex=-1을 단 document body(이전 tabindex는 복원). 사용 가능은 마운트됨, 보임, 활성, 초점 가능, 같은 라이브 문서, inert 아님을 뜻합니다. 열린 패널이 언마운트될 때도 정리 후 복귀 정책이 돌며 합성 변경 이벤트는 내지 않습니다. 거부된 제어 닫기는 이 중 아무것도 하지 않으며 초점은 활성 좁은 화면 모달 안에 남습니다. 따라하기/코치마크 중단 트랜잭션이 이 전환을 소유하면 두 소유자를 함께 돌리지 않고 복원을 그 코디네이터 하나에 명시적으로 넘깁니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

넓은 화면에서는 초기 안내와 함께 패널이 열린 채 시작합니다. 좁은 화면에서는 처음에 열기 버튼만 보이고 열면 모달이 됩니다. 해당하는 경우 아이콘 대상 크기를 44px 이상으로 유지하고, 필수 정보를 도움말에만 숨기지 않습니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

집계된 폼/리셋은 없습니다. 패널은 본문에서 입력 중인 값을 지우거나 조합 중인 키를 가로채서는 안 됩니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

component→composition을 권고합니다. 주제 트리거, 상태를 가진 패널, 선택 탭(Tabs)/따라하기 패널(TutorialPanel), 좁은 화면의 모달(Modal), 관련 링크를 포함합니다. 완료하려면 동작하는 필드/주제 데모와 반응형 셸이 필요합니다. 도움말 콘텐츠, URL, 외부 도움 채널은 호스트가 책임집니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, opener, topic-trigger, header, tabs, close, title, body, related; open,closed,active-topic,modal.

렌더링된 모든 소유 파트는 `data-krds-component="help-panel"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 씁니다. 네이티브/ARIA 상태가 우선합니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `desktop-open`, `narrow-modal`, `initial`, `context-detail`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-37) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_08_01.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
