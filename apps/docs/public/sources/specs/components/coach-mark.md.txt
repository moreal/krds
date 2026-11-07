# 코치마크 {#coach-mark}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 수락일 뿐이며, 네이티브 동작·시각/자산 검토·실행된 커버리지는 별도 게이트입니다. 어떤 게시도 승인되지 않았습니다.

시맨틱 ID `coach-mark`, 한국어 이름 코치마크, export `CoachMark`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_08_04](https://www.krds.go.kr/html/site/component/component_08_04.html), 보존된 [HTML](../../upstream/krds/raw/components/component_08_04.html). 조회 시각 `2026-10-29T23:28:05.101Z`, `80268` 바이트, SHA-256 `754efe232a5733c103dcdb25f572978409790aeae323ac1afc943eb497845b23`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조해 확인했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 별개입니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류 `component`, 수용된 프로젝트 완료 종류 `composition`. 공식 L889–898의 스포트라이트+단계/동작 구조, L982–984의 검증된 대상 동작 진행, L1184–1197의 TutorialPanel 초점 복귀를 근거로 조합(composition)을 권장합니다.

지원하는 네이티브 케이스(변형·상태 축): `single`, `multi-step`, `action-gated`. 이는 네이티브 케이스 이름이며, 상태·반응형·외관 축이 공식 명명 변형인 것은 아닙니다. 공식 유형/예시 제목 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

**실제 관련 대상/컨트롤** 바로 다음에 현재 코치 팝오버가 논리적 DOM/접근성 순서로 옵니다([공식 L1123–1124](../../upstream/krds/raw/components/component_08_04.html:1123)). 스포트라이트는 대상 주변의 aria-hidden 시각 장식일 뿐입니다. 원격 오버레이/스포트라이트 뒤에 팝오버가 오는 것은 대상→안내 순서를 충족하지 못합니다. 실제 대상과 같은 관련 DOM/접근성 루트의 인접 삽입 경계를 함께 등록하고, 팝오버를 그곳에 네이티브로 렌더합니다. 이 순서를 만들려고 살아 있는 대상이나 폼 입력을 이동·교체·복제·부모 변경하지 않습니다. Portal은 등록된 인접 동일 루트 경계로만 허용되며 순서가 증명되어야 합니다. 장식용 body 수준 Portal은 충분하지 않습니다.

팝오버에는 단계/제목, 간결한 안내, 현재/전체, 동작 행(중단(Stop), 이전(Previous), 다음(Next))이 있습니다. 첫 단계에는 이전이 없고, 마지막 단계의 다음은 완료(Finish)가 되며, 단일 단계는 확인(Confirm)이 됩니다. 한 번에 보이는 코치는 하나입니다. 제목은 가급적 한 줄, 안내는 3 이하이며, 페이지당 4개 이하를 권장하고 최대 15단계입니다. 동작 요구 단계 내내 네이티브 대상 조작, 레이블 관계, 값, 초점/캐럿, IME가 온전해야 합니다.

## 의미 API {#plain-semantic-api}

독립 API: steps {id,targetId,title,instruction,requiresAction?}[], 등록된 인접 팝오버 삽입 경계, open/defaultOpen=false, stepId/defaultStepId, onStepChange({id,reason}), onOpenChange, `startActionId`, `fallbackFocusId?`, TutorialPanel과 연결되면 `onStop({reason,running:false,returnTo:{panel:"tutorial",open:true,startActionId}})`. 등록 계약은 일반 ID와 관계를 전달하며, 각 어댑터는 다른 렌더러 래퍼 없이 자체 네이티브 삽입 방식을 제공합니다. requiresAction 단계에는 onTargetAction({stepId,targetId}): boolean|Promise<boolean>을 제공해야 합니다. 이는 해당 실제 등록 대상의 동작이 실행된 뒤에만, 일반 ID와 네이티브 Event 없이 호출됩니다. 네이티브 호스트 클로저가 실제 커밋된 애플리케이션 상태를 검증하며, true만 다음 단계 요청 하나를 승인합니다. false, 거부, 부재는 진행시키지 않습니다. 검증자가 없는 requiresAction 구성은 잘못이며 TypeError입니다. 합성 스포트라이트 클릭이 아니라 네이티브 대상 핸들러/커밋 뒤에 호출합니다. 검증이 보류 중이면 같은 단계의 중복 활성화를 합칩니다. 실제 open/단계/대상 세대에 묶으며, 닫기·단계 변경·라우트 변경·대상 제거·언마운트는 보류 중인 결과를 무효화합니다. 오래된 true는 진행시키거나 초점을 복원하지 않습니다. 제어에서 거절된 진행은 현재 단계를 유지하며, 이후 별개의 실제 동작이 다시 요청할 수 있습니다. 마운트, prop, 초점은 검증자를 호출하지 않습니다. 이는 공식 실제 동작 결과를 보존하는 독립적이고 구체적인 호스트 검증 API입니다.

제어/기본값 및 모드 전환 금지 규칙은 [파일럿 규약](./README.md)을 따릅니다. 연결 모드에서는 튜토리얼 조정자가 커밋된 running/단계/대상 상태에서 CoachMark 표시를 도출하며, 합동 onStop 요청이 유일한 중단 트랜잭션 이벤트입니다. 독립 CoachMark의 중단은 단일 소유자를 통해 실제 open=false를 요청하며, 거부되면 열린 채로 남고 초점을 복원하지 않습니다. 마운트·prop·초점·정리는 합성 사용자 변경 이벤트를 내지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

사용자가 요청한 경우에만 시작하며 페이지 로드 시 자동 실행하지 않습니다. Tab은 필수 대상 동작을 막지 않고 실제 대상과 현재 팝오버 컨트롤을 실제 읽는 순서로 순회합니다. 독립 진입 정책은 수락된 단계 변경 시 팝오버 제목에 초점을 둡니다. Escape는 중단을 요청하되, 조합 중이거나 내부 위젯이 이미 처리했으면 요청하지 않습니다. 화면 밖의 기존 대상은 스크롤해 보이게 할 수 있습니다. 대상이 없으면 보이는 복구/중단 수단과 함께 표시를 보류하며, 꾸며 낸 대상 좌표나 대체 컨트롤을 만들지 않습니다.

**TutorialPanel/CoachMark 합동 중단 트랜잭션(공식 선호 목적지를 보존하는 독립 조정 정책):** 연결된 CoachMark의 보이는/열린 상태는 두 번째 독립 닫기 소유자가 아니라 튜토리얼 조정자가 커밋된 running/작업/대상 상태에서 도출합니다. 중단은 그 소유자에게 `onStop({reason,running:false,returnTo:{panel:"tutorial",open:true,startActionId}})` 트랜잭션 요청 하나를 냅니다. 같은 중단에 중복 CoachMark onOpenChange를 내지 않습니다. 비제어 조정자는 동기적으로 커밋합니다. 제어 소유권에서는 running=false가 실제로 수락되고 코치 표시가 실제로 닫히거나 제거됐을 때만 튜토리얼이 끝납니다. 수락 전에는 실행 중 UI와 현재 초점을 유지하고 복원하지 않습니다. 소유자는 수락된 튜토리얼 탭/패널 노출을 그 중단 트랜잭션과 함께 커밋해야 합니다. 일부만 수락된 노출은 타이머로 추측하지 않고, 결과로 커밋된 탭/open 상태에 명시됩니다.

이 요청은 튜토리얼 탭 선택, 패널 열기/노출, 선호 startActionId 렌더/활성화를 요구합니다. 실제 중단·닫힘 전이와 네이티브 패널 렌더 완료 뒤, **단일 중단 복원 조정자가 먼저 실제 최상위 활성 모달을 확인**합니다. 호스트가 튜토리얼 탭 요청을 거부한 뒤에도 선택이 남은 좁은 화면의 도움말 모달도 포함합니다. 초점 후보는 마운트되고, 보이고, 활성이며, 초점 가능하고, inert가 아니어야 합니다. 모달이 아직 활성이면 추가로 그 실제 최상위 모달 안에 있어야 합니다. startActionId가 이 규칙 아래 실제로 쓸 수 있으면 우선합니다. 닫힌 모달, 숨은 탭, 거부된 패널 열림 상태, 활성 모달 경계, 오래된 대상을 통해 초점을 보내지 않습니다.

선호 시작 노출이 거절됐거나 시작 동작이 제거·사용 불가이고 **모달이 실제로 열린 채 남아 있으면**, 그 모달 안에서 쓸 수 있는 fallbackFocusId를, 없으면 논리적 DOM 순서의 첫 번째 쓸 수 있는 내부 상호작용 대상을, 없으면 모달 자신의 초점 가능 컨테이너(이전 값을 보존한 tabindex=-1)를 선택합니다. 그 트랩이 활성인 동안 바깥 패널 여는 컨트롤, 저장된 바깥 시작 컨트롤/조상, 문서 body는 이름 있는 대체가 없어도 후보가 아닙니다. 바깥 대상을 만들어 내려고 격리를 제거하거나, 트랩을 끄거나, 제어 탭/open prop을 강제하거나, 두 번째 비공개 복원 소유자를 호출하지 않습니다. 초점 전에 후보/컨테이너가 제거되면 오래된 바깥 대체를 쓰지 않고 실제 커밋된 최상위 모달을 다시 확인합니다.

커밋된 정리 뒤 **모달이 실제로 활성인 채 남아 있지 않을 때만** 대체는 다음 순서로 씁니다. 쓸 수 있는 지속 튜토리얼 패널 여는 컨트롤, 제공된 fallbackFocusId, 쓸 수 있는 저장된 시작 컨트롤/가장 가까운 쓸 수 있는 조상, 마지막으로 나중에 복원되는 임시 tabindex=-1을 둔 라이브 문서 body입니다. 요청됐지만 거부된 모달 닫기는 해당하지 않습니다. 바깥 초점은 실제로 수락된 닫기와 정리를 기다려야 합니다. 이 모달 인식 확인은 다른 모달이 활성인 채 남은 경우의 라우트 제거/해체에도 적용됩니다. running=false/open=true인 구체적 수락 중단 상태에서 도움말이 계속 선택되어 있고 튜토리얼 시작이 숨김·제거됐으며 바깥 컨트롤이 inert이면, 초점은 그 도움말 모달의 내부 대상/컨테이너에 남고 트랩과 격리도 유지됩니다.

같은 중단 조정자가 이 하나의 확인을 소유하고, 경쟁하는 초점 작업을 막기 위해 모달 셸 진입/복귀를 위임합니다. 공개 Modal의 returnFocusId 규칙은 바뀌지 않습니다. 거부된 중단은 복원을 하지 않습니다. 나중의 비동기 탭/open 변경이 이미 끝난 중단 복원을 재생해서는 안 됩니다. 이후 수락된 일반 모달 닫기는 기존의 단일 닫기/복원 소유자를 쓰며, 앞선 중단 대체를 재생하지 않습니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

투어 전체에서 팝업 너비를 일관되게 하고, 충돌을 인식해 화면 안에 머물면서 대상을 가리지 않습니다. 동작 줄이기는 스포트라이트 애니메이션과 부드러운 스크롤을 없앱니다. 대상 크기 조정/스크롤은 배치를 갱신하고, 닫으면 옵저버를 정리합니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼/리셋이 없습니다. 호스트가 검증한 이벤트만 실제 폼 작업을 진행시키며, 조합 중 입력은 완료로 치지 않습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

독립 API: 조합 완료에는 실제 등록된 대상→팝오버 DOM/접근성 순서, 스포트라이트 기하, 순서가 있는 작업 상태, 합동 TutorialPanel 복귀가 포함됩니다. 호스트가 인접 네이티브 삽입 경계를 제공하고 대상을 조작 가능하게 유지하며, 라우트/작업 성공, 조정된 중단/노출 상태, 경쟁 레이어 억제를 소유합니다. 동작 요구 로컬 스토리는 값/레이블/IME 동작이 온전한 채 실제 네이티브 자식 폼 컨트롤을 조작한 뒤, 검증된 동작에서 눈에 보이게 진행해야 합니다. 분리된 오버레이만으로는 완료가 아닙니다. 삽입 경계나 대상이 없으면 구성 오류 또는 보류된 대상 결과이며, 컨트롤을 복제·이동할 허가가 아닙니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, spotlight, popover, title, instruction, position, actions, stop, previous, next; open,closed,current-step,waiting,missing-target.

렌더되는 모든 소유 파트는 `data-krds-component="coach-mark"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위 열거는 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정됩니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 명시적 시작이 필요합니다.
2. 첫 단계/마지막 단계/단일 단계의 동작 레이블과 순서가 올바릅니다.
3. 동작 요구 단계는 검증된 호스트 이벤트로만 진행합니다.
4. 수락된 중단은 실제로 노출된 쓸 수 있는 시작 동작으로 복귀하며, 노출이나 대상이 없으면 문서화된 대체를 씁니다.
5. 제거되거나 라우트가 바뀐 대상은 깔끔하게 보류됩니다.
6. 화면 밖 대상과 좁은 가장자리에서도 보입니다.
7. 코치/알림 레이어는 하나뿐입니다.
8. 실제 대상이나 네이티브 컨트롤 바로 다음에 팝오버가 DOM과 접근성 읽기 순서로 오며, 스포트라이트 장식이 대체 대상이 되지 않습니다.
9. 동작 요구 네이티브 대상은 인접 팝오버 렌더 중에도 이동·복제 없이 레이블, 값, 초점, IME를 유지합니다.
10. 접힘, 도움말 탭 전환, 좁은 표시 뒤의 중단은 실제 쓸 수 있는 시작 동작을 노출하고 초점을 두거나, 수락된 닫기 뒤 문서화된 쓸 수 있는 대체를 씁니다.
11. 거부된 제어 중단은 초점을 복원하거나 실행 중 표시를 끝내지 않습니다. 제거된 시작 동작과 라우트 해체는 숨겨지거나 오래된 콘텐츠에 초점을 두지 않습니다.
12. 좁은 화면에서 튜토리얼 탭 변경이 거부돼 도움말이 유지되고 시작이 숨겨지거나 제거된 상태의 수락된 중단(running=false/open=true)은, 바깥 또는 body로 복원하지 않고 실제 최상위 모달 안의 쓸 수 있는 대상이나 컨테이너에 초점을 유지하며 격리와 트랩을 지킵니다.

위 항목은 앞으로 필요한 테스트이며, 실행되었거나 인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색 이외의 상태 단서, 움직임이 있는 곳의 동작 줄이기를 검증합니다. 빈 스위트를 성공으로 간주하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`coach-mark--single`, `coach-mark--multi-step`, `coach-mark--action-gated`, `coach-mark--offscreen-target`, `coach-mark--missing-target`, `coach-mark--route-change`, `coach-mark--reduced-motion`, `coach-mark--target-reading-order`, `coach-mark--action-native-control`, `coach-mark--stop-hidden-panel`, `coach-mark--stop-help-tab`, `coach-mark--stop-fallback-rejected`, `coach-mark--stop-partial-narrow-help`.

각 케이스는 적용 가능한 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태를 가져야 합니다. Solid 2 미리보기는 별도로 격리됩니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 마련되며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 수락되어야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 씁니다. Lit/Solid 2는 siheom 지원을 만들어 내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연(lazy) 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져오면 안 됩니다. 다른 렌더러 래퍼는 금지입니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML 원본(본문 지침과 상호작용·마크업 표 포함)에서 추출했습니다. 공식 요구사항을 만들어 내지 않도록 원문 언어를 유지합니다. "고려한다/권장/할 수 있다" 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 네이티브가 제어하는 DOM에서 KRDS 원본 JS를 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립 선택입니다.

### 구조

- L[883–883](../../upstream/krds/raw/components/component_08_04.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_08_04.html:889): 1. 스포트라이트 지시 사항 제공을 위해 주의를 집중시키고자 하는 사용자 인터페이스 또는 콘텐츠 섹션. 사용자 인터페이스 또는 콘텐츠 섹션 주변을 둘러싼 외곽선과 애니메이션을 통해 주목도를 높임
- L[893–893](../../upstream/krds/raw/components/component_08_04.html:893): a. 제목 과업 수행 단계 번호와 과업 명칭 텍스트를 제공함
- L[894–894](../../upstream/krds/raw/components/component_08_04.html:894): b. 지시 사항 과업 수행을 위해 사용자가 확인하거나 따라야 할 사항을 안내하는 텍스트
- L[895–895](../../upstream/krds/raw/components/component_08_04.html:895): c. 단계 식별자 전체 단계와 현재 수행 중인 단계 번호를 분수 형식으로 표시함
- L[896–896](../../upstream/krds/raw/components/component_08_04.html:896): d. 액션 버튼 건너뛰기, 이전, 다음 버튼이 제공됨
- L[890–898](../../upstream/krds/raw/components/component_08_04.html:890): 2. 코치마크 팝오버 a. 제목 과업 수행 단계 번호와 과업 명칭 텍스트를 제공함 b. 지시 사항 과업 수행을 위해 사용자가 확인하거나 따라야 할 사항을 안내하는 텍스트 c. 단계 식별자 전체 단계와 현재 수행 중인 단계 번호를 분수 형식으로 표시함 d. 액션 버튼 건너뛰기, 이전, 다음 버튼이 제공됨

### 용례

- L[906–906](../../upstream/krds/raw/components/component_08_04.html:906): 용례
- L[908–908](../../upstream/krds/raw/components/component_08_04.html:908): 사용하기 적합한 경우
- L[910–910](../../upstream/krds/raw/components/component_08_04.html:910): 사용자를 안내하고 플로(Flow) 단계의 전체적인 순서를 학습시키기 위해 사용하는 경우
- L[911–911](../../upstream/krds/raw/components/component_08_04.html:911): 사용자가 사용 가능한 기능에 대한 개요를 파악할 수 있도록 하기 위해 사용하는 경우

### 사용성 가이드라인

- L[919–919](../../upstream/krds/raw/components/component_08_04.html:919): 사용성 가이드라인
- L[922–922](../../upstream/krds/raw/components/component_08_04.html:922): 코치마크는 정보를 제공하고자 하는 요소 주변에 배치한다.
- L[923–923](../../upstream/krds/raw/components/component_08_04.html:923): 정보를 제공하고자 하는 사용자 인터페이스 또는 콘텐츠 섹션 옆에 배치하여 관련 요소와의 연관성이 명확하게 인지될 수 있도록 한다.
- L[926–926](../../upstream/krds/raw/components/component_08_04.html:926): 팝오버 영역이 본문의 중요 콘텐츠를 가리지 않도록 표현한다.
- L[927–927](../../upstream/krds/raw/components/component_08_04.html:927): 팝오버 영역이 안내를 제공하고자 하는 본문 콘텐츠 요소를 가리지 않도록 적절한 표시 방향을 설정한다.
- L[934–934](../../upstream/krds/raw/components/component_08_04.html:934): 팝오버 영역의 너비를 일관되게 유지한다.
- L[935–935](../../upstream/krds/raw/components/component_08_04.html:935): 코치마크 팝오버 영역의 너비는 최대 지시 사항 텍스트 길이를 고려하여 결정한다. 하나의 과업에 대해 제공되는 모든 코치마크 팝오버는 동일한 너비를 갖도록 표현해야 한다.
- L[938–938](../../upstream/krds/raw/components/component_08_04.html:938): 코치마크의 제목과 지시 사항은 간결하고 명확하게 작성한다.
- L[939–939](../../upstream/krds/raw/components/component_08_04.html:939): 코치마크는 관련 요소에 대한 간결한 설명을 제공하여 사용자의 부담을 줄이고 과업의 완수를 격려해야 한다. 가능한 한 제목은 1줄을 유지하고 지시 사항은 3줄 이내로 작성한다.
- L[942–942](../../upstream/krds/raw/components/component_08_04.html:942): 지나치게 많은 코치마크를 사용하지 않는다.
- L[943–944](../../upstream/krds/raw/components/component_08_04.html:943): 한 페이지에 4개 이하의 코치마크를 사용하는 것이 가장 이상적이며, 최대 15단계를 넘지 않도록 한다. 최적의 코치마크 수를 유지하기 위해 각 코치마크가 사용자에게 도움 되는 정보를 포함하고 있는지 점검해야 한다. 불필요한 코치마크는 삭제하고 가능한 경우 메시지를 합치되, 사용자가 거쳐야 하는 핵심적인 과업 단계가 누락되지 않도록 유의한다.
- L[947–947](../../upstream/krds/raw/components/component_08_04.html:947): 코치마크는 전체 과업 플로(Flow)를 고려하여 논리적인 순서로 제공한다.
- L[948–948](../../upstream/krds/raw/components/component_08_04.html:948): 사용자의 실제 이용 플로(Flow)를 반영하여 논리적인 순서에 따라 단계가 진행될 수 있도록 구성해야 한다.
- L[951–951](../../upstream/krds/raw/components/component_08_04.html:951): 한 화면에 여러 개의 코치마크가 표시되지 않도록 한다.
- L[952–952](../../upstream/krds/raw/components/component_08_04.html:952): 여러 개의 코치마크가 동시에 표시되는 것은 코치마크의 제공 목적과 이용 흐름에 적합하지 않다.
- L[955–955](../../upstream/krds/raw/components/component_08_04.html:955): 코치마크가 표시된 상태에서 다른 메시지가 표시되지 않도록 한다.
- L[956–956](../../upstream/krds/raw/components/component_08_04.html:956): 코치마크가 제공될 때 페이지에 다른 알림이나 배너 등의 레이어가 실행되지 않도록 구성하여 사용자가 코치마크에서 안내하고 있는 과업에 집중할 수 있도록 한다.
- L[959–959](../../upstream/krds/raw/components/component_08_04.html:959): 지시 사항 내부 링크는 새 창으로 실행한다.
- L[960–960](../../upstream/krds/raw/components/component_08_04.html:960): 지시 사항에 참고 링크가 포함되어 있는 경우에는 항상 새 창으로 링크를 실행시켜 사용자의 현재 과업 맥락이 중단되지 않도록 한다.
- L[963–963](../../upstream/krds/raw/components/component_08_04.html:963): 모든 단계에서 액션 버튼을 일관성 있는 순서로 배치하고 동일한 레이블을 사용한다.
- L[964–967](../../upstream/krds/raw/components/component_08_04.html:964): 모든 단계에서 액션 버튼은 왼쪽부터 ’그만보기’, ‘이전’, ‘다음’ 순서로 제공한다. 단일 단계의 코치마크에서 ‘다음’ 버튼의 레이블은 ‘확인’으로 사용한다. 여러 단계의 코치마크에서 첫 번째 단계는 ‘이전’ 버튼을 사용하지 않으며, 마지막 단계에서 ‘다음’ 버튼의 레이블은 ‘마치기’로 제공한다.
- L[974–974](../../upstream/krds/raw/components/component_08_04.html:974): 액션 버튼을 적절한 강조 수준으로 표현한다.
- L[975–975](../../upstream/krds/raw/components/component_08_04.html:975): ’그만보기’, ‘이전’ 버튼은 텍스트 버튼 스타일을, ‘다음’, ‘마치기’ 버튼은 고스트 버튼 스타일을 사용한다. ‘다음’, ‘마치기’ 버튼은 본문 액션 버튼의 강조 수준보다 낮아야 한다.
- L[982–982](../../upstream/krds/raw/components/component_08_04.html:982): 사용자의 특정 행동 이후 다음 단계의 코치마크에 접근 가능한 경우, 사용자의 행동 완수 여부를 시스템이 확인하도록 한다.
- L[983–984](../../upstream/krds/raw/components/component_08_04.html:983): 코치마크에서 사용자가 지시 사항에 따라 특정 행동을 하도록 요구하는 경우, 사용자가 해당 행동을 완수했을 때 자동으로 다음 단계의 코치마크로 넘어가도록 한다. 사용자 스스로가 해당 행동을 수행하였음을 확인하는 것이 아니라 시스템에서 사용자가 정확한 행동을 수행하였는지 확인함으로써 사용자가 부적절하게 다음 단계에 접근하는 오류를 방지해야 한다. 이 경우 ‘그만보기’ 버튼을 제공하는 한, 다음 버튼을 제공하지 않아도 된다.

### 플랫폼에 대한 고려 사항

- L[992–992](../../upstream/krds/raw/components/component_08_04.html:992): 플랫폼에 대한 고려 사항
- L[995–995](../../upstream/krds/raw/components/component_08_04.html:995): 모든 화면 크기에서 팝오버 영역이 완전히 표시되는지 확인한다.
- L[996–996](../../upstream/krds/raw/components/component_08_04.html:996): 특정 너비에서 코치마크 팝오버 영역이 시각적으로 확인할 수 없는 화면 밖의 영역에 배치되지 않는지 확인하여 문제가 발견된 경우 적절한 영역으로 배치를 변경해야 한다.

### 접근성 가이드라인

- L[1103–1103](../../upstream/krds/raw/components/component_08_04.html:1103): 접근성 가이드라인
- L[1106–1106](../../upstream/krds/raw/components/component_08_04.html:1106): 스포트라이트와 인접 배경 간 명도 대비를 3:1 이상으로 제공한다.
- L[1107–1107](../../upstream/krds/raw/components/component_08_04.html:1107): 사용자가 집중해야 할 요소를 명확하게 인지할 수 있도록 스포트라이트와 인접 배경의 명도 대비를 3:1 이상으로 제공해야 한다.
- L[1114–1114](../../upstream/krds/raw/components/component_08_04.html:1114): 코치마크는 사용자가 요청한 경우에만 실행되어야 한다.
- L[1115–1115](../../upstream/krds/raw/components/component_08_04.html:1115): 페이지가 로딩되자마자 특정 코치마크가 활성화되는 등 사용자가 의도하지 않는 상황에서 자동으로 실행되어서는 안 된다.
- L[1123–1123](../../upstream/krds/raw/components/component_08_04.html:1123): 관련 요소와 코치마크 팝오버 콘텐츠를 적절한 순서로 제공한다.
- L[1124–1124](../../upstream/krds/raw/components/component_08_04.html:1124): 스크린 리더 사용자가 코치마크 팝오버 콘텐츠에 논리적인 순서로 접근할 수 있도록 관련 있는 요소의 바로 다음 요소로 제공해야 한다.

### 상호작용 가이드라인

- L[1136–1136](../../upstream/krds/raw/components/component_08_04.html:1136): 상호작용 가이드라인
- L[1138–1138](../../upstream/krds/raw/components/component_08_04.html:1138): 팝오버 내부 콘텐츠 탐색
- L[1156–1159](../../upstream/krds/raw/components/component_08_04.html:1156): Tab 코치마크 팝오버가 활성화된 상태에서 내부 컨트롤 요소를 순차적으로 탐색한다.
- L[1166–1166](../../upstream/krds/raw/components/component_08_04.html:1166): 코치마크 비활성화
- L[1184–1190](../../upstream/krds/raw/components/component_08_04.html:1184): Click 그만보기 버튼을 Click 하면 코치마크 팝오버가 숨겨진다. 키보드 초점은 따라하기 패널에서 따라하기를 실행하는 버튼으로 이동한다.
- L[1191–1197](../../upstream/krds/raw/components/component_08_04.html:1191): Enter, Space 그만보기 버튼이 초점을 가진 상태에서 Enter 또는 Space 키를 누르면 코치마크 팝오버가 숨겨진다. 키보드 초점은 따라하기 패널에서 따라하기를 실행하는 버튼으로 이동한다.

### 예시

- L[1216–1216](../../upstream/krds/raw/components/component_08_04.html:1216): 예시
- L[1220–1220](../../upstream/krds/raw/components/component_08_04.html:1220): 기본
- L[1231–1231](../../upstream/krds/raw/components/component_08_04.html:1231): 따라하기 가이드
- L[1251–1251](../../upstream/krds/raw/components/component_08_04.html:1251): 코치 마크 내용
- L[1263–1263](../../upstream/krds/raw/components/component_08_04.html:1263): 기본 코드 확인하기

### 마크업 가이드

- L[1335–1335](../../upstream/krds/raw/components/component_08_04.html:1335): 마크업 가이드
- L[1338–1338](../../upstream/krds/raw/components/component_08_04.html:1338): CSS 선택자
- L[1355–1358](../../upstream/krds/raw/components/component_08_04.html:1355): 전체영역 .krds-coach-mark
- L[1359–1362](../../upstream/krds/raw/components/component_08_04.html:1359): 팝오버 .coach-balloon

인라인으로 보존된 예시 마크업(참고용이며 공개 네이티브 API가 아님): L[1225–1257](../../upstream/krds/raw/components/component_08_04.html:1225)

CSS/JS/가이드 이미지 원본 참조는 복사된 구현이 아닙니다. 필수/선택 열을 보존한 표 행의 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위 평탄화 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 기록된 독립 결정: 조합(composition) 종류를 수용합니다. 실제 대상 인접 네이티브 삽입, 검증된 대상 동작, 단일 모달 인식 중단 조정자는 필수이며, 네이티브 호스트 연결은 별도의 근거 게이트로 남습니다.
- 연결된 외부 코드 예시는 참조만 하고, 이번 준비에서 별도 파일로 포함하거나 읽지 않았습니다: L1268 `../../code/coach_mark.html`, L1377 `./variable/coach_mark.html`. 확인하지 못한 내용은 추정하지 않습니다.
- 상세에 가이드 이미지 참조가 4개 있으며, 내장 픽셀 도식은 시각적으로 검사하지 않았습니다. 텍스트 구조와 지침만 읽었으며, 정확한 시각 치수와 자산은 이후 시각/출처 검토가 필요합니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정됩니다. 각 네이티브 렌더러는 자체 구현, 동작/스토리 소스, 독립 인수가 여전히 필요합니다.

## 수용된 독립 결정 {#accepted-independent-resolution}

조합(composition) 종류를 수용합니다. 실제 대상 인접 네이티브 삽입, 검증된 대상 동작, 단일 모달 인식 중단 조정자는 필수이며, 네이티브 호스트 연결은 별도의 근거 게이트로 남습니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `CoachMarkContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트가 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트·조합·자산·통합에 계속 필수입니다.

이 문서의 공식 인용·파생 텍스트는 원래 KRDS 권리와 출처 표기를 유지하며, 독립 코드 MIT 부여는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
