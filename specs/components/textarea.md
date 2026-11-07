# 텍스트 영역 (Textarea) {#textarea}

**계약 상태: 네이티브 구현용으로 범위 승인됨.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 승인일 뿐이며, 네이티브 동작, 시각/자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `textarea`, 한국어 이름 텍스트 영역 (Textarea), export `Textarea`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_09_02](https://www.krds.go.kr/html/site/component/component_09_02.html), 보존된 [HTML](../../upstream/krds/raw/components/component_09_02.html). 조회 시각 `2026-10-29T23:28:05.395Z`, `71668` 바이트, SHA-256 `e8d2416c6bf6905c634a67d1ffddc551e8b233db8a2306831d68a80122c25bd9`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류는 `component`, 인수된 프로젝트 완료 종류도 `component`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 사례(변형·상태 축): `default`, `limited`, `invalid`, `disabled`, `readonly`. 이는 네이티브 사례 이름입니다. 상태, 반응형, 외관 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형/예시 헤딩 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

실제 <textarea>에 지속적으로 연결된 레이블을 두고, 선택적 플레이스홀더/도움말/오류를 둡니다. 글자 수 제한이 있으면 최대 글자 수와 남은 글자 수를 안내합니다. 글자 수는 레이블이나 필드 뒤에 옵니다. 플레이스홀더는 레이블/도움말을 대체하지 않으며 복사/붙여넣기를 제한하지 않습니다.

## 의미 API {#plain-semantic-api}

독립 API: value/defaultValue="", onValueChange({value}), name, rows=5 (제안), required/disabled/readOnly=false, maxLength?, helpId/errorId, invalid=false. 글자 수는 maxlength와 일치하도록 HTML UTF-16 코드 유닛으로 셉니다. 사용자에게 보이는 글자 수가 다르면 레이블/글자 수 문구에 이 프로젝트 정책을 드러냅니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어 값과 기본값을 함께 주거나 mode를 바꾸는 것은 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청을 한 번 내보냅니다. disabled, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI/초점 상태를 유지하고, 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하며 제어 prop이 계속 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

편집, 선택, 붙여넣기, Enter 줄 바꿈은 네이티브입니다. Tab은 초점을 일반적으로 옮기며 Enter 제출이나 단축키는 없습니다. IME 중에는 선택/조합 문자열을 보존합니다. 조합 중인 텍스트를 다시 쓰거나 자르지 않고 입력 갱신을 내보냅니다. 글자 수 표시는 키 입력마다 단호하게(assertive) 알리지 않아야 합니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

예상 텍스트에 맞는 크기로 만듭니다. 더 긴 입력은 textarea 안에서 세로로 스크롤하며 화살표 키는 네이티브 편집을 유지합니다. 쓸 수 있는 크기 조절을 허용하고 좁은 화면/확대에서 리플로우합니다. 오류/글자 수가 잘리면 안 됩니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

이름이 있고 활성인 textarea는 네이티브 FormData에 참여합니다(readonly 포함, disabled 제외). 리셋은 기본 문자열과 글자 수를 복원합니다. 제어 리셋은 콜백 없이 현재 prop을 유지합니다. required/maxLength는 네이티브 유효성과 명시적 오류 연결을 함께 씁니다. 브라우저 FormData의 CRLF 의미를 보존합니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

검증 시점과 오류 문구는 컴포넌트가 아니라 호스트가 소유합니다. 완료에는 긴 입력, 붙여넣기, 한글 IME, 레이블/오류, FormData/리셋이 포함됩니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, label, control, help, error, count; disabled,readonly,invalid,focused.

렌더링되는 모든 소유 파트는 `data-krds-component="textarea"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위의 파트/상태 어휘는 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 입력 후에도 레이블이 유지됩니다.
2. Enter는 제출 없이 줄 바꿈을 삽입합니다.
3. 붙여넣기와 IME가 텍스트/선택을 보존합니다.
4. 글자 수가 설정된 제한 의미와 일치합니다.
5. FormData/리셋/disabled/readonly가 네이티브로 동작합니다.
6. 오류가 연결되어 있고 좁은 화면에서 읽을 수 있습니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 표시, 움직임이 있는 곳의 동작 줄이기를 검증합니다. 빈 스위트를 성공으로 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`textarea--default`, `textarea--limited`, `textarea--invalid`, `textarea--disabled`, `textarea--readonly`, `textarea--long-value`, `textarea--ime`, `textarea--form-reset`.

각 사례에는 해당하는 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태가 필요합니다. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 마련되며 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부를 인수해야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 사용합니다. Lit/Solid 2는 siheom 지원을 만들지 않고 선택된 네이티브 테스트 경로를 사용해야 합니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름/대상 관계를 검증해야 합니다. Solid 2는 Solid 1 컴파일러/렌더러를 import하면 안 됩니다. 다른 렌더러의 래퍼는 쓰지 않습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존된 상세 HTML에서 추출했으며 핵심 지침과 상호작용/마크업 표를 포함합니다. 공식 요구사항을 만들어 내지 않도록 원문 언어를 그대로 둡니다. “consider/recommended/can”에 해당하는 표현은 권고로 남습니다. 예시/CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 출처 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 아래 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립적인 선택입니다.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_09_02.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_09_02.html:889): 1. 레이블 사용자가 어떤 텍스트를 입력해야 하는지를 알려줌
- L[890–890](../../upstream/krds/raw/components/component_09_02.html:890): 2. 입력 영역 텍스트가 입력되는 영역으로 배경과 입력 영역을 구분하여 사용자가 텍스트 영역임을 인지할 수 있게 함
- L[891–891](../../upstream/krds/raw/components/component_09_02.html:891): 3. 플레이스홀더(선택) 어떤 값을 입력해야 하는지에 대한 힌트 또는 예시를 제공함
- L[892–892](../../upstream/krds/raw/components/component_09_02.html:892): 4. 입력된 글자 수 입력 가능한 글자 수와 입력된 글자 수를 안내하는 텍스트

### 용례

- L[900–900](../../upstream/krds/raw/components/component_09_02.html:900): 용례
- L[902–902](../../upstream/krds/raw/components/component_09_02.html:902): 사용하기 적합한 경우
- L[907–907](../../upstream/krds/raw/components/component_09_02.html:907): 텍스트 입력 필드가 아니라 텍스트 영역을 사용해야 한다.
- L[904–909](../../upstream/krds/raw/components/component_09_02.html:904): 입력값이 여러 줄의 텍스트로 예상되는 경우 텍스트 입력 필드가 아니라 텍스트 영역을 사용해야 한다.
- L[913–913](../../upstream/krds/raw/components/component_09_02.html:913): 사용하기 적합하지 않은 경우
- L[918–918](../../upstream/krds/raw/components/component_09_02.html:918): 질문을 여러 개로 분할하고, 가능하다면 응답을 라디오 버튼이나 체크박스로 구성하여 사용자가 텍스트를 직접 입력하지 않고도 빠르게 질문에 응답할 수 있게 해야 한다.
- L[915–920](../../upstream/krds/raw/components/component_09_02.html:915): 여러 가지 질문에 대한 응답을 받기 위한 경우 질문을 여러 개로 분할하고, 가능하다면 응답을 라디오 버튼이나 체크박스로 구성하여 사용자가 텍스트를 직접 입력하지 않고도 빠르게 질문에 응답할 수 있게 해야 한다.

### 사용성 가이드라인

- L[928–928](../../upstream/krds/raw/components/component_09_02.html:928): 사용성 가이드라인
- L[931–931](../../upstream/krds/raw/components/component_09_02.html:931): 입력 영역은 텍스트의 길이를 고려하여 적절한 크기로 제공한다.
- L[932–932](../../upstream/krds/raw/components/component_09_02.html:932): 입력 영역의 높이는 사용자가 입력할 것으로 예상되는 최대 텍스트 길이에 비례하도록 제공하여 사용자가 별도의 스크롤 동작 없이도 한 번에 적절한 양의 텍스트를 확인할 수 있게 만든다.
- L[935–935](../../upstream/krds/raw/components/component_09_02.html:935): 모든 텍스트 영역에는 레이블을 제공한다.
- L[936–936](../../upstream/krds/raw/components/component_09_02.html:936): 텍스트 입력 영역에 레이블이 제공되지 않으면 사용자는 어떤 정보를 입력해야 하는지 알 수 없다. 레이블을 생략하고자 하는 경우에는 레이블 없이도 사용자가 값을 선택하는 데 문제가 없다는 근거가 명확해야 한다.
- L[939–939](../../upstream/krds/raw/components/component_09_02.html:939): 플레이스홀더가 레이블이나 도움말의 대체 수단으로 사용되어서는 안 된다.
- L[940–941](../../upstream/krds/raw/components/component_09_02.html:940): 플레이스홀더는 사용자가 값을 입력하기 시작하는 순간 사라진다. 플레이스홀더가 레이블이나 도움말의 대체 수단으로 활용되는 경우, 사용자는 값을 입력하는 도중 어떤 값을 입력하는 중이었는지, 어떤 형식으로 입력해야 하는지 다시 확인할 수 없다. 또한 거의 모든 웹 브라우저가 플레이스홀더 텍스트의 기본 색상을 최소 명도 대비 기준보다 낮게 제공하므로 읽기 어렵다. 이와 같이 플레이스홀더는 다양한 사용자 그룹에서 여러 사용성 문제를 야기하므로 단순히 사용자의 행동을 유도하기 위한 수단으로 사용해야 한다.
- L[952–952](../../upstream/krds/raw/components/component_09_02.html:952): 복사, 붙여쓰기를 제한하지 않는다.
- L[953–953](../../upstream/krds/raw/components/component_09_02.html:953): 사용자가 다른 웹사이트나 플랫폼에서 텍스트를 복사하여 붙여 넣어야 하는 경우가 있을 수 있으므로 복사, 붙여쓰기 기능을 제한하지 않는 것이 바람직하다.
- L[956–956](../../upstream/krds/raw/components/component_09_02.html:956): 입력 가능한 글자 수에 제한이 있는 경우 사용자에게 글자 수 정보를 제공한다.
- L[957–957](../../upstream/krds/raw/components/component_09_02.html:957): 입력폼 주변에 레이블 다음 또는 입력 영역 다음 요소로 최대 글자 수와 남은 입력 가능 글자 수 정보를 제공한다. 남은 입력 가능 글자 수는 사용자의 입력에 따라 동적으로 업데이트하여 사용자가 입력폼을 제출하기 전에 입력 제약 사항에 대해 예측할 수 있도록 해야 한다.

### 접근성 가이드라인

- L[1068–1068](../../upstream/krds/raw/components/component_09_02.html:1068): 접근성 가이드라인
- L[1071–1071](../../upstream/krds/raw/components/component_09_02.html:1071): 입력 영역과 인접 배경 간 명도 대비를 3:1 이상으로 제공한다.
- L[1072–1072](../../upstream/krds/raw/components/component_09_02.html:1072): 입력 영역의 테두리 또는 채움 색상이 인접한 배경과 3:1 이상의 명도 대비를 갖도록 스타일을 제공하는 것을 권장한다. 인접한 배경과의 명도 대비가 충분한 경우 사용자가 텍스트 영역임을 보다 명확하게 인지할 수 있다.
- L[1079–1079](../../upstream/krds/raw/components/component_09_02.html:1079): 텍스트 영역에 접근 가능한 이름을 제공한다.
- L[1080–1080](../../upstream/krds/raw/components/component_09_02.html:1080): 스크린 리더 사용자가 텍스트 영역의 용도를 확인할 수 있도록 &lt;label&gt;, title, aria-label, aria-labelledby 중 1가지 방식을 이용하여 레이블을 제공해야 한다.

### 상호작용 가이드라인

- L[1093–1093](../../upstream/krds/raw/components/component_09_02.html:1093): 상호작용 가이드라인
- L[1095–1095](../../upstream/krds/raw/components/component_09_02.html:1095): 마우스
- L[1113–1116](../../upstream/krds/raw/components/component_09_02.html:1113): Click 레이블 또는 입력 영역을 Click 하면 입력 영역에 커서가 활성화되면서 텍스트를 입력할 수 있게 된다.
- L[1117–1120](../../upstream/krds/raw/components/component_09_02.html:1117): Scroll 사용자가 많은 양의 텍스트를 작성하여 영역의 기본 높이를 초과하는 경우 영역에 세로 스크롤이 생성되며, 작성한 콘텐츠를 상/하로 탐색할 수 있다.
- L[1127–1127](../../upstream/krds/raw/components/component_09_02.html:1127): 키보드
- L[1145–1148](../../upstream/krds/raw/components/component_09_02.html:1145): Tab, Shift + Tab 모든 텍스트 필드는 사용 불가인 상태를 제외하고 Tab, Shift + Tab 키를 눌렀을 때 접근할 수 있어야 한다.
- L[1149–1152](../../upstream/krds/raw/components/component_09_02.html:1149): 방향키 ↑, ↓ 사용자가 많은 양의 텍스트를 작성하여 영역의 기본 높이를 초과하는 경우 영역에 세로 스크롤이 생성되며, 작성한 콘텐츠를 상/하로 탐색할 수 있다.

### 예시

- L[1171–1171](../../upstream/krds/raw/components/component_09_02.html:1171): 예시
- L[1175–1175](../../upstream/krds/raw/components/component_09_02.html:1175): 기본
- L[1206–1206](../../upstream/krds/raw/components/component_09_02.html:1206): 기본 코드 확인하기

### 마크업 가이드

- L[1226–1226](../../upstream/krds/raw/components/component_09_02.html:1226): 마크업 가이드
- L[1229–1229](../../upstream/krds/raw/components/component_09_02.html:1229): CSS 선택자
- L[1246–1249](../../upstream/krds/raw/components/component_09_02.html:1246): 전체영역 .textarea-wrap
- L[1250–1253](../../upstream/krds/raw/components/component_09_02.html:1250): 텍스트 영역 .krds-input
- L[1263–1263](../../upstream/krds/raw/components/component_09_02.html:1263): 개발 시 접근성 관련 주의 사항
- L[1265–1265](../../upstream/krds/raw/components/component_09_02.html:1265): 입력 필드는 label로 연결이 불가능한 경우 title 속성 등을 제공하여 어떤 값을 입력하는지 알 수 있도록 한다.


인라인으로 보존된 예시 마크업(참고용이며 공개 네이티브 API가 아님): L[1180–1200](../../upstream/krds/raw/components/component_09_02.html:1180)

CSS/JS/안내 이미지의 출처 참조는 복사된 구현이 아닙니다. 필수/선택 열을 보존한 표 행의 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 기록된 독립 결정: 수용된 글자 수는 maxlength와 같은 HTML UTF-16 코드 유닛입니다. 검증은 호스트가 제공한 required/오류 상태에 따라 사용자 입력/blur 시 일어납니다. IME 로컬 조합은 완료될 때까지 건드리지 않으며 중복 알림을 내지 않습니다.
- 연결된 외부 코드 예시는 참조만 하며 이번 준비에서 별도 파일로 포함하거나 읽지 않았습니다: L1211 `../../code/textarea.html`, L1277 `./variable/input.html`. 보지 못한 내용을 추론하지 않습니다.
- 상세에는 안내 이미지 참조 4개가 있으며, 내장 픽셀 다이어그램은 시각적으로 확인하지 않았습니다. 텍스트 구조/지침은 읽었습니다. 정확한 시각 치수/자산은 이후 시각·출처 검토가 필요합니다.
- 시맨틱 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작/스토리 소스, 독립 인수가 필요합니다.

## 수용된 독립 결정 {#accepted-independent-resolution}

수용된 글자 수는 maxlength와 같은 HTML UTF-16 코드 유닛입니다. 검증은 호스트가 제공한 required/오류 상태에 따라 사용자 입력/blur 시 일어납니다. IME 로컬 조합은 완료될 때까지 건드리지 않으며 중복 알림을 내지 않습니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 시맨틱 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `TextareaContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트는 지원 사례 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에서 인용하거나 파생한 공식 텍스트는 원래의 KRDS 권리와 출처 표기를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용한 실질 요구사항을 면제하지 않습니다.
