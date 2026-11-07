# 토스트 {#toast}

**계약 상태: 네이티브 구현용으로 범위 승인됨.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 승인일 뿐이며, 네이티브 동작, 시각/자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `toast`, 한국어 이름 토스트, export `Toast`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_12_05](https://www.krds.go.kr/html/site/component/component_12_05.html), 보존된 [HTML](../../upstream/krds/raw/components/component_12_05.html). 조회 시각 `2026-10-29T23:28:06.180Z`, `57107` 바이트, SHA-256 `407e2dc99ded84b9ceaeab40478d4a5c4d0125d96c968c05d2f309ae802fb9af`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류는 `component`, 인수된 프로젝트 완료 종류도 `component`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 사례(변형·상태 축): `information`, `warning`. 이는 네이티브 사례 이름입니다. 상태, 반응형, 외관 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형/예시 헤딩 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

간결한 한 문장을 담은 일시적 비대화형 컨테이너입니다. 페이지 위 하단 중앙에 두고 TabBar/FAB와 겹치지 않게 합니다. 액션 버튼은 없으며, 조치가 필요한 콘텐츠는 Snackbar를 씁니다. 긴급/치명적 알림이나 개별 필드 오류에는 쓰지 않습니다.

## 의미 API {#plain-semantic-api}

**호스트가 소유하는 현재 메시지와 큐** API를 택합니다. 필수 `message:{id:string,text:string,tone:information|warning,persistentResultId:string}|null`이며 초기값은 null입니다. durationMs 기본값은 information 3000, warning 4000입니다. `onDismiss({id,reason:"timeout",generation})`은 호스트 콘텐츠가 제거되었다는 알림이 아니라 해제 **요청**입니다. defaultMessage, 내부 큐, enqueue/store 객체는 없습니다. 결과의 정확성, 현재 메시지, 순서, 큐 진행은 호스트가 소유하며, 호스트는 더 긴 양수 duration을 설정할 수 있습니다. role=status/aria-live=polite는 독립 네이티브 정책입니다. 토스트는 비대화형으로 남으며 초점 목적지가 되지 않습니다.

**충분한 노출/재조회는 필수 완료 조건**이며, 짧은 기본 타이머를 맞추는 것만으로는 부족합니다([공식 L946–949](../../upstream/krds/raw/components/component_12_05.html:946)). 이 프로젝트의 구체적 대응은 persistentResultId가, 일시적 토스트 바깥의 찾을 수 있는 접근 가능한 **지속 결과/상태 또는 이력**에서 같은 결과 텍스트를 가리키도록 하는 것입니다. 이는 일반 읽기/탐색 순서에 있어야 하며, 호스트/사용자가 의도적으로 지우거나 해당 화면을 떠날 때까지 남아 있습니다. 느리게 읽는 사용자나 알림이 지연된 사용자가 토스트가 사라진 뒤에도 결과를 다시 얻을 수 있도록, 픽스처에 이 실제 로컬 지속 결과가 있어야 합니다. 이력/로그 방식은 독립 프로젝트 정책이며 KRDS가 정확히 그 UI를 규정한다는 주장이 아닙니다. 충분한 노출/재조회가 없으면 완료를 통과할 수 없습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

초점을 빼앗지 않으며 액션/닫기 컨트롤을 추가하지 않습니다. 호스트가 선택했으므로 메시지 ID가 바뀌면 보이는 메시지를 즉시 교체합니다. 컴포넌트는 이전/현재 스냅샷을 큐에 넣지 않습니다. message=null이면 제거합니다. 교체나 prop 제거는 onDismiss를 내지 않고 내부적으로 큐를 진행하지 않습니다.

새 ID마다, 그리고 같은 ID의 의미 있는 text/tone/유효 duration 수정마다 단조 증가하는 내부 generation을 유지합니다. 같은 ID에서 text가 바뀌면 현재 토스트를 갱신하고, 바뀐 텍스트를 한 번 알리며, 처음부터 전체 노출을 다시 시작합니다. 같은 ID에서 tone/duration만 바뀌면 외형/수명만 갱신하고 같은 텍스트를 다시 알리지 않습니다. 같은 ID의 동일한 내용이나 콜백/객체 동일성 변화만으로는 다시 알리거나 재시작하지 않습니다. message=null 뒤에 같은 ID를 다시 쓰면 새로운 가시 generation입니다. 요청은 해당 ID와 generation을 담으며, 콜백에 렌더러 객체는 없습니다.

전체 카운트다운은 해당 generation이 실제로 렌더링된 뒤에 시작합니다. 문서가 숨겨진 동안은 남은 시간을 멈추고, 보이면 남은 시간을 이어 갑니다. 교체, 제거, 의미 있는 수정, 언마운트는 이전 generation의 타이머/리스너를 취소합니다. 오래된 콜백은 무언가를 요청하기 전에 현재 generation을 확인해야 합니다. 타임아웃은 해당 generation에 대해 해제 요청을 정확히 한 번 내보낸 뒤 그 타이머를 소비합니다. 제어 호스트가 메시지를 유지하면 계속 보입니다. 로컬 숨김, 큐 진행, 타임아웃 반복 루프, 거짓 “실제 해제” 콜백은 없습니다. 의미 있는 새 generation은 새 타이머를 시작할 수 있습니다. 초점, prop 갱신, 마운트, 리셋은 사용자 변경/해제 이벤트를 만들어 내지 않습니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

하단 안전 영역/내비게이션/FAB와 겹치지 않게 합니다. 번역 텍스트나 확대 텍스트에 필요할 때만 줄 바꿈하고, 잘림보다 읽을 수 있는 메시지를 우선합니다. 움직임은 필수가 아니며 동작 줄이기에서는 슬라이드 없이 나타나고 사라집니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼/리셋/IME 동작은 없습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

큐/현재 메시지 prop, 지속 결과/이력 대상, 결과의 진실성/복구는 호스트가 소유합니다. 완료 조건은 다음과 같습니다.

- 실제 지속 결과와 일시적 메시지를 모두 만드는 로컬 동작.
- 느리게 읽거나 알림이 지연된 경우의 재조회.
- 결정적인 타임아웃, 갱신, 교체, 거부된 해제, 정리 동작.

공식 information 2–3초/warning 3–4초 값은 충분한 노출 지침 안의 기본값이며 모든 사용자가 결과를 읽거나 들었다는 증거가 아닙니다. 시간은 맞지만 다시 얻을 수 없는 결과는 관문을 통과하지 못합니다. Toast를 Snackbar로 바꾸는 액션이나 닫기 버튼은 추가하지 않습니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, message; information,warning,open,closed.

렌더링되는 모든 소유 파트는 `data-krds-component="toast"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위의 파트/상태 어휘는 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 사용자 동작이 초점 이동 없이 올바르게 알려진 결과를 보여 줍니다.
2. 대화형 자손이 없습니다.
3. information/warning 기본 지속 시간이 정책과 일치합니다.
4. 같은 ID는 중복으로 알리지 않습니다.
5. 숨겨진/언마운트된 타이머가 새 메시지를 해제할 수 없습니다.
6. 하단 내비게이션이 가려지지 않습니다.
7. 느리게 읽거나 알림이 지연된 사용자가 일시적 메시지가 사라진 뒤에도 필수 로컬 지속 상태/이력에서 같은 전체 결과를 다시 얻을 수 있습니다.
8. 같은 ID에서 바뀐 텍스트는 현재 콘텐츠를 갱신하고 한 번 알립니다. 동일한 중복 콘텐츠는 다시 알리지 않고 수명도 재시작하지 않습니다.
9. 호스트의 교체 또는 null 제거는 해제 콜백이나 내부 큐 진행 없이 이전 generation을 취소합니다.
10. 거부된 타임아웃 요청은 호스트가 제어하는 메시지를 계속 보이게 하며, 반복 타임아웃이나 거짓 실제 제거 알림을 내지 않습니다.
11. 이전 ID 또는 같은 ID 수정의 오래된 타이머는 현재 generation의 해제를 요청할 수 없습니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 표시, 움직임이 있는 곳의 동작 줄이기를 검증합니다. 빈 스위트를 성공으로 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`toast--information`, `toast--warning`, `toast--duplicate`, `toast--queued`, `toast--timer-cleanup`, `toast--narrow`, `toast--reduced-motion`, `toast--slow-reading-persistent-result`, `toast--same-id-content-update`, `toast--host-replacement-removal`, `toast--timeout-rejected`, `toast--generation-timer`.

각 사례에는 해당하는 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태가 필요합니다. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 마련되며 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부를 인수해야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 사용합니다. Lit/Solid 2는 siheom 지원을 만들지 않고 선택된 네이티브 테스트 경로를 사용해야 합니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름/대상 관계를 검증해야 합니다. Solid 2는 Solid 1 컴파일러/렌더러를 import하면 안 됩니다. 다른 렌더러의 래퍼는 쓰지 않습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존된 상세 HTML에서 추출했으며 핵심 지침과 상호작용/마크업 표를 포함합니다. 공식 요구사항을 만들어 내지 않도록 원문 언어를 그대로 둡니다. “consider/recommended/can”에 해당하는 표현은 권고로 남습니다. 예시/CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 출처 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 아래 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립적인 선택입니다.


### 구조

- L[864–864](../../upstream/krds/raw/components/component_12_05.html:864): 구조
- L[870–870](../../upstream/krds/raw/components/component_12_05.html:870): 1. 컨테이너 메시지를 담고 일시적으로 표시되었다가 사라지는 영역
- L[871–872](../../upstream/krds/raw/components/component_12_05.html:871): 2. 본문 사용자 행동에 대한 구체적인 설명 텍스트로 짧은 한 문장으로 구성

### 용례

- L[881–881](../../upstream/krds/raw/components/component_12_05.html:881): 용례
- L[883–883](../../upstream/krds/raw/components/component_12_05.html:883): 사용하기 적합한 경우
- L[888–890](../../upstream/krds/raw/components/component_12_05.html:888): 긴급공지 혹은 모달을 사용하는 것이 적합하다.
- L[885–892](../../upstream/krds/raw/components/component_12_05.html:885): 사용자 행동에 대한 즉각적인 피드백을 안내하는 경우 긴급공지 혹은 모달을 사용하는 것이 적합하다.
- L[896–896](../../upstream/krds/raw/components/component_12_05.html:896): 사용하기 적합하지 않은 경우
- L[901–901](../../upstream/krds/raw/components/component_12_05.html:901): 긴급공지 혹은 모달을 사용하는 것이 적합하다.
- L[898–903](../../upstream/krds/raw/components/component_12_05.html:898): 중요하거나 긴급한 메시지를 전달해야 하는 경우 긴급공지 혹은 모달을 사용하는 것이 적합하다.
- L[907–907](../../upstream/krds/raw/components/component_12_05.html:907): 메시지와 함께 사용자의 추가 행동을 제공해야 하는 경우 스낵바를 사용하는 것이 적합하다.
- L[904–909](../../upstream/krds/raw/components/component_12_05.html:904): 사용자의 추가 행동을 함께 제공해야 하는 경우 메시지와 함께 사용자의 추가 행동을 제공해야 하는 경우 스낵바를 사용하는 것이 적합하다.
- L[913–913](../../upstream/krds/raw/components/component_12_05.html:913): 토스트는 한 줄 이내의 짧은 설명을 제공할 때 사용하기 적합하며, 더 긴 설명이 필요하다면 모달을 사용하는 것이 적합하다.
- L[910–915](../../upstream/krds/raw/components/component_12_05.html:910): 한 문장 이상의 긴 설명을 제공해야 하는 경우 토스트는 한 줄 이내의 짧은 설명을 제공할 때 사용하기 적합하며, 더 긴 설명이 필요하다면 모달을 사용하는 것이 적합하다.
- L[919–919](../../upstream/krds/raw/components/component_12_05.html:919): 개별 입력 양식에 대한 메시지는 입력 폼이 제공되는 화면의 각 요소에 인 라인 텍스트 방식으로 제공하는 것이 사용자가 인지하기에 더 적합하다.
- L[916–921](../../upstream/krds/raw/components/component_12_05.html:916): 개별 입력 양식에 대한 오류, 성공, 경고 메시지를 제공하는 경우 개별 입력 양식에 대한 메시지는 입력 폼이 제공되는 화면의 각 요소에 인 라인 텍스트 방식으로 제공하는 것이 사용자가 인지하기에 더 적합하다.

### 사용성 가이드라인

- L[929–929](../../upstream/krds/raw/components/component_12_05.html:929): 사용성 가이드라인
- L[932–932](../../upstream/krds/raw/components/component_12_05.html:932): 토스트는 화면 중앙 하단에 표시한다.
- L[933–935](../../upstream/krds/raw/components/component_12_05.html:933): 토스트는 화면의 중앙 하단에 다른 요소 위에 배치하며, 하단 탭 바나 플로팅 버튼 등 주요 탐색 요소와 겹치지 않게 표시하여야 한다.
- L[939–939](../../upstream/krds/raw/components/component_12_05.html:939): 명확하고 간결하게 알림 메시지를 제공한다.
- L[940–942](../../upstream/krds/raw/components/component_12_05.html:940): 사용자 행동에 대한 결과를 명확하고 간결하게 한 줄의 메시지로 제공한다. 결과 전달에 있어 두줄 이상의 설명 또는 사용자의 추가 행동이 필요한 경우 스낵바를 사용하는 것이 적합하다.
- L[946–946](../../upstream/krds/raw/components/component_12_05.html:946): 메시지 노출 시간을 적절하게 설정한다.
- L[947–949](../../upstream/krds/raw/components/component_12_05.html:947): 토스트는 일시적으로 나타났다 사라지는 메시지로 사용자가 메시지의 내용을 충분히 인지할 수 있는 시간 만큼 노출 되었다가 사라져야 한다. 정보형 메시지는 2초 ~ 3초가 적정하며, 주의·경고형 메시지는 3초 ~ 4초가 적정하다.
- L[954–954](../../upstream/krds/raw/components/component_12_05.html:954): 인증 완료, 저장 완료, 파일 업로드 완료 등
- L[951–956](../../upstream/krds/raw/components/component_12_05.html:951): 정보형 메시지 (2초~3초) 인증 완료, 저장 완료, 파일 업로드 완료 등
- L[960–960](../../upstream/krds/raw/components/component_12_05.html:960): 인증 실패 (반복 시 모달로 표시 권장), 임시 저장 실패, 파일 업로드 실패 등
- L[957–962](../../upstream/krds/raw/components/component_12_05.html:957): 주의·경고형 메시지 인증 실패 (반복 시 모달로 표시 권장), 임시 저장 실패, 파일 업로드 실패 등

인라인으로 보존된 예시 마크업(참고용이며 공개 네이티브 API가 아님): 이 상세에는 인라인 샘플 뷰 마크업이 없습니다.

CSS/JS/안내 이미지의 출처 참조는 복사된 구현이 아닙니다. 필수/선택 열을 보존한 표 행의 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 이제 충분한 재조회는 구체적인 호스트 지속 결과 대응으로 요구됩니다. 그 UI, 호스트 큐 소유, generation, 요청 전용 타이머 정책은 독립 설계입니다. 모순되는 적합 사용 문장과 공식 지속 시간 지침 원문은 아래에 보존되어 있습니다.
- 상세에는 안내 이미지 참조 1개가 있으며, 내장 픽셀 다이어그램은 시각적으로 확인하지 않았습니다. 텍스트 구조/지침은 읽었습니다. 정확한 시각 치수/자산은 이후 시각·출처 검토가 필요합니다.
- 시맨틱 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작/스토리 소스, 독립 인수가 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 시맨틱 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `ToastContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트는 지원 사례 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에서 인용하거나 파생한 공식 텍스트는 원래의 KRDS 권리와 출처 표기를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용한 실질 요구사항을 면제하지 않습니다.
