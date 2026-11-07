# 태그 {#tag}

**계약 상태: 네이티브 구현용으로 범위 승인됨.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 승인일 뿐이며, 네이티브 동작, 시각/자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `tag`, 한국어 이름 태그, export `Tag`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_06_04](https://www.krds.go.kr/html/site/component/component_06_04.html), 보존된 [HTML](../../upstream/krds/raw/components/component_06_04.html). 조회 시각 `2026-10-29T23:28:04.603Z`, `84856` 바이트, SHA-256 `fcd8bad8d3bc0942c03112ebd00b07645cca0281f14fe07c9faf021c1da60857`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류는 `component`, 인수된 프로젝트 완료 종류도 `component`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 사례(변형·상태 축): `static`, `toggle`, `removable`, `add-filter`, `link`. 이는 네이티브 사례 이름입니다. 상태, 반응형, 외관 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형/예시 헤딩 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

레이블/컨테이너에 선택적 선행 체크 아이콘 또는 후행 삭제 아이콘이 붙습니다. 그룹은 대화형 또는 비대화형 중 하나로 통일합니다. 일괄 액션은 그룹 우측에, 더 보기 컨트롤은 선택적으로 둡니다. 필터링/삭제에는 실제 버튼을, 탐색 예시에만 실제 링크를 사용합니다.

## 의미 API {#plain-semantic-api}

독립 API: items {id,label,href?}[], mode=static|toggle|removable|add-filter|link, selectedIds/onSelectionChange, onRemove({id}), onAdd({id}), onClear(), appliedBarId. mode가 의미를 결정합니다. toggle은 aria-pressed를 사용합니다. 삭제 이름은 “[label] 옵션 삭제”, 추가 이름은 “[label] 필터 옵션 추가”입니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어 값과 기본값을 함께 주거나 mode를 바꾸는 것은 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청을 한 번 내보냅니다. disabled, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI/초점 상태를 유지하고, 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하며 제어 prop이 계속 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

대화형 그룹에 진입하면 첫 태그에 초점이 갑니다. 태그 탭 정지점은 하나이며 roving 초점을 씁니다(ArrowLeft/Right/Home/End 제안). 공식 Space/Enter keyup 활성화는 keydown과 네이티브 click으로 두 번 실행되지 않고 한 번만 실행되어야 합니다. 토글은 초점을 유지합니다. 필터를 추가하면 초점이 적용된 필터 막대로 이동합니다. 삭제하면 초점이 이전의 남은 활성 태그로 이동하고, 없으면 다음의 남은 활성 태그로, 사용할 태그가 없으면 실제 그룹 컨테이너로 이동합니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

레이블은 2단어 이내로 줄 바꿈 없이 짧게 하고 색은 최소한으로 일관되게 씁니다. 숨겨진 넘침 태그는 더 보기가 드러내기 전까지 접근할 수 없습니다. 네이티브 터치 대상과 초점 링은 분명해야 합니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

자동 폼 직렬화는 없습니다. 필터링 상태는 호스트가 소유합니다. 폼에 명시적으로 조합한 경우 그룹 리셋은 호스트 기본 selectedIds를 복원할 수 있습니다. IME는 사용자 지정 Enter 동작을 일으키면 안 됩니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

실제 필터 결과와 적용 막대 대상은 호스트가 소유합니다. 로컬 스토리는 로그만 내보내지 않고 데이터를 눈에 보이게 필터링하며 초점을 관리해야 합니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, list, item, label, icon, remove, clear, more; selected,disabled,expanded.

렌더링되는 모든 소유 파트는 `data-krds-component="tag"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위의 파트/상태 어휘는 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 토글 aria-pressed가 보이는 상태/필터 결과와 일치합니다.
2. Enter/Space keyup은 한 번만 호출합니다.
3. 삭제는 죽은 초점 없이 이전 태그 또는 그룹으로 초점을 옮깁니다.
4. 추가는 적용된 필터 막대로 초점을 옮깁니다.
5. 정적 태그는 초점을 받지 않습니다.
6. 링크 모드는 href의 브라우저 동작을 유지합니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 표시, 움직임이 있는 곳의 동작 줄이기를 검증합니다. 빈 스위트를 성공으로 주장하지 않습니다.

## 독립 로컬 표본 정책 {#independent-local-specimen-policy}

준비된 정적 표본은 네이티브 목록을 쓰고, 대화형 표본은 각각 모드에 맞는 실제 버튼이나 링크를 담은 그룹을 씁니다. 목록 role은 대화형 태그의 보편 요구사항이 아닙니다. 이는 독립 표본 정책이며 공식 변형이 추가된 것이 아닙니다.

## 필수 네이티브 스토리 {#required-native-stories}

`tag--static`, `tag--toggle`, `tag--removable`, `tag--add-filter`, `tag--link`, `tag--remove-last`, `tag--overflow`.

각 사례에는 해당하는 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태가 필요합니다. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 마련되며 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부를 인수해야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 사용합니다. Lit/Solid 2는 siheom 지원을 만들지 않고 선택된 네이티브 테스트 경로를 사용해야 합니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름/대상 관계를 검증해야 합니다. Solid 2는 Solid 1 컴파일러/렌더러를 import하면 안 됩니다. 다른 렌더러의 래퍼는 쓰지 않습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존된 상세 HTML에서 추출했으며 핵심 지침과 상호작용/마크업 표를 포함합니다. 공식 요구사항을 만들어 내지 않도록 원문 언어를 그대로 둡니다. “consider/recommended/can”에 해당하는 표현은 권고로 남습니다. 예시/CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 출처 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 아래 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립적인 선택입니다.

### 구조

- L[883–883](../../upstream/krds/raw/components/component_06_04.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_06_04.html:889): 1. 레이블 태그를 통해 전달하고자 하는 메타 데이터
- L[890–890](../../upstream/krds/raw/components/component_06_04.html:890): 2. 컨테이너 태그를 배경과 구분하는 윤곽선 또는 배경색
- L[891–891](../../upstream/krds/raw/components/component_06_04.html:891): 3. 삭제 아이콘 레이블과 관련된 데이터의 필터링을 해제할 수 있음을 안내함
- L[892–892](../../upstream/krds/raw/components/component_06_04.html:892): 4. 일괄 액션 버튼 태그 그룹 우측에 배치되어 전체 그룹에 대해 한 번에 동일한 동작을 수행하는 데 사용되는 버튼
- L[893–893](../../upstream/krds/raw/components/component_06_04.html:893): 5. 더 보기 버튼 표와 같이 공간이 제한되어 있는 경우 그룹 내 일부 토큰을 숨길 수 있음

### 유형

- L[901–901](../../upstream/krds/raw/components/component_06_04.html:901): 유형
- L[903–903](../../upstream/krds/raw/components/component_06_04.html:903): 단순 레이블
- L[904–904](../../upstream/krds/raw/components/component_06_04.html:904): 텍스트 레이블로만 구성된 태그 형식이다. 대개 데이터 집합의 개별 항목에 배치되어 항목의 분류 체계, 데이터 속성을 보여준다.
- L[907–907](../../upstream/krds/raw/components/component_06_04.html:907): 선행 아이콘과 레이블
- L[908–909](../../upstream/krds/raw/components/component_06_04.html:908): 체크 아이콘과 레이블로 구성된 태그 형식이다. 필터링·정렬 옵션의 하나로 선행 아이콘이 있는 태그 목록을 배치하여, 목록에 표시되고 있는 데이터 분류 또는 속성을 보여줄 수 있다. 이때, 태그 목록은 대화형 요소로 사용되며 사용자가 선택을 해제하면 단순 레이블 형태로 변경된다.
- L[912–912](../../upstream/krds/raw/components/component_06_04.html:912): 레이블과 삭제 아이콘
- L[913–913](../../upstream/krds/raw/components/component_06_04.html:913): 레이블과 삭제 아이콘으로 구성되어, 실행 시 설정된 필터링·정렬 옵션에서 해당 레이블 관련 옵션 설정이 해제됨을 안내한다.

### 용례

- L[920–920](../../upstream/krds/raw/components/component_06_04.html:920): 용례
- L[922–922](../../upstream/krds/raw/components/component_06_04.html:922): 사용하기 적합한 경우
- L[927–927](../../upstream/krds/raw/components/component_06_04.html:927): 사용자가 선택한 필터링·정렬 옵션 목록을 표시하고 선택된 조건을 삭제하는 데 태그를 이용할 수 있다.
- L[924–929](../../upstream/krds/raw/components/component_06_04.html:924): 필터링·정렬 패턴에서 설정된 옵션을 표시할 때 사용자가 선택한 필터링·정렬 옵션 목록을 표시하고 선택된 조건을 삭제하는 데 태그를 이용할 수 있다.
- L[933–933](../../upstream/krds/raw/components/component_06_04.html:933): 사용하기 적합하지 않은 경우
- L[938–938](../../upstream/krds/raw/components/component_06_04.html:938): 배지를 사용한다.
- L[935–940](../../upstream/krds/raw/components/component_06_04.html:935): 상호작용 없이 데이터의 특성 분류, 속성을 강조하여 표현하고자 할 때 배지를 사용한다.

### 사용성 가이드라인

- L[948–948](../../upstream/krds/raw/components/component_06_04.html:948): 사용성 가이드라인
- L[951–951](../../upstream/krds/raw/components/component_06_04.html:951): 레이블은 정확한 내용으로 간결하게 제공한다.
- L[952–952](../../upstream/krds/raw/components/component_06_04.html:952): 태그 레이블은 태그의 주제를 간결하고 명확하게 전달해야 한다. 레이블은 2단어 이내로 구성하고 텍스트 줄 바꿈이 발생하지 않도록 해야 한다.
- L[955–955](../../upstream/krds/raw/components/component_06_04.html:955): 태그는 관련 요소 주변에 배치한다.
- L[956–956](../../upstream/krds/raw/components/component_06_04.html:956): 한 페이지에서 여러 항목에 걸쳐 동일한 형태와 내용의 태그 반복적으로 사용되므로 사용자가 어떤 항목에 대한 태그인지를 명확하게 변별할 수 있도록 관련 요소 주변에 배치하고 항목이 서로 구분될 수 있도록 표현해야 한다.
- L[959–959](../../upstream/krds/raw/components/component_06_04.html:959): 대화형 태그와 비대화형 태그를 같은 그룹에 포함하지 않는다.
- L[960–960](../../upstream/krds/raw/components/component_06_04.html:960): 대화형 태그와 비대화형 태그가 같은 그룹에 혼합되어 있으면 사용자는 어떤 태그가 대화형으로 사용되는지 혼동을 느낄 수 있다.
- L[963–963](../../upstream/krds/raw/components/component_06_04.html:963): 지나치게 많은 태그를 사용하지 않는다.
- L[964–964](../../upstream/krds/raw/components/component_06_04.html:964): 태그를 많이 사용할수록 인지 부담이 증가되므로 최소의 태그를 사용한다. 이후, 사용자 의견 수렴 과정을 통해 추가가 필요한 태그를 확인하여 표시 개수를 늘릴 수 있다.
- L[971–971](../../upstream/krds/raw/components/component_06_04.html:971): 태그의 표현에 지나치게 많은 색상을 사용하지 않는다.
- L[972–973](../../upstream/krds/raw/components/component_06_04.html:972): 여러 색상은 사용자의 주의를 분산시키고 혼동을 줄 수 있으므로 가능한 한 태그에는 하나의 색상만 사용하는 것이 적합하다. 색상을 추가하고자 하는 경우, 색상을 활용한 태그 구분이 사용자에게 의미가 있는지를 가장 먼저 고려해야 한다. 그 다음 동시에 표시되는 태그 수를 고려하여, 모든 태그가 동등한 수준으로 강조될 수 있는 색상을 사용해야 한다.

### 접근성 가이드라인

- L[1099–1099](../../upstream/krds/raw/components/component_06_04.html:1099): 접근성 가이드라인
- L[1102–1102](../../upstream/krds/raw/components/component_06_04.html:1102): 대화형 태그의 초점을 명확하게 표시한다.
- L[1103–1103](../../upstream/krds/raw/components/component_06_04.html:1103): 대화형 태그가 초점을 가진 상태일 때, 태그에 인접 배경과 3:1 이상의 명도 대비를 갖는 윤곽선이 명확하게 표시되어야 한다.
- L[1111–1111](../../upstream/krds/raw/components/component_06_04.html:1111): 대화형 태그에 기능 또는 상태 정보를 명확하게 제공한다.
- L[1112–1112](../../upstream/krds/raw/components/component_06_04.html:1112): 사용자가 태그를 실행하였을 때 어떤 동작이 발생하는지 예측할 수 있도록 용도에 적합한 접근 가능한 이름이나 상태 정보를 제공해야 한다.
- L[1114–1117](../../upstream/krds/raw/components/component_06_04.html:1114): 필터링·조회 패턴의 일부로서 실행 시 해당 태그를 가진 요소에 대한 필터링 동작이 발생하는 경우: aria-pressed="true", aria-pressed="false" 속성을 활용하여 선택 상태에 대한 정보를 제공
- L[1118–1121](../../upstream/krds/raw/components/component_06_04.html:1118): 필터링·조회 패턴의 일부로서 실행 시 해당 태그에 대한 필터링 옵션이 해제되는 경우: aria-label="[태그 레이블] 옵션 삭제"
- L[1122–1125](../../upstream/krds/raw/components/component_06_04.html:1122): 관련된 항목 주변에 배치되어 실행 시 해당 태그에 대한 필터링 옵션이 설정되는 경우: aria-label="[태그 레이블] 필터 옵션 추가"
- L[1132–1132](../../upstream/krds/raw/components/component_06_04.html:1132): 태그의 색상으로 의미를 전달하지 않아야 한다.
- L[1133–1133](../../upstream/krds/raw/components/component_06_04.html:1133): 색상을 사용하여 태그를 구분할 수 있지만, 색상을 사용하여 의미를 전달해서는 안 된다.
- L[1140–1140](../../upstream/krds/raw/components/component_06_04.html:1140): 태그 레이블, 아이콘이 인접 배경과 3:1 이상의 명도 대비를 갖도록 표현한다.
- L[1141–1141](../../upstream/krds/raw/components/component_06_04.html:1141): 태그 레이블뿐만 아니라 태그 내부 아이콘이 인접 배경과 3:1 이상의 명도 대비를 갖도록 표현해야 한다. 아이콘은 태그를 통해 어떤 동작이 수행될 것인지를 예측하는 데 참고할 수 있는 중요한 정보이다.

### 상호작용 가이드라인

- L[1154–1154](../../upstream/krds/raw/components/component_06_04.html:1154): 상호작용 가이드라인
- L[1156–1156](../../upstream/krds/raw/components/component_06_04.html:1156): 태그 탐색과 실행
- L[1174–1177](../../upstream/krds/raw/components/component_06_04.html:1174): Click 대화형 태그인 경우, Click 시 해당 태그 조건이 필터링 옵션으로 추가된다. 초점은 적용된 필터링 옵션을 표시하는 막대로 이동한다.
- L[1178–1181](../../upstream/krds/raw/components/component_06_04.html:1178): Tab 대화형 태그인 경우, 태그 그룹으로 Tab 하면 첫 번째 태그에 초점이 위치한다. 한 번에 하나의 태그만 키보드 초점을 가진다.
- L[1182–1185](../../upstream/krds/raw/components/component_06_04.html:1182): Space, Enter 대화형 태그인 경우, 태그가 초점을 가진 상태에서 Space 또는 Enter 키에서 Keyup 이벤트가 발생하면 해당 태그 조건이 필터링 옵션으로 추가된다. 초점은 적용된 필터링 옵션을 표시하는 막대로 이동한다.
- L[1192–1192](../../upstream/krds/raw/components/component_06_04.html:1192): 태그 선택
- L[1210–1213](../../upstream/krds/raw/components/component_06_04.html:1210): Click Click 시 해당 태그 조건의 선택 상태가 토글된다. 초점은 Click한 요소에 유지된다.
- L[1214–1217](../../upstream/krds/raw/components/component_06_04.html:1214): Space 태그가 초점을 가진 상태에서 Space 또는 Enter 키에서 Keyup 이벤트가 발생하면 해당 태그 조건의 선택 상태가 토글된다. 초점은 Keyup 이벤트가 발생한 태그에 유지된다.
- L[1224–1224](../../upstream/krds/raw/components/component_06_04.html:1224): 태그 삭제
- L[1242–1245](../../upstream/krds/raw/components/component_06_04.html:1242): Click Click 시 해당 태그 조건이 목록에서 제거된다. 초점은 삭제된 태그의 이전 태그로 이동한다. 만약 초점을 이동할 태그가 목록에 남아 있지 않다면 태그 목록을 표시하는 컨테이너 자체로 초점이 이동한다.
- L[1246–1249](../../upstream/krds/raw/components/component_06_04.html:1246): Space 태그가 초점을 가진 상태에서 Space 또는 Enter 키에서 Keyup 이벤트가 발생하면 해당 태그 조건이 목록에서 제거된다. 초점은 삭제된 태그의 이전 태그로 이동한다. 만약 초점을 이동할 태그가 목록에 남아 있지 않다면 태그 목록을 표시하는 컨테이너 자체로 초점이 이동한다.

### 예시

- L[1268–1268](../../upstream/krds/raw/components/component_06_04.html:1268): 예시
- L[1272–1272](../../upstream/krds/raw/components/component_06_04.html:1272): 기본
- L[1348–1348](../../upstream/krds/raw/components/component_06_04.html:1348): 기본 코드 확인하기
- L[1364–1364](../../upstream/krds/raw/components/component_06_04.html:1364): 링크형
- L[1413–1413](../../upstream/krds/raw/components/component_06_04.html:1413): 링크형 코드 확인하기

### 마크업 가이드

- L[1433–1433](../../upstream/krds/raw/components/component_06_04.html:1433): 마크업 가이드
- L[1436–1436](../../upstream/krds/raw/components/component_06_04.html:1436): CSS 선택자
- L[1456–1462](../../upstream/krds/raw/components/component_06_04.html:1456): 태그 전체영역 .krds-tag-wrap 사이즈 크게 .large
- L[1463–1466](../../upstream/krds/raw/components/component_06_04.html:1463): 중간 .medium
- L[1467–1470](../../upstream/krds/raw/components/component_06_04.html:1467): 작게 .small
- L[1471–1476](../../upstream/krds/raw/components/component_06_04.html:1471): 태그 버튼영역 .krds-btn-tag 링크형 .link

인라인으로 보존된 예시 마크업(참고용이며 공개 네이티브 API가 아님): L[1277–1342](../../upstream/krds/raw/components/component_06_04.html:1277), L[1369–1407](../../upstream/krds/raw/components/component_06_04.html:1369)

CSS/JS/안내 이미지의 출처 참조는 복사된 구현이 아닙니다. 필수/선택 열을 보존한 표 행의 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 기록된 독립 결정: 삭제가 승인되면 먼저 이전의 남은 활성 태그에 초점을 둡니다. 삭제된 태그가 첫 번째이고 뒤 태그가 남아 있으면 다음의 남은 활성 태그에 초점을 둡니다. 사용할 태그가 없으면 임시 tabindex=-1로 실제 태그 목록 컨테이너에 초점을 둡니다. 삭제된 노드에는 초점을 두지 않습니다. 호스트가 삭제를 거부하면 초점을 유지합니다. 이는 명시되지 않은 첫 항목 경우를 채우되, 공식 이전 태그 및 빈 컨테이너 목적지를 보존합니다.
- 연결된 외부 코드 예시는 참조만 하며 이번 준비에서 별도 파일로 포함하거나 읽지 않았습니다: L1353 `../../code/tag.html`, L1418 `../../code/tag_link.html`, L1491 `./variable/tag.html`. 보지 못한 내용을 추론하지 않습니다.
- 상세에는 안내 이미지 참조 3개가 있으며, 내장 픽셀 다이어그램은 시각적으로 확인하지 않았습니다. 텍스트 구조/지침은 읽었습니다. 정확한 시각 치수/자산은 이후 시각·출처 검토가 필요합니다.
- 시맨틱 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작/스토리 소스, 독립 인수가 필요합니다.

## 수용된 독립 결정 {#accepted-independent-resolution}

삭제가 승인되면 먼저 이전의 남은 활성 태그에 초점을 둡니다. 삭제된 태그가 첫 번째이고 뒤 태그가 남아 있으면 다음의 남은 활성 태그에 초점을 둡니다. 사용할 태그가 없으면 임시 tabindex=-1로 실제 태그 목록 컨테이너에 초점을 둡니다. 삭제된 노드에는 초점을 두지 않습니다. 호스트가 삭제를 거부하면 초점을 유지합니다. 이는 명시되지 않은 첫 항목 경우를 채우되, 공식 이전 태그 및 빈 컨테이너 목적지를 보존합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 시맨틱 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `TagContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트는 지원 사례 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에서 인용하거나 파생한 공식 텍스트는 원래의 KRDS 권리와 출처 표기를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용한 실질 요구사항을 면제하지 않습니다.
