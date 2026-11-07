# 음성지원 {#tts}

**계약 상태: 네이티브 구현용으로 범위 승인됨.** 공식 근거를 포함한 검토 완료 계약 전체가 구속력을 가집니다. 이는 명세 승인일 뿐이며, 네이티브 동작, 시각/자산 검토, 실행된 커버리지는 별도 관문입니다. 게시는 승인되지 않았습니다.

시맨틱 ID `tts`, 한국어 이름 음성지원, export `TTS`. 고정 기준선 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`.

공식 상세: [component_08_06](https://www.krds.go.kr/html/site/component/component_08_06.html), 보존된 [HTML](../../upstream/krds/raw/components/component_08_06.html). 조회 시각 `2026-10-29T23:28:05.240Z`, `74209` 바이트, SHA-256 `a097e58a8d1692f196188d0bca075636c5c7125083834e47e71313842536e280`. `catalog/components.json`, `upstream/krds/manifest.json`, 실제 바이트와 대조했습니다. 웹사이트 스냅샷은 키트 태그 1.1.0과 다릅니다.

## 범위와 완료 종류 {#scope-and-completion-kind}

고정 출처 종류는 `integration`, 인수된 프로젝트 완료 종류도 `integration`입니다. integration을 유지합니다. L900–911은 페이지/영역 요약으로 범위를 정하고, L972–980은 사용자가 제어하는 재생을, L1341–1346은 함수 시그니처를 다룹니다. 엔진은 호스트가 소유합니다.

지원하는 네이티브 사례(변형·상태 축): `page`, `region`, `play`, `icon`, `xsmall`, `small`, `medium`. 이는 네이티브 사례 이름입니다. 상태, 반응형, 외관 축이 자동으로 공식 명명 변형이 되지는 않습니다. 공식 유형/예시 헤딩 원문은 근거 부록에 남아 있습니다.

## 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

이름이 있는 음성 시작 버튼을 페이지 제목이나 영역 옆에 두고, 명시적인 일시정지/정지 컨트롤을 함께 둡니다. 페이지 전체 텍스트를 무분별하게 읽거나 스크린 리더와 중복하지 않고, 간결한 목적/흐름 요약을 읽습니다. 마운트/내비게이션 시 자동 재생은 없습니다.

## 의미 API {#plain-semantic-api}

독립 API: summary, locale, state=idle|playing|paused|error, onRequest({action:play|pause|resume|stop,summary,locale}), label, size=small, iconOnly=false. 상태는 호스트가 확인합니다. 컴포넌트는 prop 변경으로 음성 엔진을 호출하지 않습니다.

공통 상태 정책은 [현재 파일럿 규약](./README.md)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어 값과 기본값을 함께 주거나 mode를 바꾸는 것은 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청을 한 번 내보냅니다. disabled, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI/초점 상태를 유지하고, 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하며 제어 prop이 계속 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

## 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

네이티브 버튼은 Enter/Space/click에 한 번 동작합니다. 재생 중에는 일시정지와 정지를 항상 쓸 수 있습니다. 상태는 경쟁하는 자동 음성/라이브 알림 없이 텍스트와 컨트롤 이름으로 노출합니다. 독립 정책: 지원되지 않으면 재생을 비활성화하고 이유를 보여 줍니다. 정리 시에는 호스트 수명 주기를 통해 라우트 이동/언마운트에서 정지 요청을 냅니다.

## 반응형·모바일 요구 {#responsive-mobile-requirements}

보이는 레이블을 권장합니다. 아이콘 전용은 기능적인 접근 가능한 이름을 가집니다. 좁은 화면에서도 페이지/영역 배치는 올바른 요약에 붙어 있어야 합니다.

## 폼·리셋·조합 {#forms-reset-and-composition}

폼/리셋/IME 동작은 없으며 컨트롤은 type=button입니다.

## 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

통합 완료에는 네이티브 컨트롤, 문서화된 호스트 드라이버 경계, play/pause/stop/error를 지원하는 명시적 로컬 목(mock)이 포함됩니다. SpeechSynthesis/서비스, 음성, 동의/런타임 지원, 실제 오디오는 호스트가 소유합니다. 스토리에 네트워크나 실제 음성은 필요하지 않습니다.

## 고정 파트와 상태 {#stable-parts-and-states}

root, play, pause, stop, label, status; idle,playing,paused,error,unsupported.

렌더링되는 모든 소유 파트는 `data-krds-component="tts"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위의 파트/상태 어휘는 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 필수 네이티브 사용자 결과 {#required-native-user-outcomes}

1. 마운트/라우트 변경은 절대 자동 재생하지 않습니다.
2. 각 요청은 올바른 영역 요약과 함께 한 번만 내보냅니다.
3. 일시정지/정지에 계속 접근할 수 있습니다.
4. 목이 확인한 상태가 레이블을 갱신합니다.
5. 미지원/오류가 보이고 조치할 수 있습니다.
6. 해체 시 드라이버가 폐기/정지됩니다.

이는 앞으로 필요한 테스트이며 실행·인수된 결과가 아닙니다. 추가로 보이는 초점, 강제 색상 모드, 200% 글자 확대, 좁은 레이아웃, 색에 의존하지 않는 상태 표시, 움직임이 있는 곳의 동작 줄이기를 검증합니다. 빈 스위트를 성공으로 주장하지 않습니다.

## 독립 정식 기본 이름 {#independent-canonical-default-names}

컨트롤 이름에는 실제로 제공된 레이블을 씁니다. 정식 일시정지/재개 동작 이름은 “{label} 다시 재생”입니다. 이를 활성화하면 여전히 resume을 요청하며 처음부터 다시 시작하지 않고 현재 재생 위치를 유지합니다. 오류 재시도도 기존 재시도 요청 의미를 유지한 채 같은 “{label} 다시 재생” 이름을 씁니다. 이는 독립적인 기본 UI 문구이며 새 동작/prop도, 재생을 초기화하라는 지시도 아닙니다. 제공된 레이블이 계속 우선합니다.

## 필수 네이티브 스토리 {#required-native-stories}

`tts--page`, `tts--region`, `tts--play-pause-stop-mock`, `tts--icon`, `tts--sizes`, `tts--unsupported`, `tts--error`.

각 사례에는 해당하는 모든 네이티브 렌더러(Solid 1, React, Svelte, Vue, Lit, Qwik, Angular)에서 로컬 args/inputs/slots와 관찰 가능한 순수 로컬 상태가 필요합니다. Solid 2 미리보기는 별도로 격리합니다. 전체 카탈로그 스토리 의무는 `catalog/full-catalog-stories.json`에 따로 마련되며 현재 파일럿 러너 선택은 바뀌지 않습니다. 활성화 전에 네이티브 제공 여부를 인수해야 합니다. 동작 스위트는 스토리 파일과 분리하고, 지원되는 upstream siheom 어댑터만 사용합니다. Lit/Solid 2는 siheom 지원을 만들지 않고 선택된 네이티브 테스트 경로를 사용해야 합니다. Qwik은 첫 지연 이벤트를 테스트합니다. Angular 폼 컨트롤은 CVA/리셋과 부분 APF 소비를 테스트합니다. Lit은 실제 Shadow DOM의 이름/대상 관계를 검증해야 합니다. Solid 2는 Solid 1 컴파일러/렌더러를 import하면 안 됩니다. 다른 렌더러의 래퍼는 쓰지 않습니다.

## 공식 근거와 독립 정책의 구분 {#official-evidence-separate-from-independent-policy}

아래 발췌는 이 항목의 실제 보존된 상세 HTML에서 추출했으며 핵심 지침과 상호작용/마크업 표를 포함합니다. 공식 요구사항을 만들어 내지 않도록 원문 언어를 그대로 둡니다. “consider/recommended/can”에 해당하는 표현은 권고로 남습니다. 예시/CSS 선택자는 보편적 필수 동작의 증거가 아닙니다. 출처 JS 함수 표는 참고 근거일 뿐이며 원본 KRDS JS를 네이티브가 제어하는 DOM에서 실행해서는 안 됩니다. 위의 공유 API, 기본값, 추가 키보드 규칙, 실패 정리, 호스트 드라이버 정책은 아래 발췌가 명시적으로 뒷받침하는 경우를 제외하면 독립적인 선택입니다.


### 구조

- L[882–882](../../upstream/krds/raw/components/component_08_06.html:882): 구조
- L[888–888](../../upstream/krds/raw/components/component_08_06.html:888): 1. 음성 안내 아이콘 버튼과 및 텍스트 레이블
- L[889–889](../../upstream/krds/raw/components/component_08_06.html:889): 2. 음성 제어 음성 안내를 제어할 수 있는 버튼

### 유형

- L[897–897](../../upstream/krds/raw/components/component_08_06.html:897): 유형
- L[900–900](../../upstream/krds/raw/components/component_08_06.html:900): 페이지 단위 음성지원
- L[901–902](../../upstream/krds/raw/components/component_08_06.html:901): 페이지 상단 또는 주요 타이틀 근처에 배치하여 이 페이지의 목적, 주요 기능, 이용 순서 등을 요약하여 낭독 (예: 민원 신청 첫 화면, 복잡한 안내 페이지 등)
- L[908–908](../../upstream/krds/raw/components/component_08_06.html:908): 영역 단위 음성 지원
- L[909–911](../../upstream/krds/raw/components/component_08_06.html:909): 카드, 서브 타이틀, 약관 등 독립된 정보 단위 옆에 배치하여 해당 영역 텍스트를 요약하여 낭독 (예: 신청 안내, 도움 안내 등)

### 용례

- L[922–922](../../upstream/krds/raw/components/component_08_06.html:922): 용례
- L[924–924](../../upstream/krds/raw/components/component_08_06.html:924): 사용하기 적합한 경우
- L[926–928](../../upstream/krds/raw/components/component_08_06.html:926): 페이지 전체 흐름을 요약·설명해야 하는 경우
- L[929–931](../../upstream/krds/raw/components/component_08_06.html:929): 특정 영역(신청 단계 등)의 내용을 음성으로 설명할 때
- L[932–934](../../upstream/krds/raw/components/component_08_06.html:932): 디지털 취약계층·고령자·외국인을 대상으로, 텍스트 이해를 보완해야 할 때
- L[935–937](../../upstream/krds/raw/components/component_08_06.html:935): 튜토리얼/도움말 플로우에서 단계별로 화면 사용법을 읽어줄 때
- L[941–941](../../upstream/krds/raw/components/component_08_06.html:941): 사용하기 적합하지 않은 경우
- L[943–945](../../upstream/krds/raw/components/component_08_06.html:943): 전체페이지를 의미 없이 읽어주어 재생되는 음성이 실질적인 정보나 도움을 제공하지 않는 경우
- L[946–948](../../upstream/krds/raw/components/component_08_06.html:946): 음성 보조기구(스크린리더 등)와 동일한 내용을 중복해서 제공하는 경우

### 사용성 가이드라인

- L[956–956](../../upstream/krds/raw/components/component_08_06.html:956): 사용성 가이드라인
- L[959–959](../../upstream/krds/raw/components/component_08_06.html:959): 명확한 레이블을 제공한다.
- L[960–961](../../upstream/krds/raw/components/component_08_06.html:960): 사용자자가 제공되는 정보를 정확하게 인지할 수 있도록 동작과 목적이 드러나도록버튼 레이블을 붙인다.
- L[972–972](../../upstream/krds/raw/components/component_08_06.html:972): 자동재생을 금지한다.
- L[973–974](../../upstream/krds/raw/components/component_08_06.html:973): 화면 전환 시 사용자의 조작 없이 자동으로 실행되지 않도록 한다. 또한 언제든지 일시정지, 정지할 수 있어야 한다.
- L[978–978](../../upstream/krds/raw/components/component_08_06.html:978): 너무 긴 내용을 읽어주지 않도록 한다.
- L[979–980](../../upstream/krds/raw/components/component_08_06.html:979): 음성 지원은 음성 보조기구(스크린리더 등)와 동일한 내용을 중복해서 제공하지 않도록 하고, 사용자에게 꼭 필요한 정보를 요약된 형태로 제공한다. (예 : 무엇을 할 수 있는지, 어떤 순서로 진행하면 되는지, 안내 및 주의 사항 등)

### 예시

- L[1102–1102](../../upstream/krds/raw/components/component_08_06.html:1102): 예시
- L[1106–1106](../../upstream/krds/raw/components/component_08_06.html:1106): 기본
- L[1146–1146](../../upstream/krds/raw/components/component_08_06.html:1146): 기본 코드 확인하기
- L[1162–1162](../../upstream/krds/raw/components/component_08_06.html:1162): 사이즈
- L[1195–1195](../../upstream/krds/raw/components/component_08_06.html:1195): 사이즈 코드 확인하기
- L[1211–1211](../../upstream/krds/raw/components/component_08_06.html:1211): 아이콘 버튼
- L[1246–1246](../../upstream/krds/raw/components/component_08_06.html:1246): 아이콘 버튼 코드 확인하기

### 마크업 가이드

- L[1267–1267](../../upstream/krds/raw/components/component_08_06.html:1267): 마크업 가이드
- L[1270–1270](../../upstream/krds/raw/components/component_08_06.html:1270): CSS 선택자
- L[1291–1299](../../upstream/krds/raw/components/component_08_06.html:1291): 전체영역 .krds-tts 타입 플레이 타입 .play
- L[1300–1304](../../upstream/krds/raw/components/component_08_06.html:1300): 사이즈 더 작게 .xsmall
- L[1305–1308](../../upstream/krds/raw/components/component_08_06.html:1305): 작게 .small
- L[1309–1312](../../upstream/krds/raw/components/component_08_06.html:1309): 중간 .medium
- L[1322–1322](../../upstream/krds/raw/components/component_08_06.html:1322): JS
- L[1341–1346](../../upstream/krds/raw/components/component_08_06.html:1341): krds_playTts krds_playTts('읽을 내용', this)

인라인으로 보존된 예시 마크업(참고용이며 공개 네이티브 API가 아님): L[1111–1140](../../upstream/krds/raw/components/component_08_06.html:1111), L[1167–1189](../../upstream/krds/raw/components/component_08_06.html:1167), L[1216–1240](../../upstream/krds/raw/components/component_08_06.html:1216)

CSS/JS/안내 이미지의 출처 참조는 복사된 구현이 아닙니다. 필수/선택 열을 보존한 표 행의 원본 HTML은 [source-evidence.json](../../catalog/source-evidence.json)에 있습니다. 위의 평탄화된 발췌가 조건부 선택자를 필수로 재분류하지 않습니다.

## 근거의 한계와 기록된 정책 {#evidence-limitations-and-recorded-policy}

- 고정된 상세에는 JS 함수 시그니처만 있고 정확한 음성 엔진/타이머/상태 수명 주기는 없습니다. 제안한 호스트 드라이버는 독립 설계입니다.
- 연결된 외부 코드 예시는 참조만 하며 이번 준비에서 별도 파일로 포함하거나 읽지 않았습니다: L1151 `../../code/tts.html`, L1200 `../../code/tts_size.html`, L1251 `../../code/tts_icon.html`. 보지 못한 내용을 추론하지 않습니다.
- 상세에는 안내 이미지 참조 5개가 있으며, 내장 픽셀 다이어그램은 시각적으로 확인하지 않았습니다. 텍스트 구조/지침은 읽었습니다. 정확한 시각 치수/자산은 이후 시각·출처 검토가 필요합니다.
- 시맨틱 인터페이스와 파트/상태 토큰은 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 각 네이티브 렌더러는 여전히 자체 구현, 동작/스토리 소스, 독립 인수가 필요합니다.

## 공통 구현 인계 {#shared-implementation-handoff}

정확한 시맨틱 인터페이스는 [full-catalog.ts](../../packages/contracts/src/full-catalog.ts)의 `TTSContract`입니다. 네이티브 프레임워크는 자신의 콘텐츠/ref/이벤트 전달만 확장합니다. 공유 매니페스트는 지원 사례 축, 파트, 상태를 고정합니다. 범용 렌더러나 다른 프레임워크 래퍼는 이 계약을 충족하지 못합니다. 이 계약의 모든 필수 결과는 컴포넌트, 조합, 자산, 통합에 계속 필수입니다.

이 문서에서 인용하거나 파생한 공식 텍스트는 원래의 KRDS 권리와 출처 표기를 유지합니다. 독립 코드 MIT 허가는 이 발췌, 글꼴, 자산을 재라이선스하지 않습니다. 위의 정확한 출처 식별은 바뀌지 않습니다. 열린 근거 한계는 확인하지 못한 가이드 픽셀, 연결된 코드, 자산 승인에 관한 것이며 여기 인용한 실질 요구사항을 면제하지 않습니다.
