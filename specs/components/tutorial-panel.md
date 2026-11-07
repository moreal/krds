# 따라하기 패널 {#tutorial-panel}

**계약 상태: 네이티브 구현용으로 범위 승인됨.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 승인일 뿐이며, 네이티브 동작, 시각/자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `tutorial-panel`, 한국어 이름 따라하기 패널, export `TutorialPanel`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_08_02](https://www.krds.go.kr/html/site/component/component_08_02.html), 보존된 [HTML](../../upstream/krds/raw/components/component_08_02.html). 조회 시각 `2026-10-29T23:28:04.943Z`, `75137` 바이트, SHA-256 `38b2ffb0d2f3655d399ef17f8e84a41b04b8d3928a395429199ee47fff7e6d6e`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류는 `composition`, 인수된 프로젝트 완료 종류도 `composition`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 사례(변형·상태 축): `task-overview`, `active-step`, `suspended-panel`, `narrow-modal`. 이는 네이티브 사례 이름입니다. 상태, 반응형, 외관 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형/예시 헤딩 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

본문 뒤에 오는 열기 버튼/패널입니다. 선택적 Help/Tutorial 탭, 닫기, 제목, 개요로 돌아가기, 과업/세부 과업 목록, 명시적 Stop 버튼을 둡니다. 세부 과업 제목은 CoachMark 제목과 같습니다. 패널 표시 여부는 진행 중인 따라하기와 독립입니다.

**개요와 과업 보기(공식 구조 3–4번을 따르는 독립 규칙):** 본문은 개요 또는 한 과업의 보기 중 하나만 보여 주며 둘을 함께 보이지 않습니다. 호스트가 `activeTaskId`(실제 과업)와 `activeStepId`를 모두 확정하면 과업 보기로 들어갑니다. 이때 `task-list`에는 그 과업만 있고 `back` 컨트롤이 렌더링됩니다. `back`을 활성화하면 개요로 돌아가며, 과업이 확정되어 있으면 `onTaskChange({id:null})` 요청(각 어댑터의 과업 변경 이벤트)을 한 번 내보냅니다. `activeTaskId`는 계속 호스트 권한입니다. 개요에서는 모든 과업을 나열하고 `back`은 렌더링하지 않습니다. 단계 없이 확정된 과업은 자신의 disclosure만 펼칩니다. disclosure를 로컬에서 소유하는 렌더러(Angular)는 그 disclosure에서 같은 필터된 과업 보기로 들어갈 수도 있습니다.

## 의미 API {#plain-semantic-api}

독립 API: tasks {id,title,steps:{id,title,targetId,instruction}[]}[], activeTaskId, activeStepId, `running?/defaultRunning=false`, `open?/defaultOpen=true` (넓은 화면), `activePanel?/defaultActivePanel=help|tutorial`, onOpenChange, `onStart({taskId,stepId})`, onTaskChange, onStepChange, onActivePanelChange({value}), `onStop({reason,running:false,returnTo:{panel:"tutorial",open:true,startActionId}})`, `startActionId`, `fallbackFocusId?`. running/open/activePanel이 정의되면 해당 필드가 제어 소유권을 갖고, 없는 필드는 한 번만 읽는 기본값을 씁니다. 제어와 기본값을 함께 주거나 모드를 바꾸는 것은 잘못된 사용입니다. Stop의 returnTo는 일반 노출 요청이며 제어 prop을 강제할 권한이 아닙니다.

**Start 트랜잭션(독립 API):** 사용 가능한 명시적 Start 동작이 실제 요청 과업과 단계를 고릅니다. 우선순위는 설정된 과업/단계, 선택된 과업의 첫 단계, 단계가 있는 첫 실제 과업 순입니다. 비었거나 사용할 수 없는 과업 데이터에서는 ID를 만들어 내거나 Start 요청을 내지 않습니다. 이미 실행 중일 때 Start는 no-op입니다. running이 비제어이면 소유한 running=true를 동기적으로 확정한 뒤 선택적 onStart({taskId,stepId}) 콜백을 한 번 호출합니다. activeTaskId/activeStepId는 계속 호스트 권한이며, 로컬 호스트는 이 같은 트랜잭션으로 요청된 ID를 수락합니다. running이 제어이면 요청을 한 번 내보내고, 실제 running=true와 요청된 과업/단계 prop을 받은 뒤에 새 실행 단계를 보여 주거나 초점을 둡니다. Start는 중복/no-op 보조 요청으로 onTaskChange나 onStepChange를 내지 않습니다. 이 콜백은 별도의 과업/단계 선택 동작을 위한 것입니다. 거부되었거나 일부만 수락된 제어 Start는 확정된 상태와 초점을 유지하며, 실행을 지어내거나 숨겨졌거나 수락되지 않은 따라하기 콘텐츠에 초점을 두면 안 됩니다. 초점은 수락된 트랜잭션이 렌더링된 뒤에만 실제로 노출된 실행 단계로 들어갈 수 있습니다. 마운트, prop 변경, 반복된 keydown/click 전달은 추가 Start 요청을 내지 않습니다.

패널을 닫거나 접거나 Help로 전환해도 running/과업/단계는 보존됩니다. 수락된 명시적 Stop 트랜잭션만 실행 중인 따라하기를 끝냅니다. 일반 패널 표시 여부는 독립입니다. props/마운트/리셋/초점 복원은 사용자 변경 알림을 내지 않습니다. 변경된 상태 요청은 각각 한 번만 내보냅니다. onStop은 경쟁하는 닫기/복원 콜백이 아니라 하나의 통합 Stop 요청입니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

열면 패널 컨테이너에 초점이 갑니다. 일반 닫기는 하나의 조합 소유자를 통해 사용 가능한 열기 버튼으로 돌아갑니다. 네이티브 disclosure 자식은 Click/Enter/Space로 실제로 펼치고 접으며 트리거에 초점을 유지합니다. 넓은 패널은 초점이 갇히지 않습니다. 좁은 셸은 네이티브 모달의 격리/진입/가둠을 재사용하고, 복원은 관련 Tutorial 또는 Stop 조정자에게 위임합니다. 공개 Modal의 저장된 열기 버튼 규칙을 덮어쓰지 않습니다.

**TutorialPanel/CoachMark 통합 Stop 트랜잭션(공식 선호 목적지를 보존하는 독립 조정 정책):** 연결된 CoachMark의 보임/열림 상태는 두 번째 독립 닫기 소유자가 유지하는 것이 아니라, 따라하기 조정자가 확정된 running/과업/대상 상태에서 파생합니다. Stop은 그 소유자에게 `onStop({reason,running:false,returnTo:{panel:"tutorial",open:true,startActionId}})` 트랜잭션 요청을 한 번 내보냅니다. 같은 Stop에 대해 CoachMark onOpenChange를 중복해 내지 않습니다. 비제어 조정자는 이를 동기적으로 확정합니다. 제어 소유권에서는 running=false가 실제로 수락되고 코치 표시가 실제로 닫히거나 제거된 경우에만 따라하기를 끝냅니다. 수락 전까지는 실행 UI와 현재 초점을 유지하고 복원하지 않습니다. 소유자는 수락된 Tutorial 탭/패널 노출을 그 중지 트랜잭션과 함께 확정해야 합니다. 일부만 수락된 노출은 타이머로 추측하지 않고 결과로 확정된 탭/열림 상태에 명시됩니다.

이 요청은 Tutorial 탭 선택, 패널 열기/노출, 선호하는 startActionId 렌더링/활성화를 요구합니다. 실제 중지/닫힘 전환과 네이티브 패널 렌더링이 끝난 뒤, **단일 Stop 복원 조정자가 먼저 실제 최상위 활성 모달을 확인합니다.** 호스트가 Tutorial 탭 요청을 거부한 뒤에도 선택된 채 남은 좁은 Help 모달도 포함합니다. 초점 후보는 마운트됨, 보임, 활성, 초점 가능, inert 아님이어야 합니다. 모달이 아직 활성이면 추가로 그 실제 최상위 모달 안에 있어야 합니다. 이 규칙에서 실제로 사용 가능하면 항상 startActionId를 우선합니다. 닫힌 모달, 숨은 탭, 거부된 패널 열림 상태, 활성 모달 경계, 오래된 대상을 통해서는 초점을 두지 않습니다.

선호 시작 노출이 거부되었거나 시작 동작이 제거/사용 불가이고 **모달이 실제로 계속 열려 있으면**, 그 모달 안의 사용 가능한 fallbackFocusId를 고르고, 없으면 논리적 DOM 순서의 첫 사용 가능한 내부 대화형 대상을, 그것도 없으면 모달 자신의 초점 가능 컨테이너를 씁니다(tabindex=-1, 이전 값 보존). 가둠이 활성인 동안은 이름 있는 대체 대상이 제공되지 않았더라도 바깥 패널 열기 버튼, 저장된 바깥 시작 컨트롤/조상, document body는 후보가 아닙니다. 격리를 제거하거나, 가둠을 끄거나, 제어 탭/열림 prop을 강제하거나, 바깥 대상을 만들어 내려고 두 번째 비공개 복원 소유자를 호출하지 않습니다. 초점 전에 후보/컨테이너가 제거되면 오래된 바깥 대체 대상을 쓰지 않고 실제 확정된 최상위 모달을 다시 확인합니다.

확정된 정리 뒤에 **활성 모달이 실제로 남아 있지 않을 때만** 대체 대상을 다음 순서로 쓸 수 있습니다. 사용 가능한 지속 따라하기 패널 열기 버튼, 제공된 fallbackFocusId, 사용 가능한 저장된 시작 컨트롤/가장 가까운 사용 가능한 조상, 마지막으로 나중에 복원하는 임시 tabindex=-1의 살아 있는 document body입니다. 요청했지만 거부된 모달 닫기는 해당하지 않습니다. 바깥 초점은 실제로 수락된 닫기와 정리를 기다려야 합니다. 이 모달 인식 해석은 다른 모달이 활성으로 남아 있을 때의 라우트 제거/해체에도 적용됩니다. 수락된 Stop이 running=false/open=true이고 Help가 선택된 채 남고 Tutorial 시작이 숨겨지거나 제거되었으며 바깥 컨트롤이 inert인 구체적 상태에서는, 초점이 그 Help 모달의 내부 대상/컨테이너에 남고 가둠과 격리도 유지됩니다.

같은 Stop 조정자가 이 하나의 해석을 소유하며 모달 셸 진입/복귀를 위임해 경쟁하는 초점 작업을 막습니다. 공개 Modal returnFocusId 규칙은 바뀌지 않습니다. 거부된 Stop은 복원을 하지 않습니다. 이후의 비동기 탭/열림 변경이 이미 끝난 Stop 복원을 되풀이해서는 안 됩니다. 이후 수락된 일반 모달 닫기는 이 이전 Stop 대체 대상을 되풀이하지 않고 기존의 단일 닫기/복원 소유자를 씁니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

좁은 화면의 열기 버튼 전용 패널은 Modal로 엽니다. 레이아웃이 바뀌어도 따라하기 상태를 보존합니다. 모달 패널이 활성 CoachMark 대상을 가리지 않게 합니다. 과업이 계속되는 동안 호스트가 패널을 일시적으로 닫을 수 있습니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼 값은 없습니다. 따라하기는 실제 사용자 폼을 제출하거나 리셋해서는 안 됩니다. 동작 완료 신호는 호스트에서 오며, IME Enter가 과업 완료로 가장해서는 안 됩니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

완료 조건은 다음을 포함합니다.

- 동작하는 과업 개요→단계 흐름.
- 실제 disclosure 컨트롤.
- 실제 CoachMark 대상.
- HelpPanel 탭 지속.

호스트는 검증된 과업 신호/라우트/콘텐츠, 확정된 Stop/탭/열림 트랜잭션, 선호 시작 동작 렌더링, body 대체 대상이 좋지 않을 때의 유효한 fallbackFocusId를 소유합니다. 로컬 픽스처는 접기, Help 탭 전환, 좁은 모달, 거부된 제어 Stop/노출, 라우트에서 제거된 시작 동작을 보여 주어야 합니다. 초점 전에 선호 동작을 눈에 보이게 노출하거나 문서화된 대체 대상을 눈에 보이게 써야 하며, 내보낸 요청이나 로그만으로는 부족합니다. 라우트 해체는 완료된 과업을 지어내거나 페이지 폼을 제출/리셋하지 않고 코치와 패널 격리/옵저버를 정리합니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, opener, header, tabs, tab, close, title, back, start, task-list, task, task-toggle, step-list, step, stop; open,closed,running,idle,active-step,selected,current. `tab`은 각 Help/Tutorial 패널 선택 탭을 표시하며(`selected`는 aria-selected를 반영), `start`는 명시적 Start 동작, `task-toggle`은 과업의 step-list를 보여 주는 네이티브 disclosure 컨트롤(summary 또는 aria-expanded 버튼, 펼침은 네이티브 `details[open]` 또는 `aria-expanded`로 유지), `step`은 step-list 안의 각 단계 활성화 컨트롤(`current`는 aria-current=step을 반영)을 표시합니다.

렌더링되는 모든 소유 파트는 `data-krds-component="tutorial-panel"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위의 파트/상태 어휘는 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 닫기/다시 열기와 Help 탭 전환이 따라하기 단계를 보존합니다.
2. 수락된 Stop은 과정을 끝내고, 초점을 복원하기 전에 선호하는 사용 가능한 시작 동작을 노출하거나 문서화된 사용 가능한 대체 대상을 씁니다.
3. 단계 제목이 CoachMark 제목과 같습니다.
4. 넓은 패널은 Tab으로 벗어날 수 있습니다.
5. 좁은 모달은 닫은 뒤 body 격리를 남기지 않습니다.
6. 제거된 대상은 안전하게 중단되고 라우트 해체는 표시를 정리하며, 실제 닫힘 전에는 오래된 초점 복원이 없습니다.
7. 패널 접기나 Help 탭 전환 뒤의 Stop은 이제 사용 가능한 시작 동작에 초점을 두기 전에 Tutorial 탭과 패널 노출을 요청합니다.
8. 좁은 화면의 Stop은 닫혔거나 inert인 모달을 통해 초점을 두지 않으며, 실제 중지되고 렌더링된 상태 뒤에 복원 소유자가 하나입니다.
9. 거부된 제어 Stop은 실행 표시와 초점을 유지합니다. 노출이 거부된 수락 Stop이나 제거된 시작 동작은 문서화된 사용 가능한 대체 대상을 씁니다.
10. 라우트 제거는 활성 표시를 정리한 뒤 살아 있는 사용 가능한 호스트 대상 또는 문서화된 document 대체 대상으로 복원합니다.
11. 수락된 좁은 화면 Stop(running=false/open=true)에서 Tutorial 탭 변경이 거부되어 Help가 유지되고 시작이 숨겨지거나 제거되면, 초점은 실제 최상위 모달 안의 사용 가능한 대상이나 컨테이너에 남으며 격리와 가둠을 유지하고 바깥이나 body로 복원하지 않습니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 표시, 움직임이 있는 곳의 동작 줄이기를 검증합니다. 빈 스위트를 성공으로 주장하지 않습니다.

## 독립 정식 기본 이름 {#independent-canonical-default-names}

독립 정식 기본 동작 이름은 “따라하기 시작”과 “따라하기 중지”이며, 개요로 돌아가기 컨트롤은 모든 렌더러에서 “작업 목록”으로 표시합니다. 패널 제목(공식 구조 3번, 따라하기 패널 자체의 제목)은 “따라하기”입니다. 이 로컬 UI 문구는 수락된 Start 요청, 제어/비제어 소유권, 통합 Stop 트랜잭션을 바꾸지 않으며 레이블 prop도 추가하지 않습니다. 필수 공식 KRDS 원문으로 귀속하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`tutorial-panel--task-overview`, `tutorial-panel--active-step`, `tutorial-panel--suspended-panel`, `tutorial-panel--help-tab-return`, `tutorial-panel--narrow-modal`, `tutorial-panel--route-change`, `tutorial-panel--stop-after-fold`, `tutorial-panel--stop-after-help-tab`, `tutorial-panel--narrow-stop-return`, `tutorial-panel--controlled-stop-exposure-rejected`, `tutorial-panel--start-action-removed`, `tutorial-panel--stop-partial-narrow-help`.

각 사례에는 해당하는 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태가 필요합니다. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 마련되며 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부를 인수해야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 사용합니다. Lit/Solid 2는 siheom 지원을 만들지 않고 선택된 네이티브 테스트 경로를 사용해야 합니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름/대상 관계를 검증해야 합니다. Solid 2는 Solid 1 컴파일러/렌더러를 import하면 안 됩니다. 다른 렌더러의 래퍼는 쓰지 않습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존된 상세 HTML에서 추출했으며 핵심 지침과 상호작용/마크업 표를 포함합니다. 공식 요구사항을 만들어 내지 않도록 원문 언어를 그대로 둡니다. “consider/recommended/can”에 해당하는 표현은 권고로 남습니다. 예시/CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 출처 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 아래 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립적인 선택입니다.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_08_02.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_08_02.html:889): 1. 패널 열기 버튼 패널을 표시하는 데 사용되는 버튼. 본문 우측에 배치되며, 스크롤 동작 시 화면의 일관된 위치에 고정하여 배치됨
- L[893–893](../../upstream/krds/raw/components/component_08_02.html:893): a. 패널 선택 탭 도움 패널과 따라하기 패널을 전환하는 데 사용됨
- L[894–894](../../upstream/krds/raw/components/component_08_02.html:894): b. 패널 닫기 버튼 패널을 닫고 패널 활성화 버튼을 표시하는 데 사용됨
- L[890–896](../../upstream/krds/raw/components/component_08_02.html:890): 2. 헤더 a. 패널 선택 탭 도움 패널과 따라하기 패널을 전환하는 데 사용됨 b. 패널 닫기 버튼 패널을 닫고 패널 활성화 버튼을 표시하는 데 사용됨
- L[897–897](../../upstream/krds/raw/components/component_08_02.html:897): 3. 섹션 제목 따라하기 패널 자체의 제목 또는 현재 진행 중인 과업 단계의 텍스트가 제공됨
- L[898–898](../../upstream/krds/raw/components/component_08_02.html:898): 4. 뒤로 가기 버튼 기본 내용 화면으로 전환하기 위한 버튼
- L[902–902](../../upstream/krds/raw/components/component_08_02.html:902): a. 기본 따라하기 패널을 실행하였을 때 최초에 제공되는 기본 콘텐츠로 실습에 포함된 과업 목록과 세부 과업을 확인할 수 있음
- L[903–903](../../upstream/krds/raw/components/component_08_02.html:903): b. 실습 단계 기본 콘텐츠에 명시된 과업 목록 하위의 세부 과업 목록. 각 세부 과업의 제목은 코치마크의 제목과 동일함
- L[899–905](../../upstream/krds/raw/components/component_08_02.html:899): 3. 본문 따라하기 패널의 용도를 안내하고 사용을 유도하기 위한 초기 상태와 단계별 상세 안내 정보를 제공하는 두 가지 상태로 구성됨 a. 기본 따라하기 패널을 실행하였을 때 최초에 제공되는 기본 콘텐츠로 실습에 포함된 과업 목록과 세부 과업을 확인할 수 있음 b. 실습 단계 기본 콘텐츠에 명시된 과업 목록 하위의 세부 과업 목록. 각 세부 과업의 제목은 코치마크의 제목과 동일함
- L[906–906](../../upstream/krds/raw/components/component_08_02.html:906): 6. 중단 버튼 진행 중인 따라하기 과정을 중단하는 데 사용되는 버튼

### 용례

- L[914–914](../../upstream/krds/raw/components/component_08_02.html:914): 용례
- L[916–916](../../upstream/krds/raw/components/component_08_02.html:916): 사용하기 적합한 경우
- L[918–918](../../upstream/krds/raw/components/component_08_02.html:918): 여러 세부 단계를 거쳐야 하거나 복잡한 입력이 필요한 경우
- L[922–922](../../upstream/krds/raw/components/component_08_02.html:922): 사용하기 적합하지 않은 경우
- L[927–927](../../upstream/krds/raw/components/component_08_02.html:927): 맥락적 도움말 컴포넌트를 사용하는 것이 적합하다.
- L[924–929](../../upstream/krds/raw/components/component_08_02.html:924): 안내/도움 정보가 간단한 경우 맥락적 도움말 컴포넌트를 사용하는 것이 적합하다.

### 사용성 가이드라인

- L[937–937](../../upstream/krds/raw/components/component_08_02.html:937): 사용성 가이드라인
- L[940–940](../../upstream/krds/raw/components/component_08_02.html:940): 사용자가 중단하기 버튼을 누르기 전까지 콘텐츠가 변경되지 않아야 한다.
- L[941–941](../../upstream/krds/raw/components/component_08_02.html:941): 사용자가 패널을 닫거나 도움 패널로 전환하였다 따라하기 패널을 다시 실행하더라도 본문은 사용자가 가장 마지막에 확인한 따라하기 콘텐츠를 표시해야 한다.
- L[944–944](../../upstream/krds/raw/components/component_08_02.html:944): 사용자가 중단하기 버튼을 누르기 전까지 따라하기 프로세스가 중단되지 않아야 한다.
- L[945–945](../../upstream/krds/raw/components/component_08_02.html:945): 사용자는 본문과 코치마크에 집중하기 위해 패널을 일시적으로 접은 상태에서 서비스를 이용할 수 있다. 패널 닫기 동작을 수행하였다고 하여 사용자의 의도와 상관없이 따라하기 절차가 중단되면 사용자는 이용 맥락을 잃어버리게 된다.
- L[948–948](../../upstream/krds/raw/components/component_08_02.html:948): 콘텐츠를 간결하게 유지한다.
- L[949–949](../../upstream/krds/raw/components/component_08_02.html:949): 가능한 한 사용자가 패널 영역을 스크롤 하지 않고 정보를 훑어볼 수 있도록 필요한 내용을 간결한 문장으로 작성한다.
- L[952–952](../../upstream/krds/raw/components/component_08_02.html:952): 패널에서 제공하는 웹페이지 링크는 새 창으로 실행한다.
- L[953–953](../../upstream/krds/raw/components/component_08_02.html:953): 패널에 웹페이지 링크가 포함되어 있는 경우에는 항상 새 창으로 링크를 실행시켜 사용자의 현재 과업 맥락이 중단되지 않도록 한다.

### 플랫폼에 대한 고려 사항

- L[961–961](../../upstream/krds/raw/components/component_08_02.html:961): 플랫폼에 대한 고려 사항
- L[964–964](../../upstream/krds/raw/components/component_08_02.html:964): 화면 너비가 충분하지 않을 때 따라하기 패널은 패널 열기 버튼으로 축약하여 제공한다.
- L[965–965](../../upstream/krds/raw/components/component_08_02.html:965): 화면 너비가 충분하지 않을 경우, 사용자가 본문 콘텐츠에 우선적으로 접근하고 본문의 과업에 집중할 수 있도록 패널 열기 버튼을 제공한다. 패널 열기 버튼을 눌렀을 때 패널은 모달 형식으로 제공하면 된다.

### 접근성 가이드라인

- L[1072–1072](../../upstream/krds/raw/components/component_08_02.html:1072): 접근성 가이드라인
- L[1075–1075](../../upstream/krds/raw/components/component_08_02.html:1075): 키보드 초점은 논리적인 순서로 이동해야 한다.
- L[1076–1076](../../upstream/krds/raw/components/component_08_02.html:1076): 패널이 실행되면 키보드 초점은 패널 영역 자체로 이동해야 한다. 패널 내부에서 키보드 함정이 발생하지 않아야 한다.
- L[1084–1084](../../upstream/krds/raw/components/component_08_02.html:1084): 패널 열기 버튼과 패널은 본문 바로 다음 요소로 제공한다.
- L[1085–1085](../../upstream/krds/raw/components/component_08_02.html:1085): 키보드, 스크린 리더 사용자가 우선 본문의 다양한 정보와 컨트롤 요소에 대한 개요를 파악한 후 도움 패널의 사용 여부를 결정할 수 있도록 본문 다음 요소로 제공한다.

### 상호작용 가이드라인

- L[1098–1098](../../upstream/krds/raw/components/component_08_02.html:1098): 상호작용 가이드라인
- L[1100–1100](../../upstream/krds/raw/components/component_08_02.html:1100): 패널 실행
- L[1118–1124](../../upstream/krds/raw/components/component_08_02.html:1118): Click 패널 열기 버튼 또는 아이콘 버튼을 Click 하면 도움 패널이 표시된다. 패널 표시 후, 키보드 초점은 도움 패널 자체로 이동한다.
- L[1125–1131](../../upstream/krds/raw/components/component_08_02.html:1125): Enter, Space 패널 열기 버튼 또는 아이콘 버튼이 초점을 가진 상태에서 Enter 또는 Space 키를 누르면 도움 패널이 표시된다. 패널 표시 후, 키보드 초점은 도움 패널 자체로 이동한다.
- L[1138–1138](../../upstream/krds/raw/components/component_08_02.html:1138): 패널 내부 콘텐츠 탐색
- L[1156–1159](../../upstream/krds/raw/components/component_08_02.html:1156): Tab 패널이 활성화된 상태에서 내부 링크 요소를 순차적으로 탐색한다.
- L[1160–1163](../../upstream/krds/raw/components/component_08_02.html:1160): Click 패널 내부의 확장 가능한 영역을 펼치거나 접는다.
- L[1164–1167](../../upstream/krds/raw/components/component_08_02.html:1164): Enter, Space 패널 내부의 확장 가능한 영역을 펼치거나 접는다. 초점은 확장 가능한 영역을 활성화하는 데 사용되는 버튼에 유지된다.
- L[1174–1174](../../upstream/krds/raw/components/component_08_02.html:1174): 패널 비활성화
- L[1192–1198](../../upstream/krds/raw/components/component_08_02.html:1192): Click 패널 닫기 버튼을 Click 하면 도움 패널이 닫히고 패널 열기 버튼이 표시된다. 키보드 초점은 패널 열기 버튼으로 이동한다.
- L[1199–1205](../../upstream/krds/raw/components/component_08_02.html:1199): Enter, Space 패널 닫기 버튼이 초점을 가진 상태에서 Enter 또는 Space 키를 누르면 도움 패널이 닫히고 패널 열기 버튼이 표시된다. 키보드 초점은 관련된 패널 열기 버튼으로 이동한다.

### 예시

- L[1224–1224](../../upstream/krds/raw/components/component_08_02.html:1224): 예시

### 마크업 가이드

- L[1259–1259](../../upstream/krds/raw/components/component_08_02.html:1259): 마크업 가이드
- L[1262–1262](../../upstream/krds/raw/components/component_08_02.html:1262): CSS 선택자
- L[1282–1287](../../upstream/krds/raw/components/component_08_02.html:1282): 전체영역 .krds-help-panel 영역 전개 .expand
- L[1288–1291](../../upstream/krds/raw/components/component_08_02.html:1288): 패널 제어 버튼 .btn-help-panel
- L[1292–1295](../../upstream/krds/raw/components/component_08_02.html:1292): 패널 본문 .help-conts
- L[1296–1299](../../upstream/krds/raw/components/component_08_02.html:1296): 중단 버튼 .help-panel-action
- L[1309–1309](../../upstream/krds/raw/components/component_08_02.html:1309): JS
- L[1328–1332](../../upstream/krds/raw/components/component_08_02.html:1328): krds_helpPanel init() 초기화 및 주요 이벤트 실행
- L[1333–1336](../../upstream/krds/raw/components/component_08_02.html:1333): setupHelpButtons() 도움 패널 버튼 설정
- L[1337–1340](../../upstream/krds/raw/components/component_08_02.html:1337): toggleHelpPanel() 도움 패널 토글


인라인으로 보존된 예시 마크업(참고용이며 공개 네이티브 API가 아님): 이 상세에는 인라인 샘플 뷰 마크업이 없습니다.

CSS/JS/안내 이미지의 출처 참조는 복사된 구현이 아닙니다. 필수/선택 열을 보존한 표 행의 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- Stop/노출/대체 순서는 이제 구체적인 독립 정책입니다. 공식 시작 동작은 실제로 노출된 뒤에도 계속 선호됩니다. composition 종류는 승인되었습니다. 실제 호스트 트랜잭션/렌더 연결에는 여전히 네이티브 근거와 독립 구현 검토가 필요합니다. 모달 인식 대체는 이제 모달이 열려 있는 동안 실제 최상위 모달의 사용 가능한 내부 대상/컨테이너를 씁니다. 바깥 대체는 실제로 수락된 닫기/정리로 활성 모달이 남지 않은 뒤에만 허용됩니다.
- 연결된 외부 코드 예시는 참조만 하며 이번 준비에서 별도 파일로 포함하거나 읽지 않았습니다: L1355 `../../../resources/js/examples/krds_helpPanel.js`. 보지 못한 내용을 추론하지 않습니다.
- 상세에는 안내 이미지 참조 1개가 있으며, 내장 픽셀 다이어그램은 시각적으로 확인하지 않았습니다. 텍스트 구조/지침은 읽었습니다. 정확한 시각 치수/자산은 이후 시각·출처 검토가 필요합니다.
- 시맨틱 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작/스토리 소스, 독립 인수가 필요합니다.

## 수용된 독립 결정 {#accepted-independent-resolution}

composition 종류가 승인되었습니다. Stop/노출과 최상위 모달 인식 초점은 고정된 독립 정책입니다. 네이티브 호스트 연결과 실제 수락 상태 근거는 여전히 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 시맨틱 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `TutorialPanelContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트는 지원 사례 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에서 인용하거나 파생한 공식 텍스트는 원래의 KRDS 권리와 출처 표기를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용한 실질 요구사항을 면제하지 않습니다.
