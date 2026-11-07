---
title: '따라하기 패널 · Tutorial panel'
---

# 따라하기 패널 {#tutorial-panel}

Tutorial panel · `TutorialPanel` · composition

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_08_02.html) · [검토된 전체 명세](/sources/specs/components/tutorial-panel.md.txt) · [프레임워크 지원](../compatibility/README.md)

## 네이티브 지원 현황 {#native-availability}

아래 상태는 `catalog/coverage.json`에서 그대로 가져옵니다. export, 예제, 테스트 실행기 종료 코드에서 추론하지 않습니다.

| 프레임워크 | 패키지 버전 | 기록된 상태 | export 선언 | 네이티브 예제와 스토리 |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/react/package.json.txt); [과거 선언 체크포인트](/sources/packages/react/dist/components/tutorial-panel/index.d.ts.txt) | [react 소스와 미리보기 정책](../compatibility/README.mdexamples#react) |
| solid | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/solid/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid/dist/components/tutorial-panel/index.d.ts.txt) | [solid 소스와 미리보기 정책](../compatibility/README.mdexamples#solid) |
| svelte | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/svelte/package.json.txt); [과거 선언 체크포인트](/sources/packages/svelte/dist/components/TutorialPanel.svelte.d.ts.txt) | [svelte 소스와 미리보기 정책](../compatibility/README.mdexamples#svelte) |
| vue | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/vue/package.json.txt); [과거 선언 체크포인트](/sources/packages/vue/dist/components/tutorial-panel/TutorialPanel.vue.d.ts.txt) | [vue 소스와 미리보기 정책](../compatibility/README.mdexamples#vue) |
| lit | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/lit/package.json.txt); [과거 선언 체크포인트](/sources/packages/lit/dist/components/tutorial-panel/index.d.ts.txt) | [lit 소스와 미리보기 정책](../compatibility/README.mdexamples#lit) |
| qwik | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/qwik/package.json.txt); [과거 선언 체크포인트](/sources/packages/qwik/dist/components/tutorial-panel/index.d.ts.txt) | [qwik 소스와 미리보기 정책](../compatibility/README.mdexamples#qwik) |
| angular | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/angular/package.json.txt); [과거 선언 체크포인트](/sources/packages/angular/dist/types/unofficial-krds-angular-tutorial-panel.d.ts.txt) | [angular 소스와 미리보기 정책](../compatibility/README.mdexamples#angular) |
| solid-next (미리보기) | `0.1.0-preview.0` | planned | [현재 루트 매니페스트](/sources/packages/solid-next/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next 소스와 미리보기 정책](../compatibility/README.mdexamples#solid-next) |

## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}

아래 의미 계약은 공유 데이터일 뿐입니다. 네이티브 콘텐츠, ref, 이벤트 전달은 각 어댑터가 맡습니다. 계약의 콜백 이름과 detail 타입은 그대로 씁니다. 머신 객체를 전달하지 않습니다. 선택 속성에는 기본값이 자동으로 채워지지 않습니다. 아래 안내의 명시적 기본값을 씁니다.

```ts
export interface TutorialPanelContract extends ControlledOpen {
    onStart?: (detail: TutorialStartDetails) => void;
    tasks: readonly {
        id: string;
        title: string;
        steps: readonly TutorialStep[];
    }[];
    activeTaskId: string | null;
    activeStepId: string | null;
    running?: boolean;
    defaultRunning?: boolean;
    activePanel?: 'help' | 'tutorial';
    defaultActivePanel?: 'help' | 'tutorial';
    onTaskChange?: (detail: {
        id: string | null;
    }) => void;
    onStepChange?: (detail: {
        id: string | null;
    }) => void;
    onActivePanelChange?: (detail: ValueChangeDetails<'help' | 'tutorial'>) => void;
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

export interface TutorialStartDetails {
    taskId: string;
    stepId: string;
}

export interface TutorialStep {
    id: string;
    title: string;
    targetId: string;
    instruction: string;
}

export interface ValueChangeDetails<T> {
    value: T;
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
| `onStart` | 아니요 | `(detail: TutorialStartDetails) => void` | 의미 이벤트 요청 |
| `tasks` | 예 | `readonly {id: string; title: string; steps: readonly TutorialStep[]}[]` | 데이터 / 상태 |
| `activeTaskId` | 예 | `string \| null` | 데이터 / 상태 |
| `activeStepId` | 예 | `string \| null` | 데이터 / 상태 |
| `running` | 아니요 | `boolean` | 데이터 / 상태 |
| `defaultRunning` | 아니요 | `boolean` | 데이터 / 상태 |
| `activePanel` | 아니요 | `'help' \| 'tutorial'` | 데이터 / 상태 |
| `defaultActivePanel` | 아니요 | `'help' \| 'tutorial'` | 데이터 / 상태 |
| `onTaskChange` | 아니요 | `(detail: {id: string \| null}) => void` | 의미 이벤트 요청 |
| `onStepChange` | 아니요 | `(detail: {id: string \| null}) => void` | 의미 이벤트 요청 |
| `onActivePanelChange` | 아니요 | `(detail: ValueChangeDetails<'help' \| 'tutorial'>) => void` | 의미 이벤트 요청 |
| `onStop` | 아니요 | `(detail: TutorialStopDetails) => void` | 의미 이벤트 요청 |
| `startActionId` | 예 | `string` | 데이터 / 상태 |
| `fallbackFocusId` | 아니요 | `string` | 데이터 / 상태 |

선택 값과 명시적 기본값은 다릅니다. 기본값과 네이티브 콘텐츠 요구사항은 아래 검토된 안내에 있습니다.

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 네이티브 JSX/콘텐츠 prop을 씁니다. Svelte는 네이티브 snippet을 씁니다. Vue는 네이티브 슬롯을 씁니다. Angular는 네이티브 input, output, 콘텐츠 투영을 씁니다. Lit은 custom element 속성, 슬롯, DOM 이벤트를 씁니다. Qwik은 네이티브 QRL 이벤트 경계를 씁니다. 이 전달 방식은 서로 바꿔 쓸 수 없습니다. 정확한 이름과 필수 콘텐츠는 링크된 공개 패키지 선언에서 확인합니다. 아래 의미 콜백이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

본문 뒤에 오는 열기 버튼/패널입니다. 선택적 Help/Tutorial 탭, 닫기, 제목, 개요로 돌아가기, 과업/세부 과업 목록, 명시적 Stop 버튼을 둡니다. 세부 과업 제목은 CoachMark 제목과 같습니다. 패널 표시 여부는 진행 중인 따라하기와 독립입니다.

**개요와 과업 보기(공식 구조 3–4번을 따르는 독립 규칙):** 본문은 개요 또는 한 과업의 보기 중 하나만 보여 주며 둘을 함께 보이지 않습니다. 호스트가 `activeTaskId`(실제 과업)와 `activeStepId`를 모두 확정하면 과업 보기로 들어갑니다. 이때 `task-list`에는 그 과업만 있고 `back` 컨트롤이 렌더링됩니다. `back`을 활성화하면 개요로 돌아가며, 과업이 확정되어 있으면 `onTaskChange({id:null})` 요청(각 어댑터의 과업 변경 이벤트)을 한 번 내보냅니다. `activeTaskId`는 계속 호스트 권한입니다. 개요에서는 모든 과업을 나열하고 `back`은 렌더링하지 않습니다. 단계 없이 확정된 과업은 자신의 disclosure만 펼칩니다. disclosure를 로컬에서 소유하는 렌더러(Angular)는 그 disclosure에서 같은 필터된 과업 보기로 들어갈 수도 있습니다.

### 의미 API {#plain-semantic-api}

독립 API: tasks {id,title,steps:{id,title,targetId,instruction}[]}[], activeTaskId, activeStepId, `running?/defaultRunning=false`, `open?/defaultOpen=true` (넓은 화면), `activePanel?/defaultActivePanel=help|tutorial`, onOpenChange, `onStart({taskId,stepId})`, onTaskChange, onStepChange, onActivePanelChange({value}), `onStop({reason,running:false,returnTo:{panel:"tutorial",open:true,startActionId}})`, `startActionId`, `fallbackFocusId?`. running/open/activePanel이 정의되면 해당 필드가 제어 소유권을 갖고, 없는 필드는 한 번만 읽는 기본값을 씁니다. 제어와 기본값을 함께 주거나 모드를 바꾸는 것은 잘못된 사용입니다. Stop의 returnTo는 일반 노출 요청이며 제어 prop을 강제할 권한이 아닙니다.

**Start 트랜잭션(독립 API):** 사용 가능한 명시적 Start 동작이 실제 요청 과업과 단계를 고릅니다. 우선순위는 설정된 과업/단계, 선택된 과업의 첫 단계, 단계가 있는 첫 실제 과업 순입니다. 비었거나 사용할 수 없는 과업 데이터에서는 ID를 만들어 내거나 Start 요청을 내지 않습니다. 이미 실행 중일 때 Start는 no-op입니다. running이 비제어이면 소유한 running=true를 동기적으로 확정한 뒤 선택적 onStart({taskId,stepId}) 콜백을 한 번 호출합니다. activeTaskId/activeStepId는 계속 호스트 권한이며, 로컬 호스트는 이 같은 트랜잭션으로 요청된 ID를 수락합니다. running이 제어이면 요청을 한 번 내보내고, 실제 running=true와 요청된 과업/단계 prop을 받은 뒤에 새 실행 단계를 보여 주거나 초점을 둡니다. Start는 중복/no-op 보조 요청으로 onTaskChange나 onStepChange를 내지 않습니다. 이 콜백은 별도의 과업/단계 선택 동작을 위한 것입니다. 거부되었거나 일부만 수락된 제어 Start는 확정된 상태와 초점을 유지하며, 실행을 지어내거나 숨겨졌거나 수락되지 않은 따라하기 콘텐츠에 초점을 두면 안 됩니다. 초점은 수락된 트랜잭션이 렌더링된 뒤에만 실제로 노출된 실행 단계로 들어갈 수 있습니다. 마운트, prop 변경, 반복된 keydown/click 전달은 추가 Start 요청을 내지 않습니다.

패널을 닫거나 접거나 Help로 전환해도 running/과업/단계는 보존됩니다. 수락된 명시적 Stop 트랜잭션만 실행 중인 따라하기를 끝냅니다. 일반 패널 표시 여부는 독립입니다. props/마운트/리셋/초점 복원은 사용자 변경 알림을 내지 않습니다. 변경된 상태 요청은 각각 한 번만 내보냅니다. onStop은 경쟁하는 닫기/복원 콜백이 아니라 하나의 통합 Stop 요청입니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

열면 패널 컨테이너에 초점이 갑니다. 일반 닫기는 하나의 조합 소유자를 통해 사용 가능한 열기 버튼으로 돌아갑니다. 네이티브 disclosure 자식은 Click/Enter/Space로 실제로 펼치고 접으며 트리거에 초점을 유지합니다. 넓은 패널은 초점이 갇히지 않습니다. 좁은 셸은 네이티브 모달의 격리/진입/가둠을 재사용하고, 복원은 관련 Tutorial 또는 Stop 조정자에게 위임합니다. 공개 Modal의 저장된 열기 버튼 규칙을 덮어쓰지 않습니다.

**TutorialPanel/CoachMark 통합 Stop 트랜잭션(공식 선호 목적지를 보존하는 독립 조정 정책):** 연결된 CoachMark의 보임/열림 상태는 두 번째 독립 닫기 소유자가 유지하는 것이 아니라, 따라하기 조정자가 확정된 running/과업/대상 상태에서 파생합니다. Stop은 그 소유자에게 `onStop({reason,running:false,returnTo:{panel:"tutorial",open:true,startActionId}})` 트랜잭션 요청을 한 번 내보냅니다. 같은 Stop에 대해 CoachMark onOpenChange를 중복해 내지 않습니다. 비제어 조정자는 이를 동기적으로 확정합니다. 제어 소유권에서는 running=false가 실제로 수락되고 코치 표시가 실제로 닫히거나 제거된 경우에만 따라하기를 끝냅니다. 수락 전까지는 실행 UI와 현재 초점을 유지하고 복원하지 않습니다. 소유자는 수락된 Tutorial 탭/패널 노출을 그 중지 트랜잭션과 함께 확정해야 합니다. 일부만 수락된 노출은 타이머로 추측하지 않고 결과로 확정된 탭/열림 상태에 명시됩니다.

이 요청은 Tutorial 탭 선택, 패널 열기/노출, 선호하는 startActionId 렌더링/활성화를 요구합니다. 실제 중지/닫힘 전환과 네이티브 패널 렌더링이 끝난 뒤, **단일 Stop 복원 조정자가 먼저 실제 최상위 활성 모달을 확인합니다.** 호스트가 Tutorial 탭 요청을 거부한 뒤에도 선택된 채 남은 좁은 Help 모달도 포함합니다. 초점 후보는 마운트됨, 보임, 활성, 초점 가능, inert 아님이어야 합니다. 모달이 아직 활성이면 추가로 그 실제 최상위 모달 안에 있어야 합니다. 이 규칙에서 실제로 사용 가능하면 항상 startActionId를 우선합니다. 닫힌 모달, 숨은 탭, 거부된 패널 열림 상태, 활성 모달 경계, 오래된 대상을 통해서는 초점을 두지 않습니다.

선호 시작 노출이 거부되었거나 시작 동작이 제거/사용 불가이고 **모달이 실제로 계속 열려 있으면**, 그 모달 안의 사용 가능한 fallbackFocusId를 고르고, 없으면 논리적 DOM 순서의 첫 사용 가능한 내부 대화형 대상을, 그것도 없으면 모달 자신의 초점 가능 컨테이너를 씁니다(tabindex=-1, 이전 값 보존). 가둠이 활성인 동안은 이름 있는 대체 대상이 제공되지 않았더라도 바깥 패널 열기 버튼, 저장된 바깥 시작 컨트롤/조상, document body는 후보가 아닙니다. 격리를 제거하거나, 가둠을 끄거나, 제어 탭/열림 prop을 강제하거나, 바깥 대상을 만들어 내려고 두 번째 비공개 복원 소유자를 호출하지 않습니다. 초점 전에 후보/컨테이너가 제거되면 오래된 바깥 대체 대상을 쓰지 않고 실제 확정된 최상위 모달을 다시 확인합니다.

확정된 정리 뒤에 **활성 모달이 실제로 남아 있지 않을 때만** 대체 대상을 다음 순서로 쓸 수 있습니다. 사용 가능한 지속 따라하기 패널 열기 버튼, 제공된 fallbackFocusId, 사용 가능한 저장된 시작 컨트롤/가장 가까운 사용 가능한 조상, 마지막으로 나중에 복원하는 임시 tabindex=-1의 살아 있는 document body입니다. 요청했지만 거부된 모달 닫기는 해당하지 않습니다. 바깥 초점은 실제로 수락된 닫기와 정리를 기다려야 합니다. 이 모달 인식 해석은 다른 모달이 활성으로 남아 있을 때의 라우트 제거/해체에도 적용됩니다. 수락된 Stop이 running=false/open=true이고 Help가 선택된 채 남고 Tutorial 시작이 숨겨지거나 제거되었으며 바깥 컨트롤이 inert인 구체적 상태에서는, 초점이 그 Help 모달의 내부 대상/컨테이너에 남고 가둠과 격리도 유지됩니다.

같은 Stop 조정자가 이 하나의 해석을 소유하며 모달 셸 진입/복귀를 위임해 경쟁하는 초점 작업을 막습니다. 공개 Modal returnFocusId 규칙은 바뀌지 않습니다. 거부된 Stop은 복원을 하지 않습니다. 이후의 비동기 탭/열림 변경이 이미 끝난 Stop 복원을 되풀이해서는 안 됩니다. 이후 수락된 일반 모달 닫기는 이 이전 Stop 대체 대상을 되풀이하지 않고 기존의 단일 닫기/복원 소유자를 씁니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

좁은 화면의 열기 버튼 전용 패널은 Modal로 엽니다. 레이아웃이 바뀌어도 따라하기 상태를 보존합니다. 모달 패널이 활성 CoachMark 대상을 가리지 않게 합니다. 과업이 계속되는 동안 호스트가 패널을 일시적으로 닫을 수 있습니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

폼 값은 없습니다. 따라하기는 실제 사용자 폼을 제출하거나 리셋해서는 안 됩니다. 동작 완료 신호는 호스트에서 오며, IME Enter가 과업 완료로 가장해서는 안 됩니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

완료 조건은 다음을 포함합니다.

- 동작하는 과업 개요→단계 흐름.
- 실제 disclosure 컨트롤.
- 실제 CoachMark 대상.
- HelpPanel 탭 지속.

호스트는 검증된 과업 신호/라우트/콘텐츠, 확정된 Stop/탭/열림 트랜잭션, 선호 시작 동작 렌더링, body 대체 대상이 좋지 않을 때의 유효한 fallbackFocusId를 소유합니다. 로컬 픽스처는 접기, Help 탭 전환, 좁은 모달, 거부된 제어 Stop/노출, 라우트에서 제거된 시작 동작을 보여 주어야 합니다. 초점 전에 선호 동작을 눈에 보이게 노출하거나 문서화된 대체 대상을 눈에 보이게 써야 하며, 내보낸 요청이나 로그만으로는 부족합니다. 라우트 해체는 완료된 과업을 지어내거나 페이지 폼을 제출/리셋하지 않고 코치와 패널 격리/옵저버를 정리합니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, opener, header, tabs, tab, close, title, back, start, task-list, task, task-toggle, step-list, step, stop; open,closed,running,idle,active-step,selected,current. `tab`은 각 Help/Tutorial 패널 선택 탭을 표시하며(`selected`는 aria-selected를 반영), `start`는 명시적 Start 동작, `task-toggle`은 과업의 step-list를 보여 주는 네이티브 disclosure 컨트롤(summary 또는 aria-expanded 버튼, 펼침은 네이티브 `details[open]` 또는 `aria-expanded`로 유지), `step`은 step-list 안의 각 단계 활성화 컨트롤(`current`는 aria-current=step을 반영)을 표시합니다.

렌더링되는 모든 소유 파트는 `data-krds-component="tutorial-panel"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위의 파트/상태 어휘는 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

지원하는 케이스 축: `task-overview`, `active-step`, `suspended-panel`, `narrow-modal`. 이 케이스 이름은 프로젝트의 독립 축입니다. 공식 KRDS 유형 이름이나 완료된 커버리지를 뜻하지 않습니다.

[필수 네이티브 스토리 매니페스트](/sources/catalog/full-catalog-stories.json.txt) · [파일럿 스토리 매니페스트](/sources/catalog/story-cases.json.txt) · [커버리지 근거와 네이티브 리뷰 링크](/sources/catalog/coverage.json.txt)

필수 전체 카탈로그 스토리: `krds-tutorial-panel--task-overview`, `krds-tutorial-panel--active-step`, `krds-tutorial-panel--suspended-panel`, `krds-tutorial-panel--help-tab-return`, `krds-tutorial-panel--narrow-modal`, `krds-tutorial-panel--route-change`, `krds-tutorial-panel--stop-after-fold`, `krds-tutorial-panel--stop-after-help-tab`, `krds-tutorial-panel--narrow-stop-return`, `krds-tutorial-panel--controlled-stop-exposure-rejected`, `krds-tutorial-panel--start-action-removed`, `krds-tutorial-panel--stop-partial-narrow-help`.

### 로컬 네이티브 스토리 {#local-native-stories}

픽스처와 Storybook 출력은 로컬 전용입니다. 이 공개 문서 사이트에 올리지 않습니다. 로컬 문서 서버도 그쪽으로 리디렉션하지 않습니다. 각 네이티브 Storybook은 자기 워크스페이스 스크립트로 실행합니다. 컴포넌트 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/` 아래에 조립된 네이티브 미리보기입니다. Solid 2에는 지원되는 네이티브 Storybook 통합이 없습니다. Qwik 프로덕션 SSR/resume에는 실제 서버가 필요합니다. 정적 미리보기로 대신할 수 없습니다. 스토리가 있다고 동작 인수가 성립하지는 않습니다.

네이티브 컴파일러 체크포인트입니다. 소스 해시는 문서를 빌드할 때마다 검증합니다. 이 기록은 최신 네이티브 후보나 동작 인수를 인증하지 않습니다. 검사된 소스 페이지마다 체크포인트 범위가 적혀 있습니다.

- react: [검사된 소비 코드 보기](/examples/react-1); [소스 그대로 내려받기](/sources/packages/react/examples/catalog.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [검사된 소비 코드 보기](/examples/solid-3); [소스 그대로 내려받기](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [검사된 소비 코드 보기](/examples/svelte-38); [소스 그대로 내려받기](/sources/apps/fixture-svelte/src/public-examples/TutorialPanelExample.svelte.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [검사된 소비 코드 보기](/examples/vue-58); [소스 그대로 내려받기](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [검사된 소비 코드 보기](/examples/lit-60); [소스 그대로 내려받기](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [검사된 소비 코드 보기](/examples/qwik-61); [소스 그대로 내려받기](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [검사된 소비 코드 보기](/examples/angular-62); [소스 그대로 내려받기](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## 출처와 권리 {#source-identity-and-rights}

기준선: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. 공식 상세 스냅숏 수집 시각: `2026-10-29T23:28:04.943Z`. SHA-256: `38b2ffb0d2f3655d399ef17f8e84a41b04b8d3928a395429199ee47fff7e6d6e`. [고정된 컴포넌트 출처 기록](/sources/catalog/components.json.txt) · [공식 출처](https://www.krds.go.kr/html/site/component/component_08_02.html). 원본 HTML은 체크아웃의 참고 근거로만 남습니다. 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/index.md)를 읽어야 합니다.
