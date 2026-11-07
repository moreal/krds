# 스피너 {#spinner}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문으로 남습니다. 게시는 승인되지 않았습니다.

시맨틱 ID `spinner`, 한국어 이름 스피너, export `Spinner`. 고정된 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세 페이지: [component_07_02](https://www.krds.go.kr/html/site/component/component_07_02.html), 보존본 [HTML](../../upstream/krds/raw/components/component_07_02.html). 조회 시각 `2026-10-29T23:28:04.806Z`, `69546` 바이트, SHA-256 `9e6ffa72e4e23e83cef056b525264dbcd19a89cfbfeda28bfcd125c70007c422`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정된 출처 종류는 `component`이고, 수용된 프로젝트 완료 종류도 `component`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 사례(변형·상태 축): `determinate`, `indeterminate`, `inline`, `region`. 이는 네이티브 사례 이름입니다. 상태·반응형·외형 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형·예시 헤딩 원문은 근거 부록에 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

진행 경로·표시기는 실제 대기 중인 작업 가까이에 둡니다. 확정형(determinate)은 실제 진행률에 따라 0–360도를 시계 방향으로 채우고, 불확정형(indeterminate)은 시계 방향으로 회전합니다. 장식이 아닙니다. 1초 미만 대기에는 불필요한 스피너를 쓰지 않습니다. 영역당 스피너는 하나이며, 독립된 인라인 작업은 예외입니다.

## 의미 API {#plain-semantic-api}

독립 API: pending, value?(0–100), label, completionMessage, size=medium. value가 없으면 불확정형입니다. 확정형은 min/max/now를 가진 role=progressbar입니다. 로딩·완료 안내는 애니메이션 장식과 구별되는 polite 상태입니다. 잘못되었거나 유한하지 않은 범위는 구성 오류입니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 의미 변경 요청 하나를 냅니다. 비활성, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 0회 냅니다. 제어 거부 시 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고, 제어 props가 계속 우선합니다. 추가 필드는 렌더러·머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

초점 이동, 키보드 동작, 초점 트랩이 없습니다. 진행률·완료를 흉내 내는 타이머를 두지 않으며, 호스트가 pending/value를 바꿉니다. polite 로딩·완료 메시지는 애니메이션 프레임마다가 아니라 실제 수명주기당 한 번 나옵니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

크기를 충분히 확보하고 경로·배경 대비는 3:1 이상입니다. 동작 줄이기에서는 연속 회전을 안정적인 진행률·레이블로 대체하며, 이는 독립 정책입니다. 출처는 0에서 멈추지 않고 반복하라고 하므로 접근성 대안을 명시적으로 기록합니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼 값·리셋·IME 동작은 없습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 실제 로딩 수명, 콘텐츠 준비 상태, 대상 영역의 aria-busy를 소유합니다. 완료는 실제 로컬 작업의 전환과 접근 가능한 시작·종료를 요구하며, 영구히 도는 링은 인정하지 않습니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, track, indicator, label, status; pending,complete,determinate,indeterminate.

렌더링되는 모든 소유 파트는 `data-krds-component="spinner"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 기준입니다. 위 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 값이 제공된 진행률을 정확히 반영합니다.
2. 불확정형에는 가짜 aria-valuenow가 없습니다.
3. 시작·종료가 polite하게 한 번 안내됩니다.
4. 초점을 빼앗지 않습니다.
5. 호스트가 완료하면 pending이 끝나고 남는 타이머가 없습니다.
6. 동작 줄이기에서도 의미 있는 상태가 유지됩니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 단서, 움직임이 있다면 동작 줄이기를 검증합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`spinner--determinate`, `spinner--indeterminate`, `spinner--inline`, `spinner--region`, `spinner--complete`, `spinner--reduced-motion`.

각 사례는 해당하는 모든 네이티브 렌더러에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태가 필요합니다: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에서 따로 단계화하며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부를 인수해야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 씁니다. Lit과 Solid 2는 siheom 지원을 만들어 내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular의 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러·렌더러를 절대 import하지 않습니다. 다른 렌더러 래퍼는 없습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML에서 가져왔으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 원문 언어를 유지합니다. “고려한다/권장/할 수 있다” 같은 표현은 권고로 남습니다. 예시·CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행해서는 안 됩니다. 위의 공통 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립 선택입니다.

### 구조

- L[883–883](../../upstream/krds/raw/components/component_07_02.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_07_02.html:889): 1. 경로 식별자가 표시되는 경로로 표현 방식에 따라 시각적으로 경로를 표시하거나 식별자의 운동 경로를 위해 가상으로 설정할 수 있음
- L[890–890](../../upstream/krds/raw/components/component_07_02.html:890): 2. 식별자 경로를 따라 이동하는 시각적 표시기로 상태 정보를 안내함

### 유형

- L[898–898](../../upstream/krds/raw/components/component_07_02.html:898): 유형
- L[900–900](../../upstream/krds/raw/components/component_07_02.html:900): 확정 스피너
- L[901–901](../../upstream/krds/raw/components/component_07_02.html:901): 확정 스피너는 완료 상태로 변경되기까지의 진행률을 계산할 수 있는 경우에 사용한다. 식별자가 도넛형 경로의 0도에서부터 360도까지 채워지면서 진행 정도를 표시한다. 파일 다운로드, 업로드와 같이 명확한 종료 지점이 존재하는 경우에 사용하기 적합하다.
- L[904–904](../../upstream/krds/raw/components/component_07_02.html:904): 불확정 스피너
- L[905–905](../../upstream/krds/raw/components/component_07_02.html:905): 불확정 스피너는 계산할 수 없는 대기 시간을 표현할 때 사용한다. 필터링·정렬 옵션을 사용했을 때와 같이 시스템의 작업이 진행 중이지만 완료까지 걸리는 시간을 확정할 수 없는 경우에 사용하기 적합하다.

### 용례

- L[912–912](../../upstream/krds/raw/components/component_07_02.html:912): 용례
- L[914–914](../../upstream/krds/raw/components/component_07_02.html:914): 사용하기 적합한 경우
- L[919–920](../../upstream/krds/raw/components/component_07_02.html:919): 페이지 전체가 로딩되거나 페이지의 맥락이 완전히 변경된 영역의 콘텐츠가 변경되는 경우에 사용한다. 스피너를 화면 중앙 또는 맥락이 변경되는 콘텐츠 영역 중앙에 배치하여 전체 페이지의 콘텐츠가 로딩되고 있음을 표시한다. 페이지 로딩에 오랜 시간이 걸리고 중대한 변경이 발생하는 프로세스에 적합하다.
- L[916–922](../../upstream/krds/raw/components/component_07_02.html:916): 화면이 완전히 새롭게 로딩되는 경우 페이지 전체가 로딩되거나 페이지의 맥락이 완전히 변경된 영역의 콘텐츠가 변경되는 경우에 사용한다. 스피너를 화면 중앙 또는 맥락이 변경되는 콘텐츠 영역 중앙에 배치하여 전체 페이지의 콘텐츠가 로딩되고 있음을 표시한다. 페이지 로딩에 오랜 시간이 걸리고 중대한 변경이 발생하는 프로세스에 적합하다.
- L[926–926](../../upstream/krds/raw/components/component_07_02.html:926): 화면이나 페이지의 전환 없이 일부 요소에 시스템의 작업이 진행되고 있는 경우 해당 요소 컨테이너 내부에 스피너를 표시할 수 있다. 검색 필드, 버튼과 같은 컴포넌트에 사용한다.
- L[923–928](../../upstream/krds/raw/components/component_07_02.html:923): 화면에서 일부 요소의 상태에 변경이 발생하는 경우 화면이나 페이지의 전환 없이 일부 요소에 시스템의 작업이 진행되고 있는 경우 해당 요소 컨테이너 내부에 스피너를 표시할 수 있다. 검색 필드, 버튼과 같은 컴포넌트에 사용한다.
- L[932–932](../../upstream/krds/raw/components/component_07_02.html:932): 사용하기 적합하지 않은 경우
- L[937–937](../../upstream/krds/raw/components/component_07_02.html:937): 스피너 제공을 고려하고 있는 화면, 요소가 완료 상태로 변경되는 데 안정적으로 1초 미만의 시간이 걸리는 경우 스피너를 사용하지 않는다. 이용 가능한 상태로 빠르게 전환될 수 있음에도 불구하고 스피너를 제공하게 되면 오히려 주의가 산만해질 수 있다.
- L[934–939](../../upstream/krds/raw/components/component_07_02.html:934): 완료 상태로 변경되는 데 1초 미만의 시간이 걸리는 경우 스피너 제공을 고려하고 있는 화면, 요소가 완료 상태로 변경되는 데 안정적으로 1초 미만의 시간이 걸리는 경우 스피너를 사용하지 않는다. 이용 가능한 상태로 빠르게 전환될 수 있음에도 불구하고 스피너를 제공하게 되면 오히려 주의가 산만해질 수 있다.

### 사용성 가이드라인

- L[947–947](../../upstream/krds/raw/components/component_07_02.html:947): 사용성 가이드라인
- L[951–951](../../upstream/krds/raw/components/component_07_02.html:951): 스피너를 장식용으로 사용하지 않는다.
- L[952–952](../../upstream/krds/raw/components/component_07_02.html:952): 스피너는 실제 대기 상태가 필요한 경우에 사용해야 한다. 화면이 빠르게 표시될 수 있음에도 불구하고 스피너를 제공하게 되면 오히려 주의가 산만해질 수 있다.
- L[955–955](../../upstream/krds/raw/components/component_07_02.html:955): 상황에 맞는 적절한 크기의 스피너를 사용한다.
- L[956–957](../../upstream/krds/raw/components/component_07_02.html:956): 페이지 전체의 맥락이 변경되거나 공간적으로 제약이 없는 요소에서의 대기 상태를 표현하는 경우에는 큰 크기의 스피너를 사용하여 사용자가 스피너를 명확하게 인지할 수 있도록 한다. 버튼, 메뉴 항목, 입력 필드와 같이 세로 및 가로 공간이 제한되어 있는 경우 작은 스피너를 사용한다.
- L[960–960](../../upstream/krds/raw/components/component_07_02.html:960): 스피너는 처리가 진행 중인 영역 근처에 배치한다.
- L[961–961](../../upstream/krds/raw/components/component_07_02.html:961): 사용자가 주의를 기울일 것으로 예상되는 위치에 배치해야 한다. 예를 들어 특정 콘텐츠 영역에 대한 데이터가 검색되고 있음을 표시하는 경우 해당 영역에 스피너를 표시한다. 입력폼의 제출 처리 상태를 표시하기 위해서는 제출 버튼 내부에 스피너를 사용할 수 있다.
- L[964–964](../../upstream/krds/raw/components/component_07_02.html:964): 불확정 스피너의 애니메이션의 루프를 중지하지 않는다.
- L[965–965](../../upstream/krds/raw/components/component_07_02.html:965): 불확정 스피너에서 식별자가 0도 위치에 도달하였을 때 애니메이션이 중지되면 사용자는 시스템이 작동을 멈춘 것으로 오인할 수 있다.
- L[968–968](../../upstream/krds/raw/components/component_07_02.html:968): 컴포넌트의 일부로 작게 표시되지 않는 한, 두 개 이상의 스피너를 동시에 표시하지 않는다.
- L[969–969](../../upstream/krds/raw/components/component_07_02.html:969): 정보 과부하와 시각적 노이즈를 줄이기 위해 가능한 한 화면에는 1개의 스피너만 표시될 수 있도록 한다. 파일 업로드 컴포넌트와 같이 개별 항목에 진행 상태 정보가 표시되어야 하는 경우를 제외하고, 화면이나 관련 영역 중앙에 1개의 스피너를 사용하는 것이 적절하다.

### 접근성 가이드라인

- L[1077–1077](../../upstream/krds/raw/components/component_07_02.html:1077): 접근성 가이드라인
- L[1081–1081](../../upstream/krds/raw/components/component_07_02.html:1081): 인접 배경과 경로 간 명도 대비, 경로와 식별자 간 명도 대비를 3:1 이상으로 표현한다.
- L[1082–1082](../../upstream/krds/raw/components/component_07_02.html:1082): 시력이 좋지 않은 사용자도 스피너의 출현 여부와 진행 상태를 인지할 수 있도록 인접 배경과 경로 간 명도 대비, 경로와 식별자 간 명도 대비를 3:1 이상으로 제공해야 한다.
- L[1091–1091](../../upstream/krds/raw/components/component_07_02.html:1091): 스피너 상태에 대한 설명을 스크린 리더에서 확인할 수 있도록 한다.
- L[1092–1093](../../upstream/krds/raw/components/component_07_02.html:1092): 스크린 리더 사용자가 스피너를 통해 제공되는 페이지 로딩 상태 정보를 확인할 수 있도록 스피너가 제공되기 시작했을 때와 로딩이 완료되었을 때의 상태 정보를 제공해야 한다. 페이지의 핵심 정보에 대한 음성 안내 방해를 최소화하도록 aria-live 속성값은 assertive가 아닌 polite를 사용해야 한다.

### 상호작용 가이드라인

- L[1107–1107](../../upstream/krds/raw/components/component_07_02.html:1107): 상호작용 가이드라인
- L[1110–1110](../../upstream/krds/raw/components/component_07_02.html:1110): 확정 스피너
- L[1111–1111](../../upstream/krds/raw/components/component_07_02.html:1111): 식별자가 도넛형 경로의 0도에서부터 360도까지 채워지면서 진행 정도를 표시한다. 식별자가 채워진 정도는 실제 진행률을 반영해야 하며, 360도 전체가 채워지면 스피너를 숨기고 페이지를 표시한다. 식별자는 0도에서 운동을 시작하여 시계 방향으로 경로를 채운다.
- L[1114–1114](../../upstream/krds/raw/components/component_07_02.html:1114): 불확정 스피너
- L[1115–1115](../../upstream/krds/raw/components/component_07_02.html:1115): 식별자가 도넛형 경로의 0도에서부터 360도를 따라 회전하면서 대기 상태에 있음을 표시한다. 페이지가 표시되기 전까지 식별자의 회전 운동은 반복되어야 한다. 식별자는 0도에서 운동을 시작하여 시계 방향으로 회전한다.

### 예시

- L[1131–1131](../../upstream/krds/raw/components/component_07_02.html:1131): 예시
- L[1135–1135](../../upstream/krds/raw/components/component_07_02.html:1135): 기본
- L[1176–1176](../../upstream/krds/raw/components/component_07_02.html:1176): 기본 코드 확인하기

### 마크업 가이드

- L[1196–1196](../../upstream/krds/raw/components/component_07_02.html:1196): 마크업 가이드
- L[1199–1199](../../upstream/krds/raw/components/component_07_02.html:1199): CSS 선택자
- L[1216–1219](../../upstream/krds/raw/components/component_07_02.html:1216): 전체영역 .krds-spinner

보존된 예시 마크업 인라인(참고용이며 공개 네이티브 API가 아님): L[1140–1170](../../upstream/krds/raw/components/component_07_02.html:1140)

CSS/JS/안내 이미지 출처 참조는 복사된 구현이 아닙니다. 표 행의 원본 HTML(필수/선택 열 보존)은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화한 발췌가 조건부 선택자를 필수로 재분류하지는 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 기록된 독립 결정: 동작 줄이기에서는 연속 회전을 정적이고 인지 가능한 표시기와 로딩·완료 텍스트로 대체합니다. 확정 값은 실제 진행률로 남습니다. 이는 독립 접근성 정책이며, 출처의 회전 규정을 문자 그대로 따른다는 주장이 아닙니다.
- 외부 코드 예시는 참조만 하며 이번 준비에서 별도 파일로 삽입하거나 읽지 않았습니다: L1181 `../../code/spinner.html`, L1234 `./variable/spinner.html`. 보지 못한 내용은 추정하지 않습니다.
- 상세 페이지에 안내 이미지 참조가 1개 있으며, 그 안의 픽셀 도식은 눈으로 확인하지 않았습니다. 텍스트 구조와 지침만 읽었습니다. 정확한 시각 치수와 자산은 이후 시각·출처 검토가 필요합니다.
- 의미 인터페이스와 파트·상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작·스토리 소스, 독립 인수가 필요합니다.

## 수용된 독립 결정 {#accepted-independent-resolution}

동작 줄이기에서는 연속 회전을 정적이고 인지 가능한 표시기와 로딩·완료 텍스트로 대체합니다. 확정 값은 실제 진행률로 남습니다. 이는 독립 접근성 정책이며, 출처의 회전 규정을 문자 그대로 따른다는 주장이 아닙니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `SpinnerContract`입니다. 네이티브 프레임워크는 자체 콘텐츠·ref·이벤트 전달만 확장합니다. 공통 매니페스트가 지원 사례 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼로는 이 계약을 충족할 수 없습니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에 인용·파생된 공식 텍스트는 원래 KRDS 권리와 출처 표시를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용한 실질 요구사항을 면제하지 않습니다.
