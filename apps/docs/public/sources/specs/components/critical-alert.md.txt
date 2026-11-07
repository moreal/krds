# 긴급 공지 {#critical-alert}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 수락일 뿐이며, 네이티브 동작·시각/자산 검토·실행된 커버리지는 별도 게이트입니다. 어떤 게시도 승인되지 않았습니다.

시맨틱 ID `critical-alert`, 한국어 이름 긴급 공지, export `CriticalAlert`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_04_02](https://www.krds.go.kr/html/site/component/component_04_02.html), 보존된 [HTML](../../upstream/krds/raw/components/component_04_02.html). 조회 시각 `2026-10-29T23:28:03.344Z`, `72817` 바이트, SHA-256 `be6556c675ce9269b7e70c9e71a0fbae7f6d5e846388e5c9431eee92ccdaf83b`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조해 확인했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 별개입니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류 `component`, 수용된 프로젝트 완료 종류 `component`. 프로젝트 완료 종류는 아래 근거를 따르며, 구체적인 완료 의무와 호스트 경계는 이 계약에 기술됩니다.

지원하는 네이티브 케이스(변형·상태 축): `high-urgency`, `medium-urgency`, `low-urgency`. 이는 네이티브 케이스 이름이며, 상태·반응형·외관 축이 공식 명명 변형인 것은 아닙니다. 공식 유형/예시 제목 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

본문 첫 콘텐츠로 MainMenu와 히어로 사이에 전체 너비 섹션을 둡니다. 장식용 긴급도 아이콘, 보이는 긴급도 레이블, 간결한 공지, 직접 관련된 상세 링크(최대 하나)로 구성합니다. 닫기/접기 컨트롤은 없습니다. 공식 텍스트는 role=banner를 명시적으로 요청합니다.

## 의미 API {#plain-semantic-api}

독립 API: urgency=high|medium|low, label, message, details? {href,label,destinationTitle}. open/defaultOpen이나 닫기 이벤트는 없습니다. 기간 제한 게시는 호스트가 제어합니다. danger/ok/info 스타일 선택자는 예시일 뿐이며, "safe"가 숫자 긴급도 수준과 같다는 증거가 아닙니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어/기본값을 함께 주거나 모드를 바꾸는 것은 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청 하나를 냅니다. 비활성, 무동작, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 커밋된 UI와 초점 상태를 유지합니다. 취소된 리셋은 아무 일도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하며, 제어 prop이 계속 우선합니다. 추가 필드로 렌더러/머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

상세 앵커만 Tab 순서에 들어갑니다. 긴급도에서 자동 초점이나 단정적(assertive) 라이브 역할을 추론하지 않습니다. 장식 아이콘에는 중복 alt가 없습니다. 배너 랜드마크의 이름 지정과 페이지 Header와의 구분은 검토가 필요합니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

텍스트는 보통 한 줄, 좁은 화면에서는 최대 두 줄입니다. 줄 수를 맞추려고 필수 정보를 잘라내지 않습니다. 호스트 문구와 상세 링크는 간결하게 씁니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼/리셋/IME 동작이 없습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 사실에 맞는 긴급 정보와 게시 기간을 소유합니다. 완료 시험은 닫을 수 없음과 상세 링크 목적지를 확인하며, 컴포넌트 안에 폴링이나 네트워크 긴급도 피드는 없습니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, icon, label, message, link; urgency=high|medium|low.

렌더되는 모든 소유 파트는 `data-krds-component="critical-alert"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위 열거는 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정됩니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 공지를 닫거나 접을 수 없습니다.
2. 보이는 레이블이 색 없이 심각도를 전달합니다.
3. 상세 링크는 하나뿐이며 목적지별 이름을 가집니다.
4. 본문 첫 배치는 좁은 화면에서도 읽을 수 있습니다.
5. 아이콘을 중복 안내하지 않습니다.

위 항목은 앞으로 필요한 테스트이며, 실행되었거나 인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색 이외의 상태 단서, 움직임이 있는 곳의 동작 줄이기를 검증합니다. 빈 스위트를 성공으로 간주하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`critical-alert--high-urgency`, `critical-alert--medium-urgency`, `critical-alert--low-urgency`, `critical-alert--narrow`, `critical-alert--page-placement`.

각 케이스는 적용 가능한 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태를 가져야 합니다. Solid 2 미리보기는 별도로 격리됩니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 마련되며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 수락되어야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 씁니다. Lit/Solid 2는 siheom 지원을 만들어 내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연(lazy) 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져오면 안 됩니다. 다른 렌더러 래퍼는 금지입니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML 원본(본문 지침과 상호작용·마크업 표 포함)에서 추출했습니다. 공식 요구사항을 만들어 내지 않도록 원문 언어를 유지합니다. "고려한다/권장/할 수 있다" 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 네이티브가 제어하는 DOM에서 KRDS 원본 JS를 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립 선택입니다.

### 구조

- L[883–883](../../upstream/krds/raw/components/component_04_02.html:883): 구조
- L[889–892](../../upstream/krds/raw/components/component_04_02.html:889): 1. 아이콘 공지 유형을 구분하며 긴급한 정도에 대한 맥락을 파악하는 데 도움 되는 아이콘레이블
- L[902–902](../../upstream/krds/raw/components/component_04_02.html:902): 예) 태풍, 홍수, 감염병, 전산사고, 사이버테러 등
- L[897–905](../../upstream/krds/raw/components/component_04_02.html:897): a. 긴급도 상 국가적으로 재난 재해에 대응하거나 복구가 필요한 상황, 예고되지 않은 급작스러운 서비스 장애/ 이용 중단 상황에 대해 알림 예) 태풍, 홍수, 감염병, 전산사고, 사이버테러 등
- L[906–906](../../upstream/krds/raw/components/component_04_02.html:906): b. 긴급도 중 온/오프라인 서비스 이용 중단에 대한 사전 예고를 알림
- L[907–907](../../upstream/krds/raw/components/component_04_02.html:907): c. 긴급도 하 서비스 이용에 중대한 영향을 미치지는 않으나 대부분의 사용자가 인지해야 하는 상황을 알림
- L[893–909](../../upstream/krds/raw/components/component_04_02.html:893): 2. 레이블 공지 유형을 구분하는 텍스트로 긴급한 정도는 다음 세 가지 상태를 가짐 a. 긴급도 상 국가적으로 재난 재해에 대응하거나 복구가 필요한 상황, 예고되지 않은 급작스러운 서비스 장애/ 이용 중단 상황에 대해 알림 예) 태풍, 홍수, 감염병, 전산사고, 사이버테러 등 b. 긴급도 중 온/오프라인 서비스 이용 중단에 대한 사전 예고를 알림 c. 긴급도 하 서비스 이용에 중대한 영향을 미치지는 않으나 대부분의 사용자가 인지해야 하는 상황을 알림
- L[910–913](../../upstream/krds/raw/components/component_04_02.html:910): 3. 텍스트 공지 내용을 전달하기 위한 간략한 문구
- L[914–917](../../upstream/krds/raw/components/component_04_02.html:914): 4. 링크(선택) 긴급 공지와 관련된 상세 정보를 확인할 수 있는 서비스/화면 링크
- L[918–921](../../upstream/krds/raw/components/component_04_02.html:918): 5. 컨테이너 긴급 공지 배너가 제공되는 영역

### 용례

- L[929–929](../../upstream/krds/raw/components/component_04_02.html:929): 용례
- L[931–931](../../upstream/krds/raw/components/component_04_02.html:931): 사용하기 적합한 경우
- L[936–936](../../upstream/krds/raw/components/component_04_02.html:936): 구조의 레이블 유형을 참고하여 사용자에 중요하게 전달해야 할 필요가 있는 정보 전달에 긴급 공지를 사용해야 한다.
- L[933–938](../../upstream/krds/raw/components/component_04_02.html:933): 중요하고 시의성 있는 정보를 전달해야 할 경우 구조의 레이블 유형을 참고하여 사용자에 중요하게 전달해야 할 필요가 있는 정보 전달에 긴급 공지를 사용해야 한다.
- L[942–942](../../upstream/krds/raw/components/component_04_02.html:942): 사용하기 적합하지 않은 경우
- L[944–944](../../upstream/krds/raw/components/component_04_02.html:944): 홍보 목적의 콘텐츠를 전달하고자 하는 경우
- L[948–948](../../upstream/krds/raw/components/component_04_02.html:948): 본문에 구조화 목록 컴포넌트를 사용하거나 히어로 영역을 적절하게 활용하는 것이 적합하다.
- L[945–950](../../upstream/krds/raw/components/component_04_02.html:945): 일반적인 공지 콘텐츠를 전달하거나 강조하는 경우 본문에 구조화 목록 컴포넌트를 사용하거나 히어로 영역을 적절하게 활용하는 것이 적합하다.
- L[954–954](../../upstream/krds/raw/components/component_04_02.html:954): 입력폼에 대한 유효성 검사 결과, 완료 상태 등 사용자에게 피드백을 제공하기 위한 용도로 사용해서는 안 된다.
- L[951–956](../../upstream/krds/raw/components/component_04_02.html:951): 피드백 메시지를 제공하는 경우 입력폼에 대한 유효성 검사 결과, 완료 상태 등 사용자에게 피드백을 제공하기 위한 용도로 사용해서는 안 된다.

### 사용성 가이드라인

- L[964–964](../../upstream/krds/raw/components/component_04_02.html:964): 사용성 가이드라인
- L[967–967](../../upstream/krds/raw/components/component_04_02.html:967): 시급하고 사용자에게 중요한 정보를 전달하는 데 긴급 공지를 사용한다.
- L[968–968](../../upstream/krds/raw/components/component_04_02.html:968): 긴급 공지는 메인 메뉴와 히어로 영역 사이에 배치되어 사용자의 주의를 끌도록 표현하기 때문에 사용자가 서비스의 핵심 과업을 수행하거나 중요 정보에 접근하는 과정을 방해한다. 따라서 필요한 경우에만 사용해야 하며 공지 유형에 따른 적절한 강조 수준으로 표현해야 한다.
- L[971–971](../../upstream/krds/raw/components/component_04_02.html:971): 일시적으로 게시하고 정보가 필요한 기간 동안만 유지한다.
- L[972–972](../../upstream/krds/raw/components/component_04_02.html:972): 긴급 공지는 공지 내용과 관련된 기간 동안만 일시적으로 사용해야 한다. 긴급 공지 배너가 항상 표시되어 있고 최신화되지 않은 콘텐츠가 제공되면 실제로 긴급한 상황이 발생했을 때 사용자가 긴급 공지에 주의를 기울이지 않을 수 있다.
- L[975–975](../../upstream/krds/raw/components/component_04_02.html:975): 눈에 잘 띄게 표현하고 배치한다.
- L[976–976](../../upstream/krds/raw/components/component_04_02.html:976): 서비스에 접속하자마자 사용자가 가장 먼저 볼 수 있도록 본문 콘텐츠의 가장 첫 요소로 배치하며 컨테이너가 화면의 전체 너비를 차지하도록 표현한다.
- L[979–979](../../upstream/krds/raw/components/component_04_02.html:979): 긴급 공지 배너 숨기기 버튼을 제공하지 않는다.
- L[980–981](../../upstream/krds/raw/components/component_04_02.html:980): 한 번 배너를 숨기고 나면 페이지를 새로 고침하거나 방문 기록을 초기화하기 전까지 사용자는 긴급 공지 내용을 확인할 수 없다. 긴급 공지는 사용자가 반드시 알아야 하는 정보를 강조하기 위해 사용하는 컴포넌트이므로 배너를 숨기거나 일시적으로 접어두는 기능을 제공해서는 안 된다.
- L[984–984](../../upstream/krds/raw/components/component_04_02.html:984): 공지 내용은 이해하기 쉽고 간결하게 작성한다.
- L[985–988](../../upstream/krds/raw/components/component_04_02.html:985): 공지 내용은 이해하기 쉬운 언어를 사용하고 명확하게 이해할 수 있도록 작성한다. 문장은 1줄 이내로 작성하여 사용자의 인지적 부하를 최소화해야 한다. 만약 화면 너비가 충분하지 않다면 2줄까지 사용할 수 있다. 필요한 경우 관련 서비스/화면 링크를 사용하여 사용자가 상세 화면에서 정보를 확인할 수 있도록 구성한다.
- L[991–991](../../upstream/krds/raw/components/component_04_02.html:991): 여러 개의 긴급 공지를 사용하지 않는다.
- L[992–992](../../upstream/krds/raw/components/component_04_02.html:992): 여러 개의 긴급 공지가 제공되면 상대적으로 더 중요한 정보에 집중하기 어려워진다. 또한 사용자에게 부담을 가중시켜 긴급 공지를 무시하게 될 수도 있다.
- L[995–995](../../upstream/krds/raw/components/component_04_02.html:995): 관련 화면으로 이동하기 위한 링크를 여러 개 사용하지 않는다.
- L[996–996](../../upstream/krds/raw/components/component_04_02.html:996): 공지와 관련된 상세 화면으로 이동하기 위한 링크는 공지 내용과 직접적으로 관련된 화면으로 이동하는 1개의 링크만 사용해야 한다. 여러 개의 링크가 제공되면 긴급 공지 요소의 복잡도가 증가하여 내용에 집중하기 어려워진다.

### 플랫폼에 대한 고려 사항

- L[1004–1004](../../upstream/krds/raw/components/component_04_02.html:1004): 플랫폼에 대한 고려 사항
- L[1007–1007](../../upstream/krds/raw/components/component_04_02.html:1007): 화면 너비가 충분하지 않은 경우 텍스트는 2줄까지 표현할 수 있다.
- L[1008–1009](../../upstream/krds/raw/components/component_04_02.html:1008): 긴급 공지는 화면 상단에 표시되므로 작은 모바일 화면에서 다른 콘텐츠의 가시성에 큰 영향을 미칠 수 있다. 화면 너비가 충분하지 않다면 텍스트가 최대 2줄까지 표시되도록 하고,필요한 경우 관련 서비스/화면 링크를 사용하여 사용자가 상세 화면에서 정보를 확인할 수 있도록 구성한다.

### 접근성 가이드라인

- L[1116–1116](../../upstream/krds/raw/components/component_04_02.html:1116): 접근성 가이드라인
- L[1119–1119](../../upstream/krds/raw/components/component_04_02.html:1119): 긴급 공지 섹션에 배너 역할을 제공한다.
- L[1120–1120](../../upstream/krds/raw/components/component_04_02.html:1120): 긴급 공지 섹션에 role="banner"를 사용하여 배너 역할을 부여함으로써 스크린 리더 사용자가 섹션의 용도를 직관적이고 빠르게 탐색할 수 있도록 해야 한다.
- L[1126–1126](../../upstream/krds/raw/components/component_04_02.html:1126): 아이콘에 대체 텍스트를 제공하지 않는다.
- L[1127–1127](../../upstream/krds/raw/components/component_04_02.html:1127): 긴급 공지에는 아이콘 외에 레이블이 항상 표시되므로 스크린 리더 사용자에게 중복된 정보가 전달되지 않도록 아이콘 이미지에 대체 텍스트를 제공해서는 안 된다.
- L[1134–1134](../../upstream/krds/raw/components/component_04_02.html:1134): 목적지를 예측할 수 있는 링크 이름 또는 부가 설명을 제공한다.
- L[1135–1135](../../upstream/krds/raw/components/component_04_02.html:1135): ‘자세히 보기’라는 링크 레이블만으로는 링크에 연결된 목적지 정보를 예측하기 어려우므로 목적지의 웹 문서 제목(title)을 부가적인 설명으로 제공하는 것이 좋다.

### 예시

- L[1155–1155](../../upstream/krds/raw/components/component_04_02.html:1155): 예시
- L[1159–1159](../../upstream/krds/raw/components/component_04_02.html:1159): 기본
- L[1209–1209](../../upstream/krds/raw/components/component_04_02.html:1209): 기본 코드 확인하기

### 마크업 가이드

- L[1229–1229](../../upstream/krds/raw/components/component_04_02.html:1229): 마크업 가이드
- L[1232–1232](../../upstream/krds/raw/components/component_04_02.html:1232): CSS 선택자
- L[1250–1253](../../upstream/krds/raw/components/component_04_02.html:1250): 전체영역 .krds-critical-alerts
- L[1254–1259](../../upstream/krds/raw/components/component_04_02.html:1254): 뱃지영역 .critical-badge 긴급 .danger
- L[1260–1263](../../upstream/krds/raw/components/component_04_02.html:1260): 안전 .ok
- L[1264–1267](../../upstream/krds/raw/components/component_04_02.html:1264): 안내 .info

인라인으로 보존된 예시 마크업(참고용이며 공개 네이티브 API가 아님): L[1164–1203](../../upstream/krds/raw/components/component_04_02.html:1164)

CSS/JS/가이드 이미지 원본 참조는 복사된 구현이 아닙니다. 필수/선택 열을 보존한 표 행의 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위 평탄화 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 기록된 독립 결정: 명시적인 공식 banner 역할을 보존합니다. CriticalAlert 배너에는 간결한 레이블을 접근 가능한 랜드마크 이름으로 주고, 서비스 Header 배너에는 독립적으로 이름을 붙입니다. 이를 alert로 몰래 바꾸거나 자동 초점·단정적 안내를 하지 않습니다.
- 연결된 외부 코드 예시는 참조만 하고, 이번 준비에서 별도 파일로 포함하거나 읽지 않았습니다: L1214 `../../code/critical_alerts.html`, L1282 `./variable/critical_alerts.html`. 확인하지 못한 내용은 추정하지 않습니다.
- 상세에 가이드 이미지 참조가 1개 있으며, 내장 픽셀 도식은 시각적으로 검사하지 않았습니다. 텍스트 구조와 지침만 읽었으며, 정확한 시각 치수와 자산은 이후 시각/출처 검토가 필요합니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정됩니다. 각 네이티브 렌더러는 자체 구현, 동작/스토리 소스, 독립 인수가 여전히 필요합니다.

## 수용된 독립 결정 {#accepted-independent-resolution}

명시적인 공식 banner 역할을 보존합니다. CriticalAlert 배너에는 간결한 레이블을 접근 가능한 랜드마크 이름으로 주고, 서비스 Header 배너에는 독립적으로 이름을 붙입니다. 이를 alert로 몰래 바꾸거나 자동 초점·단정적 안내를 하지 않습니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `CriticalAlertContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트가 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트·조합·자산·통합에 계속 필수입니다.

이 문서의 공식 인용·파생 텍스트는 원래 KRDS 권리와 출처 표기를 유지하며, 독립 코드 MIT 부여는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
