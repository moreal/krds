# 도움 패널 {#help-panel}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `help-panel`, 한국어 이름 도움 패널, export `HelpPanel`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_08_01](https://www.krds.go.kr/html/site/component/component_08_01.html), 보존본 [HTML](../../upstream/krds/raw/components/component_08_01.html). 수집 `2026-10-29T23:28:04.876Z`, `84312` 바이트, SHA-256 `c52ffcdd1637839597336232526fc7a56aa80a77de5d81a219ab4e13d3c5b346`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류는 `component`, 수용된 프로젝트 완료 종류는 `composition`입니다. composition을 권고하는 근거는 L889–914의 다중 영역 구조, L960–993의 주제/탭 유지, L1004–1005의 반응형 모달(Modal) 통합입니다.

지원하는 네이티브 케이스(변형·상태 축)는 `desktop-open`, `narrow-modal`, `initial`, `context-detail`입니다. 이는 네이티브 케이스 이름입니다. 상태·반응형·외형 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형·예시 헤딩 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

본문 뒤에 열기 버튼과 도움 패널이 옵니다. 패널 헤더에는 선택 도움말/따라하기 탭과 닫기 버튼이 있습니다. 내용은 초기 안내 또는 맥락별 제목/본문이며, 구분선과 관련 링크/도움 채널 푸터가 이어집니다. 관련 필드·섹션 옆의 맥락 아이콘 트리거는 고유한 이름을 가집니다. 섹션 제목은 연결된 레이블과 일치해야 합니다.

## 의미 API {#plain-semantic-api}

독립 API입니다. open/defaultOpen(넓은 레이아웃에서 true), selectedTopicId/defaultSelectedTopicId=null, onOpenChange({open}), onTopicChange({id}), topics {id,title,content,relatedLinks}[], 조합 시 mode=help|tutorial, `fallbackFocusId?`를 씁니다. 닫았다 다시 열어도 마지막 주제를 보존합니다. 내용은 명시적 맥락 트리거에서만 바뀝니다. 패널 열기 버튼은 별도의 지속되는 “패널 열기” 버튼입니다. 이번 열기를 시작한 맥락 주제 아이콘이 그 역할을 하지 않습니다.

[파일럿 제어/리셋 규약](./README.md)은 선언된 각 제어 필드에 적용됩니다. prop이 우선하고, 기본값은 한 번만 읽으며, 제어와 기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 사용자 요청은 변경당 하나이며, 마운트·prop·리셋 콜백은 없습니다. 거부된 제어 닫기는 보이는 패널과 그 좁은 화면 모달 격리·트랩을 유지하며 초점 복귀를 앞당기지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

열면 패널 컨테이너 자체에 초점이 갑니다. 데스크톱 패널은 트랩 없이 Tab으로 벗어날 수 있습니다. 좁은 화면 표현은 실제로 열려 있는 동안 모달(Modal)과 같은 초기 컨테이너 초점, 격리, 스크롤 잠금, 최상위 Escape, Tab 순환을 씁니다. 링크는 새 창으로 열리며 그 목적을 알려야 합니다.

**두 모드 모두에서 복원 소유자는 HelpPanel 하나뿐입니다.** 공식 닫기 동작은 별개의 패널 열기 버튼으로 돌아갑니다([L1265–1278](../../upstream/krds/raw/components/component_08_01.html:1265)). 좁은 패널을 남아 있는 주제 아이콘이 열었더라도 마찬가지입니다. 하위 수준의 네이티브 격리/트랩/진입 기본 요소를 재사용하되 자동 복귀는 끄거나 이 조합에 위임합니다. 공개 Modal 계약을 인스턴스로 만든 뒤 returnFocusId나 두 번째 초점 호출로 저장된 사용 가능한 열기 버튼을 덮어쓰지 않습니다. 공개 [Modal 실제 열기 버튼 규칙](./modal.md:23)은 바뀌지 않습니다. 이 명시적 조합 적응은 좁은 화면 모달 표현([L1004–1005](../../upstream/krds/raw/components/component_08_01.html:1004))과 함께 HelpPanel의 더 구체적인 공식 목적지를 보존합니다.

실제 true→false 전환이 수용되면 먼저 이 패널의 격리와 스크롤 잠금을 해제합니다. 그런 다음 초점을 정확히 한 번 옮깁니다. 순서는 다음과 같습니다. 사용 가능한 패널 열기 버튼, 없으면 사용 가능한 fallbackFocusId, 없으면 저장된 시작 주제 아이콘(사용 가능할 때), 없으면 그 아이콘에서 가장 가까운 사용 가능한 초점 가능 상위 요소, 없으면 임시 tabindex=-1을 단 document body(이전 tabindex는 복원). 사용 가능은 마운트됨, 보임, 활성, 초점 가능, 같은 라이브 문서, inert 아님을 뜻합니다. 열린 패널이 언마운트될 때도 정리 후 복귀 정책이 돌며 합성 변경 이벤트는 내지 않습니다. 거부된 제어 닫기는 이 중 아무것도 하지 않으며 초점은 활성 좁은 화면 모달 안에 남습니다. 따라하기/코치마크 중단 트랜잭션이 이 전환을 소유하면 두 소유자를 함께 돌리지 않고 복원을 그 코디네이터 하나에 명시적으로 넘깁니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

넓은 화면에서는 초기 안내와 함께 패널이 열린 채 시작합니다. 좁은 화면에서는 처음에 열기 버튼만 보이고 열면 모달이 됩니다. 해당하는 경우 아이콘 대상 크기를 44px 이상으로 유지하고, 필수 정보를 도움말에만 숨기지 않습니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

집계된 폼/리셋은 없습니다. 패널은 본문에서 입력 중인 값을 지우거나 조합 중인 키를 가로채서는 안 됩니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

component→composition을 권고합니다. 주제 트리거, 상태를 가진 패널, 선택 탭(Tabs)/따라하기 패널(TutorialPanel), 좁은 화면의 모달(Modal), 관련 링크를 포함합니다. 완료하려면 동작하는 필드/주제 데모와 반응형 셸이 필요합니다. 도움말 콘텐츠, URL, 외부 도움 채널은 호스트가 책임집니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, opener, topic-trigger, header, tabs, close, title, body, related; open,closed,active-topic,modal.

렌더링된 모든 소유 파트는 `data-krds-component="help-panel"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 씁니다. 네이티브/ARIA 상태가 우선합니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 넓은 화면은 초기 안내와 함께 열린 채 시작합니다.
2. 명시적 주제 트리거가 제목/본문을 바꾸고 패널에 초점을 둡니다.
3. 닫았다 다시 열어도 주제를 유지합니다.
4. 데스크톱은 Tab으로 벗어나고 좁은 모달은 올바르게 트랩합니다.
5. 수용된 닫기는 맥락 주제 아이콘이 남아 있든 사라지든 별개의 사용 가능한 패널 열기 버튼을 우선하고, 열기 버튼을 쓸 수 없으면 문서화된 대체 순서를 따릅니다.
6. 라우트 정리가 스크롤과 격리를 복원합니다.
7. 남아 있는 맥락 주제 아이콘이 연 좁은 패널은 복원 소유자가 정확히 하나인 상태로 별개의 사용 가능한 패널 열기 버튼으로 닫힙니다.
8. 거부된 제어 좁은 화면 닫기는 초점을 복원하지 않고 열림 상태, 트랩, 격리를 유지합니다.
9. 패널 열기 버튼이 제거되면 실제 닫힌 뒤 문서화된 사용 가능한 대체 순서를 쓰며, 숨겨졌거나 inert인 대상에는 초점을 두지 않습니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색 외 상태 단서, 움직임이 있다면 동작 줄이기를 검증합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`help-panel--desktop-open`, `help-panel--initial`, `help-panel--context-detail`, `help-panel--narrow-modal`, `help-panel--topic-trigger-removed`, `help-panel--help-tutorial-tabs`, `help-panel--narrow-topic-icon-return`, `help-panel--controlled-close-rejected`, `help-panel--panel-opener-removed`.

각 케이스는 해당하는 모든 네이티브 렌더러에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태가 필요합니다. 렌더러는 Solid 1, React, Svelte, Vue, Lit, Qwik, Angular이며 Solid 2 미리보기는 따로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 별도로 준비됩니다. 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부가 인수되어야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 상류 siheom 어댑터만 씁니다. Lit과 Solid 2는 siheom 지원을 지어내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름과 대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러/렌더러를 가져와서는 안 됩니다. 다른 프레임워크 렌더러 래퍼는 금지합니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존 상세 HTML에서 추출했으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 출처 언어(한국어)를 그대로 둡니다. “고려/권장/수 있다” 같은 표현은 권고로 남습니다. 예시나 CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 출처 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS를 네이티브 제어 DOM에서 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 빼면 독립 선택입니다.

### 구조

- L[883–883](../../upstream/krds/raw/components/component_08_01.html:883): 구조
- L[889–889](../../upstream/krds/raw/components/component_08_01.html:889): 1. 패널 열기 버튼 패널을 표시하는 데 사용되는 버튼. 본문 우측에 배치되며, 스크롤 동작 시 화면의 일관된 위치에 고정하여 배치됨
- L[890–890](../../upstream/krds/raw/components/component_08_01.html:890): 2. 아이콘 버튼 도움 패널과 상세 도움 콘텐츠의 표시를 토글하는 ? 아이콘 버튼
- L[891–891](../../upstream/krds/raw/components/component_08_01.html:891): 3. 식별자 활성화된 아이콘 버튼을 표시함
- L[895–895](../../upstream/krds/raw/components/component_08_01.html:895): a. 패널 선택 탭 도움 패널과 따라하기 패널을 전환하는 데 사용됨
- L[896–896](../../upstream/krds/raw/components/component_08_01.html:896): b. 패널 닫기 버튼 패널을 닫고 패널 활성화 버튼을 표시하는 데 사용됨
- L[892–898](../../upstream/krds/raw/components/component_08_01.html:892): 4. 헤더 a. 패널 선택 탭 도움 패널과 따라하기 패널을 전환하는 데 사용됨 b. 패널 닫기 버튼 패널을 닫고 패널 활성화 버튼을 표시하는 데 사용됨
- L[903–903](../../upstream/krds/raw/components/component_08_01.html:903): a. 섹션 제목 도움말을 제공할 대상에 대한 요약 텍스트
- L[904–904](../../upstream/krds/raw/components/component_08_01.html:904): b. 내용 콘텐츠. 필요한 경우 관련 페이지 링크나 파일 다운로드 링크가 포함될 수 있음
- L[899–906](../../upstream/krds/raw/components/component_08_01.html:899): 5. 본문 도움 패널의 용도를 안내하고, 사용을 유도하기 위한 초기 상태와 대상에 관련된 상세 정보를 제공하는 두 가지 상태로 구성됨 a. 섹션 제목 도움말을 제공할 대상에 대한 요약 텍스트 b. 내용 콘텐츠. 필요한 경우 관련 페이지 링크나 파일 다운로드 링크가 포함될 수 있음
- L[907–907](../../upstream/krds/raw/components/component_08_01.html:907): 6. 구분선 본문과 푸터를 구분하기 위한 선
- L[911–911](../../upstream/krds/raw/components/component_08_01.html:911): a. 관련 페이지 링크 원하는 페이지로 이동하지 못한 사용자를 고려하여, 탐색 중인 페이지와 관련되어 있거나 유사한 내용의 페이지 링크를 대안으로 제공함
- L[912–912](../../upstream/krds/raw/components/component_08_01.html:912): b. 기타 문의/도움말 채널 관련 질의응답을 확인할 수 있거나 추가적으로 질문할 수 있는 채널(자주 묻는 질문 목록, 챗봇, 상담 번호 등) 정보를 제공함
- L[908–914](../../upstream/krds/raw/components/component_08_01.html:908): 7. 푸터 a. 관련 페이지 링크 원하는 페이지로 이동하지 못한 사용자를 고려하여, 탐색 중인 페이지와 관련되어 있거나 유사한 내용의 페이지 링크를 대안으로 제공함 b. 기타 문의/도움말 채널 관련 질의응답을 확인할 수 있거나 추가적으로 질문할 수 있는 채널(자주 묻는 질문 목록, 챗봇, 상담 번호 등) 정보를 제공함

### 용례

- L[922–922](../../upstream/krds/raw/components/component_08_01.html:922): 용례
- L[924–924](../../upstream/krds/raw/components/component_08_01.html:924): 사용하기 적합하지 않은 경우
- L[929–929](../../upstream/krds/raw/components/component_08_01.html:929): 맥락적 도움말 컴포넌트를 사용하는 것이 적합하다.
- L[926–931](../../upstream/krds/raw/components/component_08_01.html:926): 안내/도움 정보가 간단한 경우 맥락적 도움말 컴포넌트를 사용하는 것이 적합하다.
- L[935–935](../../upstream/krds/raw/components/component_08_01.html:935): 도움 패널 대신 따라하기 패널과 코치 마크 컴포넌트를 사용한다.
- L[932–937](../../upstream/krds/raw/components/component_08_01.html:932): 작업을 완료하는 방법에 대한 단계별 안내를 제공하고자 하는 경우 도움 패널 대신 따라하기 패널과 코치 마크 컴포넌트를 사용한다.

### 사용성 가이드라인

- L[945–945](../../upstream/krds/raw/components/component_08_01.html:945): 사용성 가이드라인
- L[948–948](../../upstream/krds/raw/components/component_08_01.html:948): 화면이 로딩되었을 때 도움 패널은 열린 상태로 제공한다.
- L[949–949](../../upstream/krds/raw/components/component_08_01.html:949): 도움말이 필요한 사용자가 패널의 존재 유무를 직관적으로 인지할 수 있도록 화면이 로딩되었을 때 도움 패널을 펼친 상태로 제공한다.
- L[960–960](../../upstream/krds/raw/components/component_08_01.html:960): 도움 패널의 첫 화면은 기본 상태로 제공한다.
- L[961–961](../../upstream/krds/raw/components/component_08_01.html:961): 도움 패널과 따라하기 패널이 함께 제공되어야 하는 경우, 도움 패널이 선택되어 있어야 한다. 콘텐츠는 도움 패널의 용도와 활용 방법을 간략하게 안내하여, 사용자의 이용을 유도하고 사용자가 의도하지 않은 상황에서 상세 도움 정보가 제공되지 않도록 해야 한다.
- L[968–968](../../upstream/krds/raw/components/component_08_01.html:968): 아이콘 버튼은 도움 정보를 제공하고자 하는 요소 주변에 배치한다.
- L[969–969](../../upstream/krds/raw/components/component_08_01.html:969): 정보를 제공하고자 하는 컴포넌트나 레이블 옆에 배치하여 관련 요소와의 연관성이 명확하게 인지될 수 있도록 한다.
- L[972–972](../../upstream/krds/raw/components/component_08_01.html:972): 도움 패널의 섹션 제목은 아이콘 버튼과 관련된 본문 섹션 헤딩/레이블 텍스트와 일치해야 한다.
- L[973–976](../../upstream/krds/raw/components/component_08_01.html:973): 섹션 제목을 아이콘 버튼 옆의 본문 섹션 헤딩/레이블 텍스트와 일치시켜 사용자가 어떤 요소나 섹션에 관련된 도움말을 보는 중인지 명확하게 인지할 수 있도록 해야 한다. 만약 섹션 제목으로 사용할 수 있는 텍스트가 존재하지 않는다면, 안내/도움 정보를 제공하고자 하는 정보 그룹을 설명할 수 있는 내용을 섹션 제목으로 제공한다.
- L[979–979](../../upstream/krds/raw/components/component_08_01.html:979): 콘텐츠를 간결하게 유지한다.
- L[980–980](../../upstream/krds/raw/components/component_08_01.html:980): 가능한 한 사용자가 패널 영역을 스크롤 하지 않고 정보를 훑어볼 수 있도록 필요한 내용을 간결한 문장으로 작성한다.
- L[983–983](../../upstream/krds/raw/components/component_08_01.html:983): 사용자가 작업을 수행하기 위해 반드시 알아야 하는 필수 정보가 패널에서만 제공되지 않도록 한다.
- L[984–985](../../upstream/krds/raw/components/component_08_01.html:984): 도움 패널을 발견하지 못할 수 있으므로 사용자가 반드시 확인해야 하는 중요한 정보를 도움 패널에만 제공해서는 안 된다. 맥락적 도움말은 필수 정보가 아니라 제공되었을 때 사용자가 더 쉽게 이용하는 데 도움 되는 정보를 제공해야 한다. 필수 정보를 잘 요약하여 본문에 표현하고 관련된 유용한 정보를 도움 패널에 제공한다.
- L[988–988](../../upstream/krds/raw/components/component_08_01.html:988): 패널에서 제공하는 웹 페이지 링크는 새 창으로 실행한다.
- L[989–989](../../upstream/krds/raw/components/component_08_01.html:989): 패널에 웹 페이지 링크가 포함되어 있는 경우에는 항상 새 창으로 링크를 실행시켜 사용자의 현재 과업 맥락이 중단되지 않도록 한다.
- L[992–992](../../upstream/krds/raw/components/component_08_01.html:992): 본문은 사용자가 특정 아이콘 버튼을 실행하는 경우에만 변경되도록 한다.
- L[993–993](../../upstream/krds/raw/components/component_08_01.html:993): 사용자가 패널을 닫았다가 다시 실행한 경우, 본문은 사용자가 가장 마지막에 확인한 도움 콘텐츠를 표시해야 한다.

### 플랫폼에 대한 고려 사항

- L[1001–1001](../../upstream/krds/raw/components/component_08_01.html:1001): 플랫폼에 대한 고려 사항
- L[1004–1004](../../upstream/krds/raw/components/component_08_01.html:1004): 화면 너비가 충분하지 않을 때 도움 패널은 패널 열기 버튼으로 축약하여 제공한다.
- L[1005–1005](../../upstream/krds/raw/components/component_08_01.html:1005): 화면 너비가 충분하지 않을 경우, 사용자가 본문 콘텐츠에 우선적으로 접근하고 본문의 과업에 집중할 수 있도록 패널 열기 버튼을 제공한다. 패널 열기 버튼이나 아이콘 버튼을 눌렀을 때 패널은 모달 형식으로 제공하면 된다.

### 접근성 가이드라인

- L[1117–1117](../../upstream/krds/raw/components/component_08_01.html:1117): 접근성 가이드라인
- L[1120–1120](../../upstream/krds/raw/components/component_08_01.html:1120): 아이콘과 인접 배경 간 명도 대비를 3:1 이상으로 제공한다.
- L[1121–1121](../../upstream/krds/raw/components/component_08_01.html:1121): 사용자가 아이콘이 컨트롤로 사용되고 있으며 유형에 따라 다른 정보를 제공함을 인지할 수 있도록 아이콘과 인접 배경의 명도 대비를 3:1 이상으로 제공해야 한다.
- L[1128–1128](../../upstream/krds/raw/components/component_08_01.html:1128): 아이콘 버튼에 이름을 제공한다.
- L[1129–1129](../../upstream/krds/raw/components/component_08_01.html:1129): 스크린 리더 사용자가 활성화 버튼의 용도를 이해할 수 있도록 각각의 아이콘 버튼에 이름을 제공해야 한다.
- L[1137–1137](../../upstream/krds/raw/components/component_08_01.html:1137): 아이콘 버튼에 고유하고 적절한 이름을 제공한다.
- L[1138–1141](../../upstream/krds/raw/components/component_08_01.html:1138): 아이콘 버튼이 맥락적으로 도움을 제공하고자 하는 본문 콘텐츠의 내용을 포함하고 있지 않다면 해당 정보를 아이콘 버튼의 이름으로 포함하여 스크린 리더 사용자가 정확한 용도를 이해할 수 있도록 제공한다. 페이지에 존재하는 다른 아이콘 버튼과 혼동되지 않도록 모든 아이콘 버튼의 이름은 고유해야 한다. 예) 건축물 대장 유형 안내
- L[1148–1148](../../upstream/krds/raw/components/component_08_01.html:1148): 키보드 초점은 논리적인 순서로 이동해야 한다.
- L[1149–1149](../../upstream/krds/raw/components/component_08_01.html:1149): 패널이 실행되면 키보드 초점은 패널 영역 자체로 이동해야 한다. 패널 내부에서 키보드 함정이 발생하지 않아야 한다.
- L[1157–1157](../../upstream/krds/raw/components/component_08_01.html:1157): 아이콘 버튼의 크기를 44px x 44px 이상으로 제공하는 방안을 고려한다.
- L[1158–1161](../../upstream/krds/raw/components/component_08_01.html:1158): 클릭이나 터치 영역을 정교하게 조작하기 어려운 사용자를 고려하여 아이콘 버튼의 크기를 44px x 44px 이상으로 제공하는 방안을 고려한다. 이때, 단위는 CSS 픽셀을 기준으로 한다. 만약 아이콘 버튼이 문장의 끝에 제공되고 있다면 문장의 일부 요소로 간주되기 때문에 크기에 대한 요구사항을 충족하지 않아도 된다.
- L[1168–1168](../../upstream/krds/raw/components/component_08_01.html:1168): 패널 열기 버튼과 패널은 본문 바로 다음 요소로 제공한다.
- L[1169–1169](../../upstream/krds/raw/components/component_08_01.html:1169): 키보드, 스크린 리더 사용자가 우선 본문의 다양한 정보와 컨트롤 요소에 대한 개요를 파악한 후 도움 패널의 사용 여부를 결정할 수 있도록 본문 다음 요소로 제공한다.

### 상호작용 가이드라인

- L[1182–1182](../../upstream/krds/raw/components/component_08_01.html:1182): 상호작용 가이드라인
- L[1184–1184](../../upstream/krds/raw/components/component_08_01.html:1184): 도움 패널 실행
- L[1202–1205](../../upstream/krds/raw/components/component_08_01.html:1202): Click 패널 열기 버튼 또는 아이콘 버튼을 Click 하면 도움 패널이 표시된다. 패널 표시 후, 키보드 초점은 도움 패널 자체로 이동한다.
- L[1206–1212](../../upstream/krds/raw/components/component_08_01.html:1206): Enter, Space 패널 열기 버튼 또는 아이콘 버튼이 초점을 가진 상태에서 Enter 또는 Space 키를 누르면 도움 패널이 표시된다. 패널 표시 후, 키보드 초점은 도움 패널 자체로 이동한다.
- L[1219–1219](../../upstream/krds/raw/components/component_08_01.html:1219): 도움 패널 내부 콘텐츠 탐색
- L[1237–1240](../../upstream/krds/raw/components/component_08_01.html:1237): Tab 패널이 활성화된 상태에서 내부 링크 요소를 순차적으로 탐색한다.
- L[1247–1247](../../upstream/krds/raw/components/component_08_01.html:1247): 도움 패널 비활성화
- L[1265–1271](../../upstream/krds/raw/components/component_08_01.html:1265): Click 패널 닫기 버튼을 Click 하면 도움 패널이 닫히고 패널 열기 버튼이 표시된다. 키보드 초점은 패널 열기 버튼으로 이동한다.
- L[1272–1278](../../upstream/krds/raw/components/component_08_01.html:1272): Enter, Space 패널 닫기 버튼이 초점을 가진 상태에서 Enter 또는 Space 키를 누르면 도움 패널이 닫히고 패널 열기 버튼이 표시된다. 키보드 초점은 관련된 패널 열기 버튼으로 이동한다.

### 예시

- L[1297–1297](../../upstream/krds/raw/components/component_08_01.html:1297): 예시

### 마크업 가이드

- L[1344–1344](../../upstream/krds/raw/components/component_08_01.html:1344): 마크업 가이드
- L[1347–1347](../../upstream/krds/raw/components/component_08_01.html:1347): CSS 선택자
- L[1367–1372](../../upstream/krds/raw/components/component_08_01.html:1367): 전체영역 .krds-help-panel 영역 전개 .expand
- L[1373–1376](../../upstream/krds/raw/components/component_08_01.html:1373): 패널 제어 버튼 .btn-help-panel
- L[1377–1380](../../upstream/krds/raw/components/component_08_01.html:1377): 패널 본문 .help-conts
- L[1381–1384](../../upstream/krds/raw/components/component_08_01.html:1381): 패널 하단 .related-service
- L[1394–1394](../../upstream/krds/raw/components/component_08_01.html:1394): JS
- L[1413–1417](../../upstream/krds/raw/components/component_08_01.html:1413): krds_helpPanel init() 초기화 및 주요 이벤트 실행
- L[1418–1421](../../upstream/krds/raw/components/component_08_01.html:1418): setupHelpButtons() 도움 패널 버튼 설정
- L[1422–1425](../../upstream/krds/raw/components/component_08_01.html:1422): toggleHelpPanel() 도움 패널 토글

보존된 인라인 예시 마크업(참고용이며 공개 네이티브 API가 아님): 이 상세에는 인라인 샘플 뷰 마크업이 없습니다.

CSS/JS/안내 이미지 출처 참조는 복사한 구현이 아닙니다. 표 행의 필수/선택 열을 보존한 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 기록된 독립 결정: composition 종류를 수용합니다. HelpPanel 소유자 하나가 트랩/격리/진입을 하위 수준 네이티브 기본 요소에 위임하고, 실제로 수용된 닫기 뒤 별개의 사용 가능한 패널 열기 버튼 복원을 혼자 맡습니다.
- 연결된 외부 코드 예시는 참조만 하며 이 준비 단계에서 별도 파일로 포함하거나 읽지 않았습니다. L1440 `../../../resources/js/examples/krds_helpPanel.js`, L1459 `./variable/help_panel.html`. 보지 않은 내용을 추측하지 않습니다.
- 상세에는 안내 이미지 참조 5건이 있습니다. 내장 픽셀 도해는 시각적으로 검사하지 않았습니다. 텍스트 구조와 지침은 읽었습니다. 정확한 시각 치수·자산은 이후 시각·출처 검토가 필요합니다.
- 의미 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작/스토리 소스, 독립 인수가 필요합니다.

## 수용된 독립 결정 {#accepted-independent-resolution}

composition 종류를 수용합니다. HelpPanel 소유자 하나가 트랩/격리/진입을 하위 수준 네이티브 기본 요소에 위임하고, 실제로 수용된 닫기 뒤 별개의 사용 가능한 패널 열기 버튼 복원을 혼자 맡습니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `HelpPanelContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트는 지원 케이스 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼로는 이 계약을 충족할 수 없습니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에 인용·파생된 공식 텍스트는 원래의 KRDS 권리와 출처 표시를 유지합니다. 독립 코드의 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 검사하지 않은 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며, 여기 인용한 실질 요구사항을 면제하지 않습니다.
