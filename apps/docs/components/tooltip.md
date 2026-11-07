---
title: '툴팁 · Tooltip'
---

# 툴팁 {#tooltip}

Tooltip · `Tooltip` · component

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_08_05.html) · [검토된 전체 명세](/sources/specs/components/tooltip.md.txt) · [프레임워크 지원](../compatibility/)

## 네이티브 지원 현황 {#native-availability}

아래 상태는 `catalog/coverage.json`에서 그대로 가져옵니다. export, 예제, 테스트 실행기 종료 코드에서 추론하지 않습니다.

| 프레임워크 | 패키지 버전 | 기록된 상태 | export 선언 | 네이티브 예제와 스토리 |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/react/package.json.txt); [과거 선언 체크포인트](/sources/packages/react/dist/components/tooltip/index.d.ts.txt) | [react 소스와 미리보기 정책](../compatibility/examples#react) |
| solid | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/solid/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid/dist/components/tooltip/index.d.ts.txt) | [solid 소스와 미리보기 정책](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/svelte/package.json.txt); [과거 선언 체크포인트](/sources/packages/svelte/dist/components/Tooltip.svelte.d.ts.txt) | [svelte 소스와 미리보기 정책](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/vue/package.json.txt); [과거 선언 체크포인트](/sources/packages/vue/dist/components/tooltip/Tooltip.vue.d.ts.txt) | [vue 소스와 미리보기 정책](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/lit/package.json.txt); [과거 선언 체크포인트](/sources/packages/lit/dist/components/tooltip/index.d.ts.txt) | [lit 소스와 미리보기 정책](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/qwik/package.json.txt); [과거 선언 체크포인트](/sources/packages/qwik/dist/components/tooltip/index.d.ts.txt) | [qwik 소스와 미리보기 정책](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/angular/package.json.txt); [과거 선언 체크포인트](/sources/packages/angular/dist/types/unofficial-krds-angular-tooltip.d.ts.txt) | [angular 소스와 미리보기 정책](../compatibility/examples#angular) |
| solid-next (미리보기) | `0.1.0-preview.0` | planned | [현재 루트 매니페스트](/sources/packages/solid-next/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next 소스와 미리보기 정책](../compatibility/examples#solid-next) |

## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}

아래 의미 계약은 공유 데이터일 뿐입니다. 네이티브 콘텐츠, ref, 이벤트 전달은 각 어댑터가 맡습니다. 계약의 콜백 이름과 detail 타입은 그대로 씁니다. 머신 객체를 전달하지 않습니다. 선택 속성에는 기본값이 자동으로 채워지지 않습니다. 아래 안내의 명시적 기본값을 씁니다.

```ts
export interface TooltipContract extends ControlledOpen {
    text: string;
    relationship?: 'description' | 'label';
    triggerLabel?: string;
    triggerId: string;
    textId: string;
    placement?: HelpPlacement;
    fallbackFocusId?: string;
    touchToggle?: boolean;
}

export interface ControlledOpen {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (detail: OpenChangeDetails) => void;
}

export interface OpenChangeDetails {
    open: boolean;
}

export type HelpPlacement = 'top-start' | 'top' | 'top-end' | 'bottom-start' | 'bottom' | 'bottom-end';
```

| 의미 속성 / 콜백 | 필수 | 정확한 타입 | 역할 |
| --- | --- | --- | --- |
| `open` | 아니요 | `boolean` | 데이터 / 상태 |
| `defaultOpen` | 아니요 | `boolean` | 데이터 / 상태 |
| `onOpenChange` | 아니요 | `(detail: OpenChangeDetails) => void` | 의미 이벤트 요청 |
| `text` | 예 | `string` | 데이터 / 상태 |
| `relationship` | 아니요 | `'description' \| 'label'` | 데이터 / 상태 |
| `triggerLabel` | 아니요 | `string` | 데이터 / 상태 |
| `triggerId` | 예 | `string` | 데이터 / 상태 |
| `textId` | 예 | `string` | 데이터 / 상태 |
| `placement` | 아니요 | `HelpPlacement` | 데이터 / 상태 |
| `fallbackFocusId` | 아니요 | `string` | 데이터 / 상태 |
| `touchToggle` | 아니요 | `boolean` | 데이터 / 상태 |

선택 값과 명시적 기본값은 다릅니다. 기본값과 네이티브 콘텐츠 요구사항은 아래 검토된 안내에 있습니다.

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 네이티브 JSX/콘텐츠 prop을 씁니다. Svelte는 네이티브 snippet을 씁니다. Vue는 네이티브 슬롯을 씁니다. Angular는 네이티브 input, output, 콘텐츠 투영을 씁니다. Lit은 custom element 속성, 슬롯, DOM 이벤트를 씁니다. Qwik은 네이티브 QRL 이벤트 경계를 씁니다. 이 전달 방식은 서로 바꿔 쓸 수 없습니다. 정확한 이름과 필수 콘텐츠는 링크된 공개 패키지 선언에서 확인합니다. 아래 의미 콜백이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

이름이 있는 트리거 버튼 바로 뒤에 짧은 비대화형 팝업을 둡니다. 툴팁 안에는 링크/버튼을 두지 않습니다. 정보 아이콘과 아이콘 버튼 레이블 툴팁은 서로 다른 사용 사례입니다. HTML title을 중복해 쓰지 않습니다. 출처는 aria-labelledby가 트리거와 컨테이너를 연결한다고만 하며 정확한 방향은 밝히지 않습니다.

### 의미 API {#plain-semantic-api}

독립 API: `text`, `relationship:description|label=description`, `triggerLabel?`, `triggerId`, `textId`, placement, open/defaultOpen=false, onOpenChange, `fallbackFocusId?`, touchToggle=false (별도의 정보 트리거가 아니면). 팝업은 role=tooltip이며 콘텐츠는 비대화형입니다. relationship 판별자는 필수 의미 동작입니다. 아이콘 모양이나 렌더러가 우연히 고른 속성에서 추론하지 않습니다.

**description** 모드에서는 독립적인 기능/맥락 triggerLabel(또는 검증된 동등한 네이티브 보이는 이름)이 필요하며, 이것이 계속 트리거의 실제 이름입니다. textId는 그 트리거의 aria-describedby에 정확히 한 번 추가합니다. 설명용 툴팁 텍스트로 aria-labelledby를 설정하지 않습니다. **label** 모드에서는 text 자체가 안정적인 기능 버튼 이름이어야 합니다. 트리거 aria-labelledby는 textId를 가리키고, triggerLabel/대체 aria-label은 허용되지 않으며, 같은 텍스트를 aria-describedby에도 쓰지 않습니다. 시각 팝업이 닫혀 있는 동안에도 실제 textId 노드를 같은 접근성 트리/루트에 유지해, 열기 전에도 기능 이름이 존재하게 합니다. 시각적으로 숨기는 것은 참조되는 텍스트를 언마운트하는 것이 아닙니다. 중복된 숨은 레이블/라이브 메시지를 또 만들지 않습니다. 다른 도움말 설명을 쓰는 소비자는 textId를 반복하지 않고 서로 다른 유효한 ID를 유지합니다.

두 모드 모두 Lit Shadow DOM을 포함해 실제 루트에서 트리거/텍스트 관계가 실제로 해석되어야 합니다. light DOM ID가 경계 너머의 내부 컨트롤에 이름을 붙일 수 있다고 가정하지 않습니다. 같은 루트에 속한 트리거/텍스트 관계 또는 검증된 네이티브 대체를 쓰고, 해석되지 않는 잘못된 구성은 실패시킵니다. 공식 aria-labelledby 문구([L1163–1164](https://www.krds.go.kr/html/site/component/component_08_05.html))는 아래에 그대로 인용되어 있습니다. description 모드의 aria-describedby는 보충 콘텐츠에 대한 명시적 독립 해석이며 KRDS의 문자 그대로의 지시라고 주장하지 않습니다. 제어 props/기본값/리셋/중복 금지 규칙은 [파일럿 정책](/sources/specs/components/README.md.txt)을 따릅니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

hover/초점으로 표시합니다. 포인터가 트리거와 팝업 둘 다에서 벗어나거나 blur되면 숨깁니다. 일반 hover 열기는 다른 곳의 키보드 초점을 빼앗지 않습니다. 포인터는 닫히지 않고 팝업으로 이동할 수 있습니다. 별도의 정보 버튼을 터치하면 토글하고 바깥을 탭하면 닫으며, 기본 아이콘 동작은 삼키지 않습니다. 팝업에는 Tab 정지점이 없습니다.

처리되는 Escape는 닫기를 한 번만 요청합니다. 조합 중이거나 keyCode229이거나 내부에서 이미 처리된 이벤트는 무시합니다. **실제 닫힘이 승인된 경우에만**, 초점을 옮기기 전에 Escape 억제를 표시한 뒤 사용 가능한 트리거에 초점을 둡니다. 툴팁이 hover로 열렸고 초점이 이전에 다른 곳에 있었어도 마찬가지입니다([공식 L1251–1255](https://www.krds.go.kr/html/site/component/component_08_05.html)). 이때 유발된 트리거 초점이 다시 열어서는 안 됩니다. Tab/Shift+Tab으로 그 트리거에서 다른 요소로 벗어났다가 초점이 다시 들어올 때까지 자동 hover/초점 재열기를 억제합니다. 포인터 이동이나 prop 변경만으로는 이 초기화가 충족되지 않습니다. 제어 닫기가 거부되면 실제 열림 상태를 유지하고 초점을 옮기지 않으며 해제에 성공했다고 주장하지 않습니다.

승인된 닫기나 해체로 트리거가 제거되거나 사용할 수 없게 되면 리스너와 대기 중인 요청을 정리하고, 다음 순서로 사용 가능한 대상을 고릅니다. 사용 가능한 fallbackFocusId, 저장된 트리거에서 가장 가까운 사용 가능한 초점 가능 조상, 그리고 임시 tabindex=-1을 쓰고 이전 값을 복원하는 살아 있는 document body입니다. 사용 가능이란 마운트됨, 보임, 활성, 초점 가능, 같은 살아 있는 document, inert 아님을 뜻합니다. 숨겨졌거나 제거된 트리거 노드에 초점을 두지 않으며, 오래된 generation의 초점 작업을 실행하지 않고, 복원 때문에 추가 사용자 이벤트를 내지 않습니다. 외부 prop으로 닫는 것만으로 Escape 동작인 척하지 않습니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

팝업은 충돌을 고려해 화면 안에 완전히 들어오고 대상을 가리지 않습니다. 터치 사용자에게도 의미 있는 아이콘/레이블이 있어야 합니다. 약 150자를 유지하며, 더 긴 대화형 콘텐츠는 ContextualHelp로 보냅니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

폼/리셋 상태는 없습니다. Enter/Space 활성화는 툴팁이 아니라 트리거 동작에 속합니다. 조합 중 Escape는 무시합니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트는 label 모드에는 의미 있는 기능 텍스트를, description 모드에는 별도의 기능 트리거 이름과 보충 텍스트를 제공합니다. 완료 조건은 다음과 같습니다.

- 시각적으로 열리기 전, 열리는 동안, 열린 후의 결정적인 계산된 이름/설명.
- 같은 루트/Shadow DOM에서 실제 관계.
- hover/초점/터치/Escape 억제.
- hover로 시작한 Escape의 복귀/대체/거부된 닫기 사례.

title 텍스트를 렌더링하거나 ID 문자열을 저장하는 것만으로는 이러한 네이티브 관계가 성립하지 않습니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, trigger, popup, icon, text; open,closed,suppressed,placement.

렌더링되는 모든 소유 파트는 `data-krds-component="tooltip"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위의 파트/상태 어휘는 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

지원하는 케이스 축: `information-icon`, `icon-button`, `vertical`, `box`. 이 케이스 이름은 프로젝트의 독립 축입니다. 공식 KRDS 유형 이름이나 완료된 커버리지를 뜻하지 않습니다.

[필수 네이티브 스토리 매니페스트](/sources/catalog/full-catalog-stories.json.txt) · [파일럿 스토리 매니페스트](/sources/catalog/story-cases.json.txt) · [커버리지 근거와 네이티브 리뷰 링크](/sources/catalog/coverage.json.txt)

필수 전체 카탈로그 스토리: `krds-tooltip--information-icon`, `krds-tooltip--icon-button`, `krds-tooltip--vertical`, `krds-tooltip--box`, `krds-tooltip--touch-toggle`, `krds-tooltip--escape-suppression`, `krds-tooltip--viewport-edge`, `krds-tooltip--relationship-description`, `krds-tooltip--relationship-label-closed`, `krds-tooltip--hover-escape-return`, `krds-tooltip--controlled-escape-rejected`, `krds-tooltip--trigger-removed`, `krds-tooltip--shadow-relationship`.

### 로컬 네이티브 스토리 {#local-native-stories}

픽스처와 Storybook 출력은 로컬 전용입니다. 이 공개 문서 사이트에 올리지 않습니다. 로컬 문서 서버도 그쪽으로 리디렉션하지 않습니다. 각 네이티브 Storybook은 자기 워크스페이스 스크립트로 실행합니다. 컴포넌트 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/` 아래에 조립된 네이티브 미리보기입니다. Solid 2에는 지원되는 네이티브 Storybook 통합이 없습니다. Qwik 프로덕션 SSR/resume에는 실제 서버가 필요합니다. 정적 미리보기로 대신할 수 없습니다. 스토리가 있다고 동작 인수가 성립하지는 않습니다.

네이티브 컴파일러 체크포인트입니다. 소스 해시는 문서를 빌드할 때마다 검증합니다. 이 기록은 최신 네이티브 후보나 동작 인수를 인증하지 않습니다. 검사된 소스 페이지마다 체크포인트 범위가 적혀 있습니다.

- react: [검사된 소비 코드 보기](/examples/react-1); [소스 그대로 내려받기](/sources/packages/react/examples/catalog.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [검사된 소비 코드 보기](/examples/solid-3); [소스 그대로 내려받기](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [검사된 소비 코드 보기](/examples/svelte-41); [소스 그대로 내려받기](/sources/apps/fixture-svelte/src/public-examples/TooltipExample.svelte.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [검사된 소비 코드 보기](/examples/vue-58); [소스 그대로 내려받기](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [검사된 소비 코드 보기](/examples/lit-60); [소스 그대로 내려받기](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [검사된 소비 코드 보기](/examples/qwik-61); [소스 그대로 내려받기](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [검사된 소비 코드 보기](/examples/angular-62); [소스 그대로 내려받기](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## 출처와 권리 {#source-identity-and-rights}

기준선: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. 공식 상세 스냅숏 수집 시각: `2026-10-29T23:28:05.172Z`. SHA-256: `cbbbf46d9fb23ba34d57fc1b4ae0e9ef072fba2956bee367673a11e28838118a`. [고정된 컴포넌트 출처 기록](/sources/catalog/components.json.txt) · [공식 출처](https://www.krds.go.kr/html/site/component/component_08_05.html). 원본 HTML은 체크아웃의 참고 근거로만 남습니다. 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
