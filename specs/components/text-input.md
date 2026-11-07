# 텍스트 입력 필드 {#text-input}

**계약 상태: 네이티브 구현용으로 범위 승인됨.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 승인일 뿐이며, 네이티브 동작, 시각/자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `text-input`, 한국어 이름 텍스트 입력 필드, export `TextInput`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_09_03](https://www.krds.go.kr/html/site/component/component_09_03.html), 보존된 [HTML](../../upstream/krds/raw/components/component_09_03.html). 조회 시각 `2026-10-29T23:28:05.462Z`, `89860` 바이트, SHA-256 `5644f9fe165d0143d87c56356cf23de1658d4b13c4a20cc180b8d10bc223a53f`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류는 `component`, 인수된 프로젝트 완료 종류도 `component`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 사례(변형·상태 축): `default`, `error`, `success`, `small`, `medium`, `large`, `icon-action`. 이는 네이티브 사례 이름입니다. 상태, 반응형, 외관 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형/예시 헤딩 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

네이티브 한 줄 입력에 지속되는 레이블, 선택적 도움말/오류와 플레이스홀더, 선택적이며 별도 이름을 가진 아이콘 버튼을 둡니다. 보이는 초점과 오류/성공 표시가 있어야 합니다. 반복되는 개인 정보에는 브라우저 자동 완성을 씁니다. 붙여넣기를 막지 않습니다.

## 의미 API {#plain-semantic-api}

독립 API: type=text|email|tel|url|password|search (기본 text), value/defaultValue="", onValueChange({value}), name, autocomplete,inputMode, required, disabled, readOnly, minLength/maxLength/pattern, status=default|error|success, helpId/errorId, size=medium, iconAction? {label,onAction}. 기본적으로 날짜 파싱이나 숫자 변환은 하지 않습니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어 값과 기본값을 함께 주거나 mode를 바꾸는 것은 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청을 한 번 내보냅니다. disabled, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI/초점 상태를 유지하고, 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하며 제어 prop이 계속 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

편집/선택은 네이티브 동작이며 레이블을 클릭하면 초점이 갑니다. 아이콘 버튼은 type=button이며 제출하지 않습니다. 한글 IME 조합 중에는 값을 다시 쓰지 않으며 조합 중 Enter를 확정으로 취급하지 않습니다. 조합이 끝난 뒤의 일반 Enter 폼 제출은 호스트/브라우저 동작으로 남습니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

유동 필드는 보통 섹션을 채웁니다. 예측 가능한 짧은 필드는 예상 입력 크기에 맞출 수 있으나 작은 화면에서 잘리면 안 됩니다. 모바일 키보드는 제공된 type/inputMode를 따르며, 임의의 식별자에 숫자 키보드를 강제하지 않습니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

네이티브 name/value FormData를 따릅니다. disabled는 제외하고 readonly는 포함하며, 리셋은 defaultValue로 되돌립니다. 제어 리셋은 콜백 없이 현재 prop을 유지합니다. 오류는 aria-invalid/설명과 required 유효성으로 나타냅니다. 비밀번호 표시 기능을 제공한다면 값과 캐럿을 보존하고 접근 가능한 토글 레이블을 바꿔야 합니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

검증 시점, 개인 정보 자동 완성 토큰, 선택적 표시/검색 동작, 원격 검사는 호스트가 소유합니다. 로컬 스토리는 인증/API를 호출할 수 없습니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, label, control, help, error, icon-action; invalid,success,disabled,readonly,focused.

렌더링되는 모든 소유 파트는 `data-krds-component="text-input"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위의 파트/상태 어휘는 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 보이는 레이블과 설명/오류 연결이 입력 후에도 유지됩니다.
2. FormData/리셋/disabled/readonly가 올바릅니다.
3. 붙여넣기/IME/캐럿이 안정적입니다.
4. 아이콘 동작은 폼 제출 없이 한 번 실행됩니다.
5. 자동 완성이 실제 input에 닿습니다.
6. 성공/오류가 색만으로 표시되지 않습니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 표시, 움직임이 있는 곳의 동작 줄이기를 검증합니다. 빈 스위트를 성공으로 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`text-input--default`, `text-input--error`, `text-input--success`, `text-input--sizes`, `text-input--icon-action`, `text-input--disabled-readonly`, `text-input--ime`, `text-input--form-reset`.

각 사례에는 해당하는 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태가 필요합니다. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 마련되며 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부를 인수해야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 사용합니다. Lit/Solid 2는 siheom 지원을 만들지 않고 선택된 네이티브 테스트 경로를 사용해야 합니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름/대상 관계를 검증해야 합니다. Solid 2는 Solid 1 컴파일러/렌더러를 import하면 안 됩니다. 다른 렌더러의 래퍼는 쓰지 않습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존된 상세 HTML에서 추출했으며 핵심 지침과 상호작용/마크업 표를 포함합니다. 공식 요구사항을 만들어 내지 않도록 원문 언어를 그대로 둡니다. “consider/recommended/can”에 해당하는 표현은 권고로 남습니다. 예시/CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 출처 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 아래 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립적인 선택입니다.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_09_03.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_09_03.html:889): 1. 레이블 사용자가 어떤 텍스트를 입력해야 하는지를 안내하는 문구
- L[890–890](../../upstream/krds/raw/components/component_09_03.html:890): 2. 입력 필드 텍스트가 입력되는 영역으로 배경과 입력 필드를 구분하여 사용자가 텍스트 입력 필드임을 인지할 수 있게 함
- L[891–891](../../upstream/krds/raw/components/component_09_03.html:891): 3. 도움말(선택) 입력 방식에 대한 도움말 또는 오류 메시지를 제공함
- L[892–892](../../upstream/krds/raw/components/component_09_03.html:892): 4. 플레이스홀더(선택) 어떤 값을 입력해야 하는지에 대한 힌트 또는 예시를 제공함

### 용례

- L[900–900](../../upstream/krds/raw/components/component_09_03.html:900): 용례
- L[902–902](../../upstream/krds/raw/components/component_09_03.html:902): 사용하기 적합한 경우
- L[910–910](../../upstream/krds/raw/components/component_09_03.html:910): 이름
- L[911–911](../../upstream/krds/raw/components/component_09_03.html:911): 전화번호
- L[912–912](../../upstream/krds/raw/components/component_09_03.html:912): 생년월일
- L[913–913](../../upstream/krds/raw/components/component_09_03.html:913): 최소/최대 입력값이 정해진 숫자
- L[907–915](../../upstream/krds/raw/components/component_09_03.html:907): 사용자가 입력해야 하는 정보가 명확하고 텍스트의 길이가 고정된 경우에는 텍스트 입력 필드를 사용하는 것이 적합하다. 이름 전화번호 생년월일 최소/최대 입력값이 정해진 숫자
- L[904–917](../../upstream/krds/raw/components/component_09_03.html:904): 입력값이 한 줄의 텍스트로 예상되는 경우 사용자가 입력해야 하는 정보가 명확하고 텍스트의 길이가 고정된 경우에는 텍스트 입력 필드를 사용하는 것이 적합하다. 이름 전화번호 생년월일 최소/최대 입력값이 정해진 숫자
- L[921–921](../../upstream/krds/raw/components/component_09_03.html:921): 사용자의 응답을 예측할 수 없거나 사용자가 자유롭게 텍스트를 입력할 수 있게 하는 경우에는 라디오 버튼, 셀렉트가 아닌 텍스트 입력 필드를 사용하는 것이 적합하다.
- L[918–923](../../upstream/krds/raw/components/component_09_03.html:918): 예상할 수 없는 임의의 값을 입력받고자 하는 경우 사용자의 응답을 예측할 수 없거나 사용자가 자유롭게 텍스트를 입력할 수 있게 하는 경우에는 라디오 버튼, 셀렉트가 아닌 텍스트 입력 필드를 사용하는 것이 적합하다.
- L[927–927](../../upstream/krds/raw/components/component_09_03.html:927): 사용하기 적합하지 않은 경우
- L[932–932](../../upstream/krds/raw/components/component_09_03.html:932): 텍스트 입력 필드가 아니라 텍스트 영역을 사용해야 한다.
- L[929–934](../../upstream/krds/raw/components/component_09_03.html:929): 입력값이 여러 줄의 텍스트로 예상되는 경우 텍스트 입력 필드가 아니라 텍스트 영역을 사용해야 한다.
- L[938–938](../../upstream/krds/raw/components/component_09_03.html:938): 라디오 버튼, 체크박스, 셀렉트와 같은 컴포넌트를 사용해야 한다.
- L[935–940](../../upstream/krds/raw/components/component_09_03.html:935): 입력값의 내용, 양식이 정해져 있는 경우 라디오 버튼, 체크박스, 셀렉트와 같은 컴포넌트를 사용해야 한다.

### 사용성 가이드라인

- L[948–948](../../upstream/krds/raw/components/component_09_03.html:948): 사용성 가이드라인
- L[951–951](../../upstream/krds/raw/components/component_09_03.html:951): 입력 필드는 텍스트의 길이를 고려하여 적절한 크기로 제공한다.
- L[952–953](../../upstream/krds/raw/components/component_09_03.html:952): 기본적으로 텍스트 입력 필드의 크기를 그리드, 화면 크기에 따라 유동적이나 전체 섹션 영역을 차지하도록 구현한다. 그러나 이름, 우편번호, 전화번호 등 입력값의 길이를 예측할 수 있는 경우 최대 길이에 맞추어 입력 필드의 너비를 고정하고, 사용자가 더 작은 크기의 화면에서도 잘림 없이 입력값을 확인할 수 있는지를 점검해야 한다.
- L[964–964](../../upstream/krds/raw/components/component_09_03.html:964): 모든 텍스트 입력 필드에는 레이블을 제공한다.
- L[965–965](../../upstream/krds/raw/components/component_09_03.html:965): 텍스트 입력 필드에 레이블이 제공되지 않으면 사용자는 어떤 정보를 입력해야 하는지 알 수 없다. 레이블을 생략하고자 하는 경우에는 레이블 없이도 사용자가 값을 선택하는 데 문제가 없다는 근거가 명확해야 한다.
- L[968–968](../../upstream/krds/raw/components/component_09_03.html:968): 플레이스홀더가 레이블이나 도움말의 대체 수단으로 사용되어서는 안 된다.
- L[969–970](../../upstream/krds/raw/components/component_09_03.html:969): 플레이스홀더는 사용자가 값을 입력하기 시작하는 순간 사라진다. 플레이스홀더가 레이블이나 도움말의 대체 수단으로 활용되는 경우, 사용자는 값을 입력하는 도중 어떤 값을 입력하는 중이었는지, 어떤 형식으로 입력해야 하는지 다시 확인할 수 없다. 또한 거의 모든 웹 브라우저가 플레이스홀더 텍스트의 기본 색상을 최소 명도 대비 기준보다 낮게 제공하므로 읽기 어렵다. 이와 같이 플레이스홀더는 다양한 사용자 그룹에서 여러 사용성 문제를 야기하므로 단순히 사용자의 행동을 유도하기 위한 수단으로 사용해야 한다.
- L[981–981](../../upstream/krds/raw/components/component_09_03.html:981): 복사, 붙여쓰기를 제한하지 않는다.
- L[982–982](../../upstream/krds/raw/components/component_09_03.html:982): 사용자가 다른 웹사이트나 플랫폼에서 텍스트를 복사하여 붙여 넣어야 하는 경우가 있을 수 있으므로 복사, 붙여쓰기 기능을 제한하지 않는 것이 바람직하다
- L[985–985](../../upstream/krds/raw/components/component_09_03.html:985): 사용자가 자주, 반복적으로 입력하는 값은 자동 완성될 수 있도록 구현한다.
- L[986–986](../../upstream/krds/raw/components/component_09_03.html:986): 사용자에게 개인 정보를 입력받는 입력 필드에 프로그램(웹 브라우저)을 통해 사용자가 기존에 입력한 정보를 활용할 수 있는 기술을 적용한다. 이를 통해 정보 입력에 필요한 사용자의 인지적, 신체적 노력을 최소화할 수 있다.

### 접근성 가이드라인

- L[1093–1093](../../upstream/krds/raw/components/component_09_03.html:1093): 접근성 가이드라인
- L[1096–1096](../../upstream/krds/raw/components/component_09_03.html:1096): 모든 입력 필드의 초점은 시각적으로 확인할 수 있도록 표현한다.
- L[1097–1097](../../upstream/krds/raw/components/component_09_03.html:1097): 입력 필드의 초점이 표시되지 않으면 키보드 사용자는 조작하고 있는 대상을 알 수 없으므로 초점은 시각적으로 확인할 수 있게 표현해야 한다. 특히 브라우저가 제공하는 기본 입력 필드 대신 입력 필드를 임의로 만들어 사용하는 경우, 초점 제공에 유의해야 한다.
- L[1104–1104](../../upstream/krds/raw/components/component_09_03.html:1104): 입력 필드와 인접 배경 간 명도 대비를 3:1 이상으로 표현한다.
- L[1105–1105](../../upstream/krds/raw/components/component_09_03.html:1105): 입력 필드의 테두리 또는 채움 색상이 인접한 배경과 3:1 이상의 명도 대비를 갖도록 스타일을 제공하는 것을 권장한다. 인접한 배경과의 명도 대비가 충분한 경우, 사용자가 텍스트 입력 필드임을 보다 명확하게 인지할 수 있다.
- L[1112–1112](../../upstream/krds/raw/components/component_09_03.html:1112): 텍스트 입력 필드에 접근 가능한 이름을 제공한다.
- L[1113–1114](../../upstream/krds/raw/components/component_09_03.html:1113): 스크린 리더 사용자가 텍스트 입력 필드의 용도를 확인할 수 있도록 &lt;label&gt;, title, aria-label, aria-labelledby 중 1가지 방식을 이용하여 레이블을 제공해야 한다. 이때, 가능하면 &lt;label&gt;을 이용하여 사용자가 레이블을 클릭하였을 때에도 값을 입력할 수 있도록 구현하는 것이 좋다.

### 상호작용 가이드라인

- L[1127–1127](../../upstream/krds/raw/components/component_09_03.html:1127): 상호작용 가이드라인
- L[1129–1129](../../upstream/krds/raw/components/component_09_03.html:1129): 데이터 입력
- L[1147–1150](../../upstream/krds/raw/components/component_09_03.html:1147): Click 레이블 또는 입력 필드를 Click 하면 입력 필드에 커서가 활성화되면서 텍스트를 입력할 수 있게 된다.
- L[1151–1154](../../upstream/krds/raw/components/component_09_03.html:1151): Tab, Shift + Tab 모든 텍스트 필드는 사용 불가인 상태를 제외하고 Tab, Shift + Tab 키를 눌렀을 때 접근할 수 있어야 한다.

### 예시

- L[1173–1173](../../upstream/krds/raw/components/component_09_03.html:1173): 예시
- L[1177–1177](../../upstream/krds/raw/components/component_09_03.html:1177): 기본
- L[1228–1228](../../upstream/krds/raw/components/component_09_03.html:1228): 기본 코드 확인하기
- L[1244–1244](../../upstream/krds/raw/components/component_09_03.html:1244): 상태
- L[1295–1295](../../upstream/krds/raw/components/component_09_03.html:1295): 상태 코드 확인하기
- L[1311–1311](../../upstream/krds/raw/components/component_09_03.html:1311): 사이즈
- L[1362–1362](../../upstream/krds/raw/components/component_09_03.html:1362): 사이즈 코드 확인하기
- L[1378–1378](../../upstream/krds/raw/components/component_09_03.html:1378): 아이콘 버튼
- L[1458–1458](../../upstream/krds/raw/components/component_09_03.html:1458): 아이콘 버튼 코드 확인하기

### 마크업 가이드

- L[1478–1478](../../upstream/krds/raw/components/component_09_03.html:1478): 마크업 가이드
- L[1481–1481](../../upstream/krds/raw/components/component_09_03.html:1481): CSS 선택자
- L[1502–1508](../../upstream/krds/raw/components/component_09_03.html:1502): 기본 .krds-input 상태 에러 .is-error .krds-input
- L[1509–1512](../../upstream/krds/raw/components/component_09_03.html:1509): 성공 .is-success .krds-input
- L[1513–1517](../../upstream/krds/raw/components/component_09_03.html:1513): 사이즈 작게 .small
- L[1518–1521](../../upstream/krds/raw/components/component_09_03.html:1518): 중간 .medium
- L[1522–1525](../../upstream/krds/raw/components/component_09_03.html:1522): 크게 .large
- L[1535–1535](../../upstream/krds/raw/components/component_09_03.html:1535): 개발 시 접근성 관련 주의 사항
- L[1537–1537](../../upstream/krds/raw/components/component_09_03.html:1537): 입력 필드는 label로 연결이 불가능한 경우 title 속성 등을 제공하여 어떤 값을 입력하는지 알 수 있도록 한다.


인라인으로 보존된 예시 마크업(참고용이며 공개 네이티브 API가 아님): L[1182–1222](../../upstream/krds/raw/components/component_09_03.html:1182), L[1249–1289](../../upstream/krds/raw/components/component_09_03.html:1249), L[1316–1356](../../upstream/krds/raw/components/component_09_03.html:1316), L[1383–1452](../../upstream/krds/raw/components/component_09_03.html:1383)

CSS/JS/안내 이미지의 출처 참조는 복사된 구현이 아닙니다. 필수/선택 열을 보존한 표 행의 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 공식 크기/상태/아이콘 예시는 비밀번호 표시 기능을 요구하지 않습니다. 그런 동작이 필요하면 별도로 검토된 명시적 API가 있어야 합니다.
- 연결된 외부 코드 예시는 참조만 하며 이번 준비에서 별도 파일로 포함하거나 읽지 않았습니다: L1233 `../../code/text_input.html`, L1300 `../../code/text_input_state.html`, L1367 `../../code/text_input_size.html`, L1463 `../../code/text_input_icon.html`, L1549 `./variable/input.html`. 보지 못한 내용을 추론하지 않습니다.
- 상세에는 안내 이미지 참조 5개가 있으며, 내장 픽셀 다이어그램은 시각적으로 확인하지 않았습니다. 텍스트 구조/지침은 읽었습니다. 정확한 시각 치수/자산은 이후 시각·출처 검토가 필요합니다.
- 시맨틱 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작/스토리 소스, 독립 인수가 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 시맨틱 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `TextInputContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트는 지원 사례 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에서 인용하거나 파생한 공식 텍스트는 원래의 KRDS 권리와 출처 표기를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용한 실질 요구사항을 면제하지 않습니다.
