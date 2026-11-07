---
title: '모달 · Modal'
---

# 모달 {#modal}

Modal · `Modal` · component

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_04_05.html) · [검토된 전체 명세](/sources/specs/components/modal.md.txt) · [프레임워크 지원](../compatibility/)

## 네이티브 지원 현황 {#native-availability}

아래 상태는 `catalog/coverage.json`에서 그대로 가져옵니다. export, 예제, 테스트 실행기 종료 코드에서 추론하지 않습니다.

| 프레임워크 | 패키지 버전 | 기록된 상태 | export 선언 | 네이티브 예제와 스토리 |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/react/package.json.txt); [과거 선언 체크포인트](/sources/packages/react/dist/components/modal/index.d.ts.txt) | [react 소스와 미리보기 정책](../compatibility/examples#react) |
| solid | `0.1.0` | implemented | [현재 하위 경로 매니페스트](/sources/packages/solid/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid/dist/components/modal/index.d.ts.txt) | [solid 소스와 미리보기 정책](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/svelte/package.json.txt); [과거 선언 체크포인트](/sources/packages/svelte/dist/components/Modal.svelte.d.ts.txt) | [svelte 소스와 미리보기 정책](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/vue/package.json.txt); [과거 선언 체크포인트](/sources/packages/vue/dist/components/modal/Modal.vue.d.ts.txt) | [vue 소스와 미리보기 정책](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/lit/package.json.txt); [과거 선언 체크포인트](/sources/packages/lit/dist/components/modal/index.d.ts.txt) | [lit 소스와 미리보기 정책](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/qwik/package.json.txt); [과거 선언 체크포인트](/sources/packages/qwik/dist/components/modal/index.d.ts.txt) | [qwik 소스와 미리보기 정책](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/angular/package.json.txt); [과거 선언 체크포인트](/sources/packages/angular/dist/types/unofficial-krds-angular-modal.d.ts.txt) | [angular 소스와 미리보기 정책](../compatibility/examples#angular) |
| solid-next (미리보기) | `0.1.0-preview.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/solid-next/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid-next/dist/components/modal/index.d.ts.txt) | [solid-next 소스와 미리보기 정책](../compatibility/examples#solid-next) |

## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}

아래 의미 계약은 공유 데이터일 뿐입니다. 네이티브 콘텐츠, ref, 이벤트 전달은 각 어댑터가 맡습니다. 계약의 콜백 이름과 detail 타입은 그대로 씁니다. 머신 객체를 전달하지 않습니다. 선택 속성에는 기본값이 자동으로 채워지지 않습니다. 아래 안내의 명시적 기본값을 씁니다.

공개 API는 아래 검토된 안내와 각 네이티브 공개 선언이 정의합니다. [공유 이벤트·날짜 타입](/sources/packages/contracts/src/types.ts.txt).

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 네이티브 JSX/콘텐츠 prop을 씁니다. Svelte는 네이티브 snippet을 씁니다. Vue는 네이티브 슬롯을 씁니다. Angular는 네이티브 input, output, 콘텐츠 투영을 씁니다. Lit은 custom element 속성, 슬롯, DOM 이벤트를 씁니다. Qwik은 네이티브 QRL 이벤트 경계를 씁니다. 이 전달 방식은 서로 바꿔 쓸 수 없습니다. 정확한 이름과 필수 콘텐츠는 링크된 공개 패키지 선언에서 확인합니다. 아래 의미 콜백이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 공식 요구사항 {#official-requirements}

KRDS는 다음을 요구합니다.

- 초기 초점은 대화상자 자체나 첫 번째 대화형 요소에 둡니다.
- 키보드와 스크린 리더 초점을 활성 모달 안에 가둡니다.
- 닫으면 열었던 컨트롤로 초점을 복원합니다.
- 읽기 순서를 논리적으로 유지합니다.

아이콘 닫기 버튼은 모달 마크업의 마지막 요소입니다. Tab/Shift+Tab은 모달 안에서 순환합니다. 닫기 버튼이 있으면 Escape로 닫습니다.

### 프로젝트 API와 기본값 {#project-api-and-defaults}

옵션: `open?: boolean`, `defaultOpen?: boolean`(false), `onOpenChange(OpenChangeDetails)`, `closeOnOutsideClick: boolean`(false), `showCloseButton: boolean`(true), `initialFocusId?: string`, `returnFocusId?: string`, 필수 제목 콘텐츠/ID, 선택적 설명 콘텐츠/ID, 본문 및 동작 콘텐츠.

`showCloseButton=false`이면 본문/푸터에 활성화된 명시적 닫기/취소 동작이 필요합니다. `showCloseButton`은 아이콘 닫기 버튼만 제어하며 Escape 허용 여부는 제어하지 않습니다. 파일럿에서는 닿을 수 있는 닫기 동작이 없는 모달을 허용하지 않습니다. 닫기 버튼이 있으면 독립적인 Escape 해제 옵션도 없습니다.

`role=dialog`, `aria-modal=true`, 보이는 제목을 가리키는 `aria-labelledby`를 렌더링합니다. 설명은 선택 사항이며 있을 때만 참조합니다. 구조화된 본문 전체를 평면 설명으로 안내하지 않습니다. 순서는 제목, 선택적 설명, 본문, 동작, 마지막에 아이콘 닫기 버튼입니다. 아이콘 닫기 버튼의 기본 이름은 번역된 `닫기`(영어는 `Close`)이거나 명시적 로컬 레이블입니다. 닫기 컨트롤은 `type=button`입니다. 작은 뷰포트에서도 대화상자 콘텐츠를 스크롤할 수 있어야 하며, 실제로 열려 있는 동안 배경 스크롤과 상호작용을 막습니다. 닫힌 콘텐츠는 hidden/inert이며 접근성 트리와 탭 트리에 없습니다.

### 닫기와 초점 정책 {#dismissal-and-focus-policy}

실제 false→true 전환 때 여는 요소/활성 요소를 저장합니다. `initialFocusId`를 주면 대화상자 컨테이너 자체나, 대화상자의 논리적 DOM 순서에서 첫 번째로 활성화되고 보이며 초점을 받을 수 있는 대화형 요소만 가리킬 수 있습니다. 그 밖의 대상(뒤쪽 동작, 앞에 다른 대화형 요소가 있는 마지막 닫기 버튼 포함)은 설정 오류입니다. 주지 않으면 `tabindex=-1`인 대화상자 컨테이너에 초점을 둡니다. 명시적으로 대상으로 지정해도 대화상자 컨테이너는 `tabindex=-1`을 씁니다. 후자가 의도된 기본값이며, 동작보다 제목과 콘텐츠 맥락이 먼저 오게 합니다. 활성 포털 밖에는 스크린 리더 접근을 포함한 inert/배경 격리를 적용하고, 기존 inert/스크롤 상태를 보존했다가 복원합니다. Tab과 Shift+Tab은 활성화되고 보이는 초점 가능 요소를 순환하며, 남은 것이 없으면 대화상자에 초점을 유지합니다. 중첩 모달에서는 최상위 모달만 초점을 가두고 닫기를 처리합니다. 자식이 닫힐 때까지 부모는 inert로 남습니다.

바깥 포인터 상호작용은 백드롭이 막으며 기본적으로 닫지 않습니다. `closeOnOutsideClick=true`이면 백드롭에서 시작해 백드롭에서 끝나는 기본 포인터 제스처만 닫습니다. 안쪽에서 시작한 드래그, 보조 클릭, 하위 요소 클릭은 닫지 않습니다. `{open:false}` 요청 하나를 내보냅니다. 이 옵션은 프로젝트 정책이며 KRDS 요구사항에서 추론한 것이 아닙니다.

Escape는 실제로 열려 있고, 최상위이며, 닫기 버튼(아이콘 닫기 버튼 또는 필수 명시적 닫기/취소 동작)이 있고, 내부 위젯이 아직 처리하지 않은 이벤트일 때 닫기를 요청합니다. 닫기 버튼을 유지한 채 이 닫기를 끄는 설정은 불가능합니다. IME 조합 중(`keyCode` 229 폴백 포함)에는 Escape를 무시합니다. 처리한 Escape만 소비합니다. 내부 select/popover는 먼저 자기 Escape를 받습니다. 명시적 닫기/취소, 트리거 열기, 허용된 바깥 닫기는 상태가 다를 때 각각 요청 하나를 내보냅니다. 이미 열린 대화상자의 열기 트리거는 요청을 내보내지 않습니다. 제어 모드에서 거부된 닫기는 초점 가둠, 배경 격리, UI를 열린 채로 둡니다. 부모의 false prop이 도착하기 전에는 초점을 복원하지 않습니다.

실제 true→false 때 격리를 제거하고, 저장한 여는 요소가 여전히 마운트되어 있고 보이며 활성화되고 초점을 받을 수 있으며 inert가 아니면 그곳으로 초점을 복원합니다. `returnFocusId`가 사용 가능한 여는 요소를 덮어쓰면 안 됩니다. 여는 요소가 없거나 쓸 수 없을 때만 주어진 `returnFocusId`가 보이고 활성화되며 초점을 받을 수 있고 inert가 아닌 대체 대상을 가리킬 수 있습니다. 그 대체 대상도 없거나 쓸 수 없으면 여는 요소의 남은 가장 가까운 사용 가능한 초점 가능 조상에 초점을 둡니다. 그것도 없으면 임시 `tabindex=-1`로 document body에 초점을 둡니다(이전 `tabindex`는 복원). 열린 대화상자를 언마운트해도 합성 사용자 변경 이벤트 없이 같은 정리와 복원을 합니다. 여는 동작 없이 처음부터 열린 대화상자에는 여는 요소가 없으므로, 사용 가능한 `returnFocusId`를 쓰고 없으면 body를 씁니다. prop 전환과 마운트는 open-change 콜백을 내보내지 않습니다.

### 폼·상태·인수 기준 {#form-states-and-acceptance}

값/name이나 폼 리셋 상태가 없습니다. Enter는 중첩 폼을 일반 제출 버튼을 통해서만 제출하며, 모든 Enter를 모달 확인으로 취급하지 않습니다. 동작 실패는 애플리케이션 콘텐츠입니다. 열린 채로 두고 보이는 오류를 안내하며, 암묵적 재시도나 닫기를 하지 않습니다. 열기/닫기 애니메이션은 이 논리 상태를 보존하고 동작 줄이기를 따라야 합니다.

파트: `root`, `trigger`, `backdrop`, `content`, `title`, `description`, `body`, `actions`, `close`. 루트/백드롭/콘텐츠 상태: `open` 또는 `closed`.

인수 기준:

- 제목 관계
- 마지막 닫기 마크업
- 대화상자/첫 대화형 요소로만 초점 진입
- 초점 가둠
- 사용 가능한 여는 요소로의 필수 복귀와 제거된 여는 요소의 폴백
- 백드롭 기본값과 옵트인 드래그 보호
- 닫기 버튼에 의한 필수 Escape와 최상위/처리됨/조합 중 안전장치
- 제어 모드의 거부된 닫기
- 언마운트 시 복원
- 중복 열림 알림 없음

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

지원하는 케이스 축: `default`, `scrolling`. 이 케이스 이름은 프로젝트의 독립 축입니다. 공식 KRDS 유형 이름이나 완료된 커버리지를 뜻하지 않습니다.

[필수 네이티브 스토리 매니페스트](/sources/catalog/full-catalog-stories.json.txt) · [파일럿 스토리 매니페스트](/sources/catalog/story-cases.json.txt) · [커버리지 근거와 네이티브 리뷰 링크](/sources/catalog/coverage.json.txt)

### 로컬 네이티브 스토리 {#local-native-stories}

픽스처와 Storybook 출력은 로컬 전용입니다. 이 공개 문서 사이트에 올리지 않습니다. 로컬 문서 서버도 그쪽으로 리디렉션하지 않습니다. 각 네이티브 Storybook은 자기 워크스페이스 스크립트로 실행합니다. 컴포넌트 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/` 아래에 조립된 네이티브 미리보기입니다. Solid 2에는 지원되는 네이티브 Storybook 통합이 없습니다. Qwik 프로덕션 SSR/resume에는 실제 서버가 필요합니다. 정적 미리보기로 대신할 수 없습니다. 스토리가 있다고 동작 인수가 성립하지는 않습니다.

네이티브 컴파일러 체크포인트입니다. 소스 해시는 문서를 빌드할 때마다 검증합니다. 이 기록은 최신 네이티브 후보나 동작 인수를 인증하지 않습니다. 검사된 소스 페이지마다 체크포인트 범위가 적혀 있습니다.

- react: [검사된 소비 코드 보기](/examples/react-1); [소스 그대로 내려받기](/sources/packages/react/examples/catalog.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [검사된 소비 코드 보기](/examples/solid-2); [소스 그대로 내려받기](/sources/apps/fixture-solid/src/examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [검사된 소비 코드 보기](/examples/svelte-18); [소스 그대로 내려받기](/sources/apps/fixture-svelte/src/public-examples/ModalExample.svelte.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [검사된 소비 코드 보기](/examples/vue-59); [소스 그대로 내려받기](/sources/apps/fixture-vue/src/ConsumerExample.vue.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [검사된 소비 코드 보기](/examples/lit-60); [소스 그대로 내려받기](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [검사된 소비 코드 보기](/examples/qwik-61); [소스 그대로 내려받기](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [검사된 소비 코드 보기](/examples/angular-62); [소스 그대로 내려받기](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## 출처와 권리 {#source-identity-and-rights}

기준선: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. 공식 상세 스냅숏 수집 시각: `2026-10-29T23:28:03.556Z`. SHA-256: `333c5f77e93a67c408874b067e2b0717dc0a3ad890269be35671fe1601bd3fd9`. [고정된 컴포넌트 출처 기록](/sources/catalog/components.json.txt) · [공식 출처](https://www.krds.go.kr/html/site/component/component_04_05.html). 원본 HTML은 체크아웃의 참고 근거로만 남습니다. 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
