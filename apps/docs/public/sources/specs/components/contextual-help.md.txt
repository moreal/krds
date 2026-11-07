# 맥락적 도움말 {#contextual-help}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 수락일 뿐이며, 네이티브 동작·시각/자산 검토·실행된 커버리지는 별도 게이트입니다. 어떤 게시도 승인되지 않았습니다.

시맨틱 ID `contextual-help`, 한국어 이름 맥락적 도움말, export `ContextualHelp`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_08_03](https://www.krds.go.kr/html/site/component/component_08_03.html), 보존된 [HTML](../../upstream/krds/raw/components/component_08_03.html). 조회 시각 `2026-10-29T23:28:05.025Z`, `96929` 바이트, SHA-256 `13d1fe66ded72ef2b1492db7e2d7d549457511c87b12003ced10f78c96637531`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조해 확인했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 별개입니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류 `component`, 수용된 프로젝트 완료 종류 `component`. 프로젝트 완료 종류는 아래 근거를 따르며, 구체적인 완료 의무와 호스트 경계는 이 계약에 기술됩니다.

지원하는 네이티브 케이스(변형·상태 축): `information`, `help`, `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`. 이는 네이티브 케이스 이름이며, 상태·반응형·외관 축이 공식 명명 변형인 것은 아닙니다. 공식 유형/예시 제목 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

연관된 필드/레이블 옆에 이름 있는 정보/물음표 버튼을 두고, DOM에서 바로 다음에 팝오버(제목, 선택적 링크가 있는 본문, 닫기 버튼)를 둡니다. 중첩된 도움말/모달은 없으며, 필수 작업 정보를 여기에만 숨기지 않습니다.

## 의미 API {#plain-semantic-api}

독립 API: open/defaultOpen=false, onOpenChange({open}), title, content, variant=information|help, placement=bottom-start 기본(공식 여섯 정렬을 매핑), triggerLabel, relatedId. 네이티브 버튼은 aria-expanded/controls를 갖고, 비모달 팝오버 영역에는 레이블이 있으며, 상호작용 콘텐츠에 tooltip 역할을 쓰지 않습니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어/기본값을 함께 주거나 모드를 바꾸는 것은 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청 하나를 냅니다. 비활성, 무동작, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 커밋된 UI와 초점 상태를 유지합니다. 취소된 리셋은 아무 일도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하며, 제어 prop이 계속 우선합니다. 추가 필드로 렌더러/머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

클릭/Enter/Space로 열거나 토글합니다. 링크가 있으면 열릴 때 첫 상호작용 요소에 초점을 둡니다. Tab으로 벗어날 수 있습니다(트랩 없음). 바깥 클릭, Escape, 트리거 토글로 닫으며 공식 표대로 트리거로 초점을 돌려줍니다. Escape는 조합 중이거나 이미 처리된 이벤트를 무시합니다. 트리거가 제거되면 제공된 쓸 수 있는 복귀 대상, 없으면 body로 대체합니다. 실제로 닫힌 경우에만 복원합니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

충돌 시 뒤집기/이동으로 팝업 전체를 화면 안에 두고 트리거나 중요한 대상을 가리지 않습니다. 뷰포트가 매우 작으면 콘텐츠를 스크롤하며, 200–400% 확대에서 불투명한 잘림이 없어야 합니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼 상태가 없습니다. 도움말 버튼은 type=button이며, 조합 중 Escape는 무시됩니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 짧은 맥락 콘텐츠와 새 창 링크를 소유하고, 같은 작업에서 HelpPanel과 동시에 쓰지 않습니다. 완료에는 실제 상호작용 링크 초점, 닫기, 재배치 동작이 필요합니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, trigger, icon, popover, title, body, close; open,closed,placement.

렌더되는 모든 소유 파트는 `data-krds-component="contextual-help"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위 열거는 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정됩니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 기본은 닫혀 있고 자동 시작하지 않습니다.
2. 고유한 트리거 이름이 주제를 식별합니다.
3. 링크 콘텐츠가 초점을 받고 Tab으로 벗어납니다.
4. Escape/바깥 클릭은 트리거로 돌아갑니다.
5. 뷰포트 가장자리에서 팝업이 재배치됩니다.
6. 트리거 제거/라우트 언마운트 시 리스너를 정리합니다.

위 항목은 앞으로 필요한 테스트이며, 실행되었거나 인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색 이외의 상태 단서, 움직임이 있는 곳의 동작 줄이기를 검증합니다. 빈 스위트를 성공으로 간주하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`contextual-help--information`, `contextual-help--help`, `contextual-help--six-placements`, `contextual-help--interactive-link`, `contextual-help--narrow-edge`, `contextual-help--removed-trigger`, `contextual-help--controlled-rejected`.

각 케이스는 적용 가능한 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태를 가져야 합니다. Solid 2 미리보기는 별도로 격리됩니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 마련되며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 수락되어야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 씁니다. Lit/Solid 2는 siheom 지원을 만들어 내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연(lazy) 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져오면 안 됩니다. 다른 렌더러 래퍼는 금지입니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML 원본(본문 지침과 상호작용·마크업 표 포함)에서 추출했습니다. 공식 요구사항을 만들어 내지 않도록 원문 언어를 유지합니다. "고려한다/권장/할 수 있다" 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 네이티브가 제어하는 DOM에서 KRDS 원본 JS를 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립 선택입니다.

### 구조

- L[883–883](../../upstream/krds/raw/components/component_08_03.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_08_03.html:889): 1. 아이콘 버튼 도움말 콘텐츠의 표시를 토글하는 버튼. 정보의 유형에 따라 정보(i) 아이콘, 물음표(?) 아이콘으로 구분됨
- L[890–890](../../upstream/krds/raw/components/component_08_03.html:890): 2. 컨테이너 도움말 영역과 배경을 구분하는 요소
- L[891–891](../../upstream/krds/raw/components/component_08_03.html:891): 3. 제목 도움말의 제목
- L[892–892](../../upstream/krds/raw/components/component_08_03.html:892): 4. 본문 구체적인 설명 텍스트. 일반적으로 짧은 단락으로 구성되며, 링크를 포함할 수 있음
- L[893–893](../../upstream/krds/raw/components/component_08_03.html:893): 5. 닫기 버튼 컨테이너에 포함된 x 아이콘 버튼

### 유형

- L[901–901](../../upstream/krds/raw/components/component_08_03.html:901): 유형
- L[903–903](../../upstream/krds/raw/components/component_08_03.html:903): 정보 제공
- L[905–907](../../upstream/krds/raw/components/component_08_03.html:905): 버튼이 정보(i) 아이콘으로 표현된다. 컴포넌트나 레이블 옆에 배치되어 해당 요소에 관한 부가적인 정보나 사용자가 알았을 때 도움이 되는 정보를 전달하기 위해 사용된다. 본문은 간략하지만 요소에 대한 구체적인 안내를 포함하고 있어야 한다.
- L[909–909](../../upstream/krds/raw/components/component_08_03.html:909): 예) 비활성화 상태인 컨트롤 요소에 대해 현시점에서 사용할 수 없는 이유에 대한 설명 등
- L[914–914](../../upstream/krds/raw/components/component_08_03.html:914): 도움 제공
- L[920–920](../../upstream/krds/raw/components/component_08_03.html:920): 예) 입력 방법에 대한 설명, 전문 용어에 대한 해설 등

### 용례

- L[929–929](../../upstream/krds/raw/components/component_08_03.html:929): 용례
- L[931–931](../../upstream/krds/raw/components/component_08_03.html:931): 사용하기 적합하지 않은 경우
- L[936–936](../../upstream/krds/raw/components/component_08_03.html:936): 텍스트 레이블 없는 아이콘 단독 컨트롤 요소에 레이블을 표시하고자 하는 경우에는 툴팁을 사용하는 것이 적절하다.
- L[933–938](../../upstream/krds/raw/components/component_08_03.html:933): 컨트롤 요소에 대한 레이블을 제공할 때 텍스트 레이블 없는 아이콘 단독 컨트롤 요소에 레이블을 표시하고자 하는 경우에는 툴팁을 사용하는 것이 적절하다.
- L[942–942](../../upstream/krds/raw/components/component_08_03.html:942): 사용자가 맥락적 도움말을 발견하지 못할 수 있으므로 사용자가 반드시 확인해야 하는 중요한 정보를 도움말 팝오버에 숨겨서는 안 된다. 중요한 정보를 전달하는 데는 인라인 도움말이나 도움 패널이 적합하다.
- L[939–944](../../upstream/krds/raw/components/component_08_03.html:939): 사용자가 작업을 완료하는 데 필요한 중요한 정보를 전달할 때 사용자가 맥락적 도움말을 발견하지 못할 수 있으므로 사용자가 반드시 확인해야 하는 중요한 정보를 도움말 팝오버에 숨겨서는 안 된다. 중요한 정보를 전달하는 데는 인라인 도움말이나 도움 패널이 적합하다.
- L[948–948](../../upstream/krds/raw/components/component_08_03.html:948): 툴팁이나 인라인 도움말을 사용하는 것이 적절하다.
- L[945–950](../../upstream/krds/raw/components/component_08_03.html:945): 간단한 추가 정보를 제공할 때 툴팁이나 인라인 도움말을 사용하는 것이 적절하다.

### 사용성 가이드라인

- L[958–958](../../upstream/krds/raw/components/component_08_03.html:958): 사용성 가이드라인
- L[961–961](../../upstream/krds/raw/components/component_08_03.html:961): 아이콘 버튼은 도움 정보를 제공하고자 하는 요소 주변에 배치한다.
- L[962–962](../../upstream/krds/raw/components/component_08_03.html:962): 정보를 제공하고자 하는 컴포넌트나 레이블 옆에 배치하여 관련 요소와의 연관성이 명확하게 인지될 수 있도록 한다.
- L[965–965](../../upstream/krds/raw/components/component_08_03.html:965): 팝오버 영역이 화면을 벗어나지 않도록 표현한다.
- L[966–966](../../upstream/krds/raw/components/component_08_03.html:966): 도움말 팝오버 영역이 시각적으로 확인할 수 없는 화면 밖의 영역에 배치되어 내부 콘텐츠가 가려지지 않도록 해야 한다.
- L[969–969](../../upstream/krds/raw/components/component_08_03.html:969): 팝오버 영역이 본문의 중요 콘텐츠를 가리지 않도록 표현한다.
- L[970–970](../../upstream/krds/raw/components/component_08_03.html:970): 팝오버 영역이 활성화 버튼과 맥락적으로 도움을 제공하고자 하는 본문 콘텐츠 요소를 가리지 않도록 적절한 표시 방향을 설정한다.
- L[973–973](../../upstream/krds/raw/components/component_08_03.html:973): 사용자가 작업을 수행하기 위해 반드시 알아야 하는 필수 정보가 맥락적 도움말 콘텐츠에서만 제공되지 않도록 한다.
- L[974–975](../../upstream/krds/raw/components/component_08_03.html:974): 맥락적 도움말을 발견하지 못할 수 있으므로 사용자가 반드시 확인해야 하는 중요한 정보를 도움말 팝오버에만 제공해서는 안 된다. 맥락적 도움말은 필수 정보가 아니라 제공되었을 때 사용자가 더 쉽게 이용하는 데 도움되는 정보를 제공해야 한다. 필수 정보를 잘 요약하여 본문에 표현하고 관련된 유용한 정보를 맥락적 도움말로 제공한다.
- L[983–983](../../upstream/krds/raw/components/component_08_03.html:983): 맥락적 도움말에서 또 다른 맥락적 도움말을 실행하거나 모달을 실행하지 않도록 한다.
- L[984–984](../../upstream/krds/raw/components/component_08_03.html:984): 여러 개의 도움말 팝업을 동시에 활성화 하거나 하나의 팝오버를 다른 팝오버 내부에 중첩시켜서는 안 된다. 또한 맥락적 도움말에서 모달이 생성되지 않도록 하여 복잡성을 피해야 한다.
- L[987–987](../../upstream/krds/raw/components/component_08_03.html:987): 도움말 내부 링크는 새 창으로 실행한다.
- L[988–988](../../upstream/krds/raw/components/component_08_03.html:988): 본문에 링크가 포함되어 있는 경우에는 항상 새 창으로 링크를 실행시켜 사용자의 현재 과업 맥락이 중단되지 않도록 한다.
- L[991–991](../../upstream/krds/raw/components/component_08_03.html:991): 맥락적 도움말과 도움 패널을 함께 사용하지 않는다.
- L[992–992](../../upstream/krds/raw/components/component_08_03.html:992): 사용자가 인터페이스의 작동 방식을 혼동하지 않도록 하나의 과업 흐름에서 맥락적 도움말과 도움 패널을 동시에 사용하지 않아야 한다.

### 플랫폼에 대한 고려 사항

- L[1004–1004](../../upstream/krds/raw/components/component_08_03.html:1004): 플랫폼에 대한 고려 사항
- L[1007–1007](../../upstream/krds/raw/components/component_08_03.html:1007): 모든 화면 크기에서 팝오버 영역이 완전히 표시되는지 확인한다.
- L[1008–1008](../../upstream/krds/raw/components/component_08_03.html:1008): 특정 너비에서 도움말 팝오버 영역이 시각적으로 확인할 수 없는 화면 밖의 영역에 배치되지 않는지 확인하여 문제가 발견된 경우 적절한 영역으로 배치를 변경해야 한다.

### 접근성 가이드라인

- L[1130–1130](../../upstream/krds/raw/components/component_08_03.html:1130): 접근성 가이드라인
- L[1133–1133](../../upstream/krds/raw/components/component_08_03.html:1133): 아이콘과 인접 배경 간 명도 대비를 3:1 이상으로 제공한다.
- L[1134–1134](../../upstream/krds/raw/components/component_08_03.html:1134): 사용자가 아이콘이 컨트롤로 사용되고 있으며 유형에 따라 다른 정보를 제공함을 인지할 수 있도록 아이콘과 인접 배경의 명도 대비를 3:1 이상으로 제공해야 한다.
- L[1141–1141](../../upstream/krds/raw/components/component_08_03.html:1141): 아이콘 버튼에 이름을 제공한다.
- L[1142–1142](../../upstream/krds/raw/components/component_08_03.html:1142): 스크린 리더 사용자가 활성화 버튼의 용도를 이해할 수 있도록 각각의 아이콘 버튼에 이름을 제공해야 한다.
- L[1150–1150](../../upstream/krds/raw/components/component_08_03.html:1150): 아이콘 버튼에 고유하고 적절한 이름을 제공한다.
- L[1151–1152](../../upstream/krds/raw/components/component_08_03.html:1151): 아이콘 버튼이 맥락적으로 도움을 제공하고자 하는 본문 콘텐츠의 내용을 포함하고 있지 않다면 해당 정보를 아이콘 버튼의 이름으로 포함하여 스크린 리더 사용자가 정확한 용도를 이해할 수 있도록 제공한다. 페이지에 존재하는 다른 아이콘 버튼과 혼동되지 않도록 모든 아이콘 버튼의 이름은 고유해야 한다.
- L[1159–1159](../../upstream/krds/raw/components/component_08_03.html:1159): 맥락적 도움말은 사용자가 요청한 경우에만 실행되어야 한다.
- L[1160–1160](../../upstream/krds/raw/components/component_08_03.html:1160): 페이지가 로딩되자마자 특정 맥락적 도움말이 활성화되는 등 사용자가 의도하지 않는 상황에서 자동으로 실행되어서는 안 된다.
- L[1168–1168](../../upstream/krds/raw/components/component_08_03.html:1168): 아이콘 버튼과 도움말 팝오버 콘텐츠를 적절한 순서로 제공한다.
- L[1169–1169](../../upstream/krds/raw/components/component_08_03.html:1169): 스크린 리더 사용자가 도움말 팝오버 콘텐츠에 논리적인 순서로 접근할 수 있도록 관련 있는 아이콘 버튼 다음 요소로 제공해야 한다.
- L[1176–1176](../../upstream/krds/raw/components/component_08_03.html:1176): 키보드 초점은 논리적인 순서로 이동해야 한다.
- L[1177–1177](../../upstream/krds/raw/components/component_08_03.html:1177): 맥락적 도움말 팝오버 내부에 링크가 포함된 경우, 맥락적 도움말을 활성화했을 때 키보드 초점은 팝오버 내부의 대화형 요소로 이동해야 한다. 이때, 팝오버 내부에서 키보드 함정이 발생하지 않도록 유의해야 한다.
- L[1185–1185](../../upstream/krds/raw/components/component_08_03.html:1185): 아이콘 버튼의 크기를 44px x 44px 이상으로 제공하는 방안을 고려한다.
- L[1186–1189](../../upstream/krds/raw/components/component_08_03.html:1186): 클릭이나 터치 영역을 정교하게 조작하기 어려운 사용자를 고려하여 아이콘 버튼의 크기를 44px x 44px 이상으로 제공하는 방안을 고려한다. 이때, 단위는 CSS 픽셀을 기준으로 한다. 만약 아이콘 버튼이 문장의 끝에 제공되고 있다면 문장의 일부 요소로 간주되기 때문에 크기에 대한 요구사항을 충족하지 않아도 된다.

### 상호작용 가이드라인

- L[1201–1201](../../upstream/krds/raw/components/component_08_03.html:1201): 상호작용 가이드라인
- L[1203–1203](../../upstream/krds/raw/components/component_08_03.html:1203): 맥락적 도움말 실행
- L[1221–1224](../../upstream/krds/raw/components/component_08_03.html:1221): Click 아이콘 버튼을 Click 하면 도움말 콘텐츠가 표시된다.
- L[1225–1228](../../upstream/krds/raw/components/component_08_03.html:1225): Enter, Space 아이콘 버튼이 초점을 가진 상태에서 Enter 또는 Space 키를 누르면 도움말 콘텐츠가 표시된다.
- L[1235–1235](../../upstream/krds/raw/components/component_08_03.html:1235): 도움말 내부 콘텐츠 탐색
- L[1253–1256](../../upstream/krds/raw/components/component_08_03.html:1253): Tab 도움말 팝오버가 활성화된 상태에서 내부 링크 요소를 순차적으로 탐색한다.
- L[1263–1263](../../upstream/krds/raw/components/component_08_03.html:1263): 맥락적 도움말 비활성화
- L[1281–1287](../../upstream/krds/raw/components/component_08_03.html:1281): Click 아이콘 버튼 또는 도움말 팝오버 바깥쪽 본문 영역을 Click 하면 도움말 콘텐츠가 숨겨진다. 키보드 초점은 관련된 아이콘 버튼으로 돌아간다.
- L[1288–1294](../../upstream/krds/raw/components/component_08_03.html:1288): Esc 초점의 위치와 상관없이 Esc 키를 누르면 도움말 콘텐츠가 숨겨진다. 키보드 초점은 관련된 아이콘 버튼으로 돌아간다.
- L[1295–1301](../../upstream/krds/raw/components/component_08_03.html:1295): Enter, Space 아이콘 버튼이 초점을 가진 상태에서 Enter 또는 Space 키를 누르면 도움말 콘텐츠가 숨겨진다. 키보드 초점은 관련된 아이콘 버튼으로 돌아간다.

### 예시

- L[1320–1320](../../upstream/krds/raw/components/component_08_03.html:1320): 예시
- L[1324–1324](../../upstream/krds/raw/components/component_08_03.html:1324): 기본
- L[1341–1341](../../upstream/krds/raw/components/component_08_03.html:1341): 도움말 제목
- L[1366–1366](../../upstream/krds/raw/components/component_08_03.html:1366): 도움말 제목
- L[1391–1391](../../upstream/krds/raw/components/component_08_03.html:1391): 도움말 제목
- L[1418–1418](../../upstream/krds/raw/components/component_08_03.html:1418): 도움말 제목
- L[1443–1443](../../upstream/krds/raw/components/component_08_03.html:1443): 도움말 제목
- L[1468–1468](../../upstream/krds/raw/components/component_08_03.html:1468): 도움말 제목
- L[1491–1491](../../upstream/krds/raw/components/component_08_03.html:1491): 기본 코드 확인하기

### 마크업 가이드

- L[1511–1511](../../upstream/krds/raw/components/component_08_03.html:1511): 마크업 가이드
- L[1514–1514](../../upstream/krds/raw/components/component_08_03.html:1514): CSS 선택자
- L[1534–1546](../../upstream/krds/raw/components/component_08_03.html:1534): 전체영역 .krds-contextual-help 팝오버 위치 .top.left (상단 왼쪽) .top.center (상단 중앙) .top.right (상단 오른쪽) .bottom.left (하단 왼쪽) .bottom.center (하단 중앙) .bottom.right (하단 오른쪽)
- L[1547–1550](../../upstream/krds/raw/components/component_08_03.html:1547): 도움말 제어 .tooltip-action
- L[1551–1554](../../upstream/krds/raw/components/component_08_03.html:1551): 팝오버 .tooltip-popover
- L[1564–1564](../../upstream/krds/raw/components/component_08_03.html:1564): JS
- L[1583–1587](../../upstream/krds/raw/components/component_08_03.html:1583): krds_contextualHelp init() 초기화 및 주요 이벤트 실행
- L[1588–1591](../../upstream/krds/raw/components/component_08_03.html:1588): setupTooltips() 도움말 설정
- L[1592–1595](../../upstream/krds/raw/components/component_08_03.html:1592): toggleTooltip() 도움말 팝오버 토글

인라인으로 보존된 예시 마크업(참고용이며 공개 네이티브 API가 아님): L[1329–1485](../../upstream/krds/raw/components/component_08_03.html:1329)

CSS/JS/가이드 이미지 원본 참조는 복사된 구현이 아닙니다. 필수/선택 열을 보존한 표 행의 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위 평탄화 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 기록된 독립 결정: 수락된 바깥 클릭 닫기는, 포인터 대상이 다른 컨트롤이어도 공식 트리거 복귀 규칙을 문자 그대로 따릅니다. 그 대상 동작을 정상 실행한 뒤, 실제로 수락된 닫기 후에만 쓸 수 있는 트리거를 한 번 복원합니다. 열린 최상위 모달은 자신의 활성 경계 안에서 복원을 유지합니다. 거부된 닫기에서는 초점 이동이 없습니다. 트리거가 없으면 쓸 수 있는 같은 경계의 fallbackFocusId를 쓰고, 이후 활성 모달 격리 밖에서만 초점 가능한 컨테이너/body를 씁니다.
- 연결된 외부 코드 예시는 참조만 하고, 이번 준비에서 별도 파일로 포함하거나 읽지 않았습니다: L1496 `../../code/contextual_help.html`, L1610 `../../../resources/js/examples/krds_contextualHelp.js`, L1629 `./variable/contextual_help.html`. 확인하지 못한 내용은 추정하지 않습니다.
- 상세에 가이드 이미지 참조가 3개 있으며, 내장 픽셀 도식은 시각적으로 검사하지 않았습니다. 텍스트 구조와 지침만 읽었으며, 정확한 시각 치수와 자산은 이후 시각/출처 검토가 필요합니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정됩니다. 각 네이티브 렌더러는 자체 구현, 동작/스토리 소스, 독립 인수가 여전히 필요합니다.

## 수용된 독립 결정 {#accepted-independent-resolution}

수락된 바깥 클릭 닫기는, 포인터 대상이 다른 컨트롤이어도 공식 트리거 복귀 규칙을 문자 그대로 따릅니다. 그 대상 동작을 정상 실행한 뒤, 실제로 수락된 닫기 후에만 쓸 수 있는 트리거를 한 번 복원합니다. 열린 최상위 모달은 자신의 활성 경계 안에서 복원을 유지합니다. 거부된 닫기에서는 초점 이동이 없습니다. 트리거가 없으면 쓸 수 있는 같은 경계의 fallbackFocusId를 쓰고, 이후 활성 모달 격리 밖에서만 초점 가능한 컨테이너/body를 씁니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `ContextualHelpContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트가 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트·조합·자산·통합에 계속 필수입니다.

이 문서의 공식 인용·파생 텍스트는 원래 KRDS 권리와 출처 표기를 유지하며, 독립 코드 MIT 부여는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
