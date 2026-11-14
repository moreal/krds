---
title: 'Text list'
---

# Text list {#text-list}

텍스트 목록 · `TextList` — 관련된 내용을 순서가 있거나 없는 목록으로 나열합니다.

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_04_13.html) · [전체 명세](/sources/specs/components/text-list.md.txt) · [프레임워크 지원](../compatibility/README.md)

## 프레임워크 지원 현황 {#native-availability}

상태는 기록된 커버리지 기준입니다. [상태의 의미](../compatibility/README.md#what-the-evidence-means)를 참고하세요.

| 프레임워크 | 패키지 버전 | 상태 | 예제 |
| --- | --- | --- | --- |
| react | `0.1.0` | planned | [react 예제](../compatibility/README.mdexamples#react) |
| solid | `0.1.0` | planned | [solid 예제](../compatibility/README.mdexamples#solid) |
| svelte | `0.1.0` | planned | [svelte 예제](../compatibility/README.mdexamples#svelte) |
| vue | `0.1.0` | planned | [vue 예제](../compatibility/README.mdexamples#vue) |
| lit | `0.1.0` | planned | [lit 예제](../compatibility/README.mdexamples#lit) |
| qwik | `0.1.0` | planned | [qwik 예제](../compatibility/README.mdexamples#qwik) |
| angular | `0.1.0` | planned | [angular 예제](../compatibility/README.mdexamples#angular) |
| solid-next (미리보기) | `0.1.0-preview.0` | planned | [solid-next 예제](../compatibility/README.mdexamples#solid-next) |

## 속성과 이벤트 {#props-events-content-and-defaults}

모든 프레임워크가 같은 속성 이름과 이벤트 타입을 씁니다. 콘텐츠를 넣는 방법과 이벤트를 받는 문법만 프레임워크마다 다릅니다. 선택 속성의 기본값은 아래 안내를 따릅니다.

| 이름 | 타입 | 필수 | 구분 |
| --- | --- | --- | --- |
| `ordered` | `boolean` | 선택 | 속성 |
| `marker` | `'dot' \| 'dash' \| 'hollow'` | 선택 | 속성 |
| `items` | `readonly TextListItem[]` | 필수 | 속성 |

표에 나온 타입의 정의입니다.

```ts
export interface TextListContract {
    ordered?: boolean;
    marker?: 'dot' | 'dash' | 'hollow';
    items: readonly TextListItem[];
}

export interface TextListItem {
    id: string;
    content: string;
    children?: readonly TextListItem[];
}
```

### 프레임워크별 콘텐츠와 이벤트 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 마크업 구조와 순서 {#native-structure-and-mandatory-ordering}

중요도가 같은 순서 없는 내용에는 네이티브 ul/li를, 순서/순위에는 ol/li를 씁니다. 중첩 목록은 부모 li 안에 둡니다. 수준은 최대 3개이며 들여쓰기, 어투, 문장 부호가 일관되어야 합니다. list-style:none이면 명시적 role=list/listitem으로 모바일 목록 탐색을 유지합니다.

### API와 기본값 {#plain-semantic-api}

독립 API: ordered=false, marker=dot|dash|hollow (dot), items {id,content,children?}[]. ordered 변형은 실제 숫자 순서를 씁니다. 콘텐츠에는 네이티브 링크를 담을 수 있습니다. 선택/현재 값이나 만들어 낸 listbox role은 없습니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어 값과 기본값을 함께 주거나 mode를 바꾸는 것은 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청을 한 번 내보냅니다. disabled, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI/초점 상태를 유지하고, 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하며 제어 prop이 계속 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

### 키보드와 초점 {#keyboard-focus-and-state-transitions}

정적 텍스트는 탭 정지점이나 화살표 탐색을 추가하지 않습니다. 포함된 네이티브 대화형 콘텐츠는 일반 읽기 순서를 따릅니다.

### 반응형 동작 {#responsive-mobile-requirements}

줄 바꿈된 텍스트는 같은 수준 텍스트 아래에 내어쓰기로 정렬합니다. 확대/좁은 너비에서도 계층을 유지합니다. 목록을 줄 바꿈으로 평탄화하지 않습니다.

### 폼 제출과 초기화 {#forms-reset-and-composition}

폼/리셋/IME 동작은 없습니다.

### 호스트 책임과 완료 기준 {#asset-integration-and-composition-completion}

공개 export `TextList`는 유지하되 잠정 종류를 composition→component로 바꾸기를 권장합니다. 출처는 여러 컴포넌트의 작업 워크플로 없이 시맨틱 목록 프리미티브를 정의합니다. 편집상의 순서와 문장 부호는 호스트가, 올바른 중첩은 렌더러가 소유합니다.

### 파트와 상태 속성 {#stable-parts-and-states}

root, item, marker, content, nested-list; ordered/unordered,level.

렌더링되는 모든 소유 파트는 `data-krds-component="text-list"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위의 파트/상태 어휘는 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 지원하는 변형 {#state-examples-and-native-checks}

`unordered-dot`, `unordered-dash`, `unordered-hollow`, `ordered`

이 이름은 프로젝트가 정한 구분이며 공식 KRDS 유형 이름은 아닙니다.

### 예제 코드 {#local-native-stories}

위 미리보기는 각 프레임워크의 실제 패키지로 만든 예제입니다. Storybook은 로컬에서만 실행하며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-25) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_04_13.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/index.md)를 읽어야 합니다.
