# 툴팁 {#tooltip}

**계약 상태: 네이티브 구현용으로 범위 승인됨.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 승인일 뿐이며, 네이티브 동작, 시각/자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `tooltip`, 한국어 이름 툴팁, export `Tooltip`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_08_05](https://www.krds.go.kr/html/site/component/component_08_05.html), 보존된 [HTML](../../upstream/krds/raw/components/component_08_05.html). 조회 시각 `2026-10-29T23:28:05.172Z`, `89103` 바이트, SHA-256 `cbbbf46d9fb23ba34d57fc1b4ae0e9ef072fba2956bee367673a11e28838118a`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류는 `component`, 인수된 프로젝트 완료 종류도 `component`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 사례(변형·상태 축): `information-icon`, `icon-button`, `vertical`, `box`. 이는 네이티브 사례 이름입니다. 상태, 반응형, 외관 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형/예시 헤딩 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

이름이 있는 트리거 버튼 바로 뒤에 짧은 비대화형 팝업을 둡니다. 툴팁 안에는 링크/버튼을 두지 않습니다. 정보 아이콘과 아이콘 버튼 레이블 툴팁은 서로 다른 사용 사례입니다. HTML title을 중복해 쓰지 않습니다. 출처는 aria-labelledby가 트리거와 컨테이너를 연결한다고만 하며 정확한 방향은 밝히지 않습니다.

## 의미 API {#plain-semantic-api}

독립 API: `text`, `relationship:description|label=description`, `triggerLabel?`, `triggerId`, `textId`, placement, open/defaultOpen=false, onOpenChange, `fallbackFocusId?`, touchToggle=false (별도의 정보 트리거가 아니면). 팝업은 role=tooltip이며 콘텐츠는 비대화형입니다. relationship 판별자는 필수 의미 동작입니다. 아이콘 모양이나 렌더러가 우연히 고른 속성에서 추론하지 않습니다.

**description** 모드에서는 독립적인 기능/맥락 triggerLabel(또는 검증된 동등한 네이티브 보이는 이름)이 필요하며, 이것이 계속 트리거의 실제 이름입니다. textId는 그 트리거의 aria-describedby에 정확히 한 번 추가합니다. 설명용 툴팁 텍스트로 aria-labelledby를 설정하지 않습니다. **label** 모드에서는 text 자체가 안정적인 기능 버튼 이름이어야 합니다. 트리거 aria-labelledby는 textId를 가리키고, triggerLabel/대체 aria-label은 허용되지 않으며, 같은 텍스트를 aria-describedby에도 쓰지 않습니다. 시각 팝업이 닫혀 있는 동안에도 실제 textId 노드를 같은 접근성 트리/루트에 유지해, 열기 전에도 기능 이름이 존재하게 합니다. 시각적으로 숨기는 것은 참조되는 텍스트를 언마운트하는 것이 아닙니다. 중복된 숨은 레이블/라이브 메시지를 또 만들지 않습니다. 다른 도움말 설명을 쓰는 소비자는 textId를 반복하지 않고 서로 다른 유효한 ID를 유지합니다.

두 모드 모두 Lit Shadow DOM을 포함해 실제 루트에서 트리거/텍스트 관계가 실제로 해석되어야 합니다. light DOM ID가 경계 너머의 내부 컨트롤에 이름을 붙일 수 있다고 가정하지 않습니다. 같은 루트에 속한 트리거/텍스트 관계 또는 검증된 네이티브 대체를 쓰고, 해석되지 않는 잘못된 구성은 실패시킵니다. 공식 aria-labelledby 문구([L1163–1164](../../upstream/krds/raw/components/component_08_05.html:1163))는 아래에 그대로 인용되어 있습니다. description 모드의 aria-describedby는 보충 콘텐츠에 대한 명시적 독립 해석이며 KRDS의 문자 그대로의 지시라고 주장하지 않습니다. 제어 props/기본값/리셋/중복 금지 규칙은 [파일럿 정책](./README.md)을 따릅니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

hover/초점으로 표시합니다. 포인터가 트리거와 팝업 둘 다에서 벗어나거나 blur되면 숨깁니다. 일반 hover 열기는 다른 곳의 키보드 초점을 빼앗지 않습니다. 포인터는 닫히지 않고 팝업으로 이동할 수 있습니다. 별도의 정보 버튼을 터치하면 토글하고 바깥을 탭하면 닫으며, 기본 아이콘 동작은 삼키지 않습니다. 팝업에는 Tab 정지점이 없습니다.

처리되는 Escape는 닫기를 한 번만 요청합니다. 조합 중이거나 keyCode229이거나 내부에서 이미 처리된 이벤트는 무시합니다. **실제 닫힘이 승인된 경우에만**, 초점을 옮기기 전에 Escape 억제를 표시한 뒤 사용 가능한 트리거에 초점을 둡니다. 툴팁이 hover로 열렸고 초점이 이전에 다른 곳에 있었어도 마찬가지입니다([공식 L1251–1255](../../upstream/krds/raw/components/component_08_05.html:1251)). 이때 유발된 트리거 초점이 다시 열어서는 안 됩니다. Tab/Shift+Tab으로 그 트리거에서 다른 요소로 벗어났다가 초점이 다시 들어올 때까지 자동 hover/초점 재열기를 억제합니다. 포인터 이동이나 prop 변경만으로는 이 초기화가 충족되지 않습니다. 제어 닫기가 거부되면 실제 열림 상태를 유지하고 초점을 옮기지 않으며 해제에 성공했다고 주장하지 않습니다.

승인된 닫기나 해체로 트리거가 제거되거나 사용할 수 없게 되면 리스너와 대기 중인 요청을 정리하고, 다음 순서로 사용 가능한 대상을 고릅니다. 사용 가능한 fallbackFocusId, 저장된 트리거에서 가장 가까운 사용 가능한 초점 가능 조상, 그리고 임시 tabindex=-1을 쓰고 이전 값을 복원하는 살아 있는 document body입니다. 사용 가능이란 마운트됨, 보임, 활성, 초점 가능, 같은 살아 있는 document, inert 아님을 뜻합니다. 숨겨졌거나 제거된 트리거 노드에 초점을 두지 않으며, 오래된 generation의 초점 작업을 실행하지 않고, 복원 때문에 추가 사용자 이벤트를 내지 않습니다. 외부 prop으로 닫는 것만으로 Escape 동작인 척하지 않습니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

팝업은 충돌을 고려해 화면 안에 완전히 들어오고 대상을 가리지 않습니다. 터치 사용자에게도 의미 있는 아이콘/레이블이 있어야 합니다. 약 150자를 유지하며, 더 긴 대화형 콘텐츠는 ContextualHelp로 보냅니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼/리셋 상태는 없습니다. Enter/Space 활성화는 툴팁이 아니라 트리거 동작에 속합니다. 조합 중 Escape는 무시합니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트는 label 모드에는 의미 있는 기능 텍스트를, description 모드에는 별도의 기능 트리거 이름과 보충 텍스트를 제공합니다. 완료 조건은 다음과 같습니다.

- 시각적으로 열리기 전, 열리는 동안, 열린 후의 결정적인 계산된 이름/설명.
- 같은 루트/Shadow DOM에서 실제 관계.
- hover/초점/터치/Escape 억제.
- hover로 시작한 Escape의 복귀/대체/거부된 닫기 사례.

title 텍스트를 렌더링하거나 ID 문자열을 저장하는 것만으로는 이러한 네이티브 관계가 성립하지 않습니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, trigger, popup, icon, text; open,closed,suppressed,placement.

렌더링되는 모든 소유 파트는 `data-krds-component="tooltip"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위의 파트/상태 어휘는 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 초점/hover가 같은 읽을 수 있는 텍스트를 드러냅니다.
2. 포인터가 조기 해제 없이 팝업으로 들어갈 수 있습니다.
3. 승인된 Escape는 유발된 트리거 초점이 있어도 키보드가 떠났다 다시 들어올 때까지 닫힌 채 유지됩니다. 거부된 제어 닫기는 해제한 척하지 않습니다.
4. 툴팁 안에 초점 가능한 자손이 없습니다.
5. 터치 정보 트리거는 아이콘 동작을 가로채지 않고 토글합니다.
6. 이름과 설명이 중복되지 않습니다.
7. description 모드는 독립적인 트리거 동작 이름을 유지하고 보충 텍스트를 한 번만 참조합니다. label 모드는 시각적으로 닫혀 있어도 안정적인 툴팁 텍스트를 이름으로 쓰며 중복 설명이 없습니다.
8. hover로 열어도 다른 컨트롤에서 초점이 옮겨지지 않습니다. 승인된 Escape는 사용 가능한 트리거에 초점을 두고 유발된 초점 동안 억제를 유지합니다.
9. 거부된 제어 Escape는 열림 상태와 이전 초점을 유지합니다. 트리거 제거나 해체는 문서화된 사용 가능한 대체 대상을 쓰며 오래된 재열기가 없습니다.
10. 이름과 설명의 실제 ID 관계가 네이티브 같은 루트와 Lit Shadow DOM 출력에서 해석됩니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 표시, 움직임이 있는 곳의 동작 줄이기를 검증합니다. 빈 스위트를 성공으로 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`tooltip--information-icon`, `tooltip--icon-button`, `tooltip--vertical`, `tooltip--box`, `tooltip--touch-toggle`, `tooltip--escape-suppression`, `tooltip--viewport-edge`, `tooltip--relationship-description`, `tooltip--relationship-label-closed`, `tooltip--hover-escape-return`, `tooltip--controlled-escape-rejected`, `tooltip--trigger-removed`, `tooltip--shadow-relationship`.

각 사례에는 해당하는 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태가 필요합니다. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 마련되며 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부를 인수해야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 사용합니다. Lit/Solid 2는 siheom 지원을 만들지 않고 선택된 네이티브 테스트 경로를 사용해야 합니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름/대상 관계를 검증해야 합니다. Solid 2는 Solid 1 컴파일러/렌더러를 import하면 안 됩니다. 다른 렌더러의 래퍼는 쓰지 않습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존된 상세 HTML에서 추출했으며 핵심 지침과 상호작용/마크업 표를 포함합니다. 공식 요구사항을 만들어 내지 않도록 원문 언어를 그대로 둡니다. “consider/recommended/can”에 해당하는 표현은 권고로 남습니다. 예시/CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 출처 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 아래 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립적인 선택입니다.


### 구조

- L[883–883](../../upstream/krds/raw/components/component_08_05.html:883): 구조
- L[892–892](../../upstream/krds/raw/components/component_08_05.html:892): 1. 활성화 버튼 툴팁 콘텐츠의 표시를 토글하는 버튼
- L[893–893](../../upstream/krds/raw/components/component_08_05.html:893): 2. 컨테이너 팝오버 영역과 배경을 구분하는 요소
- L[894–894](../../upstream/krds/raw/components/component_08_05.html:894): 3. 아이콘(선택) 강조가 필요한 경우, 본문의 내용에 따라 시스템 상태 아이콘을 사용할 수 있음
- L[895–895](../../upstream/krds/raw/components/component_08_05.html:895): 4. 본문 구체적인 설명 텍스트

### 유형

- L[903–903](../../upstream/krds/raw/components/component_08_05.html:903): 유형
- L[905–905](../../upstream/krds/raw/components/component_08_05.html:905): 정보/물음표 아이콘 툴팁
- L[906–906](../../upstream/krds/raw/components/component_08_05.html:906): 컴포넌트나 레이블 옆에 배치되어 해당 요소에 관한 부가적인 정보를 제공하는 툴팁이다. 아이콘의 선택 방법에 대해서는 맥락적 도움말 컴포넌트의 유형을 참고하면 된다.
- L[909–909](../../upstream/krds/raw/components/component_08_05.html:909): 아이콘 버튼 툴팁
- L[910–910](../../upstream/krds/raw/components/component_08_05.html:910): 텍스트 레이블이 없거나 공간 제약으로 인해 레이블이 축약된 아이콘 버튼에 제공되는 툴팁이다.

### 용례

- L[917–917](../../upstream/krds/raw/components/component_08_05.html:917): 용례
- L[919–919](../../upstream/krds/raw/components/component_08_05.html:919): 사용하기 적합한 경우
- L[924–924](../../upstream/krds/raw/components/component_08_05.html:924): 텍스트 레이블 없는 아이콘 단독 컨트롤 요소에 레이블을 표시하고자 하는 경우에 툴팁을 사용한다.
- L[921–926](../../upstream/krds/raw/components/component_08_05.html:921): 컨트롤 요소에 대한 레이블을 제공할 때 텍스트 레이블 없는 아이콘 단독 컨트롤 요소에 레이블을 표시하고자 하는 경우에 툴팁을 사용한다.
- L[930–930](../../upstream/krds/raw/components/component_08_05.html:930): 단어 의미에 대한 설명과 같이 간단한 추가 정보를 제공할 때 툴팁을 사용한다.
- L[927–932](../../upstream/krds/raw/components/component_08_05.html:927): 서비스 이용/콘텐츠 이해에 필수적이지는 않으나 간단한 추가 정보를 제공할 때 단어 의미에 대한 설명과 같이 간단한 추가 정보를 제공할 때 툴팁을 사용한다.
- L[936–936](../../upstream/krds/raw/components/component_08_05.html:936): 사용하기 적합하지 않은 경우
- L[941–941](../../upstream/krds/raw/components/component_08_05.html:941): 맥락적 도움말을 사용한다.
- L[938–943](../../upstream/krds/raw/components/component_08_05.html:938): 팝오버에 대화형 요소가 포함되어야 하는 경우 맥락적 도움말을 사용한다.
- L[947–947](../../upstream/krds/raw/components/component_08_05.html:947): 툴팁은 150자 내외의 짧은 설명을 제공할 때 사용하기 적합하다. 더 긴 설명이 필요하다면 콘텐츠의 특성과 이용 맥락에 따라 맥락적 도움말, 도움 패널, 별도 도움말 페이지를 활용한다.
- L[944–949](../../upstream/krds/raw/components/component_08_05.html:944): 긴 설명을 제공해야 하는 경우 툴팁은 150자 내외의 짧은 설명을 제공할 때 사용하기 적합하다. 더 긴 설명이 필요하다면 콘텐츠의 특성과 이용 맥락에 따라 맥락적 도움말, 도움 패널, 별도 도움말 페이지를 활용한다.

### 사용성 가이드라인

- L[957–957](../../upstream/krds/raw/components/component_08_05.html:957): 사용성 가이드라인
- L[960–960](../../upstream/krds/raw/components/component_08_05.html:960): 툴팁 컴포넌트 사용을 우선적으로 고려한다.
- L[961–962](../../upstream/krds/raw/components/component_08_05.html:961): HTML title 속성으로 제공되는 힌트 텍스트는 글자 크기, 표시 위치와 같은 스타일을 수정할 수 없어 툴팁을 필요로하는 사용자가 정보를 확인하기 어려울 수 있다. 또한 스크린 리더 환경설정에 따라 title 속성으로 제공된 힌트 텍스트가 음성으로 출력되지 않을 수 있으므로 가능한 툴팁 컴포넌트를 사용하는 것이 좋다.
- L[965–965](../../upstream/krds/raw/components/component_08_05.html:965): 팝오버 영역이 화면을 벗어나지 않도록 표현한다.
- L[966–966](../../upstream/krds/raw/components/component_08_05.html:966): 툴팁의 팝오버 영역이 시각적으로 확인할 수 없는 화면 밖의 영역에 배치되어 내부 콘텐츠가 가려지지 않도록 해야 한다.
- L[977–977](../../upstream/krds/raw/components/component_08_05.html:977): 팝오버 영역이 본문의 중요 콘텐츠를 가리지 않도록 표현한다.
- L[978–978](../../upstream/krds/raw/components/component_08_05.html:978): 툴팁의 팝오버 영역이 활성화 버튼과 부가 정보를 제공하고자 하는 본문 콘텐츠 요소를 가리지 않도록 적절한 표시 방향을 설정한다.
- L[989–989](../../upstream/krds/raw/components/component_08_05.html:989): 아이콘 버튼에 툴팁을 제공한다.
- L[990–990](../../upstream/krds/raw/components/component_08_05.html:990): 아이콘만으로 구성된 컨트롤 요소는 사용자에게 의미/용도를 정확하게 전달하기 어렵다. 그러므로 아이콘만으로 구성된 메뉴/기능 버튼에는 툴팁을 반드시 제공해야 한다.
- L[1001–1001](../../upstream/krds/raw/components/component_08_05.html:1001): 툴팁은 부가적인 정보를 전달하는 데 사용한다.
- L[1002–1002](../../upstream/krds/raw/components/component_08_05.html:1002): 사용자가 반드시 확인해야 하는 중요한 정보를 툴팁 팝오버에만 제공해서는 안 된다. 필수 정보는 사용자가 잘 발견할 수 있도록 별도의 상호작용 없이 본문에 표시하는 것이 적절하다.
- L[1013–1013](../../upstream/krds/raw/components/component_08_05.html:1013): 툴팁 컴포넌트와 title 속성을 중첩하여 사용하지 않는다.
- L[1014–1014](../../upstream/krds/raw/components/component_08_05.html:1014): 툴팁 컴포넌트와 title 속성이 동시에 사용되면 두 요소의 위치가 중첩되면서 설명이 정확하게 전달되기 어렵다. 스크린 리더 사용자에게도 동일한 설명이 여러 번 제공되므로 피로를 유발할 수 있다.
- L[1021–1021](../../upstream/krds/raw/components/component_08_05.html:1021): 한 화면에 아이콘 툴팁과 맥락적 도움말 또는 도움말 패널을 혼용하지 않는다.
- L[1022–1022](../../upstream/krds/raw/components/component_08_05.html:1022): 정보/물음표 아이콘 툴팁과 맥락적 도움말의 활성화 버튼은 동일하게 생겼으나 상호작용 방식이 다르므로 한 화면에 두 개의 요소를 혼용할 경우 사용자가 혼동을 느낄 수 있다. 만약 맥락적 도움말이나 도움말 패널 사용이 필요하다면 툴팁 대신 맥락적 도움말 컴포넌트를 사용한다.

### 플랫폼에 대한 고려 사항

- L[1030–1030](../../upstream/krds/raw/components/component_08_05.html:1030): 플랫폼에 대한 고려 사항
- L[1033–1033](../../upstream/krds/raw/components/component_08_05.html:1033): 터치 인터페이스에서의 사용성을 고려한다.
- L[1034–1035](../../upstream/krds/raw/components/component_08_05.html:1034): 툴팁은 마우스, 키보드, 펜 인터페이스로만 실행할 수 있기 때문에 터치가 1차적인 입력 방식인 경우에는 사용자에게 부가적인 정보를 제공하기 어렵다. 이러한 상황을 고려하여 아이콘 버튼을 표현할 때는 메뉴/기능의 의미를 명확하게 보여줄 수 있는 아이콘을 선택해야 한다. 별도의 활성화 버튼이 존재한다면 터치 인터페이스가 탐지되었을 때, 활성화 버튼의 Click 이벤트에 팝오버의 출현이 토글 될 수 있도록 한다.

### 접근성 가이드라인

- L[1142–1142](../../upstream/krds/raw/components/component_08_05.html:1142): 접근성 가이드라인
- L[1145–1145](../../upstream/krds/raw/components/component_08_05.html:1145): 활성화 버튼에 이름을 제공한다.
- L[1146–1146](../../upstream/krds/raw/components/component_08_05.html:1146): 스크린 리더 사용자가 활성화 버튼의 용도를 이해할 수 있도록 각각의 버튼에 이름을 제공해야 한다.
- L[1154–1154](../../upstream/krds/raw/components/component_08_05.html:1154): 활성화 버튼에 고유하고 적절한 이름을 제공한다.
- L[1155–1156](../../upstream/krds/raw/components/component_08_05.html:1155): 활성화 버튼이 맥락적으로 도움을 제공하고자 하는 본문 콘텐츠의 내용을 포함하고 있지 않다면 해당 정보를 활성화 버튼의 이름으로 포함하여 스크린 리더 사용자가 정확한 용도를 이해할 수 있도록 제공한다. 화면에 존재하는 다른 활성화 버튼과 혼동되지 않도록 모든 활성화 버튼의 이름은 고유해야 한다.
- L[1163–1163](../../upstream/krds/raw/components/component_08_05.html:1163): 활성화 버튼과 컨테이너 영역을 aria-labelledby 속성으로 연결한다.
- L[1164–1164](../../upstream/krds/raw/components/component_08_05.html:1164): 이를 통해 시각을 활용하여 정보를 탐색하는 사용자가 활성화 버튼에 접근했을 때 툴팁 콘텐츠를 바로 확인할 수 있는 것처럼 스크린 리더 사용자도 동일한 방식으로 정보를 전달받을 수 있다.
- L[1170–1170](../../upstream/krds/raw/components/component_08_05.html:1170): 활성화 버튼과 팝오버 콘텐츠를 적절한 순서로 제공한다.
- L[1171–1171](../../upstream/krds/raw/components/component_08_05.html:1171): 스크린 리더 사용자가 도움말 팝오버 콘텐츠에 논리적인 순서로 접근할 수 있도록 관련 있는 활성화 버튼 다음 요소로 제공해야 한다.

### 상호작용 가이드라인

- L[1183–1183](../../upstream/krds/raw/components/component_08_05.html:1183): 상호작용 가이드라인
- L[1185–1185](../../upstream/krds/raw/components/component_08_05.html:1185): 툴팁 활성화
- L[1203–1206](../../upstream/krds/raw/components/component_08_05.html:1203): Click 터치 인터페이스에서 활성화 버튼을 누르면 툴팁 팝오버가 표시된다.
- L[1207–1210](../../upstream/krds/raw/components/component_08_05.html:1207): Mouseover 활성화 버튼에 Mouseover 이벤트가 발생하면 툴팁 팝오버가 표시된다.
- L[1211–1214](../../upstream/krds/raw/components/component_08_05.html:1211): Focus 활성화 버튼이 초점을 가지면 툴팁 팝오버가 표시된다.
- L[1221–1221](../../upstream/krds/raw/components/component_08_05.html:1221): 툴팁 비활성화
- L[1239–1242](../../upstream/krds/raw/components/component_08_05.html:1239): Click 터치 인터페이스에서 활성화 버튼 또는 팝오버 영역 외의 화면을 누르면 팝오버가 사라진다.
- L[1243–1246](../../upstream/krds/raw/components/component_08_05.html:1243): Mouseleave 활성화 버튼 또는 팝오버 영역 밖으로 마우스가 이동하면 팝오버가 사라진다.
- L[1247–1250](../../upstream/krds/raw/components/component_08_05.html:1247): Blur 활성화 버튼에서 Tab, Shift + Tab을 눌러 초점이 버튼 외부로 빠져나가면 팝오버가 사라진다.
- L[1251–1255](../../upstream/krds/raw/components/component_08_05.html:1251): Esc 툴팁 팝오버가 표시된 상태에서 Esc 키를 누르면 팝오버가 닫히면서 키보드 초점이 활성화 버튼으로 이동한다. Tab, Shift + Tab을 눌러 다른 요소를 탐색한 후 활성화 버튼에 다시 초점이 다시 진입하기 전까지 팝오버는 사라진 상태로 유지된다.

### 예시

- L[1274–1274](../../upstream/krds/raw/components/component_08_05.html:1274): 예시
- L[1278–1278](../../upstream/krds/raw/components/component_08_05.html:1278): 기본
- L[1304–1304](../../upstream/krds/raw/components/component_08_05.html:1304): 기본 코드 확인하기
- L[1320–1320](../../upstream/krds/raw/components/component_08_05.html:1320): tooltip vertical
- L[1346–1346](../../upstream/krds/raw/components/component_08_05.html:1346): tooltip vertical 코드 확인하기
- L[1362–1362](../../upstream/krds/raw/components/component_08_05.html:1362): tooltip box
- L[1392–1392](../../upstream/krds/raw/components/component_08_05.html:1392): tooltip box 코드 확인하기

### 마크업 가이드

- L[1413–1413](../../upstream/krds/raw/components/component_08_05.html:1413): 마크업 가이드
- L[1416–1416](../../upstream/krds/raw/components/component_08_05.html:1416): CSS 선택자
- L[1436–1441](../../upstream/krds/raw/components/component_08_05.html:1436): 활성화 버튼 .krds-tooltip 인라인형 상하 방향 .tooltip-vertical
- L[1442–1445](../../upstream/krds/raw/components/component_08_05.html:1442): 박스형 .tooltip-box
- L[1446–1449](../../upstream/krds/raw/components/component_08_05.html:1446): 팝오버 .krds-tooltip-popover
- L[1459–1459](../../upstream/krds/raw/components/component_08_05.html:1459): JS
- L[1478–1482](../../upstream/krds/raw/components/component_08_05.html:1478): krds_tooltip init() 초기화 및 주요 이벤트 실행
- L[1483–1486](../../upstream/krds/raw/components/component_08_05.html:1483): setupTooltips() 툴팁 설정
- L[1487–1490](../../upstream/krds/raw/components/component_08_05.html:1487): setupGlobalEvents() 툴팁 전역 이벤트 설정
- L[1491–1494](../../upstream/krds/raw/components/component_08_05.html:1491): showTooltip() 툴팁 열기
- L[1495–1498](../../upstream/krds/raw/components/component_08_05.html:1495): closeAllTooltips() 툴팁 닫기


인라인으로 보존된 예시 마크업(참고용이며 공개 네이티브 API가 아님): L[1283–1298](../../upstream/krds/raw/components/component_08_05.html:1283), L[1325–1340](../../upstream/krds/raw/components/component_08_05.html:1325), L[1367–1386](../../upstream/krds/raw/components/component_08_05.html:1367)

CSS/JS/안내 이미지의 출처 참조는 복사된 구현이 아닙니다. 필수/선택 열을 보존한 표 행의 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 출처의 aria-labelledby 방향은 문자 그대로는 여전히 모호하지만, 위의 독립 relationship 판별자로 네이티브 이름/설명 동작이 결정적이 되었습니다. description 방식은 공식 원문으로 표현해서는 안 됩니다. 출처 인용과 시각/연결 코드의 공백은 그대로입니다.
- 연결된 외부 코드 예시는 참조만 하며 이번 준비에서 별도 파일로 포함하거나 읽지 않았습니다: L1309 `../../code/tooltip.html`, L1351 `../../code/tooltip_vertical.html`, L1397 `../../code/tooltip_box.html`, L1513 `../../../resources/js/examples/krds_tooltip.js`, L1532 `./variable/tooltip.html`. 보지 못한 내용을 추론하지 않습니다.
- 상세에는 안내 이미지 참조 11개가 있으며, 내장 픽셀 다이어그램은 시각적으로 확인하지 않았습니다. 텍스트 구조/지침은 읽었습니다. 정확한 시각 치수/자산은 이후 시각·출처 검토가 필요합니다.
- 시맨틱 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작/스토리 소스, 독립 인수가 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 시맨틱 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `TooltipContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트는 지원 사례 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에서 인용하거나 파생한 공식 텍스트는 원래의 KRDS 권리와 출처 표기를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용한 실질 요구사항을 면제하지 않습니다.
