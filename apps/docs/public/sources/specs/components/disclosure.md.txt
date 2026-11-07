# 디스클로저 {#disclosure}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 수락일 뿐이며, 네이티브 동작·시각/자산 검토·실행된 커버리지는 별도 게이트입니다. 어떤 게시도 승인되지 않았습니다.

시맨틱 ID `disclosure`, 한국어 이름 디스클로저, export `Disclosure`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_04_04](https://www.krds.go.kr/html/site/component/component_04_04.html), 보존된 [HTML](../../upstream/krds/raw/components/component_04_04.html). 조회 시각 `2026-10-29T23:28:03.476Z`, `75503` 바이트, SHA-256 `ade08d8edb621cc764ea84520aa9e1deaa9f74f26f1ba8f1f9ecc0dee8c8467a`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조해 확인했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 별개입니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류 `component`, 수용된 프로젝트 완료 종류 `component`. 프로젝트 완료 종류는 아래 근거를 따르며, 구체적인 완료 의무와 호스트 경계는 이 계약에 기술됩니다.

지원하는 네이티브 케이스(변형·상태 축): `default`. 이는 네이티브 케이스 이름이며, 상태·반응형·외관 축이 공식 명명 변형인 것은 아닙니다. 공식 유형/예시 제목 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

설명 텍스트와 갈매기(chevron)가 있는 type=button 트리거 뒤에 연결된 콘텐츠가 옵니다. 처음에는 접혀 있고 관련 정보 아래에 두며, 섹션마다 디스클로저는 보통 하나입니다. aria-expanded와 aria-controls로 상태를 노출합니다.

## 의미 API {#plain-semantic-api}

독립 API: open/defaultOpen=false, onOpenChange({open}), label, contentId. 폼 값이나 href는 없습니다. 사용자 토글마다 전이를 한 번 요청하며, 제어 거부는 현재 가시성을 유지합니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어/기본값을 함께 주거나 모드를 바꾸는 것은 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청 하나를 냅니다. 비활성, 무동작, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 커밋된 UI와 초점 상태를 유지합니다. 취소된 리셋은 아무 일도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하며, 제어 prop이 계속 우선합니다. 추가 필드로 렌더러/머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

클릭/Enter/Space로 토글하며 초점은 트리거에 남습니다. 닫힌 콘텐츠와 하위 요소는 초점·접근성 트리에서 제외됩니다. 초점이 안에 있을 때 호스트가 닫으면 숨기기 전에 트리거로 초점을 돌립니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

콘텐츠는 필수 정보를 숨기지 않고 정상적으로 재배치됩니다. 필수 애니메이션은 없으며, 동작 줄이기에서도 읽을 수 있어야 합니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

값/리셋이 없습니다. 내부 자식 폼은 자신의 상태를 소유하며, 호스트가 언마운트를 요청하지 않는 한 일반 접기로 버려서는 안 됩니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 적절한 보충 콘텐츠를 정하며, 필수 오류나 필수 작업 정보를 숨기지 않습니다. 완료에는 실제 숨김/표시 콘텐츠와 초점 검사가 포함됩니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, trigger, icon, content; open,closed.

렌더되는 모든 소유 파트는 `data-krds-component="disclosure"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위 열거는 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정됩니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 기본은 콘텐츠가 숨겨져 있습니다.
2. 클릭/Enter/Space 한 번이 한 번 토글하고 aria-expanded를 갱신합니다.
3. 접힌 링크는 탭으로 이동할 수 없습니다.
4. 토글 시 초점은 트리거에 남고, 초점 있는 패널이 외부에서 숨겨지면 트리거로 돌아갑니다.

위 항목은 앞으로 필요한 테스트이며, 실행되었거나 인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색 이외의 상태 단서, 움직임이 있는 곳의 동작 줄이기를 검증합니다. 빈 스위트를 성공으로 간주하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`disclosure--default`, `disclosure--interactive-content`, `disclosure--controlled-rejected`, `disclosure--narrow`.

각 케이스는 적용 가능한 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태를 가져야 합니다. Solid 2 미리보기는 별도로 격리됩니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 마련되며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 수락되어야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 씁니다. Lit/Solid 2는 siheom 지원을 만들어 내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연(lazy) 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져오면 안 됩니다. 다른 렌더러 래퍼는 금지입니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML 원본(본문 지침과 상호작용·마크업 표 포함)에서 추출했습니다. 공식 요구사항을 만들어 내지 않도록 원문 언어를 유지합니다. "고려한다/권장/할 수 있다" 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 네이티브가 제어하는 DOM에서 KRDS 원본 JS를 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립 선택입니다.

### 구조

- L[886–886](../../upstream/krds/raw/components/component_04_04.html:886): 구조
- L[892–892](../../upstream/krds/raw/components/component_04_04.html:892): 1. 꺾쇠 아이콘 콘텐츠 섹션의 확장/축소 상태를 나타냄
- L[893–893](../../upstream/krds/raw/components/component_04_04.html:893): 2. 텍스트 확장할 콘텐츠 섹션의 내용을 유추할 수 있는 제목 텍스트
- L[894–894](../../upstream/krds/raw/components/component_04_04.html:894): 3. 컨테이너 정보가 제공되는 콘텐츠 섹션으로 꺾쇠 아이콘이나 텍스트를 눌러 표시하거나 숨길 수 있음

### 용례

- L[902–902](../../upstream/krds/raw/components/component_04_04.html:902): 용례
- L[904–904](../../upstream/krds/raw/components/component_04_04.html:904): 사용하기 적합한 경우
- L[909–909](../../upstream/krds/raw/components/component_04_04.html:909): 화면이 단일 섹션으로 구성된 경우 사용자가 여러 섹션을 비교·탐색하는 인지적 부담이 적으므로 부가적인 상호작용을 통해 콘텐츠를 표시하는 것보다 기본으로 보여주는 것이 적절하다.
- L[906–911](../../upstream/krds/raw/components/component_04_04.html:906): 화면이 여러 개의 콘텐츠 섹션으로 구성된 경우 화면이 단일 섹션으로 구성된 경우 사용자가 여러 섹션을 비교·탐색하는 인지적 부담이 적으므로 부가적인 상호작용을 통해 콘텐츠를 표시하는 것보다 기본으로 보여주는 것이 적절하다.
- L[915–918](../../upstream/krds/raw/components/component_04_04.html:915): 디스클로저는 탭이나 아코디언보다 시각적으로 눈에 덜 띄며 콘텐츠를 표시하기 위한 상호작용이 필요하므로 부가적인 정보를 제공하는 데 사용하는 것이 적합하다. 예) 부가적인 안내 콘텐츠, 시각적으로 표시되는 이미지 대체 텍스트
- L[912–920](../../upstream/krds/raw/components/component_04_04.html:912): 부가적인 정보를 제공하고자 하는 경우 디스클로저는 탭이나 아코디언보다 시각적으로 눈에 덜 띄며 콘텐츠를 표시하기 위한 상호작용이 필요하므로 부가적인 정보를 제공하는 데 사용하는 것이 적합하다. 예) 부가적인 안내 콘텐츠, 시각적으로 표시되는 이미지 대체 텍스트
- L[924–924](../../upstream/krds/raw/components/component_04_04.html:924): 사용하기 적합하지 않은 경우
- L[929–929](../../upstream/krds/raw/components/component_04_04.html:929): 화면이 단일 섹션으로 구성된 경우 부가적인 상호작용을 통해 콘텐츠를 표시하는 것보다 기본으로 정보를 보여주는 것이 적절하다.
- L[926–931](../../upstream/krds/raw/components/component_04_04.html:926): 화면이 단일 콘텐츠 섹션으로 구성된 경우 화면이 단일 섹션으로 구성된 경우 부가적인 상호작용을 통해 콘텐츠를 표시하는 것보다 기본으로 정보를 보여주는 것이 적절하다.
- L[935–935](../../upstream/krds/raw/components/component_04_04.html:935): 디스클로저 내부에 정보가 제공되고 있음을 발견하지 못할 수 있으므로 사용자가 명확하게 인지할 수 있는 레이아웃을 사용해야 한다.
- L[932–937](../../upstream/krds/raw/components/component_04_04.html:932): 오류 메시지나 중요한 정보를 전달해야 하는 경우 디스클로저 내부에 정보가 제공되고 있음을 발견하지 못할 수 있으므로 사용자가 명확하게 인지할 수 있는 레이아웃을 사용해야 한다.
- L[941–941](../../upstream/krds/raw/components/component_04_04.html:941): 표의 셀 내부는 콘텐츠를 표시할 수 있는 공간이 충분하지 않으며, 디스클로저로 인해 행의 높이가 유동적으로 변경되었을 경우 정보를 인지하기 어렵다.
- L[938–943](../../upstream/krds/raw/components/component_04_04.html:938): 표의 셀 내부 표의 셀 내부는 콘텐츠를 표시할 수 있는 공간이 충분하지 않으며, 디스클로저로 인해 행의 높이가 유동적으로 변경되었을 경우 정보를 인지하기 어렵다.

### 사용성 가이드라인

- L[951–951](../../upstream/krds/raw/components/component_04_04.html:951): 사용성 가이드라인
- L[954–954](../../upstream/krds/raw/components/component_04_04.html:954): 기본적으로 축소된 상태로 제공한다.
- L[955–955](../../upstream/krds/raw/components/component_04_04.html:955): 디스클로저는 화면 내 정보를 훑어보는 과정에서 사용자의 인지적 부담을 덜어주기 위한 용도로 사용되므로 화면이 로딩되었을 때 펼쳐진 상태로 제공하는 것은 적절하지 않다.
- L[958–958](../../upstream/krds/raw/components/component_04_04.html:958): 디스클로저를 통해 제공하고자 하는 부가 정보와 관련된 정보/컨트롤/섹션 아래에 배치한다.
- L[959–959](../../upstream/krds/raw/components/component_04_04.html:959): 사용자가 관련 정보와 디스클로저 컨트롤 및 섹션 간 관계를 인지할 수 있도록 부가적인 정보를 제공하고자 하는 요소 아래에 배치한다.
- L[962–962](../../upstream/krds/raw/components/component_04_04.html:962): 가능한 한 하나의 섹션에 하나의 디스클로저만 사용한다.
- L[963–963](../../upstream/krds/raw/components/component_04_04.html:963): 여러 개의 디스클로저를 연속적으로 배치하게 되면 복잡성이 증가되어 오히려 사용자에게 혼동을 줄 수 있다.

### 접근성 가이드라인

- L[1078–1078](../../upstream/krds/raw/components/component_04_04.html:1078): 접근성 가이드라인
- L[1081–1081](../../upstream/krds/raw/components/component_04_04.html:1081): 디스클로저를 버튼 역할로 제공한다.
- L[1082–1082](../../upstream/krds/raw/components/component_04_04.html:1082): 디스클로저를 실행하였을 때 특정 섹션이나 화면으로 이동하는 것이 아니므로 &lt;button&gt;을 사용하거나 role="button"을 사용하여 스크린 리더에서 버튼 역할임을 인지할 수 있도록 한다.
- L[1088–1088](../../upstream/krds/raw/components/component_04_04.html:1088): 스크린 리더에서 확장/축소 상태 정보를 확인할 수 있도록 한다.
- L[1089–1089](../../upstream/krds/raw/components/component_04_04.html:1089): aria-expanded 속성이나 title 속성을 활용하여 디스클로저 섹션의 활성화 상태 정보가 스크린 리더에 탐지될 수 있도록 해야 한다.

### 상호작용 가이드라인

- L[1100–1100](../../upstream/krds/raw/components/component_04_04.html:1100): 상호작용 가이드라인
- L[1102–1102](../../upstream/krds/raw/components/component_04_04.html:1102): 디스클로저 탐색
- L[1120–1123](../../upstream/krds/raw/components/component_04_04.html:1120): Tab, Shift + Tab 디스클로저 컨트롤에 초점이 진입하고 포커스링이 표시된다.
- L[1130–1130](../../upstream/krds/raw/components/component_04_04.html:1130): 디스클로저 확장 및 축소
- L[1148–1151](../../upstream/krds/raw/components/component_04_04.html:1148): Click 디스클로저를 Click 하여 펼치거나 접는다
- L[1152–1155](../../upstream/krds/raw/components/component_04_04.html:1152): Enter, Space 디스클로저 컨트롤이 초점을 가진 상태에서 Enter 또는 Space 키를 눌러 디스클로저를 펼치거나 접을 수 있다

### 예시

- L[1174–1174](../../upstream/krds/raw/components/component_04_04.html:1174): 예시
- L[1178–1178](../../upstream/krds/raw/components/component_04_04.html:1178): 기본
- L[1205–1205](../../upstream/krds/raw/components/component_04_04.html:1205): 기본 코드 확인하기

### 마크업 가이드

- L[1256–1256](../../upstream/krds/raw/components/component_04_04.html:1256): 마크업 가이드
- L[1259–1259](../../upstream/krds/raw/components/component_04_04.html:1259): CSS 선택자
- L[1276–1279](../../upstream/krds/raw/components/component_04_04.html:1276): 전체영역 .krds-disclosure .conts-expand-area
- L[1280–1283](../../upstream/krds/raw/components/component_04_04.html:1280): 디스클로저 버튼 .btn-conts-expand
- L[1284–1287](../../upstream/krds/raw/components/component_04_04.html:1284): 컨테이너 .expand-wrap
- L[1297–1297](../../upstream/krds/raw/components/component_04_04.html:1297): JS
- L[1316–1320](../../upstream/krds/raw/components/component_04_04.html:1316): krds_disclosure init() 초기화 및 주요 이벤트 실행
- L[1321–1324](../../upstream/krds/raw/components/component_04_04.html:1321): setupDisclosure() 디스클로저 설정
- L[1325–1328](../../upstream/krds/raw/components/component_04_04.html:1325): toggleDisclosure() 디스클로저 토글
- L[1356–1356](../../upstream/krds/raw/components/component_04_04.html:1356): 개발 시 접근성 관련 주의 사항
- L[1358–1358](../../upstream/krds/raw/components/component_04_04.html:1358): 키보드 탐색 시 초점이 순차적으로 이동하는지 확인한다.

인라인으로 보존된 예시 마크업(참고용이며 공개 네이티브 API가 아님): L[1183–1199](../../upstream/krds/raw/components/component_04_04.html:1183)

CSS/JS/가이드 이미지 원본 참조는 복사된 구현이 아닙니다. 필수/선택 열을 보존한 표 행의 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위 평탄화 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 추가 텍스트 모순은 발견하지 못했습니다. 의미 API/기본값은 이 수용된 계약으로 고정되며, 네이티브 구현은 별도의 근거/검토를 거쳐야 합니다.
- 연결된 외부 코드 예시는 참조만 하고, 이번 준비에서 별도 파일로 포함하거나 읽지 않았습니다: L1210 `../../code/disclosure.html`, L1343 `../../../resources/js/examples/krds_disclosure.js`, L1370 `./variable/disclosure.html`. 확인하지 못한 내용은 추정하지 않습니다.
- 상세에 가이드 이미지 참조가 3개 있으며, 내장 픽셀 도식은 시각적으로 검사하지 않았습니다. 텍스트 구조와 지침만 읽었으며, 정확한 시각 치수와 자산은 이후 시각/출처 검토가 필요합니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정됩니다. 각 네이티브 렌더러는 자체 구현, 동작/스토리 소스, 독립 인수가 여전히 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `DisclosureContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트가 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트·조합·자산·통합에 계속 필수입니다.

이 문서의 공식 인용·파생 텍스트는 원래 KRDS 권리와 출처 표기를 유지하며, 독립 코드 MIT 부여는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
