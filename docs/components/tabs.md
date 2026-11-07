---
title: '탭 · Tab'
---

# 탭 {#tab}

Tab · `Tabs` · component

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_04_10.html) · [검토된 전체 명세](/sources/specs/components/tabs.md.txt) · [프레임워크 지원](../compatibility/README.md)

## 네이티브 지원 현황 {#native-availability}

아래 상태는 `catalog/coverage.json`에서 그대로 가져옵니다. export, 예제, 테스트 실행기 종료 코드에서 추론하지 않습니다.

| 프레임워크 | 패키지 버전 | 기록된 상태 | export 선언 | 네이티브 예제와 스토리 |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/react/package.json.txt); [과거 선언 체크포인트](/sources/packages/react/dist/components/tabs/index.d.ts.txt) | [react 소스와 미리보기 정책](../compatibility/README.mdexamples#react) |
| solid | `0.1.0` | implemented | [현재 하위 경로 매니페스트](/sources/packages/solid/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid/dist/components/tabs/index.d.ts.txt) | [solid 소스와 미리보기 정책](../compatibility/README.mdexamples#solid) |
| svelte | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/svelte/package.json.txt); [과거 선언 체크포인트](/sources/packages/svelte/dist/components/Tabs.svelte.d.ts.txt) | [svelte 소스와 미리보기 정책](../compatibility/README.mdexamples#svelte) |
| vue | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/vue/package.json.txt); [과거 선언 체크포인트](/sources/packages/vue/dist/components/tabs/Tabs.vue.d.ts.txt) | [vue 소스와 미리보기 정책](../compatibility/README.mdexamples#vue) |
| lit | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/lit/package.json.txt); [과거 선언 체크포인트](/sources/packages/lit/dist/components/tabs/index.d.ts.txt) | [lit 소스와 미리보기 정책](../compatibility/README.mdexamples#lit) |
| qwik | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/qwik/package.json.txt); [과거 선언 체크포인트](/sources/packages/qwik/dist/components/tabs/index.d.ts.txt) | [qwik 소스와 미리보기 정책](../compatibility/README.mdexamples#qwik) |
| angular | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/angular/package.json.txt); [과거 선언 체크포인트](/sources/packages/angular/dist/types/unofficial-krds-angular-tabs.d.ts.txt) | [angular 소스와 미리보기 정책](../compatibility/README.mdexamples#angular) |
| solid-next (미리보기) | `0.1.0-preview.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/solid-next/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid-next/dist/components/tabs/index.d.ts.txt) | [solid-next 소스와 미리보기 정책](../compatibility/README.mdexamples#solid-next) |

## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}

아래 의미 계약은 공유 데이터일 뿐입니다. 네이티브 콘텐츠, ref, 이벤트 전달은 각 어댑터가 맡습니다. 계약의 콜백 이름과 detail 타입은 그대로 씁니다. 머신 객체를 전달하지 않습니다. 선택 속성에는 기본값이 자동으로 채워지지 않습니다. 아래 안내의 명시적 기본값을 씁니다.

공개 API는 아래 검토된 안내와 각 네이티브 공개 선언이 정의합니다. [공유 이벤트·날짜 타입](/sources/packages/contracts/src/types.ts.txt).

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 네이티브 JSX/콘텐츠 prop을 씁니다. Svelte는 네이티브 snippet을 씁니다. Vue는 네이티브 슬롯을 씁니다. Angular는 네이티브 input, output, 콘텐츠 투영을 씁니다. Lit은 custom element 속성, 슬롯, DOM 이벤트를 씁니다. Qwik은 네이티브 QRL 이벤트 경계를 씁니다. 이 전달 방식은 서로 바꿔 쓸 수 없습니다. 정확한 이름과 필수 콘텐츠는 링크된 공개 패키지 선언에서 확인합니다. 아래 의미 콜백이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 공식 요구사항 {#official-requirements}

KRDS는 다음을 요구합니다.

- 키보드 접근과 보이는 초점.
- 색에 의존하지 않는 선택 상태 표시.
- 노출된 선택 상태.
- tablist/tab/tabpanel의 프로그램적 관계.

상호작용 표는 모든 탭을 Tab/Shift+Tab으로 이동할 수 있고, Click/Enter가 초점이 있는 탭을 선택한다고 규정합니다. 이 순차 키보드 접근을 유지합니다. 백엔드 기본값인 roving-tabindex를 그대로 물려받지 않습니다.

### 프로젝트 API와 기본값 {#project-api-and-defaults}

옵션:

- 순서가 있는 `items`. 각 항목은 비어 있지 않은 고유 문자열 `value`, 보이는 레이블, 패널 콘텐츠, 선택적 disabled 플래그를 가집니다.
- `value?: string`, `defaultValue?: string`.
- `activationMode: 'manual' | 'automatic'` (manual).
- `orientation: 'horizontal' | 'vertical'` (horizontal).
- `onValueChange(ValueChangeDetails<string>)`.
- 보이는 tablist 레이블 또는 aria-label/aria-labelledby (필수).
- 안정적인 인스턴스/항목 ID.

콘텐츠는 로컬입니다. 어댑터는 각자의 네이티브 슬롯/children을 사용합니다. 탐색 URL이나 비동기 로드 계약은 암시하지 않습니다. 모든 패널은 마운트된 채로 두어 선택이 바뀌어도 로컬 상태가 유지됩니다. 비활성 패널은 hidden이며 탭 순서와 접근성 트리에서 빠집니다.

기본 선택은 defaultValue이고, 없으면 첫 번째 활성 항목입니다. 비었거나 모두 disabled인 목록은 선택(`''`)도 활성 패널도 없습니다. 선택 값은 활성 항목을 가리켜야 합니다. 활성 항목이 없을 때의 `''`만 예외입니다. 따라서 활성 항목이 하나라도 있으면 선택된 패널이 정확히 하나 있습니다. 잘못된 선택을 담은 prop 갱신은 구성 오류입니다. 다른 항목을 몰래 선택하는 자동 복구는 없습니다.

### 초점과 활성화 정책 {#focus-and-activation-policy}

모든 활성 탭은 tabindex=0입니다. disabled 탭은 네이티브 disabled/tabindex=-1입니다. Tab/Shift+Tab으로 모든 활성 탭을 DOM 순서대로 순차 방문할 수 있습니다. manual 모드에서는 초점이 선택을 뜻하지 않습니다. 패널은 읽기 순서에서 tablist 뒤에 옵니다. 활성 패널은 첫 자식이 초점을 받을 수 없을 때만 tabindex=0입니다. 그렇지 않으면 일반 초점이 첫 초점 가능 콘텐츠에 닿습니다. 숨은 패널은 초점을 받지 않습니다.

다른 활성 탭의 Click 또는 Enter/Space는 정확히 한 번 선택합니다. Enter/Space는 네이티브 버튼 click 디스패치가 처리합니다. keydown에서 선택을 또 보내지 않습니다.

manual 모드: 화살표/Home/End는 초점만 옮기고, Enter/Space가 확정합니다.

automatic 모드는 즉시 쓸 수 있는 로컬 패널을 위한 명시적 옵트인입니다. 다른 활성 탭으로 초점이 이동하면 정확히 한 번 선택을 요청합니다. Tab과 프로그램적 초점도 포함합니다. 같은 초점/선택에 이어지는 click은 두 번 발생시키지 않습니다. 제어 부모가 거부하면 원래 선택된 패널을 유지하고, 초점은 요청된 탭에 남을 수 있습니다. 같은 활성화 제스처에서 짝지어진 focus/click 중복만 억제하고, 이후의 의도적 제스처는 억제하지 않습니다.

수평 모드는 Left/Right, 수직 모드는 Up/Down으로 이전/다음 활성 탭으로 이동합니다. 끝에서는 순환하고 disabled 항목은 건너뜁니다. Home/End는 첫/마지막 활성 탭에 초점을 둡니다. 처리한 탐색 키만 소비하며, 직교 화살표는 일반 스크롤을 유지합니다. 화살표는 KRDS 순차 접근에 더해지는 것이며 대체가 아닙니다.

선택이나 키보드 탐색은 URL을 바꾸지 않고, 폼을 제출하지 않으며, 초점을 패널로 옮기지 않습니다. 외부 선택 변경은 초점을 빼앗거나 콜백을 내지 않고 올바른 패널을 렌더링합니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

지원하는 케이스 축: `manual`, `automatic`, `horizontal`, `vertical`. 이 케이스 이름은 프로젝트의 독립 축입니다. 공식 KRDS 유형 이름이나 완료된 커버리지를 뜻하지 않습니다.

[필수 네이티브 스토리 매니페스트](/sources/catalog/full-catalog-stories.json.txt) · [파일럿 스토리 매니페스트](/sources/catalog/story-cases.json.txt) · [커버리지 근거와 네이티브 리뷰 링크](/sources/catalog/coverage.json.txt)

### 로컬 네이티브 스토리 {#local-native-stories}

픽스처와 Storybook 출력은 로컬 전용입니다. 이 공개 문서 사이트에 올리지 않습니다. 로컬 문서 서버도 그쪽으로 리디렉션하지 않습니다. 각 네이티브 Storybook은 자기 워크스페이스 스크립트로 실행합니다. 컴포넌트 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/` 아래에 조립된 네이티브 미리보기입니다. Solid 2에는 지원되는 네이티브 Storybook 통합이 없습니다. Qwik 프로덕션 SSR/resume에는 실제 서버가 필요합니다. 정적 미리보기로 대신할 수 없습니다. 스토리가 있다고 동작 인수가 성립하지는 않습니다.

네이티브 컴파일러 체크포인트입니다. 소스 해시는 문서를 빌드할 때마다 검증합니다. 이 기록은 최신 네이티브 후보나 동작 인수를 인증하지 않습니다. 검사된 소스 페이지마다 체크포인트 범위가 적혀 있습니다.

- react: [검사된 소비 코드 보기](/examples/react-1); [소스 그대로 내려받기](/sources/packages/react/examples/catalog.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [검사된 소비 코드 보기](/examples/solid-2); [소스 그대로 내려받기](/sources/apps/fixture-solid/src/examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [검사된 소비 코드 보기](/examples/svelte-23); [소스 그대로 내려받기](/sources/apps/fixture-svelte/src/public-examples/TabsExample.svelte.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [검사된 소비 코드 보기](/examples/vue-59); [소스 그대로 내려받기](/sources/apps/fixture-vue/src/ConsumerExample.vue.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [검사된 소비 코드 보기](/examples/lit-60); [소스 그대로 내려받기](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [검사된 소비 코드 보기](/examples/qwik-61); [소스 그대로 내려받기](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [검사된 소비 코드 보기](/examples/angular-62); [소스 그대로 내려받기](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## 출처와 권리 {#source-identity-and-rights}

기준선: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. 공식 상세 스냅숏 수집 시각: `2026-10-29T23:28:03.905Z`. SHA-256: `ee99fe206d12a4500498b5370a68d246a4572a773a295e4ef1240464af0ffc03`. [고정된 컴포넌트 출처 기록](/sources/catalog/components.json.txt) · [공식 출처](https://www.krds.go.kr/html/site/component/component_04_10.html). 원본 HTML은 체크아웃의 참고 근거로만 남습니다. 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/index.md)를 읽어야 합니다.
