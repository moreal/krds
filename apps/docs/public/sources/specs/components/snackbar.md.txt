# 스낵바 {#snackbar}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문으로 남습니다. 게시는 승인되지 않았습니다.

시맨틱 ID `snackbar`, 한국어 이름 스낵바, export `Snackbar`. 고정된 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세 페이지: [component_12_06](https://www.krds.go.kr/html/site/component/component_12_06.html), 보존본 [HTML](../../upstream/krds/raw/components/component_12_06.html). 조회 시각 `2026-10-29T23:28:06.246Z`, `57980` 바이트, SHA-256 `37d9d9357b2e3f020afed315ff700cc2cc0ee3c3aee5df128c62b458fb1b7322`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정된 출처 종류는 `component`이고, 수용된 프로젝트 완료 종류도 `component`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 사례(변형·상태 축): `message`, `with-action`, `with-icon`. 이는 네이티브 사례 이름입니다. 상태·반응형·외형 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형·예시 헤딩 원문은 근거 부록에 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

알림은 화면 하단 중앙에 하나만 둡니다. 구성은 왼쪽의 선택적 은은한 아이콘, 제목, 간결한 본문, 직접 관련된 선택적 텍스트 동작(최대 하나, 오른쪽), 보이는 닫기 버튼입니다. 동시에 여러 스낵바를 쌓지 않고, TabBar나 FAB를 가리지 않습니다. 필드 오류는 인라인으로 유지합니다.

## 의미 API {#plain-semantic-api}

**호스트가 현재 메시지와 큐를 소유**하도록 합니다. 필수 `message:{id,title,text,icon?,error?,actionPending?}|null`(초기값 null)을 둡니다. 선택 동작은 구별된 유니온 하나입니다: `action:{kind:"button",id,label}|{kind:"link",id,label,href,target?,rel?}`. 버튼 동작은 `onAction({id,generation,actionId})`, 닫기 요청은 `onDismiss({id,reason:close|timeout,generation})`입니다. durationMs=null(지속이 기본값)과 선택적 `fallbackFocusId`도 있습니다. 호스트가 메시지 존재, 큐·순서, 실제 결과를 제어합니다. 내부 enqueue/store/defaultMessage는 없습니다. 동작은 암묵적으로 닫지 않습니다. 호스트가 결과에 따라 필요하면 메시지를 명시적으로 교체하거나 제거합니다.

실행 취소/재시도는 이름 있는 네이티브 type=button이며 onAction을 한 번 호출합니다. 이동은 href가 있는 실제 앵커이며 네이티브 Enter/클릭, 수정 키 클릭, 컨텍스트 메뉴, 새 탭 열기 동작을 그대로 유지합니다. 명령형 버튼 이동으로 대체하거나 브라우저 의미를 취소하지 않습니다. 해당하면 외부·새 창 의미를 전달합니다. 둘 다 오른쪽의 텍스트 동작 슬롯 하나를 차지합니다. 동작을 둘 노출하거나 중첩된 상호작용 링크·버튼을 두지 않습니다. role=status는 메시지 텍스트에 적용하며, 컨트롤은 라이브 텍스트 밖에 둡니다. 지속 기본값, 선택적 타이머, 아래 호스트 수명주기 정책은 독립 선택입니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

초점을 빼앗지 않습니다. 닫기는 이름 있는 네이티브 type=button이고, 선택 동작은 구별된 네이티브 버튼·링크 역할을 씁니다. 닫기를 명시적으로 활성화할 때마다 제거를 한 번 요청합니다. 초점 복원이나 큐 진행 전에 호스트가 실제로 제거할 때까지 기다립니다. 요청이 거부되면 메시지, 접근 가능한 동작·닫기, 현재 초점을 유지합니다. 사용자가 다시 명시적으로 활성화하면 동작마다 새 요청을 하나 낼 수 있습니다. 버튼 활성화는 onAction만 내고 합성 닫기를 내지 않습니다. 네이티브 링크 이동은 네이티브로 남습니다. 이동 중에는 이전 페이지의 시작 요소로 초점을 복원하지 않고, 경로 소유자가 도착지 초점을 처리합니다.

호스트가 ID를 바꾸면 즉시 현재 콘텐츠를 교체하고, null이면 제거합니다. 어느 쪽도 합성 닫기를 내거나 큐를 내부에서 진행하지 않습니다. 같은 ID에서 text/title/error/action kind/label/href가 바뀌면 중복으로 버리지 않고 현재 렌더링된 알림을 갱신합니다. 접근 가능한 메시지 텍스트가 바뀌면 한 번만 알립니다. 콜백 객체가 바뀌었다는 이유로 같은 텍스트를 다시 알리지 않습니다. 초점 받은 컨트롤이 제거·교체되면 실제로 수용된 렌더링 뒤에만 복원합니다. 순서는 사용할 수 있는 저장된 시작 컨트롤, 사용할 수 있는 fallbackFocusId, 사용할 수 있는 가장 가까운 저장된 조상, 마지막으로 임시 tabindex=-1을 둔 라이브 문서 body이며 이 tabindex는 나중에 원복합니다. 제거됨, 숨김, 비활성, inert, 이전 경로의 컨트롤에는 초점을 주지 않습니다. 사용자의 네이티브 이동으로 다른 사용 가능한 컨트롤이 이미 초점을 받았다면 빼앗지 않습니다.

ID와 의미 있는 접근 가능한 콘텐츠·동작·유효 지속시간 개정에 묶인 generation을 씁니다. 동일한 중복 콘텐츠나 콜백 정체성만으로는 재시작하지 않습니다. 의미 있는 generation마다 이전 타이머를 취소하고, 실제 렌더링 뒤 선택적 전체 수명을 새로 시작할 수 있습니다. 기본 duration null에는 타이머가 없습니다. 양수 타임아웃을 설정하면 호버 중, 스낵바 안에 초점이 있는 동안, actionPending일 때, 문서가 숨겨진 동안 남은 시간을 일시 정지합니다. 모든 조건이 풀릴 때만 재개합니다. 설정 duration을 늘리면 명시적 연장 수단으로서 새 전체 수명이 생깁니다. 타임아웃은 generation당 요청 하나를 냅니다. 호스트가 거부하면 계속 보이게 두고 타임아웃을 반복하지 않습니다. 이전 generation의 오래된 콜백은 교체 메시지나 같은 ID의 개정본을 닫을 수 없습니다. 실제 제거·언마운트 때 타이머와 리스너를 정리합니다. prop 갱신, 초점 이동, 리셋은 조작된 사용자·닫기 알림을 내지 않습니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

하단 safe-area와 내비게이션 여백을 확보합니다. 아이콘·메시지·동작은 구별되어야 하며 좁은 화면과 확대에서 읽기 좋게 줄바꿈됩니다. 동작 줄이기에서는 슬라이드 애니메이션을 없앱니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼·리셋·IME 상태는 없습니다. 버튼은 type=button입니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 큐·현재 메시지 존재, 실행 취소/재시도 결과, 실제 이동 도착지, 선택적 타이머 설정을 소유합니다. 필수 로컬 예시는 다음을 포함합니다. 각각 유일한 동작인 작동하는 실행 취소/재시도 **버튼**과 실제 href **이동 링크**, 같은 ID에서 바뀐 오류·동작 콘텐츠, 거부된 닫기·타임아웃, 초점이 안전한 수용된 제거, generation에 안전한 교체·정리. 지속 기본값은 동작을 계속 쓸 수 있게 둡니다. 설정된 만료는 호버·초점·숨김·대기 중 상호작용 동안 보호되어야 합니다. 네트워크나 upstream 토스트 매니저는 필요 없습니다. 앵커 없이 이동 콜백만 기록하는 것은 완료로 인정하지 않습니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, icon, title, message, action, close; open,closed,action-pending,error.

렌더링되는 모든 소유 파트는 `data-krds-component="snackbar"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 기준입니다. 위 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 스낵바는 한 번에 하나만 보입니다.
2. 동작은 한 번 실행되고 로컬 결과가 눈에 띄게 바뀝니다.
3. 닫기는 이름이 있고 키보드로 닿을 수 있습니다.
4. 제거 뒤 초점이 보존·복원됩니다.
5. 선택적 타이머가 초점 받은 동작을 만료시킬 수 없습니다.
6. 중복·언마운트 정리가 안전합니다.
7. 하단 내비게이션과 겹치지 않습니다.
8. 이동 동작은 이름 있는 실제 href 링크이며 네이티브 수정 키 클릭과 컨텍스트 메뉴 동작을 가집니다. 실행 취소·재시도는 별도 사례의 네이티브 버튼이며, 렌더링되는 동작은 하나뿐입니다.
9. 같은 ID의 text, error, action 개정은 중복 제거된 메시지로 사라지지 않고 현재 스낵바를 갱신합니다.
10. 거부된 명시적 닫기나 타임아웃은 호스트가 실제로 제거할 때까지 메시지와 초점을 유지하며, 큐를 내부에서 진행하지 않습니다.
11. 호스트의 교체·제거는 합성 닫기 없이 이전 generation을 취소합니다. 오래된 이전 generation 타이머는 새 콘텐츠나 같은 ID로 개정된 콘텐츠에 영향을 줄 수 없습니다.
12. 선택적 타이머는 호버, 초점, 대기 중 동작, 숨겨진 문서 동안 남은 시간을 일시 정지하고, 지속 기본값은 타이머를 시작하지 않습니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 단서, 움직임이 있다면 동작 줄이기를 검증합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`snackbar--message`, `snackbar--with-action`, `snackbar--with-icon`, `snackbar--undo-local`, `snackbar--action-error`, `snackbar--close-focused`, `snackbar--timer-cleanup`, `snackbar--narrow`, `snackbar--navigation-link`, `snackbar--same-id-error-action-update`, `snackbar--dismissal-rejected`, `snackbar--host-queue-replacement`, `snackbar--generation-timer-pauses`.

각 사례는 해당하는 모든 네이티브 렌더러에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태가 필요합니다: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에서 따로 단계화하며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부를 인수해야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 씁니다. Lit과 Solid 2는 siheom 지원을 만들어 내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular의 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러·렌더러를 절대 import하지 않습니다. 다른 렌더러 래퍼는 없습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML에서 가져왔으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 원문 언어를 유지합니다. “고려한다/권장/할 수 있다” 같은 표현은 권고로 남습니다. 예시·CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행해서는 안 됩니다. 위의 공통 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립 선택입니다.

### 구조

- L[864–864](../../upstream/krds/raw/components/component_12_06.html:864): 구조
- L[870–870](../../upstream/krds/raw/components/component_12_06.html:870): 1. 컨테이너 메시지를 담고 있는 영역으로 배경을 구분하는 요소
- L[871–872](../../upstream/krds/raw/components/component_12_06.html:871): 2. 아이콘(선택) 메시지의 의미를 담은 관련도 높은 간단한 아이콘
- L[873–874](../../upstream/krds/raw/components/component_12_06.html:873): 3. 제목 메시지 제목
- L[875–876](../../upstream/krds/raw/components/component_12_06.html:875): 4. 본문 구체적인 설명 텍스트와 사용자의 추가 행동에 대한 텍스트링크를 제공하는 영역
- L[877–878](../../upstream/krds/raw/components/component_12_06.html:877): 5. 작업 버튼(선택) 작업의 세부 정보 표시. 텍스트 버튼 사용
- L[879–880](../../upstream/krds/raw/components/component_12_06.html:879): 6. 닫기 버튼 사용자가 스낵바을 닫을 수 있게 하는 버튼 요소로 대개 'X' 아이콘으로 표현됨.

### 용례

- L[888–888](../../upstream/krds/raw/components/component_12_06.html:888): 용례
- L[890–890](../../upstream/krds/raw/components/component_12_06.html:890): 사용하기 적합한 경우
- L[895–897](../../upstream/krds/raw/components/component_12_06.html:895): 되돌리기, 재시도, 목록 이동 등 사용자가 즉시 수행할 수 있는 간단한 조치를 안내 메시지와 함께 제공하는 경우 사용이 적합하다.
- L[892–899](../../upstream/krds/raw/components/component_12_06.html:892): 사용자에게 피드백과 선택적 조치를 안내하는 경우 되돌리기, 재시도, 목록 이동 등 사용자가 즉시 수행할 수 있는 간단한 조치를 안내 메시지와 함께 제공하는 경우 사용이 적합하다.
- L[903–903](../../upstream/krds/raw/components/component_12_06.html:903): 사용하기 적합하지 않은 경우
- L[908–908](../../upstream/krds/raw/components/component_12_06.html:908): 긴급공지 혹은 모달을 사용하는 것이 적합하다.
- L[905–910](../../upstream/krds/raw/components/component_12_06.html:905): 중요하거나 긴급한 메시지를 전달해야 하는 경우 긴급공지 혹은 모달을 사용하는 것이 적합하다.
- L[914–914](../../upstream/krds/raw/components/component_12_06.html:914): 스낵바는 한 문장 이내의 짧은 설명을 제공할 때 사용하기 적합하다. 더 긴 설명이 필요하다면 모달을 사용하는 것이 적합하다.
- L[911–916](../../upstream/krds/raw/components/component_12_06.html:911): 긴 설명을 제공해야 하는 경우 스낵바는 한 문장 이내의 짧은 설명을 제공할 때 사용하기 적합하다. 더 긴 설명이 필요하다면 모달을 사용하는 것이 적합하다.
- L[920–920](../../upstream/krds/raw/components/component_12_06.html:920): 개별 입력 양식에 대한 메시지는 입력 폼이 제공되는 화면의 각 요소에 인라인 텍스트 방식으로 제공하는 것이 사용자가 인지하기에 더 적합하다.
- L[917–922](../../upstream/krds/raw/components/component_12_06.html:917): 개별 입력 양식에 대한 오류, 성공, 경고 메시지를 제공하는 경우 개별 입력 양식에 대한 메시지는 입력 폼이 제공되는 화면의 각 요소에 인라인 텍스트 방식으로 제공하는 것이 사용자가 인지하기에 더 적합하다.

### 사용성 가이드라인

- L[930–930](../../upstream/krds/raw/components/component_12_06.html:930): 사용성 가이드라인
- L[933–933](../../upstream/krds/raw/components/component_12_06.html:933): 스낵바는 화면 중앙 하단에 표시한다.
- L[934–936](../../upstream/krds/raw/components/component_12_06.html:934): 스낵바는 화면의 중앙 하단에 다른 요소 위에 배치하며, 하단 탭 바나 플로팅 버튼 등 주요 탐색 요소와 겹치지 않게 표시하여야 한다.
- L[940–940](../../upstream/krds/raw/components/component_12_06.html:940): 명확하고 간결하게 피드백 메시지를 제공한다.
- L[941–943](../../upstream/krds/raw/components/component_12_06.html:941): 사용자 행동에 대해 어떤 결과가 발생하였는지 명확하고 간단하게 설명하여 사용자가 빠르게 인지할 수 있게 해주어야 한다. 메시지는 한 문장 이내로 짧게 제공하는 것이 적정하며, 두 문장 이상의 중요 정보를 전달해야 하는 경우는 모달을 사용하는 것이 적합하다.
- L[947–947](../../upstream/krds/raw/components/component_12_06.html:947): 한 페이지에 하나의 스낵바만 표시 한다.
- L[948–950](../../upstream/krds/raw/components/component_12_06.html:948): 여러개의 스낵바를 한 페이지에서 겹치거나 쌓아서 표시하지 않는다. 여러개의 스낵바를 사용할 경우 사용자의 주의를 분산시키고 담을 줄 수 있다.
- L[954–954](../../upstream/krds/raw/components/component_12_06.html:954): 메시지와 직접 관련된 추가 행동을 위한 작업 버튼을 필요 시 제공한다.
- L[955–957](../../upstream/krds/raw/components/component_12_06.html:955): 메시지와 함께 추가 행동 제공이 사용자에게 필요한 경우 텍스트 형태의 작업 버튼을 제공 한다. 버튼은 최대 1개만 제공하며, 메시지 우측에 구분하여 제공한다.
- L[961–961](../../upstream/krds/raw/components/component_12_06.html:961): 아이콘은 반드시 필요한 경우에만 사용한다.
- L[962–964](../../upstream/krds/raw/components/component_12_06.html:962): 메시지의 의미 전달 강화를 목적으로 필요 시 메시지 좌측에 아이콘을 배치하여 사용한다. 아이콘은 시각적으로 부각되지 않게 사용하며, 메시지 톤과 일관되게 사용하는 것이 적합하다.

보존된 예시 마크업 인라인(참고용이며 공개 네이티브 API가 아님): 이 상세 페이지에는 인라인 예시 뷰 마크업이 없습니다.

CSS/JS/안내 이미지 출처 참조는 복사된 구현이 아닙니다. 표 행의 원본 HTML(필수/선택 열 보존)은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화한 발췌가 조건부 선택자를 필수로 재분류하지는 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 현재 메시지·큐 권한, 갱신 generation, 요청 전용 닫기, 버튼/링크 동작 판별자는 이제 구체적인 독립 API 선택입니다. 공식의 단일 표시·관련 동작 하나 구조는 계속 구속력이 있습니다. 지속을 기본으로 하는 타이밍을 공식 지속시간 지침이라고 주장하지 않습니다.
- 상세 페이지에 안내 이미지 참조가 1개 있으며, 그 안의 픽셀 도식은 눈으로 확인하지 않았습니다. 텍스트 구조와 지침만 읽었습니다. 정확한 시각 치수와 자산은 이후 시각·출처 검토가 필요합니다.
- 의미 인터페이스와 파트·상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작·스토리 소스, 독립 인수가 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `SnackbarContract`입니다. 네이티브 프레임워크는 자체 콘텐츠·ref·이벤트 전달만 확장합니다. 공통 매니페스트가 지원 사례 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼로는 이 계약을 충족할 수 없습니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에 인용·파생된 공식 텍스트는 원래 KRDS 권리와 출처 표시를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용한 실질 요구사항을 면제하지 않습니다.
