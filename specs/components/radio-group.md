# 라디오 버튼 {#radio-group}

**계약 상태: 네이티브 구현용으로 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐이며, 네이티브 동작, 시각/자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `radio-group`, 한국어 이름 라디오 버튼, export `RadioGroup`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_06_01](https://www.krds.go.kr/html/site/component/component_06_01.html), 보존된 [HTML](../../upstream/krds/raw/components/component_06_01.html). 조회 시각 `2026-10-29T23:28:04.390Z`, `89854` 바이트, SHA-256 `28578bf2746fa0f35bb0d4faac7f9c6d2515a9dc3dacc07cb3ffeacdca6c5e44`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조해 확인했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 별개입니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류 `component`, 수용된 프로젝트 완료 종류 `component`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 케이스(변형·상태 축): `default`, `chip`, `medium`, `large`. 이는 네이티브 케이스 이름이며, 상태·반응형·외형 축이 곧 공식 명명 변형은 아닙니다. 공식 유형/예시 헤딩은 근거 부록에 그대로 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

이름 있는 fieldset/legend 그룹 안에 같은 `name`의 네이티브 `input[type=radio]`와 오른쪽 레이블을 연결합니다. 기본은 세로이며, 가로 배치는 충분한 간격이 필요합니다. 정확한 선택이 중요한 경우 미리 선택하지 않습니다. 선택적 “없음/모름”은 호스트가 명시하는 옵션입니다.

## 의미 API {#plain-semantic-api}

독립 API: `options: readonly RadioGroupOption[]`(`RadioGroupOption`은 기존 `SelectOption`을 확장하며 선택적 `id?:string`을 가짐), `name`, `value?: string | null`, `defaultValue?: string | null`(비제어 기준선은 `null`), `onValueChange({value:string | null})`, `required=false`, `disabled=false`, `invalid`/`errorId`/`helpId`, `size=medium`, `appearance=default|chip`. `null`을 포함해 정의된 `value`는 제어 모드를 택하며, `undefined`만 비제어를 뜻합니다. `null`은 체크된 라디오가 없음을 뜻합니다. 빈 문자열 `""`을 포함한 모든 문자열은 유효한 일반 옵션 값이며, 고유한 옵션 하나와 정확히 일치해야 합니다. 빈 문자열도, 없는 옵션도 빈 값 표지(sentinel)가 아닙니다. 알 수 없는 non-null 값과 중복 옵션 값은 설정 오류입니다. “없음/모름” 옵션을 자동으로 넣지 않으며, 그것은 호스트가 명시하는 콘텐츠입니다.

[파일럿 제어/리셋 규약](./README.md)을 적용합니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 선택이 바뀔 때마다 사용자 요청 하나를 내보내며, 거부되어도 마찬가지입니다. 마운트, 하이드레이션, prop, 리셋 변경은 콜백을 내보내지 않습니다. 이미 선택된 옵션을 클릭하면 no-op입니다. prop이 `null`로 바뀌면 이벤트 없이 체크된 비트를 모두 지웁니다. 제어 모드에서 거부되면 모든 실제 네이티브 라디오의 체크 비트를 커밋된 prop에 맞춰 조정하며, `null`이면 모두 해제로 복원합니다. 수용되지 않은 브라우저 토글이 렌더링, 유효성, FormData로 새어 나가면 안 됩니다.

**명시적 옵션 식별(추가 조합 API):** 옵션은 실제 네이티브 라디오 입력에 쓸 비어 있지 않은 고유 `id`를 줄 수 있습니다. 그 ID를 그대로 적용하고 실제 레이블을 같은 컨트롤에 연결하며, 중복 프록시 입력을 만들거나 ID를 선택 값으로 쓰지 않습니다. 생략하면 기존의 안정적인 생성 ID 동작이 그대로입니다. 중복되거나 빈 명시 ID는 설정 오류입니다. 이 라디오 전용 하위 타입은 NativeSelect와 무관한 `SelectOption` 계약에 ID를 더하거나 의미를 바꾸지 않습니다. 선택, 그룹화, `null`/빈 문자열 값, 리셋, 콜백은 그대로입니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

공식 요구 **활성화된 모든 라디오를 Tab과 Shift+Tab으로 순차 접근할 수 있어야 한다**를 보존합니다. 이는 실제 같은 `name` 네이티브 라디오 그룹화, 그리고 별도로 요구되는 화살표 이동/선택과 함께 적용됩니다([공식 L1211–1218](../../upstream/krds/raw/components/component_06_01.html:1211)). 비활성 라디오는 건너뜁니다. Tab 순회는 초점만 바꿉니다. Space, 연결된 레이블/컨트롤 클릭, 해당 화살표 키가 옵션 하나를 선택하며, 중복 합성 활성화 없이 변경 값 요청 하나를 내보냅니다. 초점 링은 보이는 라디오 영역에 둡니다.

고정된 같은 `name` 네이티브 예시는 브라우저의 통상적인 단일 그룹 Tab 동작을 가지며, 이는 모든 라디오 순차 접근이라는 명시적 행과 충돌합니다. 이 긴장이 그 행을 부정하거나 네이티브 기본 그룹화를 적합하다고 선언할 근거가 되지는 않습니다. 제안 계약은 활성화된 모든 라디오의 순차 접근을 보존합니다. 수용된 독립 구현 정책은 초점이 그룹 안에 있을 때 Tab/Shift+Tab을 가로채 체크 상태를 바꾸지 않고 다음/이전의 활성화된 실제 같은 `name` 네이티브 라디오로 초점을 옮기며, 그룹 경계에서는 브라우저가 빠져나가도록 허용하는 것입니다. 모든 실제 라디오는 일반 네이티브 그룹 속성을 유지하며 이름을 바꾸거나 복제하거나 대체하지 않습니다. 이로써 네이티브 화살표/폼 동작을 유지하면서 명시된 순차 접근 행을 보존합니다. 각 렌더러는 역방향 진입/이탈과 거부된 제어 선택을 검증해야 하며, 네이티브 기본 Tab만으로는 충분하지 않습니다. 각 렌더러/브라우저는 실제 라디오 폼/그룹 의미와 화살표 선택을 보존하고 Tab으로 인한 추가 선택이 없는 상태에서, 활성화된 모든 라디오에 대한 정방향·역방향 순차 접근을 입증해야 합니다. 백엔드/네이티브 기본값만으로는 이 결과의 근거가 되지 않습니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

세로 배치와 오른쪽 레이블을 선호합니다. 옵션이 많으면(익숙한 기준 7개 초과) 셀렉트(Select)가 나을 수 있습니다. 네이티브 앱/모바일 권고는 맥락에 따르며 배제가 아닙니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

`null`이면 모든 실제 라디오가 해제되고, 필수 그룹은 유효하지 않으며, FormData에 name/값이 담기지 않습니다. 체크된 활성 옵션은 정확한 문자열(빈 문자열 값 포함)을 전달하고, 비활성 컨트롤/fieldset은 제외됩니다. 취소되지 않은 리셋은 비제어 초기 `defaultValue`/`null`을 복원하고, 제어 상태는 현재 prop을 유지합니다. 모든 네이티브 체크 비트와 필수 유효성을 콜백 없이 조정합니다. 취소된 리셋은 선택도 네이티브 조정 기준선도 바꾸지 않습니다. prop에 의한 해제는 리셋도 사용자 동작도 아닙니다. 레이블과 오류/도움말 연결은 네이티브로 남아 테스트 가능해야 합니다. 편집 가능한 IME 경로는 없습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

정렬(정당한 우선순위가 없으면 가나다순 기본), 옵션 데이터, 필수 검증 문구는 호스트가 맡습니다. 버튼 role 대체물이 아니라 실제 네이티브 라디오의 폼 참여가 완료 조건입니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, legend, item, control, indicator, label, help, error; checked,unchecked,disabled,invalid.

렌더링되는 모든 소유 파트는 `data-krds-component="radio-group"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 사용합니다. 네이티브/ARIA 상태가 기준입니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 사용자 선택마다 정확히 하나의 선택과 하나의 변경이 발생합니다.
2. 레이블이 해당 라디오를 활성화합니다.
3. 화살표 탐색은 비활성 선택지를 거치지 않고 선택합니다.
4. FormData, 리셋, 필수 유효성이 네이티브 컨트롤과 일치합니다.
5. 신중한 선택이 필요한 미선택 예시에 의도치 않은 기본값이 없습니다.
6. 칩은 네이티브 라디오 의미를 유지합니다.
7. 정방향 Tab과 역방향 Shift+Tab이 초점만으로 선택을 바꾸지 않고, 실제 같은 `name` 그룹화를 보존하며 활성화된 모든 라디오에 닿습니다.
8. 제어 `null`은 모두 해제 상태로 렌더링되고, 필수 무효이며, FormData 항목이 없습니다. 빈 문자열 옵션 선택은 빈 문자열을 제출합니다.
9. prop 해제, 거부된 선택, 취소되었거나 수용된 리셋은 prop/리셋 알림 없이 모든 체크 비트를 조정합니다.

이는 앞으로 필요한 테스트이며, 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 단서, 움직임이 있는 곳의 동작 줄이기를 확인합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`radio-group--default`, `radio-group--chip`, `radio-group--medium-large`, `radio-group--unselected-required`, `radio-group--disabled-option`, `radio-group--form-reset`, `radio-group--controlled`, `radio-group--all-radio-sequential-access`, `radio-group--controlled-null`, `radio-group--controlled-clear-rejected`, `radio-group--empty-string-option`.

각 케이스는 해당되는 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태를 갖춰야 합니다. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 준비하며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 인수되어야 합니다. 동작 스위트는 스토리 파일과 분리하며, 지원되는 upstream siheom 어댑터만 사용합니다. Lit/Solid 2는 siheom 지원을 만들어 내지 않고 선택한 네이티브 테스트 경로를 씁니다. Qwik은 첫 lazy 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 partial APF 소비를 테스트해야 합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증해야 합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져오지 않습니다. 다른 렌더러의 래퍼는 금지합니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML 원본에서 뽑았으며, 실질 지침과 상호작용/마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 원문 언어를 유지합니다. “고려/권장/가능” 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행하면 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립적 선택입니다.

### 구조

- L[883–883](../../upstream/krds/raw/components/component_06_01.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_06_01.html:889): 1. 그룹 레이블(선택) 옵션 목록의 카테고리에 대한 설명 또는 옵션 선택에 대한 도움말을 제공함
- L[890–890](../../upstream/krds/raw/components/component_06_01.html:890): 2. 버튼 양식 버튼의 현재 선택 상태를 보여줌
- L[891–891](../../upstream/krds/raw/components/component_06_01.html:891): 3. 버튼 레이블 선택하거나 선택 해제할 정보를 나타냄

### 용례

- L[899–899](../../upstream/krds/raw/components/component_06_01.html:899): 용례
- L[901–901](../../upstream/krds/raw/components/component_06_01.html:901): 사용하기 적합한 경우
- L[906–906](../../upstream/krds/raw/components/component_06_01.html:906): 사용자가 여러 개의 옵션을 선택할 수 있도록 하는 경우에는 체크박스를 사용해야 한다.
- L[903–908](../../upstream/krds/raw/components/component_06_01.html:903): 사용자가 옵션 목록에서 한 개의 값만 선택할 수 있는 경우 사용자가 여러 개의 옵션을 선택할 수 있도록 하는 경우에는 체크박스를 사용해야 한다.
- L[912–912](../../upstream/krds/raw/components/component_06_01.html:912): 셀렉트나 콤보 상자보다 라디오 버튼이 적합하다.
- L[913–913](../../upstream/krds/raw/components/component_06_01.html:913): 예) 설문조사 응답 문항
- L[909–915](../../upstream/krds/raw/components/component_06_01.html:909): 사용자가 옵션을 선택하기 위해 여러 옵션을 비교해야 하거나 선택 과정의 효율성이 중요한 경우 셀렉트나 콤보 상자보다 라디오 버튼이 적합하다. 예) 설문조사 응답 문항
- L[919–919](../../upstream/krds/raw/components/component_06_01.html:919): 사용하기 적합하지 않은 경우
- L[924–924](../../upstream/krds/raw/components/component_06_01.html:924): 체크박스를 사용해야 한다.
- L[921–926](../../upstream/krds/raw/components/component_06_01.html:921): 사용자가 여러 개의 옵션을 선택할 수 있도록 하는 경우 체크박스를 사용해야 한다.
- L[930–930](../../upstream/krds/raw/components/component_06_01.html:930): 옵션의 개수가 7개를 초과하며 사용자가 옵션 목록에 친숙한 경우에 라디오 버튼이 아니라 셀렉트나 콤보 상자를 사용하면 사용자의 인지적 부담을 줄이고 활용할 수 있는 공간을 확보하는 데 도움이 된다.
- L[927–932](../../upstream/krds/raw/components/component_06_01.html:927): 옵션의 개수가 많은 경우 옵션의 개수가 7개를 초과하며 사용자가 옵션 목록에 친숙한 경우에 라디오 버튼이 아니라 셀렉트나 콤보 상자를 사용하면 사용자의 인지적 부담을 줄이고 활용할 수 있는 공간을 확보하는 데 도움이 된다.
- L[936–936](../../upstream/krds/raw/components/component_06_01.html:936): 옵션을 확인하기 위해 전체 화면을 스크롤 하는 것보다 별도의 옵션 목록을 탐색하는 것이 더 효율적이므로 셀렉트나 콤보 상자의 사용을 우선적으로 고려해야 한다.
- L[933–938](../../upstream/krds/raw/components/component_06_01.html:933): 모바일 플랫폼 옵션을 확인하기 위해 전체 화면을 스크롤 하는 것보다 별도의 옵션 목록을 탐색하는 것이 더 효율적이므로 셀렉트나 콤보 상자의 사용을 우선적으로 고려해야 한다.

### 사용성 가이드라인

- L[946–946](../../upstream/krds/raw/components/component_06_01.html:946): 사용성 가이드라인
- L[949–949](../../upstream/krds/raw/components/component_06_01.html:949): 기본적으로 라디오 버튼의 옵션은 가나다순으로 정렬한다.
- L[950–951](../../upstream/krds/raw/components/component_06_01.html:950): 사용자가 가장 많이 선택하는 옵션을 먼저 배치할 경우 옵션을 빠르게 선택하는 데 도움이 될 수 있다. 그러나 특정한 기준에 따른 옵션 정렬이 편견이나 차별을 강화할 수 있으므로 유의해서 사용해야 한다. 정렬 기준에 대한 명확한 근거나 이유가 없는 경우에는 가나다순으로 정렬하는 것이 가장 안전하다.
- L[954–954](../../upstream/krds/raw/components/component_06_01.html:954): 라디오 버튼은 수직으로, 라디오 버튼의 레이블은 양식의 오른쪽에 배치한다.
- L[955–955](../../upstream/krds/raw/components/component_06_01.html:955): 가독성과 옵션 간 명확한 구분을 위하여 라디오 버튼은 수직으로 배치하는 것이 좋다. 이때, 레이블은 양식의 오른쪽에 배치해 일관된 위치에서 텍스트를 읽을 수 있도록 해야 한다. 만약 라디오 버튼을 수평으로 배치해야 한다면 레이블의 텍스트 길이가 지나치게 길지 않아야 한다.
- L[966–966](../../upstream/krds/raw/components/component_06_01.html:966): 라디오 버튼을 수평으로 배치하는 경우 버튼 간 간격을 충분히 제공한다.
- L[967–967](../../upstream/krds/raw/components/component_06_01.html:967): 각 라디오 버튼의 간격을 양식과 레이블 간 간격과 동일하게 제공하는 경우 사용자에게 혼동을 줄 수 있으므로 유의해야 한다.
- L[978–978](../../upstream/krds/raw/components/component_06_01.html:978): 라디오 버튼의 레이블은 분명하고 정확하게 제공한다.
- L[979–979](../../upstream/krds/raw/components/component_06_01.html:979): 사용자가 어떤 옵션을 선택하는 것인지 이해할 수 있도록 라디오 버튼의 레이블은 분명하고 정확하게 제공해야 한다.
- L[990–990](../../upstream/krds/raw/components/component_06_01.html:990): 사용자가 정확한 값을 입력하는 것이 중요한 경우 라디오 버튼의 특정 옵션을 기본 선택값으로 제공하지 않아야 한다.
- L[991–991](../../upstream/krds/raw/components/component_06_01.html:991): 사용자가 어떤 질문이나 선택을 해야 하는지를 놓치거나 잘못된 옵션 값을 제출하는 실수를 할 수 있으므로 유의해야 한다.
- L[1004–1004](../../upstream/krds/raw/components/component_06_01.html:1004): ‘해당 없음’, ‘잘 모름’ 옵션 제공을 고려한다.
- L[1005–1006](../../upstream/krds/raw/components/component_06_01.html:1005): 일단 라디오 버튼 옵션 목록에서 하나의 옵션을 선택하고 나면 화면을 새로 고침하기 전까지 선택을 되돌릴 수 없다. 필수 입력 항목이 아닌 경우와 같이 아무 값도 선택하지 않아도 되는 상황을 고려하여 ‘해당 없음’, 잘 모름’, ‘선택 안 함’과 같은 옵션을 제공하는 것이 좋다.

### 접근성 가이드라인

- L[1121–1121](../../upstream/krds/raw/components/component_06_01.html:1121): 접근성 가이드라인
- L[1124–1124](../../upstream/krds/raw/components/component_06_01.html:1124): 버튼 양식과 인접 배경 간 명도 대비를 3:1 이상으로 표현한다.
- L[1125–1125](../../upstream/krds/raw/components/component_06_01.html:1125): 원형의 라디오 버튼 양식은 라디오 버튼의 선택 상태와 해당 요소가 라디오 버튼 컴포넌트임을 인지할 수 있게 도와주는 중요한 시각적 정보이므로 인접 배경과의 명도 대비를 최소 3:1 이상으로 제공해야 한다.
- L[1132–1132](../../upstream/krds/raw/components/component_06_01.html:1132): 버튼 양식의 선택 상태를 색상으로만 구분하지 않는다.
- L[1133–1133](../../upstream/krds/raw/components/component_06_01.html:1133): 버튼 양식의 선택 상태를 색상 이외의 수단으로 구분할 수 있는 시각적 단서를 제공해야 한다.
- L[1148–1148](../../upstream/krds/raw/components/component_06_01.html:1148): 라디오 버튼을 키보드로 탐색하고 실행할 수 있도록 한다.
- L[1149–1150](../../upstream/krds/raw/components/component_06_01.html:1149): 사용자 에이전트에서 제공되는 기본 버튼 양식이 아니라 커스텀 양식 디자인을 사용하는 경우에 기본 버튼 양식에 display:none, visibility:hidden, opacity:0과 같은 스타일을 하면 스크린 리더에서 라디오 버튼의 역할을 인지할 수 없으며 키보드로 옵션을 선택할 수 없게 된다.
- L[1158–1158](../../upstream/krds/raw/components/component_06_01.html:1158): 라디오 버튼에 키보드 초점이 명확하게 표시되도록 한다.
- L[1159–1160](../../upstream/krds/raw/components/component_06_01.html:1159): 사용자 에이전트에서 제공되는 기본 버튼 양식이 아니라 커스텀 양식 디자인을 사용하는 경우 키보드 초점이 시각적으로 표시되도록 스타일을 제공해야 한다. 라디오 버튼 요소를 시각적으로 숨기는 경우, 시각적으로 표시되고 있는 버튼 양식과 숨겨진 요소의 크기와 위치를 일치시켜 포커스링이 적절하게 표시되도록 구현해야 한다.
- L[1168–1168](../../upstream/krds/raw/components/component_06_01.html:1168): 라디오 버튼에 접근 가능한 이름을 제공한다.
- L[1169–1170](../../upstream/krds/raw/components/component_06_01.html:1169): 스크린 리더 사용자가 라디오 버튼의 용도를 확인할 수 있도록 &lt;label&gt;, title, aria-label, aria-labelledby 중 1가지 방식을 이용하여 레이블을 제공해야 한다. 이때, 가능하면 &lt;label&gt;을 이용하여 사용자가 레이블을 클릭하였을 때에도 값을 선택할 수 있도록 구현하는 것이 좋다.
- L[1178–1178](../../upstream/krds/raw/components/component_06_01.html:1178): 스크린 리더에서 그룹 레이블과 라디오 버튼 그룹의 관계를 확인할 수 있도록 한다.
- L[1179–1179](../../upstream/krds/raw/components/component_06_01.html:1179): &lt;fieldset&gt;, &lt;legend&gt;를 사용하여 스크린 리더 사용자에게 라디오 버튼 그룹에서 값을 선택하는 목적을 보다 명확하게 전달할 수 있다.

### 상호작용 가이드라인

- L[1191–1191](../../upstream/krds/raw/components/component_06_01.html:1191): 상호작용 가이드라인
- L[1193–1193](../../upstream/krds/raw/components/component_06_01.html:1193): 탐색
- L[1211–1214](../../upstream/krds/raw/components/component_06_01.html:1211): Tab, Shift + Tab 모든 라디오 버튼은 Tab, Shift + Tab 키를 눌렀을 때 접근할 수 있어야 한다.
- L[1215–1218](../../upstream/krds/raw/components/component_06_01.html:1215): 방향키 ↑/←, ↓/→ 방향키 ↑/←, ↓/→를 눌렀을 때 다음/이전 라디오 버튼 양식으로 초점이 이동하고 값이 선택되어야 한다.
- L[1225–1225](../../upstream/krds/raw/components/component_06_01.html:1225): 실행
- L[1243–1246](../../upstream/krds/raw/components/component_06_01.html:1243): Click 버튼 양식 또는 버튼 레이블을 Click 하였을 때 값이 선택되어야 한다.
- L[1247–1250](../../upstream/krds/raw/components/component_06_01.html:1247): Space 라디오 버튼 양식에 초점이 있는 상태에서 Space 키를 누르면 값이 선택되어야 한다.
- L[1251–1254](../../upstream/krds/raw/components/component_06_01.html:1251): 방향키 ↑/←, ↓/→ 방향키 ↑/←, ↓/→를 눌렀을 때 다음/이전 라디오 버튼 양식으로 초점이 이동하고 값이 선택되어야 한다.

### 예시

- L[1273–1273](../../upstream/krds/raw/components/component_06_01.html:1273): 예시
- L[1277–1277](../../upstream/krds/raw/components/component_06_01.html:1277): 기본
- L[1342–1342](../../upstream/krds/raw/components/component_06_01.html:1342): 기본 코드 확인하기
- L[1358–1358](../../upstream/krds/raw/components/component_06_01.html:1358): 사이즈
- L[1384–1384](../../upstream/krds/raw/components/component_06_01.html:1384): 사이즈 코드 확인하기
- L[1400–1400](../../upstream/krds/raw/components/component_06_01.html:1400): chip
- L[1430–1430](../../upstream/krds/raw/components/component_06_01.html:1430): chip 코드 확인하기

### 마크업 가이드

- L[1450–1450](../../upstream/krds/raw/components/component_06_01.html:1450): 마크업 가이드
- L[1453–1453](../../upstream/krds/raw/components/component_06_01.html:1453): CSS 선택자
- L[1474–1479](../../upstream/krds/raw/components/component_06_01.html:1474): 전체영역 .krds-check-area 체크박스 세로 정렬 .chk-column
- L[1480–1486](../../upstream/krds/raw/components/component_06_01.html:1480): radio 감싸는 영역 .krds-form-check 사이즈 중간 .medium
- L[1487–1490](../../upstream/krds/raw/components/component_06_01.html:1487): 크게 .large
- L[1500–1500](../../upstream/krds/raw/components/component_06_01.html:1500): 개발 시 접근성 관련 주의 사항
- L[1502–1502](../../upstream/krds/raw/components/component_06_01.html:1502): 폼 컨트롤에 label을 매칭할 수 없는경우 title, aria-label, aria-labelledby 중 한가지 속성을 넣어 레이블을 제공한다.

보존된 인라인 예시 마크업(참고용이며 공개 네이티브 API 아님): L[1282–1336](../../upstream/krds/raw/components/component_06_01.html:1282), L[1363–1378](../../upstream/krds/raw/components/component_06_01.html:1363), L[1405–1424](../../upstream/krds/raw/components/component_06_01.html:1405)

CSS/JS/가이드 이미지에 대한 출처 참조는 복사된 구현이 아닙니다. 표 행의 원본 HTML(필수/선택 열 보존)은 [source-evidence.json](../../catalog/source-evidence.json)에 보관합니다. 위의 평탄화 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 기록된 독립 결정: 내부 Tab/Shift+Tab은 선택하지 않고 다음/이전의 활성화된 실제 같은 `name` 네이티브 라디오로 초점을 명시적으로 옮기며, 경계에서는 브라우저 이탈을 유지합니다. 브라우저의 역방향 그룹 진입을 입증해야 합니다. 화살표 선택, 네이티브 name 그룹화, FormData는 네이티브로 남습니다. 컨트롤을 복제하거나 그룹 이름을 바꾸지 않습니다.
- 연결된 외부 코드 예시는 참조만 했고 이번 준비에서 별도 파일로 포함·열람하지 않았습니다: L1347 `../../code/radio_button.html`, L1389 `../../code/radio_size.html`, L1435 `../../code/radio_chip.html`, L1514 `./variable/radio_button.html`. 보지 못한 내용은 추정하지 않습니다.
- 상세에는 가이드 이미지 참조가 13개 있으나, 포함된 픽셀 다이어그램은 시각 검사하지 않았습니다. 텍스트 구조와 지침만 읽었습니다. 정확한 시각 수치와 자산은 이후 시각/출처 검토가 필요합니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 자체 구현, 동작/스토리 소스, 독립 인수가 여전히 필요합니다.

## 수용된 독립 결정 {#accepted-independent-resolution}

내부 Tab/Shift+Tab은 선택하지 않고 다음/이전의 활성화된 실제 같은 `name` 네이티브 라디오로 초점을 명시적으로 옮기며, 경계에서는 브라우저 이탈을 유지합니다. 브라우저의 역방향 그룹 진입을 입증해야 합니다. 화살표 선택, 네이티브 name 그룹화, FormData는 네이티브로 남습니다. 컨트롤을 복제하거나 그룹 이름을 바꾸지 않습니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `RadioGroupContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트가 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크의 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 의무입니다.

공식 인용·파생 텍스트는 원래의 KRDS 권리와 출처 표기를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 출처 식별은 그대로입니다. 남은 근거 한계는 검사하지 못한 가이드 픽셀, 연결 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
