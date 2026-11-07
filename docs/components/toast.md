---
title: '토스트 · Toast'
---

# 토스트 {#toast}

Toast · `Toast` · component

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_12_05.html) · [검토된 전체 명세](/sources/specs/components/toast.md.txt) · [프레임워크 지원](../compatibility/README.md)

## 네이티브 지원 현황 {#native-availability}

아래 상태는 `catalog/coverage.json`에서 그대로 가져옵니다. export, 예제, 테스트 실행기 종료 코드에서 추론하지 않습니다.

| 프레임워크 | 패키지 버전 | 기록된 상태 | export 선언 | 네이티브 예제와 스토리 |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/react/package.json.txt); [과거 선언 체크포인트](/sources/packages/react/dist/components/toast/index.d.ts.txt) | [react 소스와 미리보기 정책](../compatibility/README.mdexamples#react) |
| solid | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/solid/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid/dist/components/toast/index.d.ts.txt) | [solid 소스와 미리보기 정책](../compatibility/README.mdexamples#solid) |
| svelte | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/svelte/package.json.txt); [과거 선언 체크포인트](/sources/packages/svelte/dist/components/Toast.svelte.d.ts.txt) | [svelte 소스와 미리보기 정책](../compatibility/README.mdexamples#svelte) |
| vue | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/vue/package.json.txt); [과거 선언 체크포인트](/sources/packages/vue/dist/components/toast/Toast.vue.d.ts.txt) | [vue 소스와 미리보기 정책](../compatibility/README.mdexamples#vue) |
| lit | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/lit/package.json.txt); [과거 선언 체크포인트](/sources/packages/lit/dist/components/toast/index.d.ts.txt) | [lit 소스와 미리보기 정책](../compatibility/README.mdexamples#lit) |
| qwik | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/qwik/package.json.txt); [과거 선언 체크포인트](/sources/packages/qwik/dist/components/toast/index.d.ts.txt) | [qwik 소스와 미리보기 정책](../compatibility/README.mdexamples#qwik) |
| angular | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/angular/package.json.txt); [과거 선언 체크포인트](/sources/packages/angular/dist/types/unofficial-krds-angular-toast.d.ts.txt) | [angular 소스와 미리보기 정책](../compatibility/README.mdexamples#angular) |
| solid-next (미리보기) | `0.1.0-preview.0` | planned | [현재 루트 매니페스트](/sources/packages/solid-next/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next 소스와 미리보기 정책](../compatibility/README.mdexamples#solid-next) |

## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}

아래 의미 계약은 공유 데이터일 뿐입니다. 네이티브 콘텐츠, ref, 이벤트 전달은 각 어댑터가 맡습니다. 계약의 콜백 이름과 detail 타입은 그대로 씁니다. 머신 객체를 전달하지 않습니다. 선택 속성에는 기본값이 자동으로 채워지지 않습니다. 아래 안내의 명시적 기본값을 씁니다.

```ts
export interface ToastContract {
    message: ToastMessage | null;
    durationMs?: number;
    onDismiss: (detail: {
        id: string;
        reason: 'timeout';
        generation: number;
    }) => void;
}

export interface ToastMessage {
    id: string;
    text: string;
    tone: 'information' | 'warning';
    persistentResultId: string;
}
```

| 의미 속성 / 콜백 | 필수 | 정확한 타입 | 역할 |
| --- | --- | --- | --- |
| `message` | 예 | `ToastMessage \| null` | 데이터 / 상태 |
| `durationMs` | 아니요 | `number` | 데이터 / 상태 |
| `onDismiss` | 예 | `(detail: {id: string; reason: 'timeout'; generation: number}) => void` | 의미 이벤트 요청 |

선택 값과 명시적 기본값은 다릅니다. 기본값과 네이티브 콘텐츠 요구사항은 아래 검토된 안내에 있습니다.

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 네이티브 JSX/콘텐츠 prop을 씁니다. Svelte는 네이티브 snippet을 씁니다. Vue는 네이티브 슬롯을 씁니다. Angular는 네이티브 input, output, 콘텐츠 투영을 씁니다. Lit은 custom element 속성, 슬롯, DOM 이벤트를 씁니다. Qwik은 네이티브 QRL 이벤트 경계를 씁니다. 이 전달 방식은 서로 바꿔 쓸 수 없습니다. 정확한 이름과 필수 콘텐츠는 링크된 공개 패키지 선언에서 확인합니다. 아래 의미 콜백이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

간결한 한 문장을 담은 일시적 비대화형 컨테이너입니다. 페이지 위 하단 중앙에 두고 TabBar/FAB와 겹치지 않게 합니다. 액션 버튼은 없으며, 조치가 필요한 콘텐츠는 Snackbar를 씁니다. 긴급/치명적 알림이나 개별 필드 오류에는 쓰지 않습니다.

### 의미 API {#plain-semantic-api}

**호스트가 소유하는 현재 메시지와 큐** API를 택합니다. 필수 `message:{id:string,text:string,tone:information|warning,persistentResultId:string}|null`이며 초기값은 null입니다. durationMs 기본값은 information 3000, warning 4000입니다. `onDismiss({id,reason:"timeout",generation})`은 호스트 콘텐츠가 제거되었다는 알림이 아니라 해제 **요청**입니다. defaultMessage, 내부 큐, enqueue/store 객체는 없습니다. 결과의 정확성, 현재 메시지, 순서, 큐 진행은 호스트가 소유하며, 호스트는 더 긴 양수 duration을 설정할 수 있습니다. role=status/aria-live=polite는 독립 네이티브 정책입니다. 토스트는 비대화형으로 남으며 초점 목적지가 되지 않습니다.

**충분한 노출/재조회는 필수 완료 조건**이며, 짧은 기본 타이머를 맞추는 것만으로는 부족합니다([공식 L946–949](https://www.krds.go.kr/html/site/component/component_12_05.html)). 이 프로젝트의 구체적 대응은 persistentResultId가, 일시적 토스트 바깥의 찾을 수 있는 접근 가능한 **지속 결과/상태 또는 이력**에서 같은 결과 텍스트를 가리키도록 하는 것입니다. 이는 일반 읽기/탐색 순서에 있어야 하며, 호스트/사용자가 의도적으로 지우거나 해당 화면을 떠날 때까지 남아 있습니다. 느리게 읽는 사용자나 알림이 지연된 사용자가 토스트가 사라진 뒤에도 결과를 다시 얻을 수 있도록, 픽스처에 이 실제 로컬 지속 결과가 있어야 합니다. 이력/로그 방식은 독립 프로젝트 정책이며 KRDS가 정확히 그 UI를 규정한다는 주장이 아닙니다. 충분한 노출/재조회가 없으면 완료를 통과할 수 없습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

초점을 빼앗지 않으며 액션/닫기 컨트롤을 추가하지 않습니다. 호스트가 선택했으므로 메시지 ID가 바뀌면 보이는 메시지를 즉시 교체합니다. 컴포넌트는 이전/현재 스냅샷을 큐에 넣지 않습니다. message=null이면 제거합니다. 교체나 prop 제거는 onDismiss를 내지 않고 내부적으로 큐를 진행하지 않습니다.

새 ID마다, 그리고 같은 ID의 의미 있는 text/tone/유효 duration 수정마다 단조 증가하는 내부 generation을 유지합니다. 같은 ID에서 text가 바뀌면 현재 토스트를 갱신하고, 바뀐 텍스트를 한 번 알리며, 처음부터 전체 노출을 다시 시작합니다. 같은 ID에서 tone/duration만 바뀌면 외형/수명만 갱신하고 같은 텍스트를 다시 알리지 않습니다. 같은 ID의 동일한 내용이나 콜백/객체 동일성 변화만으로는 다시 알리거나 재시작하지 않습니다. message=null 뒤에 같은 ID를 다시 쓰면 새로운 가시 generation입니다. 요청은 해당 ID와 generation을 담으며, 콜백에 렌더러 객체는 없습니다.

전체 카운트다운은 해당 generation이 실제로 렌더링된 뒤에 시작합니다. 문서가 숨겨진 동안은 남은 시간을 멈추고, 보이면 남은 시간을 이어 갑니다. 교체, 제거, 의미 있는 수정, 언마운트는 이전 generation의 타이머/리스너를 취소합니다. 오래된 콜백은 무언가를 요청하기 전에 현재 generation을 확인해야 합니다. 타임아웃은 해당 generation에 대해 해제 요청을 정확히 한 번 내보낸 뒤 그 타이머를 소비합니다. 제어 호스트가 메시지를 유지하면 계속 보입니다. 로컬 숨김, 큐 진행, 타임아웃 반복 루프, 거짓 “실제 해제” 콜백은 없습니다. 의미 있는 새 generation은 새 타이머를 시작할 수 있습니다. 초점, prop 갱신, 마운트, 리셋은 사용자 변경/해제 이벤트를 만들어 내지 않습니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

하단 안전 영역/내비게이션/FAB와 겹치지 않게 합니다. 번역 텍스트나 확대 텍스트에 필요할 때만 줄 바꿈하고, 잘림보다 읽을 수 있는 메시지를 우선합니다. 움직임은 필수가 아니며 동작 줄이기에서는 슬라이드 없이 나타나고 사라집니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

폼/리셋/IME 동작은 없습니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

큐/현재 메시지 prop, 지속 결과/이력 대상, 결과의 진실성/복구는 호스트가 소유합니다. 완료 조건은 다음과 같습니다.

- 실제 지속 결과와 일시적 메시지를 모두 만드는 로컬 동작.
- 느리게 읽거나 알림이 지연된 경우의 재조회.
- 결정적인 타임아웃, 갱신, 교체, 거부된 해제, 정리 동작.

공식 information 2–3초/warning 3–4초 값은 충분한 노출 지침 안의 기본값이며 모든 사용자가 결과를 읽거나 들었다는 증거가 아닙니다. 시간은 맞지만 다시 얻을 수 없는 결과는 관문을 통과하지 못합니다. Toast를 Snackbar로 바꾸는 액션이나 닫기 버튼은 추가하지 않습니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, message; information,warning,open,closed.

렌더링되는 모든 소유 파트는 `data-krds-component="toast"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위의 파트/상태 어휘는 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

지원하는 케이스 축: `information`, `warning`. 이 케이스 이름은 프로젝트의 독립 축입니다. 공식 KRDS 유형 이름이나 완료된 커버리지를 뜻하지 않습니다.

[필수 네이티브 스토리 매니페스트](/sources/catalog/full-catalog-stories.json.txt) · [파일럿 스토리 매니페스트](/sources/catalog/story-cases.json.txt) · [커버리지 근거와 네이티브 리뷰 링크](/sources/catalog/coverage.json.txt)

필수 전체 카탈로그 스토리: `krds-toast--information`, `krds-toast--warning`, `krds-toast--duplicate`, `krds-toast--queued`, `krds-toast--timer-cleanup`, `krds-toast--narrow`, `krds-toast--reduced-motion`, `krds-toast--slow-reading-persistent-result`, `krds-toast--same-id-content-update`, `krds-toast--host-replacement-removal`, `krds-toast--timeout-rejected`, `krds-toast--generation-timer`.

### 로컬 네이티브 스토리 {#local-native-stories}

픽스처와 Storybook 출력은 로컬 전용입니다. 이 공개 문서 사이트에 올리지 않습니다. 로컬 문서 서버도 그쪽으로 리디렉션하지 않습니다. 각 네이티브 Storybook은 자기 워크스페이스 스크립트로 실행합니다. 컴포넌트 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/` 아래에 조립된 네이티브 미리보기입니다. Solid 2에는 지원되는 네이티브 Storybook 통합이 없습니다. Qwik 프로덕션 SSR/resume에는 실제 서버가 필요합니다. 정적 미리보기로 대신할 수 없습니다. 스토리가 있다고 동작 인수가 성립하지는 않습니다.

네이티브 컴파일러 체크포인트입니다. 소스 해시는 문서를 빌드할 때마다 검증합니다. 이 기록은 최신 네이티브 후보나 동작 인수를 인증하지 않습니다. 검사된 소스 페이지마다 체크포인트 범위가 적혀 있습니다.

- react: [검사된 소비 코드 보기](/examples/react-1); [소스 그대로 내려받기](/sources/packages/react/examples/catalog.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [검사된 소비 코드 보기](/examples/solid-3); [소스 그대로 내려받기](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [검사된 소비 코드 보기](/examples/svelte-55); [소스 그대로 내려받기](/sources/apps/fixture-svelte/src/public-examples/ToastExample.svelte.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [검사된 소비 코드 보기](/examples/vue-58); [소스 그대로 내려받기](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [검사된 소비 코드 보기](/examples/lit-60); [소스 그대로 내려받기](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [검사된 소비 코드 보기](/examples/qwik-61); [소스 그대로 내려받기](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [검사된 소비 코드 보기](/examples/angular-62); [소스 그대로 내려받기](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## 출처와 권리 {#source-identity-and-rights}

기준선: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. 공식 상세 스냅숏 수집 시각: `2026-10-29T23:28:06.180Z`. SHA-256: `407e2dc99ded84b9ceaeab40478d4a5c4d0125d96c968c05d2f309ae802fb9af`. [고정된 컴포넌트 출처 기록](/sources/catalog/components.json.txt) · [공식 출처](https://www.krds.go.kr/html/site/component/component_12_05.html). 원본 HTML은 체크아웃의 참고 근거로만 남습니다. 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/index.md)를 읽어야 합니다.
