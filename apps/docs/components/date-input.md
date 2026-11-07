---
title: '날짜 입력 필드 · Date input'
---

# 날짜 입력 필드 {#date-input}

Date input · `DateInput` · component

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_09_01.html) · [검토된 전체 명세](/sources/specs/components/date-input.md.txt) · [프레임워크 지원](../compatibility/)

## 네이티브 지원 현황 {#native-availability}

아래 상태는 `catalog/coverage.json`에서 그대로 가져옵니다. export, 예제, 테스트 실행기 종료 코드에서 추론하지 않습니다.

| 프레임워크 | 패키지 버전 | 기록된 상태 | export 선언 | 네이티브 예제와 스토리 |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/react/package.json.txt); [과거 선언 체크포인트](/sources/packages/react/dist/components/date-input/index.d.ts.txt) | [react 소스와 미리보기 정책](../compatibility/examples#react) |
| solid | `0.1.0` | implemented | [현재 하위 경로 매니페스트](/sources/packages/solid/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid/dist/components/date-input/index.d.ts.txt) | [solid 소스와 미리보기 정책](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/svelte/package.json.txt); [과거 선언 체크포인트](/sources/packages/svelte/dist/components/DateInput.svelte.d.ts.txt) | [svelte 소스와 미리보기 정책](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/vue/package.json.txt); [과거 선언 체크포인트](/sources/packages/vue/dist/components/date-input/DateInput.vue.d.ts.txt) | [vue 소스와 미리보기 정책](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/lit/package.json.txt); [과거 선언 체크포인트](/sources/packages/lit/dist/components/date-input/index.d.ts.txt) | [lit 소스와 미리보기 정책](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/qwik/package.json.txt); [과거 선언 체크포인트](/sources/packages/qwik/dist/components/date-input/index.d.ts.txt) | [qwik 소스와 미리보기 정책](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/angular/package.json.txt); [과거 선언 체크포인트](/sources/packages/angular/dist/types/unofficial-krds-angular-date-input.d.ts.txt) | [angular 소스와 미리보기 정책](../compatibility/examples#angular) |
| solid-next (미리보기) | `0.1.0-preview.0` | planned | [현재 하위 경로 매니페스트](/sources/packages/solid-next/package.json.txt); [과거 선언 체크포인트](/sources/packages/solid-next/dist/components/date-input/index.d.ts.txt) | [solid-next 소스와 미리보기 정책](../compatibility/examples#solid-next) |

## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}

아래 의미 계약은 공유 데이터일 뿐입니다. 네이티브 콘텐츠, ref, 이벤트 전달은 각 어댑터가 맡습니다. 계약의 콜백 이름과 detail 타입은 그대로 씁니다. 머신 객체를 전달하지 않습니다. 선택 속성에는 기본값이 자동으로 채워지지 않습니다. 아래 안내의 명시적 기본값을 씁니다.

공개 API는 아래 검토된 안내와 각 네이티브 공개 선언이 정의합니다. [공유 이벤트·날짜 타입](/sources/packages/contracts/src/types.ts.txt).

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 네이티브 JSX/콘텐츠 prop을 씁니다. Svelte는 네이티브 snippet을 씁니다. Vue는 네이티브 슬롯을 씁니다. Angular는 네이티브 input, output, 콘텐츠 투영을 씁니다. Lit은 custom element 속성, 슬롯, DOM 이벤트를 씁니다. Qwik은 네이티브 QRL 이벤트 경계를 씁니다. 이 전달 방식은 서로 바꿔 쓸 수 없습니다. 정확한 이름과 필수 콘텐츠는 링크된 공개 패키지 선언에서 확인합니다. 아래 의미 콜백이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 공식 요구사항 {#official-requirements}

KRDS는 단일, 범위, 분할, 달력 보조 입력을 구분합니다. 의미 있는 필드 레이블, 지속적인 형식 안내, 달력이 있어도 키보드 입력, 프로그램적 레이블 관계를 요구합니다. 달력이 있다고 텍스트 필드를 비활성화하거나 읽기 전용으로 만들 수 없습니다. 파일럿은 전체 날짜 단일 입력과 두 필드 범위 입력을 지원하며, 달력 보조는 선택입니다. 연/월만 있는 입력과 분할 입력은 앞으로의 변형이며 구현됐다고 주장하지 않습니다.

### 프로젝트 API와 기본값 {#project-api-and-defaults}

옵션: `mode: 'single' | 'range'`(single, 마운트 후 변경 불가), `value`, `defaultValue`, `onValueChange`, 네이티브 `name`, `required`(false), `disabled`(false), `id`, `form`, `autocomplete`, `min?: string`, `max?: string`, `locale: 'ko-KR' | 'en-US'`(ko-KR), `translations?: DateInputTranslations`, `withCalendar: boolean`(true), `referenceDate: string`('2000-01-01'), `today?: string`, 필드 레이블, 지속 힌트, 선택적 외부 오류 콘텐츠. 파일럿은 readOnly 모드를 추가하지 않습니다.

단일 값은 `string | null`이며 비어 있으면 기본 null이고, 이벤트는 `ValueChangeDetails<string | null>`입니다. 범위 값은 `DateRangeValue`이며 비어 있으면 기본 `{start:null,end:null}`이고, 이벤트는 `ValueChangeDetails<DateRangeValue>`입니다. 커밋된 범위는 비어 있거나 순서가 맞는 유효한 두 끝점을 가져야 합니다. 부분 범위는 로컬 편집/달력 초안으로만 존재합니다. 모드와 맞지 않는 페이로드 형태는 TypeError입니다. 유효하지 않거나, 부분적이거나, 뒤바뀌었거나, 범위를 벗어난 제어/기본 날짜 값은 RangeError입니다. min/max/referenceDate/today는 엄격한 ISO 날짜입니다. min과 max는 경계를 포함하며, 경계가 없으면 0001-01-01과 9999-12-31입니다. min>max는 RangeError입니다. referenceDate/today는 허용 범위 밖일 수 있으며, 보기와 표시만 안내하고 경계를 덮어쓰지 않습니다.

실제 type=text 입력을 렌더하고 inputmode=numeric이며, 네이티브 날짜 선택기와 자동 구분자 삽입은 없습니다. 허용 텍스트, 표시 텍스트, 제출 값은 두 로케일 모두 정확히 ASCII YYYY-MM-DD입니다. `parseIsoDate`와 `formatIsoDate`는 그레고리력 1–9999년과 윤년을 따릅니다. 공백 제거, 일/월 순서 추측, 슬래시 허용, 넘치는 날짜 정규화, 타임스탬프 변환, 호스트 시간대 적용을 하지 않습니다. 로케일은 레이블과 안내를 바꿀 뿐 데이터나 파싱은 바꾸지 않습니다. 네이티브 텍스트 편집, 붙여넣기, 선택, 실행 취소가 동작해야 합니다.

범위는 과업을 알려 주는 보이는 fieldset legend 아래에 별도 이름의 입력 둘(기본 `시작일`/`종료일`)을 둡니다. 단일 입력은 과업별 레이블 내용(예: `방문일`)이 필요하며, 라이브러리가 업무 목적 레이블을 만들어 내서는 안 됩니다. 플레이스홀더 `YYYY-MM-DD`는 지속 형식 힌트를 보완할 뿐 대체하지 않습니다.

### 편집, 커밋, 알림 {#editing-commits-and-notifications}

원시 텍스트 초안을 커밋된 의미 값과 분리해 유지합니다. 입력 이벤트는 초안만 갱신합니다. 필드에서 Enter를 누르거나 입력/달력 그룹 전체에서 초점이 벗어날 때 검증하고 커밋을 시도하며, 키 입력마다 또는 범위 필드 사이 이동 시에는 하지 않습니다. 조합 중이 아닌 Enter는 커밋하도록 소비해 의도치 않은 폼 제출을 막으며, 명시적 폼 제출 버튼은 그대로 동작합니다. 유효하고 바뀐 값이 커밋된 뒤의 blur는 다시 내보내지 않습니다. 비어 있는 단일 텍스트는 null을 커밋합니다. 범위의 두 텍스트가 모두 비면 빈 범위를 커밋하고, 한쪽 끝점만 비면 미완성이라 커밋하지 않습니다. 뒤바뀐 범위는 유효하지 않으며, 날짜를 몰래 재정렬하거나 min/max로 고정(clamp)하지 않습니다.

조합 중에는 원시 입력을 유지하고 검증, 서식, Enter 커밋, 달력 단축키를 억제합니다. compositionstart/end와 `isComposing`(keyCode 229 대체)을 추적하며, compositionend는 초안만 갱신합니다. 이후 조합 중이 아닌 Enter나 그룹 blur가 이를 검증합니다. 숫자 필터링을 강제하거나 중간 한글을 파싱하지 않습니다. 완성된 한글 텍스트는 고칠 때까지 잘못된 형식으로 남으며, 사용자의 초안과 캐럿을 보존합니다. 달력을 열어도 끝나지 않은 텍스트 초안을 커밋하지 않고, 마지막으로 커밋된 값에서 초기화합니다.

유효한 비제어 커밋은 상태를 갱신하고 한 번 내보냅니다. 제어 커밋은 한 번 내보내고, 핸들러 뒤에 표시된 커밋 값을 부모 prop에 맞춰 조정하며, 거절된 요청은 prop의 서식 텍스트를 복원합니다. 잘못된 원시 텍스트는 계속 보이고, 이전 커밋 의미 값을 유지하며, aria-invalid를 설정하고, 보이는 오류를 노출하며, 값 이벤트를 내지 않습니다. 외부 값 변경은 초안을 교체하고 로컬 오류를 지우되 내보내지 않습니다. 외부 disabled 변경은 편집/달력 활성화를 막으며 변경을 내보내지 않습니다. 형식 오류가 범위 오류보다 우선하며, 범위는 시작, 끝, 순서 순으로 검증합니다. 필수 빈 값은 필수 오류입니다. 로케일 변경이나 검증 과정은 사용자 값 이벤트를 내지 않습니다.

### 달력 통합 {#calendar-integration}

여는 컨트롤은 type=button이며 이름은 `달력 열기`/`Open calendar`이고 aria-haspopup=dialog, aria-expanded, aria-controls를 가집니다. 범위 모드에서는 두 필드에 여는 컨트롤 하나를 쓰며, 날짜 입력이 여럿이면 과업 레이블을 맥락으로 이름을 붙입니다. 열면 이름 있는 모달 달력 대화상자를 보이고 트리거를 저장합니다. 초점은 선택된 활성 날짜에, 없으면 표시된 달의 첫 선택 가능한 날짜에, 없으면 활성 이전/다음 달 컨트롤에, 없으면 대화상자 컨테이너에 둡니다. [달력(Calendar)](/sources/specs/components/calendar.md.txt)이 날짜 탐색, 임시 선택, 확인/취소를 정의합니다.

달력 선택은 `확인`/`Confirm` 전까지 임시입니다. 유효하고 다른 값의 확인은 DateInput 값 변경을 정확히 한 번 내보내고 닫습니다. 같은 값의 확인은 값 변경 없이 닫습니다. 취소, 허용된 Escape, 확인 없는 닫기는 임시 날짜를 버리고 커밋된 입력 값을 보존합니다. 확인 시 원시 텍스트 초안을 교체하고 로컬 검증 오류를 지웁니다. 팝업 열기/닫기는 내부 표시 상태이며 두 번째 값 이벤트가 아니고, 이 파일럿에는 공개 open-change API가 없습니다. Escape는 조합 중이거나 내부 컨트롤이 처리했으면 무시합니다. 최상위 대화상자만 Escape를 처리합니다. 백드롭 클릭은 막히며 기본적으로 닫지 않습니다. 실제로 닫힌 뒤 트리거 초점을 복원하고, 트리거가 사라졌으면 Modal의 대체를 씁니다. 확인 뒤에도 부모가 제어하는 값이 권위를 갖습니다. 열고 닫는 것만으로 기존의 잘못된 텍스트 초안을 지우지 않습니다.

### 번역과 접근성 피드백 {#translation-and-accessible-feedback}

`DateInputTranslations`는 이 명세의 의미 사전입니다(어댑터는 대응하는 일반 인터페이스를 노출할 수 있음). 부분 재정의는 선택한 로케일과 병합하며, 어떤 키도 빈 문자열이 될 수 없습니다. 필수 키와 기본값:

| 키 | ko-KR | en-US |
| --- | --- | --- |
| startLabel | 시작일 | Start date |
| endLabel | 종료일 | End date |
| formatHint | YYYY-MM-DD 형식으로 입력하세요. 예: 2024-02-29 | Enter YYYY-MM-DD, for example 2024-02-29 |
| openCalendar | 달력 열기 | Open calendar |
| calendarTitle | 날짜 선택 | Choose date |
| requiredError | 날짜를 입력하세요 | Enter a date |
| formatError | YYYY-MM-DD 형식의 올바른 날짜를 입력하세요 | Enter a valid date in YYYY-MM-DD format |
| incompleteRangeError | 시작일과 종료일을 모두 입력하세요 | Enter both start and end dates |
| orderError | 종료일은 시작일보다 빠를 수 없습니다 | End date must not precede start date |
| minError | {min} 이후 날짜를 입력하세요 (당일 포함) | Enter a date on or after {min} |
| maxError | {max} 이전 날짜를 입력하세요 (당일 포함) | Enter a date on or before {max} |

{min}/{max}는 HTML이 아닌 ISO 텍스트로 보간합니다. 달력 번역은 따로 규정합니다. 보이는 힌트/오류 노드는 aria-describedby로 연결하고, 영향받는 필드에 aria-invalid를 설정합니다. 지속적인 polite 상태 영역은 새 오류를 키 입력마다가 아니라 검증 시 한 번 알립니다. 단정적 안내를 중복하지 않습니다. 잘못된 입력은 초점을 빼앗지 않습니다. 오류 텍스트는 레이블을 보완하며 오류가 지속되는 동안 계속 보입니다. 외부 오류 콘텐츠는 설명용이며 잘못된 표시를 붙일 수는 있지만, 잘못된 의미 날짜를 커밋하게 만들 수는 없습니다.

### 폼·구조·인수 기준 {#form-structure-and-acceptance}

단일은 성공 이름 하나(정식)를 쓰고, 범위는 `${name}.start`와 `${name}.end`를 씁니다. 편집 가능한 초안에는 성공 이름이 없습니다. 정식 숨은 입력이 커밋된 ISO 텍스트를 담으며, 빈 값은 빈 문자열입니다. 비활성은 모든 성공 항목을 생략합니다. 활성화된 선택 빈 값은 이름 있는 정식 항목에 빈 문자열을 기여합니다. `form`은 보이는 입력과 숨은 입력에 전달하고, required/validity는 보이는 입력에 전달합니다. 현재 초안의 형식/경계/순서/필수 유효성을 네이티브 setCustomValidity로 반영하므로, 커밋된 숨은 값이 유효해도 잘못된 초안은 제출을 막습니다. 제출은 보류 중인 초안을 먼저 검증하며, 커밋되지 않고 값이 다른 초안은 고치거나 커밋할 때까지 막습니다. 오래된 값을 몰래 보내지 않습니다. 유효한 보류 초안은 네이티브 FormData 구성 전에 제출 중 한 번 커밋할 수 있으며, 제어에서 거절된 커밋은 그 제출을 막습니다. 네이티브 invalid 초점은 영향받는 첫 보이는 입력입니다. 제출을 재귀 호출하지 않습니다. 비제어 리셋은 초기 커밋 값과 표시를 복원하고, 팝업을 닫고, 임시 상태와 오류를 버리며, 아무것도 내보내지 않습니다. 제어 리셋은 현재 prop에서 표시를 복원하고 팝업을 닫으며 아무것도 내보내지 않습니다. 취소된 리셋은 아무것도 바꾸지 않습니다.

파트: `root`, `label`, `control`, `start-input`, `end-input`, `trigger`, `hint`, `error`, `popup`. 단일은 `control`, 범위는 start/end 파트를 씁니다. 루트/필드 상태: `disabled`, `invalid`. 팝업/트리거: `open` 또는 `closed`. 콘텐츠 순서: 레이블/legend, 여는 컨트롤이 있는 입력, 힌트, 오류, 연결된 팝업. 달력은 자체 중첩 식별과 파트를 기여합니다.

인수: 유효한 윤일, 잘못된/0 채움 없는 날짜, 0001/9999년, 원시 붙여넣기와 IME 조합, 그룹 blur 대 범위 필드 초점, Enter와 blur 이벤트 횟수, 같은/거절된 제어 커밋, 경계 포함 min/max와 뒤바뀐/미완성 범위, 팝업 확인/취소 일관성, 번역된 한국어 필드/버튼/날짜(day) 이름, 오류 관계, 폼 데이터/리셋/필수 및 잘못된 초안 제출 차단. 브라우저 로케일이나 시간대가 이 기대 값을 바꿔서는 안 됩니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

지원하는 케이스 축: `single`, `range`. 이 케이스 이름은 프로젝트의 독립 축입니다. 공식 KRDS 유형 이름이나 완료된 커버리지를 뜻하지 않습니다.

[필수 네이티브 스토리 매니페스트](/sources/catalog/full-catalog-stories.json.txt) · [파일럿 스토리 매니페스트](/sources/catalog/story-cases.json.txt) · [커버리지 근거와 네이티브 리뷰 링크](/sources/catalog/coverage.json.txt)

### 로컬 네이티브 스토리 {#local-native-stories}

픽스처와 Storybook 출력은 로컬 전용입니다. 이 공개 문서 사이트에 올리지 않습니다. 로컬 문서 서버도 그쪽으로 리디렉션하지 않습니다. 각 네이티브 Storybook은 자기 워크스페이스 스크립트로 실행합니다. 컴포넌트 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/` 아래에 조립된 네이티브 미리보기입니다. Solid 2에는 지원되는 네이티브 Storybook 통합이 없습니다. Qwik 프로덕션 SSR/resume에는 실제 서버가 필요합니다. 정적 미리보기로 대신할 수 없습니다. 스토리가 있다고 동작 인수가 성립하지는 않습니다.

네이티브 컴파일러 체크포인트입니다. 소스 해시는 문서를 빌드할 때마다 검증합니다. 이 기록은 최신 네이티브 후보나 동작 인수를 인증하지 않습니다. 검사된 소스 페이지마다 체크포인트 범위가 적혀 있습니다.

- react: [검사된 소비 코드 보기](/examples/react-1); [소스 그대로 내려받기](/sources/packages/react/examples/catalog.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [검사된 소비 코드 보기](/examples/solid-2); [소스 그대로 내려받기](/sources/apps/fixture-solid/src/examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [검사된 소비 코드 보기](/examples/svelte-43); [소스 그대로 내려받기](/sources/apps/fixture-svelte/src/public-examples/DateInputExample.svelte.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [검사된 소비 코드 보기](/examples/vue-59); [소스 그대로 내려받기](/sources/apps/fixture-vue/src/ConsumerExample.vue.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [검사된 소비 코드 보기](/examples/lit-60); [소스 그대로 내려받기](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [검사된 소비 코드 보기](/examples/qwik-61); [소스 그대로 내려받기](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [검사된 소비 코드 보기](/examples/angular-62); [소스 그대로 내려받기](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## 출처와 권리 {#source-identity-and-rights}

기준선: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. 공식 상세 스냅숏 수집 시각: `2026-10-29T23:28:05.326Z`. SHA-256: `d9711fdb55bab5ecd6c99793ce89912c5fba6969f80f66ee30bc96a1a0852ac5`. [고정된 컴포넌트 출처 기록](/sources/catalog/components.json.txt) · [공식 출처](https://www.krds.go.kr/html/site/component/component_09_01.html). 원본 HTML은 체크아웃의 참고 근거로만 남습니다. 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
