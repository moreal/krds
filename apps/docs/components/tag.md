---
title: 'Tag'
---

# Tag {#tag}

태그 · `Tag`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_06_04.html) · [전체 명세](/sources/specs/components/tag.md.txt) · [프레임워크 지원](../compatibility/)

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
export interface TagContract {
    items: readonly {
        id: string;
        label: string;
        href?: string;
        disabled?: boolean;
    }[];
    mode?: 'static' | 'toggle' | 'removable' | 'add-filter' | 'link';
    selectedIds?: readonly string[];
    onSelectionChange?: (detail: {
        ids: readonly string[];
    }) => void;
    onRemove?: (detail: {
        id: string;
    }) => void;
    onAdd?: (detail: {
        id: string;
    }) => void;
    onClear?: () => void;
    appliedBarId?: string;
}
```

| 속성 / 콜백 | 필수 | 타입 | 역할 |
| --- | --- | --- | --- |
| `items` | 예 | `readonly {id: string; label: string; href?: string; disabled?: boolean}[]` | 데이터 / 상태 |
| `mode` | 아니요 | `'static' \| 'toggle' \| 'removable' \| 'add-filter' \| 'link'` | 데이터 / 상태 |
| `selectedIds` | 아니요 | `readonly string[]` | 데이터 / 상태 |
| `onSelectionChange` | 아니요 | `(detail: {ids: readonly string[]}) => void` | 이벤트 |
| `onRemove` | 아니요 | `(detail: {id: string}) => void` | 이벤트 |
| `onAdd` | 아니요 | `(detail: {id: string}) => void` | 이벤트 |
| `onClear` | 아니요 | `() => void` | 이벤트 |
| `appliedBarId` | 아니요 | `string` | 데이터 / 상태 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

레이블/컨테이너에 선택적 선행 체크 아이콘 또는 후행 삭제 아이콘이 붙습니다. 그룹은 대화형 또는 비대화형 중 하나로 통일합니다. 일괄 액션은 그룹 우측에, 더 보기 컨트롤은 선택적으로 둡니다. 필터링/삭제에는 실제 버튼을, 탐색 예시에만 실제 링크를 사용합니다.

### 의미 API {#plain-semantic-api}

독립 API: items {id,label,href?}[], mode=static|toggle|removable|add-filter|link, selectedIds/onSelectionChange, onRemove({id}), onAdd({id}), onClear(), appliedBarId. mode가 의미를 결정합니다. toggle은 aria-pressed를 사용합니다. 삭제 이름은 “[label] 옵션 삭제”, 추가 이름은 “[label] 필터 옵션 추가”입니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어 값과 기본값을 함께 주거나 mode를 바꾸는 것은 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청을 한 번 내보냅니다. disabled, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI/초점 상태를 유지하고, 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하며 제어 prop이 계속 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

대화형 그룹에 진입하면 첫 태그에 초점이 갑니다. 태그 탭 정지점은 하나이며 roving 초점을 씁니다(ArrowLeft/Right/Home/End 제안). 공식 Space/Enter keyup 활성화는 keydown과 네이티브 click으로 두 번 실행되지 않고 한 번만 실행되어야 합니다. 토글은 초점을 유지합니다. 필터를 추가하면 초점이 적용된 필터 막대로 이동합니다. 삭제하면 초점이 이전의 남은 활성 태그로 이동하고, 없으면 다음의 남은 활성 태그로, 사용할 태그가 없으면 실제 그룹 컨테이너로 이동합니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

레이블은 2단어 이내로 줄 바꿈 없이 짧게 하고 색은 최소한으로 일관되게 씁니다. 숨겨진 넘침 태그는 더 보기가 드러내기 전까지 접근할 수 없습니다. 네이티브 터치 대상과 초점 링은 분명해야 합니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

자동 폼 직렬화는 없습니다. 필터링 상태는 호스트가 소유합니다. 폼에 명시적으로 조합한 경우 그룹 리셋은 호스트 기본 selectedIds를 복원할 수 있습니다. IME는 사용자 지정 Enter 동작을 일으키면 안 됩니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

실제 필터 결과와 적용 막대 대상은 호스트가 소유합니다. 로컬 스토리는 로그만 내보내지 않고 데이터를 눈에 보이게 필터링하며 초점을 관리해야 합니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, list, item, label, icon, remove, clear, more; selected,disabled,expanded.

렌더링되는 모든 소유 파트는 `data-krds-component="tag"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위의 파트/상태 어휘는 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `static`, `toggle`, `removable`, `add-filter`, `link`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-33) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_06_04.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
