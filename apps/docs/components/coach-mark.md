---
title: '코치마크 · Coach mark'
---

# 코치마크 {#coach-mark}

Coach mark · `CoachMark` · composition

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_08_04.html) · [검토된 전체 명세](/sources/specs/components/coach-mark.md.txt) · [프레임워크 지원](../compatibility/)

## 네이티브 지원 현황 {#native-availability}

아래 상태는 `catalog/coverage.json`에서 그대로 가져옵니다. export, 예제, 테스트 실행기 종료 코드에서 추론하지 않습니다.

| 프레임워크 | 패키지 버전 | 기록된 상태 | export 선언 | 네이티브 예제와 스토리 |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/react/package.json.txt); [과거 선언 체크포인트](/sources/packages/react/dist/components/coach-mark/index.d.ts.txt) | [react 소스와 미리보기 정책](../compatibility/examples#react) |
| solid | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/solid/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid/dist/components/coach-mark/index.d.ts.txt) | [solid 소스와 미리보기 정책](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/svelte/package.json.txt); [과거 선언 체크포인트](/sources/packages/svelte/dist/components/CoachMark.svelte.d.ts.txt) | [svelte 소스와 미리보기 정책](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/vue/package.json.txt); [과거 선언 체크포인트](/sources/packages/vue/dist/components/coach-mark/CoachMark.vue.d.ts.txt) | [vue 소스와 미리보기 정책](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/lit/package.json.txt); [과거 선언 체크포인트](/sources/packages/lit/dist/components/coach-mark/index.d.ts.txt) | [lit 소스와 미리보기 정책](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/qwik/package.json.txt); [과거 선언 체크포인트](/sources/packages/qwik/dist/components/coach-mark/index.d.ts.txt) | [qwik 소스와 미리보기 정책](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/angular/package.json.txt); [과거 선언 체크포인트](/sources/packages/angular/dist/types/unofficial-krds-angular-coach-mark.d.ts.txt) | [angular 소스와 미리보기 정책](../compatibility/examples#angular) |
| solid-next (미리보기) | `0.1.0-preview.0` | planned | [현재 루트 매니페스트](/sources/packages/solid-next/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next 소스와 미리보기 정책](../compatibility/examples#solid-next) |

## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}

아래 의미 계약은 공유 데이터일 뿐입니다. 네이티브 콘텐츠, ref, 이벤트 전달은 각 어댑터가 맡습니다. 계약의 콜백 이름과 detail 타입은 그대로 씁니다. 머신 객체를 전달하지 않습니다. 선택 속성에는 기본값이 자동으로 채워지지 않습니다. 아래 안내의 명시적 기본값을 씁니다.

```ts
export interface CoachMarkContract extends ControlledOpen {
    onTargetAction?: (detail: CoachMarkTargetActionDetails) => boolean | Promise<boolean>;
    steps: readonly CoachMarkStep[];
    boundaries: readonly CoachMarkBoundary[];
    stepId?: string;
    defaultStepId?: string;
    onStepChange?: (detail: {
        id: string;
        reason: 'previous' | 'next' | 'target-action';
    }) => void;
    onStop?: (detail: TutorialStopDetails) => void;
    startActionId: string;
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

export interface CoachMarkTargetActionDetails {
    stepId: string;
    targetId: string;
}

export interface CoachMarkStep {
    id: string;
    targetId: string;
    title: string;
    instruction: string;
    requiresAction?: boolean;
}

/** The host registers a native insertion location immediately after the real target. */
export interface CoachMarkBoundary {
    targetId: string;
    insertionBoundaryId: string;
}

export interface TutorialStopDetails {
    reason: 'stop' | 'finish' | 'target-removed' | 'route-change';
    running: false;
    returnTo: {
        panel: 'tutorial';
        open: true;
        startActionId: string;
    };
}
```

| 의미 속성 / 콜백 | 필수 | 정확한 타입 | 역할 |
| --- | --- | --- | --- |
| `open` | 아니요 | `boolean` | 데이터 / 상태 |
| `defaultOpen` | 아니요 | `boolean` | 데이터 / 상태 |
| `onOpenChange` | 아니요 | `(detail: OpenChangeDetails) => void` | 의미 이벤트 요청 |
| `onTargetAction` | 아니요 | `(detail: CoachMarkTargetActionDetails) => boolean \| Promise<boolean>` | 의미 이벤트 요청 |
| `steps` | 예 | `readonly CoachMarkStep[]` | 데이터 / 상태 |
| `boundaries` | 예 | `readonly CoachMarkBoundary[]` | 데이터 / 상태 |
| `stepId` | 아니요 | `string` | 데이터 / 상태 |
| `defaultStepId` | 아니요 | `string` | 데이터 / 상태 |
| `onStepChange` | 아니요 | `(detail: {id: string; reason: 'previous' \| 'next' \| 'target-action'}) => void` | 의미 이벤트 요청 |
| `onStop` | 아니요 | `(detail: TutorialStopDetails) => void` | 의미 이벤트 요청 |
| `startActionId` | 예 | `string` | 데이터 / 상태 |
| `fallbackFocusId` | 아니요 | `string` | 데이터 / 상태 |

선택 값과 명시적 기본값은 다릅니다. 기본값과 네이티브 콘텐츠 요구사항은 아래 검토된 안내에 있습니다.

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 네이티브 JSX/콘텐츠 prop을 씁니다. Svelte는 네이티브 snippet을 씁니다. Vue는 네이티브 슬롯을 씁니다. Angular는 네이티브 input, output, 콘텐츠 투영을 씁니다. Lit은 custom element 속성, 슬롯, DOM 이벤트를 씁니다. Qwik은 네이티브 QRL 이벤트 경계를 씁니다. 이 전달 방식은 서로 바꿔 쓸 수 없습니다. 정확한 이름과 필수 콘텐츠는 링크된 공개 패키지 선언에서 확인합니다. 아래 의미 콜백이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

**실제 관련 대상/컨트롤** 바로 다음에 현재 코치 팝오버가 논리적 DOM/접근성 순서로 옵니다([공식 L1123–1124](https://www.krds.go.kr/html/site/component/component_08_04.html)). 스포트라이트는 대상 주변의 aria-hidden 시각 장식일 뿐입니다. 원격 오버레이/스포트라이트 뒤에 팝오버가 오는 것은 대상→안내 순서를 충족하지 못합니다. 실제 대상과 같은 관련 DOM/접근성 루트의 인접 삽입 경계를 함께 등록하고, 팝오버를 그곳에 네이티브로 렌더합니다. 이 순서를 만들려고 살아 있는 대상이나 폼 입력을 이동·교체·복제·부모 변경하지 않습니다. Portal은 등록된 인접 동일 루트 경계로만 허용되며 순서가 증명되어야 합니다. 장식용 body 수준 Portal은 충분하지 않습니다.

팝오버에는 단계/제목, 간결한 안내, 현재/전체, 동작 행(중단(Stop), 이전(Previous), 다음(Next))이 있습니다. 첫 단계에는 이전이 없고, 마지막 단계의 다음은 완료(Finish)가 되며, 단일 단계는 확인(Confirm)이 됩니다. 한 번에 보이는 코치는 하나입니다. 제목은 가급적 한 줄, 안내는 3 이하이며, 페이지당 4개 이하를 권장하고 최대 15단계입니다. 동작 요구 단계 내내 네이티브 대상 조작, 레이블 관계, 값, 초점/캐럿, IME가 온전해야 합니다.

### 의미 API {#plain-semantic-api}

독립 API: steps {id,targetId,title,instruction,requiresAction?}[], 등록된 인접 팝오버 삽입 경계, open/defaultOpen=false, stepId/defaultStepId, onStepChange({id,reason}), onOpenChange, `startActionId`, `fallbackFocusId?`, TutorialPanel과 연결되면 `onStop({reason,running:false,returnTo:{panel:"tutorial",open:true,startActionId}})`. 등록 계약은 일반 ID와 관계를 전달하며, 각 어댑터는 다른 렌더러 래퍼 없이 자체 네이티브 삽입 방식을 제공합니다. requiresAction 단계에는 onTargetAction({stepId,targetId}): boolean|Promise&lt;boolean>을 제공해야 합니다. 이는 해당 실제 등록 대상의 동작이 실행된 뒤에만, 일반 ID와 네이티브 Event 없이 호출됩니다. 네이티브 호스트 클로저가 실제 커밋된 애플리케이션 상태를 검증하며, true만 다음 단계 요청 하나를 승인합니다. false, 거부, 부재는 진행시키지 않습니다. 검증자가 없는 requiresAction 구성은 잘못이며 TypeError입니다. 합성 스포트라이트 클릭이 아니라 네이티브 대상 핸들러/커밋 뒤에 호출합니다. 검증이 보류 중이면 같은 단계의 중복 활성화를 합칩니다. 실제 open/단계/대상 세대에 묶으며, 닫기·단계 변경·라우트 변경·대상 제거·언마운트는 보류 중인 결과를 무효화합니다. 오래된 true는 진행시키거나 초점을 복원하지 않습니다. 제어에서 거절된 진행은 현재 단계를 유지하며, 이후 별개의 실제 동작이 다시 요청할 수 있습니다. 마운트, prop, 초점은 검증자를 호출하지 않습니다. 이는 공식 실제 동작 결과를 보존하는 독립적이고 구체적인 호스트 검증 API입니다.

제어/기본값 및 모드 전환 금지 규칙은 [파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 연결 모드에서는 튜토리얼 조정자가 커밋된 running/단계/대상 상태에서 CoachMark 표시를 도출하며, 합동 onStop 요청이 유일한 중단 트랜잭션 이벤트입니다. 독립 CoachMark의 중단은 단일 소유자를 통해 실제 open=false를 요청하며, 거부되면 열린 채로 남고 초점을 복원하지 않습니다. 마운트·prop·초점·정리는 합성 사용자 변경 이벤트를 내지 않습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

사용자가 요청한 경우에만 시작하며 페이지 로드 시 자동 실행하지 않습니다. Tab은 필수 대상 동작을 막지 않고 실제 대상과 현재 팝오버 컨트롤을 실제 읽는 순서로 순회합니다. 독립 진입 정책은 수락된 단계 변경 시 팝오버 제목에 초점을 둡니다. Escape는 중단을 요청하되, 조합 중이거나 내부 위젯이 이미 처리했으면 요청하지 않습니다. 화면 밖의 기존 대상은 스크롤해 보이게 할 수 있습니다. 대상이 없으면 보이는 복구/중단 수단과 함께 표시를 보류하며, 꾸며 낸 대상 좌표나 대체 컨트롤을 만들지 않습니다.

**TutorialPanel/CoachMark 합동 중단 트랜잭션(공식 선호 목적지를 보존하는 독립 조정 정책):** 연결된 CoachMark의 보이는/열린 상태는 두 번째 독립 닫기 소유자가 아니라 튜토리얼 조정자가 커밋된 running/작업/대상 상태에서 도출합니다. 중단은 그 소유자에게 `onStop({reason,running:false,returnTo:{panel:"tutorial",open:true,startActionId}})` 트랜잭션 요청 하나를 냅니다. 같은 중단에 중복 CoachMark onOpenChange를 내지 않습니다. 비제어 조정자는 동기적으로 커밋합니다. 제어 소유권에서는 running=false가 실제로 수락되고 코치 표시가 실제로 닫히거나 제거됐을 때만 튜토리얼이 끝납니다. 수락 전에는 실행 중 UI와 현재 초점을 유지하고 복원하지 않습니다. 소유자는 수락된 튜토리얼 탭/패널 노출을 그 중단 트랜잭션과 함께 커밋해야 합니다. 일부만 수락된 노출은 타이머로 추측하지 않고, 결과로 커밋된 탭/open 상태에 명시됩니다.

이 요청은 튜토리얼 탭 선택, 패널 열기/노출, 선호 startActionId 렌더/활성화를 요구합니다. 실제 중단·닫힘 전이와 네이티브 패널 렌더 완료 뒤, **단일 중단 복원 조정자가 먼저 실제 최상위 활성 모달을 확인**합니다. 호스트가 튜토리얼 탭 요청을 거부한 뒤에도 선택이 남은 좁은 화면의 도움말 모달도 포함합니다. 초점 후보는 마운트되고, 보이고, 활성이며, 초점 가능하고, inert가 아니어야 합니다. 모달이 아직 활성이면 추가로 그 실제 최상위 모달 안에 있어야 합니다. startActionId가 이 규칙 아래 실제로 쓸 수 있으면 우선합니다. 닫힌 모달, 숨은 탭, 거부된 패널 열림 상태, 활성 모달 경계, 오래된 대상을 통해 초점을 보내지 않습니다.

선호 시작 노출이 거절됐거나 시작 동작이 제거·사용 불가이고 **모달이 실제로 열린 채 남아 있으면**, 그 모달 안에서 쓸 수 있는 fallbackFocusId를, 없으면 논리적 DOM 순서의 첫 번째 쓸 수 있는 내부 상호작용 대상을, 없으면 모달 자신의 초점 가능 컨테이너(이전 값을 보존한 tabindex=-1)를 선택합니다. 그 트랩이 활성인 동안 바깥 패널 여는 컨트롤, 저장된 바깥 시작 컨트롤/조상, 문서 body는 이름 있는 대체가 없어도 후보가 아닙니다. 바깥 대상을 만들어 내려고 격리를 제거하거나, 트랩을 끄거나, 제어 탭/open prop을 강제하거나, 두 번째 비공개 복원 소유자를 호출하지 않습니다. 초점 전에 후보/컨테이너가 제거되면 오래된 바깥 대체를 쓰지 않고 실제 커밋된 최상위 모달을 다시 확인합니다.

커밋된 정리 뒤 **모달이 실제로 활성인 채 남아 있지 않을 때만** 대체는 다음 순서로 씁니다. 쓸 수 있는 지속 튜토리얼 패널 여는 컨트롤, 제공된 fallbackFocusId, 쓸 수 있는 저장된 시작 컨트롤/가장 가까운 쓸 수 있는 조상, 마지막으로 나중에 복원되는 임시 tabindex=-1을 둔 라이브 문서 body입니다. 요청됐지만 거부된 모달 닫기는 해당하지 않습니다. 바깥 초점은 실제로 수락된 닫기와 정리를 기다려야 합니다. 이 모달 인식 확인은 다른 모달이 활성인 채 남은 경우의 라우트 제거/해체에도 적용됩니다. running=false/open=true인 구체적 수락 중단 상태에서 도움말이 계속 선택되어 있고 튜토리얼 시작이 숨김·제거됐으며 바깥 컨트롤이 inert이면, 초점은 그 도움말 모달의 내부 대상/컨테이너에 남고 트랩과 격리도 유지됩니다.

같은 중단 조정자가 이 하나의 확인을 소유하고, 경쟁하는 초점 작업을 막기 위해 모달 셸 진입/복귀를 위임합니다. 공개 Modal의 returnFocusId 규칙은 바뀌지 않습니다. 거부된 중단은 복원을 하지 않습니다. 나중의 비동기 탭/open 변경이 이미 끝난 중단 복원을 재생해서는 안 됩니다. 이후 수락된 일반 모달 닫기는 기존의 단일 닫기/복원 소유자를 쓰며, 앞선 중단 대체를 재생하지 않습니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

투어 전체에서 팝업 너비를 일관되게 하고, 충돌을 인식해 화면 안에 머물면서 대상을 가리지 않습니다. 동작 줄이기는 스포트라이트 애니메이션과 부드러운 스크롤을 없앱니다. 대상 크기 조정/스크롤은 배치를 갱신하고, 닫으면 옵저버를 정리합니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

폼/리셋이 없습니다. 호스트가 검증한 이벤트만 실제 폼 작업을 진행시키며, 조합 중 입력은 완료로 치지 않습니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

독립 API: 조합 완료에는 실제 등록된 대상→팝오버 DOM/접근성 순서, 스포트라이트 기하, 순서가 있는 작업 상태, 합동 TutorialPanel 복귀가 포함됩니다. 호스트가 인접 네이티브 삽입 경계를 제공하고 대상을 조작 가능하게 유지하며, 라우트/작업 성공, 조정된 중단/노출 상태, 경쟁 레이어 억제를 소유합니다. 동작 요구 로컬 스토리는 값/레이블/IME 동작이 온전한 채 실제 네이티브 자식 폼 컨트롤을 조작한 뒤, 검증된 동작에서 눈에 보이게 진행해야 합니다. 분리된 오버레이만으로는 완료가 아닙니다. 삽입 경계나 대상이 없으면 구성 오류 또는 보류된 대상 결과이며, 컨트롤을 복제·이동할 허가가 아닙니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, spotlight, popover, title, instruction, position, actions, stop, previous, next; open,closed,current-step,waiting,missing-target.

렌더되는 모든 소유 파트는 `data-krds-component="coach-mark"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위 열거는 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정됩니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

지원하는 케이스 축: `single`, `multi-step`, `action-gated`. 이 케이스 이름은 프로젝트의 독립 축입니다. 공식 KRDS 유형 이름이나 완료된 커버리지를 뜻하지 않습니다.

[필수 네이티브 스토리 매니페스트](/sources/catalog/full-catalog-stories.json.txt) · [파일럿 스토리 매니페스트](/sources/catalog/story-cases.json.txt) · [커버리지 근거와 네이티브 리뷰 링크](/sources/catalog/coverage.json.txt)

필수 전체 카탈로그 스토리: `krds-coach-mark--single`, `krds-coach-mark--multi-step`, `krds-coach-mark--action-gated`, `krds-coach-mark--offscreen-target`, `krds-coach-mark--missing-target`, `krds-coach-mark--route-change`, `krds-coach-mark--reduced-motion`, `krds-coach-mark--target-reading-order`, `krds-coach-mark--action-native-control`, `krds-coach-mark--stop-hidden-panel`, `krds-coach-mark--stop-help-tab`, `krds-coach-mark--stop-fallback-rejected`, `krds-coach-mark--stop-partial-narrow-help`.

### 로컬 네이티브 스토리 {#local-native-stories}

픽스처와 Storybook 출력은 로컬 전용입니다. 이 공개 문서 사이트에 올리지 않습니다. 로컬 문서 서버도 그쪽으로 리디렉션하지 않습니다. 각 네이티브 Storybook은 자기 워크스페이스 스크립트로 실행합니다. 컴포넌트 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/` 아래에 조립된 네이티브 미리보기입니다. Solid 2에는 지원되는 네이티브 Storybook 통합이 없습니다. Qwik 프로덕션 SSR/resume에는 실제 서버가 필요합니다. 정적 미리보기로 대신할 수 없습니다. 스토리가 있다고 동작 인수가 성립하지는 않습니다.

네이티브 컴파일러 체크포인트입니다. 소스 해시는 문서를 빌드할 때마다 검증합니다. 이 기록은 최신 네이티브 후보나 동작 인수를 인증하지 않습니다. 검사된 소스 페이지마다 체크포인트 범위가 적혀 있습니다.

- react: [검사된 소비 코드 보기](/examples/react-1); [소스 그대로 내려받기](/sources/packages/react/examples/catalog.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [검사된 소비 코드 보기](/examples/solid-3); [소스 그대로 내려받기](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [검사된 소비 코드 보기](/examples/svelte-40); [소스 그대로 내려받기](/sources/apps/fixture-svelte/src/public-examples/CoachMarkExample.svelte.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [검사된 소비 코드 보기](/examples/vue-58); [소스 그대로 내려받기](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [검사된 소비 코드 보기](/examples/lit-60); [소스 그대로 내려받기](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [검사된 소비 코드 보기](/examples/qwik-61); [소스 그대로 내려받기](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [검사된 소비 코드 보기](/examples/angular-62); [소스 그대로 내려받기](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## 출처와 권리 {#source-identity-and-rights}

기준선: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. 공식 상세 스냅숏 수집 시각: `2026-10-29T23:28:05.101Z`. SHA-256: `754efe232a5733c103dcdb25f572978409790aeae323ac1afc943eb497845b23`. [고정된 컴포넌트 출처 기록](/sources/catalog/components.json.txt) · [공식 출처](https://www.krds.go.kr/html/site/component/component_08_04.html). 원본 HTML은 체크아웃의 참고 근거로만 남습니다. 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
