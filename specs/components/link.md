# 링크 {#link}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `link`, 한국어 이름 링크, export `Link`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_05_01](https://www.krds.go.kr/html/site/component/component_05_01.html), 보존본 [HTML](../../upstream/krds/raw/components/component_05_01.html). 수집 `2026-10-29T23:28:04.183Z`, `79213` 바이트, SHA-256 `5dd23146a2c35cd36a52f4658c457abd8c1f3f934ce62d5c9d93fcea288ce5b5`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류는 `component`, 수용된 프로젝트 완료 종류도 `component`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 케이스(변형·상태 축)는 `standalone`, `inline`, `group`, `external`입니다. 이는 네이티브 케이스 이름입니다. 상태·반응형·외형 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형·예시 헤딩 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

목적지를 구체적으로 알리는 레이블과 선택적 장식/외부 아이콘·밑줄을 담은 실제 <a href>를 씁니다. 인라인 크기는 본문과 같게 합니다. 외부 목적지와 새 창 동작을 구분해 알립니다. 사용할 수 없는 링크는 href를 생략하며 키보드 동작이 아닙니다.

## 의미 API {#plain-semantic-api}

독립 API입니다. href, target, rel, label/content, disabled=false, appearance=basic|emphasis, size=small|medium|large, underline=true(명확한 내비게이션 맥락은 예외)를 씁니다. disabled는 href를 생략하고 모든 이동과 콜백을 막습니다. 오래된 클릭 핸들러를 남기지 않습니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어와 기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 변경 요청 하나를 냅니다. 비활성, 무동작, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

네이티브 Tab과 Enter/클릭 이동을 따르며, 보조키 클릭, 컨텍스트 메뉴, 새 탭 열기를 포함합니다. Space를 버튼처럼 처리하는 핸들러는 없습니다. 같은 문서 초점 정책은 모든 링크가 아니라 SkipLink/InPageNavigation의 몫입니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

레이블은 읽기 쉬워야 하고 초점이 보여야 합니다. 권장 클릭 영역은 포인터 17×17, 터치 44×44이며 적절한 레이아웃에서 적용됩니다. 인라인 링크는 텍스트 흐름을 유지합니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼/리셋/IME 동작은 없습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

실제 목적지, tel:/mailto: 값, 외부 링크의 의미는 호스트가 책임집니다. 필요하다고 명시한 출처별 조합을 제외하고 target=_blank를 자동으로 붙이지 않습니다. 네이티브 브라우저 Link 동작은 라우터 통합 뒤에도 유지되어야 합니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, label, icon; disabled,external.

렌더링된 모든 소유 파트는 `data-krds-component="link"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 씁니다. 네이티브/ARIA 상태가 우선합니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 앵커 href가 실제 목적지와 네이티브 보조키 클릭을 노출합니다.
2. disabled는 href를 생략하고 아무것도 실행하지 않습니다.
3. 인라인 링크는 색 없이도 식별됩니다.
4. 외부/새 창 의도를 알립니다.
5. 레이블이 목적지를 일관되게 가리킵니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색 외 상태 단서, 움직임이 있다면 동작 줄이기를 검증합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`link--standalone`, `link--inline`, `link--group`, `link--external`, `link--disabled`, `link--mailto-tel`.

각 케이스는 해당하는 모든 네이티브 렌더러에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태가 필요합니다. 렌더러는 Solid 1, React, Svelte, Vue, Lit, Qwik, Angular이며 Solid 2 미리보기는 따로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 별도로 준비됩니다. 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 인수되어야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 상류 siheom 어댑터만 씁니다. Lit과 Solid 2는 siheom 지원을 지어내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름과 대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져와서는 안 됩니다. 다른 프레임워크 렌더러 래퍼는 금지합니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존 상세 HTML에서 추출했으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 출처 언어(한국어)를 그대로 둡니다. “고려/권장/수 있다” 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 출처 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS를 네이티브 제어 DOM에서 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 빼면 독립 선택입니다.

### 구조

- L[883–883](../../upstream/krds/raw/components/component_05_01.html:883): 구조
- L[889–892](../../upstream/krds/raw/components/component_05_01.html:889): 1. 레이블 링크와 연결된 대상을 안내하는 텍스트
- L[893–896](../../upstream/krds/raw/components/component_05_01.html:893): 2. 인디케이터(선택) 일반 텍스트와 링크 텍스트를 명확하게 구분하기 위한 시각적인 식별자로 실선/파선, 밑줄로 표현됨. 링크가 메뉴, 푸터, 사이트맵과 같이 용도가 명확한 요소 내에서 사용되는 경우에는 인디케이터를 생략할 수 있음
- L[897–900](../../upstream/krds/raw/components/component_05_01.html:897): 3. 아이콘(선택) 현재 서비스의 맥락을 벗어나 다른 웹사이트로 이동하거나 부가적인 도움말 제공 화면으로 이동하는 경우에 사용됨

### 유형

- L[908–908](../../upstream/krds/raw/components/component_05_01.html:908): 유형
- L[910–910](../../upstream/krds/raw/components/component_05_01.html:910): 단독
- L[916–916](../../upstream/krds/raw/components/component_05_01.html:916): 인라인
- L[922–922](../../upstream/krds/raw/components/component_05_01.html:922): 그룹

### 용례

- L[932–932](../../upstream/krds/raw/components/component_05_01.html:932): 용례
- L[934–934](../../upstream/krds/raw/components/component_05_01.html:934): 사용하기 적합한 경우
- L[936–939](../../upstream/krds/raw/components/component_05_01.html:936): 다른 서비스/애플리케이션, 한 서비스 내의 다른 화면, 한 화면 내의 다른 섹션 등으로 이동이 필요한 경우 링크 역할의 컴포넌트를 지원하는 경우 링크를 사용한다.
- L[943–943](../../upstream/krds/raw/components/component_05_01.html:943): 사용하기 적합하지 않은 경우
- L[945–948](../../upstream/krds/raw/components/component_05_01.html:945): 입력폼 제출, 대화창 실행, 기능 취소 등 중요한 상호작용이 필요한 경우 버튼 컴포넌트를 사용하는 것이 적절하다.

### 사용성 가이드라인

- L[956–956](../../upstream/krds/raw/components/component_05_01.html:956): 사용성 가이드라인
- L[959–959](../../upstream/krds/raw/components/component_05_01.html:959): 링크가 인라인으로 사용될 때 링크 텍스트를 주변 텍스트와 동일한 크기로 제공한다.
- L[960–960](../../upstream/krds/raw/components/component_05_01.html:960): 문장 중 일부 단어의 크기만 조정되면 문단의 가독성에 중요한 텍스트의 스타일 속성(행간 등)에 일관성이 저하되어 정보 인지를 어렵게 만들고 사용자에게 혼동을 줄 수 있다.
- L[963–963](../../upstream/krds/raw/components/component_05_01.html:963): 링크와 관련된 사용자 과업, 플로(Flow)의 중요도에 따라 위계를 명확하게 구분한다.
- L[964–967](../../upstream/krds/raw/components/component_05_01.html:964): 일반적으로 파란색이나 서비스의 주조색(Main color)으로 표현되는 강조 링크를 가장 중요한 정보에 사용한다. 기본 링크는 중간 수준의 강조가 필요한 경우에 사용한다. 링크와 관련된 행동의 중요도가 낮거나 한 페이지 또는 한 개의 뷰에서 중요도가 동일한 여러 개의 링크가 제공되어야 하는 경우에 적합하다.
- L[974–974](../../upstream/krds/raw/components/component_05_01.html:974): 링크를 색상만으로 구분하지 않는다.
- L[975–975](../../upstream/krds/raw/components/component_05_01.html:975): 링크에 인디케이터를 제공하면 요소를 직관적으로 인지할 수 있으며, 색상 지각에 어려움이 있는 사용자도 링크를 명확하게 변별할 수 있다.
- L[986–986](../../upstream/krds/raw/components/component_05_01.html:986): 링크 레이블은 연결된 목적지 정보를 예측할 수 있는 내용으로 제공한다.
- L[987–991](../../upstream/krds/raw/components/component_05_01.html:987): 링크는 사용자를 현재의 맥락에서 데리고 나와 새로운 위치로 이동시킨다. 그러므로 링크 레이블은 목적지에서 발견할 수 있는 콘텐츠 내용을 정확하게 반영해야 한다. 따라서 주변 맥락을 활용하여 링크 목적지 정보를 명확하게 파악할 수 있는 경우를 제외하고 '이곳을 클릭하세요', '더 읽기'와 같은 일반적인 텍스트를 레이블로 사용해서는 안 된다. 레이블은 사용자가 이해할 수 있을 만큼 구체적이고 설명적이어야 하지만 텍스트가 여러 줄로 줄바꿈될 정도로 길어지는 것은 피해야 한다.
- L[994–994](../../upstream/krds/raw/components/component_05_01.html:994): 이메일 주소, 전화번호 정보를 링크로 제공한다.
- L[995–995](../../upstream/krds/raw/components/component_05_01.html:995): 이메일 주소, 전화번호를 링크로 마크업하고 각각에 'mailto:', 'tel:' URI 스킴을 적용하면 텍스트를 복사하지 않고 링크를 실행하는 것만으로 적절한 플랫폼으로 연결될 수 있다.
- L[998–998](../../upstream/krds/raw/components/component_05_01.html:998): 외부 서비스로 이동하는 링크를 분명하게 구분하고 일관된 방식으로 표현한다.
- L[999–999](../../upstream/krds/raw/components/component_05_01.html:999): 외부 서비스로 이동하는 링크에는 별도의 아이콘이나 텍스트(예 - ‘외부’)를 제공하여 링크를 실행함으로써 현재 이용 중인 서비스를 벗어나게 될 것임을 사용자가 예측할 수 있도록 해야 한다.
- L[1010–1010](../../upstream/krds/raw/components/component_05_01.html:1010): 링크는 레이블의 설명과 가장 관련성이 높은 목적지로 바로 이동할 수 있도록 구성한다.
- L[1011–1011](../../upstream/krds/raw/components/component_05_01.html:1011): 사용자가 링크를 실행하여 이동한 후, 원하는 정보를 찾기 위해 부가적인 탐색을 시도하지 않도록 적절한 목적지로 연결해야 한다. 적절한 경우 연결된 서비스의 특정 섹션이 목적지로 사용될 수 있다.

### 접근성 가이드라인

- L[1133–1133](../../upstream/krds/raw/components/component_05_01.html:1133): 접근성 가이드라인
- L[1136–1136](../../upstream/krds/raw/components/component_05_01.html:1136): 비활성화, 사용불가 상태인 경우를 제외하고 모든 링크는 키보드로 접근하고 조작할 수 있도록 한다.
- L[1137–1137](../../upstream/krds/raw/components/component_05_01.html:1137): &lt;a&gt;가 스크린 리더에서 컨트롤 요소로 인식되고 키보드로 접근할 수 있도록 href 속성을 선언해야 한다. 단, 링크가 사용불가 상태이거나 일시적으로 기능이 동작하지 않도록 하는 경우, href 속성을 생략하여 키보드가 접근하지 않도록 하는 것이 적절하다.
- L[1144–1144](../../upstream/krds/raw/components/component_05_01.html:1144): 링크 텍스트는 링크 목적지 정보를 적절하게 설명할 수 있는 내용으로 제공한다.
- L[1145–1145](../../upstream/krds/raw/components/component_05_01.html:1145): 링크 요소의 레이블을 텍스트 형식으로 제공하여 스크린 리더 사용자가 링크 목적지 정보를 전달받을 수 있도록 해야 한다. 만약 눈에 보이는 텍스트만으로 목적지에 대한 정보를 충분히 전달하기 어렵다면 툴팁 속성(title)을 보조적인 수단으로 활용할 수 있다.
- L[1152–1152](../../upstream/krds/raw/components/component_05_01.html:1152): 링크 레이블은 고유한 내용으로 제공한다.
- L[1153–1153](../../upstream/krds/raw/components/component_05_01.html:1153): 같은 목적지로 이동하는 링크 레이블은 동일하게, 서로 다른 목적지로 이동하는 링크 레이블은 다르게 제공하여 사용자가 목적지를 혼동하지 않도록 해야 한다.
- L[1161–1161](../../upstream/krds/raw/components/component_05_01.html:1161): 링크를 적절한 크기로 제공한다.
- L[1162–1162](../../upstream/krds/raw/components/component_05_01.html:1162): 클릭, 터치 영역을 정교하게 조작하기 어려운 사용자를 고려하여, 마우스 상호작용에 대해서는 17px x 17px, 터치 상호작용에 대해서는 44px x 44px 이상의 영역에서 반응할 수 있는 컨트롤 크기를 사용할 것을 권장한다.
- L[1168–1168](../../upstream/krds/raw/components/component_05_01.html:1168): 링크로 작동하는 모든 요소는 스크린 리더에서 링크로 인지될 수 있도록 한다.
- L[1169–1169](../../upstream/krds/raw/components/component_05_01.html:1169): &lt;a&gt; 대신 불가피하게 다른 태그를 사용해야 하는 경우 role="link"를 사용하여 스크린 리더에서 요소의 역할이 링크로 인식될 수 있도록 해야 한다.

### 상호작용 가이드라인

- L[1180–1180](../../upstream/krds/raw/components/component_05_01.html:1180): 상호작용 가이드라인
- L[1182–1182](../../upstream/krds/raw/components/component_05_01.html:1182): 탐색
- L[1200–1203](../../upstream/krds/raw/components/component_05_01.html:1200): Tab, Shift + Tab 모든 링크는 Tab, Shift + Tab 키를 눌렀을 때 접근할 수 있어야 한다.
- L[1210–1210](../../upstream/krds/raw/components/component_05_01.html:1210): 링크 실행
- L[1228–1231](../../upstream/krds/raw/components/component_05_01.html:1228): Click 링크 영역을 Click 하면 링크가 실행된다.
- L[1232–1235](../../upstream/krds/raw/components/component_05_01.html:1232): Enter 링크가 초점을 가진 상태에서 Enter 키를 누르면 링크가 실행된다.

### 예시

- L[1254–1254](../../upstream/krds/raw/components/component_05_01.html:1254): 예시
- L[1258–1258](../../upstream/krds/raw/components/component_05_01.html:1258): 기본
- L[1291–1291](../../upstream/krds/raw/components/component_05_01.html:1291): 기본 코드 확인하기

### 마크업 가이드

- L[1311–1311](../../upstream/krds/raw/components/component_05_01.html:1311): 마크업 가이드
- L[1314–1314](../../upstream/krds/raw/components/component_05_01.html:1314): CSS 선택자
- L[1336–1341](../../upstream/krds/raw/components/component_05_01.html:1336): 전체영역 .krds-btn.link 본문 텍스트 컬러 .basic
- L[1342–1345](../../upstream/krds/raw/components/component_05_01.html:1342): 가상클래스 상태 시 컬러 유지 .pure
- L[1346–1350](../../upstream/krds/raw/components/component_05_01.html:1346): 사이즈 작게 .small
- L[1351–1354](../../upstream/krds/raw/components/component_05_01.html:1351): 중간 .medium
- L[1355–1358](../../upstream/krds/raw/components/component_05_01.html:1355): 크게 .large
- L[1359–1362](../../upstream/krds/raw/components/component_05_01.html:1359): 밑줄 &gt;.underline
- L[1363–1366](../../upstream/krds/raw/components/component_05_01.html:1363): 가상클래스 상태 시 밑줄 .hidden-underline

보존된 인라인 예시 마크업(참고용이며 공개 네이티브 API가 아님): L[1263–1285](../../upstream/krds/raw/components/component_05_01.html:1263)

CSS/JS/안내 이미지 출처 참조는 복사한 구현이 아닙니다. 표 행의 필수/선택 열을 보존한 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 추가로 확인된 텍스트상의 모순은 없습니다. 의미 API와 기본값은 이 수용된 계약으로 고정됩니다. 네이티브 구현은 별도의 근거·검토 대상입니다.
- 연결된 외부 코드 예시는 참조만 하며 이 준비 단계에서 별도 파일로 포함하거나 읽지 않았습니다. L1296 `../../code/link.html`, L1382 `./variable/link.html`. 보지 않은 내용을 추측하지 않습니다.
- 상세에는 안내 이미지 참조 9건이 있습니다. 내장 픽셀 도해는 시각적으로 검사하지 않았습니다. 텍스트 구조와 지침은 읽었습니다. 정확한 시각 치수·자산은 이후 시각·출처 검토가 필요합니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작/스토리 소스, 독립 인수가 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `LinkContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트는 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼로는 이 계약을 충족할 수 없습니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에 인용·파생된 공식 텍스트는 원래의 KRDS 권리와 출처 표시를 유지합니다. 독립 코드의 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 검사하지 않은 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
