# 토글 스위치 {#switch}

**계약 상태: 네이티브 구현 범위 승인.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 인수일 뿐입니다. 네이티브 동작, 시각·자산 검토, 실행된 커버리지는 별도 관문으로 남습니다. 게시는 승인되지 않았습니다.

시맨틱 ID `switch`, 한국어 이름 토글 스위치, export `Switch`. 고정된 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세 페이지: [component_06_07](https://www.krds.go.kr/html/site/component/component_06_07.html), 보존본 [HTML](../../upstream/krds/raw/components/component_06_07.html). 조회 시각 `2026-10-29T23:28:04.668Z`, `81080` 바이트, SHA-256 `d24abf7be779128a28e4a62746ccfe801a442cacb0d3ecb5386b92062b554625`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정된 출처 종류는 `component`이고, 수용된 프로젝트 완료 종류도 `component`입니다. 프로젝트 완료 종류는 아래 근거를 따릅니다. 구체적인 완료 의무와 호스트 경계는 이 계약에 기술합니다.

지원하는 네이티브 사례(변형·상태 축): `medium`, `large`, `with-help`. 이는 네이티브 사례 이름입니다. 상태·반응형·외형 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형·예시 헤딩 원문은 근거 부록에 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

레이블이 있는 불리언 컨트롤로, 트랙, 핸들, 상태 아이콘, 선택적 aria-describedby 도움말을 가집니다. 목적을 나타내는 레이블은 상태에 따라 바뀌지 않습니다. role=switch를 가진 네이티브 체크박스를 쓰며, checked는 실제 불리언입니다. mixed 상태는 없습니다.

## 의미 API {#plain-semantic-api}

독립 API: checked/defaultChecked=false, onCheckedChange({checked}), label, 선택적 name/value, disabled=false, 도움말·오류 ID, size=medium. 콜백은 설정을 즉시 적용하라는 요청입니다. 제어하는 호스트는 대기 중에 요청을 거부할 수 있으며, 이때 화면이 거짓 상태를 보여서는 안 됩니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 의미 변경 요청 하나를 냅니다. 비활성, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 0회 냅니다. 제어 거부 시 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고, 제어 props가 계속 우선합니다. 추가 필드는 렌더러·머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

레이블·컨트롤 클릭과 Space는 한 번만 토글합니다. Tab과 초점은 일반적으로 동작합니다. aria-checked는 실제 상태입니다. 추가 Enter 요구는 추정하지 않습니다. 상태 아이콘·핸들이 색에 의존하지 않는 단서와 3:1 대비를 제공합니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

페이지 전체에서 레이블·컨트롤 배치를 일관되게 유지하고, 넓은 컨테이너에서는 레이블을 컨트롤 가까이에 둡니다. 좁은 화면에서는 터치하기 쉬운 대상과 읽기 좋은 도움말을 제공합니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

name이 있으면 네이티브 checked 체크박스의 FormData 동작을 따릅니다. 비제어 리셋은 defaultChecked로 복원하고, 제어 상태는 콜백 없이 현재 prop을 유지합니다. 설정 부수 효과는 명시적 사용자 동작이나 호스트 정책에서만 일어나며, 마운트·prop·리셋을 재생해 일으키지 않습니다. IME는 없습니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 실제 설정·저장소·비동기 오류를 소유합니다. 별도의 적용 동작이 필요한 선택에는 쓰지 않으며, 그런 경우에는 Checkbox/Radio가 맞습니다. 로컬 스토리는 관찰 가능한 로컬 설정을 바꿉니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, control, track, handle, state-icon, label, help; checked,unchecked,disabled.

렌더링되는 모든 소유 파트는 `data-krds-component="switch"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 기준입니다. 위 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 목적 레이블이 일정하게 유지됩니다.
2. Space/레이블은 변경을 한 번 일으킵니다.
3. 보이는 상태와 aria 상태가 제어 수용 결과와 일치합니다.
4. 도움말 관계가 안내됩니다.
5. 리셋이 외부 설정 명령을 재생하지 않습니다.
6. 이름이 있고 활성이며 checked인 input은 FormData에 포함됩니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 단서, 움직임이 있다면 동작 줄이기를 검증합니다. 빈 스위트로 성공을 주장하지 않습니다.

## 필수 네이티브 스토리 {#required-native-stories}

`switch--medium`, `switch--large`, `switch--with-help`, `switch--disabled`, `switch--controlled-rejected`, `switch--form-reset`.

각 사례는 해당하는 모든 네이티브 렌더러에서 로컬 args/입력/슬롯과 관찰 가능한 순수 로컬 상태가 필요합니다: Solid 1, React, Svelte, Vue, Lit, Qwik, Angular. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에서 따로 단계화하며, 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부를 인수해야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 씁니다. Lit과 Solid 2는 siheom 지원을 만들어 내지 않고 선택된 네이티브 테스트 경로를 씁니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular의 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름·대상 관계를 검증합니다. Solid 2는 Solid 1 컴파일러·렌더러를 절대 import하지 않습니다. 다른 렌더러 래퍼는 없습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 보존된 상세 HTML에서 가져왔으며 핵심 지침과 상호작용·마크업 표를 포함합니다. 공식 요구사항을 지어내지 않도록 원문 언어를 유지합니다. “고려한다/권장/할 수 있다” 같은 표현은 권고로 남습니다. 예시·CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 원본 JS 함수 표는 참고 근거일 뿐이며, 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행해서는 안 됩니다. 위의 공통 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 이 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립 선택입니다.

### 구조

- L[883–883](../../upstream/krds/raw/components/component_06_07.html:883): 구조
- L[892–892](../../upstream/krds/raw/components/component_06_07.html:892): a. 경로(Track) 핸들의 이동 경로를 보여주는 내부 영역 또는 테두리
- L[893–893](../../upstream/krds/raw/components/component_06_07.html:893): b. 핸들(Handle) 두 상태의 전환 상태를 표시하는 인디케이터로 경로를 따라 좌/우로 이동함
- L[889–895](../../upstream/krds/raw/components/component_06_07.html:889): 1. 스위치 a. 경로(Track) 핸들의 이동 경로를 보여주는 내부 영역 또는 테두리 b. 핸들(Handle) 두 상태의 전환 상태를 표시하는 인디케이터로 경로를 따라 좌/우로 이동함
- L[896–896](../../upstream/krds/raw/components/component_06_07.html:896): 2. 레이블 상태를 적용할 대상 정보를 나타내는 텍스트
- L[897–897](../../upstream/krds/raw/components/component_06_07.html:897): 3. 상태 아이콘 선택/선택 해제 상태를 보여주는 아이콘
- L[898–898](../../upstream/krds/raw/components/component_06_07.html:898): 4. 도움말 (선택) 대상 정보, 선택 결과 등에 대한 사용자의 이해를 돕기 위해 부가적인 설명을 제공할 때 사용하는 텍스트

### 용례

- L[906–906](../../upstream/krds/raw/components/component_06_07.html:906): 용례
- L[908–908](../../upstream/krds/raw/components/component_06_07.html:908): 사용하기 적합한 경우
- L[913–913](../../upstream/krds/raw/components/component_06_07.html:913): 두 가지 상태가 부울 유형(Boolean)이어서 상호 배타적인 경우, 토글 스위치를 사용할 수 있다.
- L[910–915](../../upstream/krds/raw/components/component_06_07.html:910): 서로 반대인 두 가지 상태 값을 선택하는 경우 두 가지 상태가 부울 유형(Boolean)이어서 상호 배타적인 경우, 토글 스위치를 사용할 수 있다.
- L[919–919](../../upstream/krds/raw/components/component_06_07.html:919): 알림의 표시 여부 등 기능의 사용을 설정하거나 해제할 때, 토글 스위치를 사용하여 값을 선택하도록 하는 것이 적절하다.
- L[916–921](../../upstream/krds/raw/components/component_06_07.html:916): 기능의 사용을 설정하거나 해제하고자 하는 경우 알림의 표시 여부 등 기능의 사용을 설정하거나 해제할 때, 토글 스위치를 사용하여 값을 선택하도록 하는 것이 적절하다.
- L[925–925](../../upstream/krds/raw/components/component_06_07.html:925): 선택한 상태가 화면/서비스 전체에 즉각적으로 반영되는 경우, 토글 스위치를 사용하여 값을 선택하도록 하는 것이 적절하다.
- L[922–927](../../upstream/krds/raw/components/component_06_07.html:922): 상태 전환의 결과가 즉각적으로 반영되는 경우 선택한 상태가 화면/서비스 전체에 즉각적으로 반영되는 경우, 토글 스위치를 사용하여 값을 선택하도록 하는 것이 적절하다.
- L[931–931](../../upstream/krds/raw/components/component_06_07.html:931): 사용하기 적합하지 않은 경우
- L[936–936](../../upstream/krds/raw/components/component_06_07.html:936): 중간 상태를 가지는 체크박스 목록을 사용한다.
- L[933–938](../../upstream/krds/raw/components/component_06_07.html:933): 선택 옵션이 계층 구조를 가지는 경우 중간 상태를 가지는 체크박스 목록을 사용한다.
- L[942–942](../../upstream/krds/raw/components/component_06_07.html:942): 서로 반대되는 상태를 선택하는 경우라도 단일 레이블로 적절하게 설명하기 어렵다면, 라디오 버튼을 사용하여 선택 컨트롤을 2개로 나누고 각각의 라디오 버튼에 정확하게 레이블을 제공하는 것이 좋다.
- L[939–944](../../upstream/krds/raw/components/component_06_07.html:939): 레이블이 직관적이지 않은 경우 서로 반대되는 상태를 선택하는 경우라도 단일 레이블로 적절하게 설명하기 어렵다면, 라디오 버튼을 사용하여 선택 컨트롤을 2개로 나누고 각각의 라디오 버튼에 정확하게 레이블을 제공하는 것이 좋다.
- L[948–948](../../upstream/krds/raw/components/component_06_07.html:948): 토글 형태의 요소는 항상 기본 상태를 갖는다. 기본 상태가 존재하지 않는(켜짐 또는 꺼짐이 모두 아님) 상황에서는 토글을 사용하지 않아야 한다.
- L[945–950](../../upstream/krds/raw/components/component_06_07.html:945): 기본 상태가 존재하지 않는 경우 토글 형태의 요소는 항상 기본 상태를 갖는다. 기본 상태가 존재하지 않는(켜짐 또는 꺼짐이 모두 아님) 상황에서는 토글을 사용하지 않아야 한다.
- L[954–954](../../upstream/krds/raw/components/component_06_07.html:954): 부울 유형(Boolean)의 상태를 전환하는 것이 아니라면 라디오 버튼을 사용한다.
- L[951–956](../../upstream/krds/raw/components/component_06_07.html:951): 두 상태가 서로 반대되는 상태가 아닌 경우 부울 유형(Boolean)의 상태를 전환하는 것이 아니라면 라디오 버튼을 사용한다.
- L[960–960](../../upstream/krds/raw/components/component_06_07.html:960): 라디오 버튼을 사용한다.
- L[957–962](../../upstream/krds/raw/components/component_06_07.html:957): 여러 개의 상호 배타적인 선택 옵션이 존재하는 경우 라디오 버튼을 사용한다.
- L[966–966](../../upstream/krds/raw/components/component_06_07.html:966): 선택 정보 및 옵션의 특성에 따라 체크박스나 라디오 버튼을 사용한다.
- L[963–968](../../upstream/krds/raw/components/component_06_07.html:963): 선택한 옵션 값의 적용에 별도 제출/적용 과정이 필요한 경우 선택 정보 및 옵션의 특성에 따라 체크박스나 라디오 버튼을 사용한다.

### 사용성 가이드라인

- L[976–976](../../upstream/krds/raw/components/component_06_07.html:976): 사용성 가이드라인
- L[980–980](../../upstream/krds/raw/components/component_06_07.html:980): 레이블은 가능한 명사형으로 작성한다.
- L[981–981](../../upstream/krds/raw/components/component_06_07.html:981): 명사형으로 작성하였을 때 의미가 명확하지 않다면 동사형으로 변경하거나, 부가적인 도움말을 제공하여 토글 스위치를 켜고 끄는 동작을 통해 무엇이 변경되는지를 사용자가 직관적으로 이해할 수 있어야 한다.
- L[992–992](../../upstream/krds/raw/components/component_06_07.html:992): 스위치 상태에 상관없이 레이블을 일관되게 유지한다.
- L[993–994](../../upstream/krds/raw/components/component_06_07.html:993): 스위치 상태가 변경될 때마다 레이블의 내용이 변경되어서는 안 된다. 스위치 상태 정보는 핸들의 위치, 상태 아이콘을 통해 전달할 수 있으므로 레이블의 내용은 스위치의 목적을 정확하게 보여줄 수 있는 내용으로 작성한다. 상태 정보를 텍스트로 제공하고자 하는 경우, 스위치의 인접 영역에 별도 텍스트로 제공해야 한다.
- L[1005–1005](../../upstream/krds/raw/components/component_06_07.html:1005): 레이블과 스위치 사이의 거리에 유의한다.
- L[1006–1006](../../upstream/krds/raw/components/component_06_07.html:1006): 레이블과 스위치가 지나치게 멀리 배치되어 있으면 사용자에 따라 두 요소 간 관계를 파악하기 어려울 수 있다. 넓은 컨테이너 내부에 스위치를 사용해야 하는 경우, 레이블을 스위치 오른쪽과 같이 보다 인접한 영역에 배치하는 것이 바람직하다.
- L[1017–1017](../../upstream/krds/raw/components/component_06_07.html:1017): 한 화면 내에서의 토글 스위치 표현에 동일한 레이아웃을 사용한다.
- L[1018–1019](../../upstream/krds/raw/components/component_06_07.html:1018): 만약 목록의 왼쪽 열에 레이블이 배치되고 오른쪽 열에 스위치가 배치된다면 목록에서의 모든 스위치는 동일한 배열을 가져야 한다. 또한 상태 레이블이나 상태 아이콘을 사용한 스위치가 하나라도 존재한다면, 이 역시 모든 스위치 항목에 제공되어야 한다. 이를 통해, 사용자의 시선이 일관된 흐름으로 이동하도록 도와 탐색 피로도를 최소화할 수 있다.

### 접근성 가이드라인

- L[1136–1136](../../upstream/krds/raw/components/component_06_07.html:1136): 접근성 가이드라인
- L[1139–1139](../../upstream/krds/raw/components/component_06_07.html:1139): 경로, 핸들, 상태 아이콘과 인접 배경 간 명도 대비를 3:1 이상으로 표현한다.
- L[1140–1140](../../upstream/krds/raw/components/component_06_07.html:1140): 경로와 핸들은 요소가 토글 스위치임을 알려주는 시각적 단서이며, 상태 아이콘은 스위치의 활성화 상태 정보를 전달하는 중요 정보이므로 인접한 영역과 3:1 이상의 명도 대비를 준수해야 한다.
- L[1147–1147](../../upstream/krds/raw/components/component_06_07.html:1147): 토글 스위치를 키보드로 탐색하고 실행할 수 있도록 한다.
- L[1148–1148](../../upstream/krds/raw/components/component_06_07.html:1148): 토글 스위치로 작동하는 요소에 display:none, visibility:hidden, opacity:0과 같은 스타일을 적용하면 스크린 리더에서 요소의 역할을 인지할 수 없으며 키보드로 옵션을 선택할 수 없게 된다.
- L[1156–1156](../../upstream/krds/raw/components/component_06_07.html:1156): 토글 스위치에 키보드 초점이 명확하게 표시되도록 한다.
- L[1157–1157](../../upstream/krds/raw/components/component_06_07.html:1157): 시각적으로 표시되고 있는 토글 스위치와 숨겨진 요소의 크기 및 위치를 일치시켜 포커스링이 적절하게 표시되도록 구현해야 한다.
- L[1165–1165](../../upstream/krds/raw/components/component_06_07.html:1165): 토글 스위치에 접근 가능한 이름을 제공한다.
- L[1166–1167](../../upstream/krds/raw/components/component_06_07.html:1166): 스크린 리더 사용자가 스위치의 용도를 확인할 수 있도록 &lt;label&gt;, aria-label, aria-labelledby 중 1가지 방식을 이용하여 레이블을 제공해야 한다. 이때, 가능하면 &lt;label&gt;을 이용하여 사용자가 레이블을 클릭하였을 때도 값을 선택할 수 있도록 구현하는 것이 좋다.
- L[1175–1175](../../upstream/krds/raw/components/component_06_07.html:1175): 스크린 리더에서 도움말을 인지할 수 있도록 한다.
- L[1176–1176](../../upstream/krds/raw/components/component_06_07.html:1176): 스위치가 도움말을 aria-describedby로 연결하여 스크린 리더가 스위치에 접근하였을 때, 도움말 정보를 즉각적으로 전달받을 수 있도록 한다.

### 상호작용 가이드라인

- L[1187–1187](../../upstream/krds/raw/components/component_06_07.html:1187): 상호작용 가이드라인
- L[1189–1189](../../upstream/krds/raw/components/component_06_07.html:1189): 옵션 탐색
- L[1207–1210](../../upstream/krds/raw/components/component_06_07.html:1207): Tab, Shift + Tab 모든 토글 스위치는 Tab, Shift + Tab 키를 눌렀을 때 접근할 수 있어야 한다.
- L[1217–1217](../../upstream/krds/raw/components/component_06_07.html:1217): 옵션 선택 및 선택 해제
- L[1235–1238](../../upstream/krds/raw/components/component_06_07.html:1235): Click 사용자는 스위치 또는 레이블을 눌러 선택하거나 선택 해제할 수 있다. 일반적으로 스위치는 조작하기에 크기가 충분하지 않으므로 레이블로 상호작용이 확장될 수 있도록 구현해야 한다.
- L[1239–1242](../../upstream/krds/raw/components/component_06_07.html:1239): Space 스위치에 초점이 있는 상태에서 Space 키를 누르면 값이 선택된다.

### 예시

- L[1261–1261](../../upstream/krds/raw/components/component_06_07.html:1261): 예시
- L[1265–1265](../../upstream/krds/raw/components/component_06_07.html:1265): 기본
- L[1293–1293](../../upstream/krds/raw/components/component_06_07.html:1293): 기본 코드 확인하기
- L[1309–1309](../../upstream/krds/raw/components/component_06_07.html:1309): 사이즈
- L[1333–1333](../../upstream/krds/raw/components/component_06_07.html:1333): 사이즈 코드 확인하기

### 마크업 가이드

- L[1353–1353](../../upstream/krds/raw/components/component_06_07.html:1353): 마크업 가이드
- L[1356–1356](../../upstream/krds/raw/components/component_06_07.html:1356): CSS 선택자
- L[1377–1383](../../upstream/krds/raw/components/component_06_07.html:1377): switch 감싸는 영역 .krds-form-toggle-switch 사이즈 중간 .medium
- L[1384–1387](../../upstream/krds/raw/components/component_06_07.html:1384): 크게 .large

보존된 예시 마크업 인라인(참고용이며 공개 네이티브 API가 아님): L[1270–1287](../../upstream/krds/raw/components/component_06_07.html:1270), L[1314–1327](../../upstream/krds/raw/components/component_06_07.html:1314)

CSS/JS/안내 이미지 출처 참조는 복사된 구현이 아닙니다. 표 행의 원본 HTML(필수/선택 열 보존)은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화한 발췌가 조건부 선택자를 필수로 재분류하지는 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 추가적인 텍스트 모순은 발견되지 않았습니다. 의미 API와 기본값은 이 수용된 계약이 고정합니다. 네이티브 구현은 여전히 별도의 근거 검토 대상입니다.
- 외부 코드 예시는 참조만 하며 이번 준비에서 별도 파일로 삽입하거나 읽지 않았습니다: L1298 `../../code/toggle_switch.html`, L1338 `../../code/toggle_switch_size.html`, L1402 `./variable/toggle_switch.html`. 보지 못한 내용은 추정하지 않습니다.
- 상세 페이지에 안내 이미지 참조가 9개 있으며, 그 안의 픽셀 도식은 눈으로 확인하지 않았습니다. 텍스트 구조와 지침만 읽었습니다. 정확한 시각 치수와 자산은 이후 시각·출처 검토가 필요합니다.
- 의미 인터페이스와 파트·상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작·스토리 소스, 독립 인수가 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 의미 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `SwitchContract`입니다. 네이티브 프레임워크는 자체 콘텐츠·ref·이벤트 전달만 확장합니다. 공통 매니페스트가 지원 사례 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼로는 이 계약을 충족할 수 없습니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에 인용·파생된 공식 텍스트는 원래 KRDS 권리와 출처 표시를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용한 실질 요구사항을 면제하지 않습니다.
