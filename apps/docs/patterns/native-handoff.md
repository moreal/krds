# 네이티브 구성 인계 {#native-composition-handoff}

이 글은 패턴 예시의 공통 상태 모델을 각 프레임워크의 예제 앱에 연결하는 방법을 설명합니다. 대상 렌더러는 Solid 1, React, Svelte, Vue, Lit, Qwik, Angular 7개입니다. Solid 2는 별도의 미리보기이며 Solid 1을 대신하지 않습니다.

## import와 호스트 경계 {#import-and-host-boundary}

`@unofficial-krds/test-contracts/patterns`에서 다음을 import합니다.

- `createPatternState`, `transition`
- `createLocalDriver`
- `getPresentation`
- `patternScenarios`와 예시 콘텐츠

이 모듈은 저장소 안의 예제와 테스트에서만 씁니다. 공개 컴포넌트 패키지는 이 모듈에 의존하지 않습니다. 구현은 `packages/test-contracts/src/patterns/`에 있습니다.

역할은 이렇게 나뉩니다.

- 공통 모델은 JSON 상태와 효과만 반환합니다. DOM, ref, 이벤트, 라우팅, 초점, 포털, 폼은 다루지 않습니다.
- 화면 컴포넌트는 `PatternState`와 프레임워크의 콜백/슬롯을 받아 그리기만 합니다.
- 호스트는 드라이버를 만들고, 사용자 동작을 전달하고, 효과를 실제 DOM에 적용합니다.

`fieldIds`는 의미상의 대상 ID입니다. 렌더링이 끝난 뒤 실제 컨트롤을 찾아 효과를 적용합니다. 모델이 돌려준 `focus` 효과는 요청일 뿐이고, 실제 초점 이동은 호스트가 합니다.

호스트는 다음 순서로 구성합니다.

1. 라우트를 시나리오에 맞춥니다. `/examples/<patternId>?case=<caseId>`가 `patternScenarios` 항목 하나에 대응합니다. 라우트마다 `createLocalDriver(patternId, {caseId, seed, initialState?})`를 만들고 첫 렌더링 전에 `initialActions`를 적용합니다. `filter-resets-page` 케이스는 페이지 3에서 시작합니다.
2. `getState()`로 초기 상태를 읽고 구독합니다. 사용자 동작 하나에 `PatternAction` 하나를 dispatch합니다. 반환된 초점 효과는 DOM이 갱신된 뒤에 수행합니다. 요청 효과는 `pattern:request` 이벤트로 `{operation, requestId, payload}`와 함께 한 번씩 기록합니다. 아무것도 바꾸지 않는 동작의 효과는 기록하지 않습니다.
3. 요청을 끝내는 것은 호스트입니다. 드라이버에는 타이머, fetch, 저장소, 자동 재시도가 없습니다. `settle()`을 부를 때까지 요청은 로딩 상태로 남습니다.
4. 테스트는 `window.__KRDS_FIXTURE__` 브리지로 요청을 끝냅니다. `setState({__patternCommand:{sequence:1,command:'settle'}})`처럼 sequence를 하나씩 올려 호출합니다. 호스트는 각 sequence를 한 번만 처리하고 `settle({ok})`를 부릅니다. 같은 sequence가 다시 와도 settle은 두 번 일어나지 않습니다.
5. 테스트는 결과를 실제 화면에서 확인합니다. 표시된 상태와 초점은 DOM에서, 요청 횟수는 `pattern:request` 이벤트에서 봅니다. 요청은 클릭이나 키보드 조작으로 먼저 시작하고 그다음에 끝냅니다. 브리지로 화면 상태를 직접 바꾸지 않습니다.
6. 라우트를 떠날 때 정리합니다. 구독을 해지하고, 드라이버와 브리지를 폐기하고, 리스너와 포털을 제거합니다. 폐기한 뒤나 리셋/취소한 뒤에 도착한 응답은 화면을 바꾸지 않습니다.

시드는 요청이 어떻게 끝나는지를 정합니다. 요청을 자동으로 시작하지는 않습니다.

- `success`: 성공합니다.
- `error-once`: 처음 한 번 실패한 뒤 성공합니다.
- `error`: 항상 실패합니다.
- `loading`: `settle({ok:true/false})`를 부를 때까지 로딩 상태입니다.

`initialState`는 선택 사항입니다. 준비가 끝나고 대기 중인 요청이 없는 상태 스냅샷을 넘기면 드라이버가 그 상태에서 시작합니다. 이때 드라이버는 dispatch, settle, 요청, 시나리오 동작 재생을 하지 않습니다. 시나리오의 초기 동작은 스냅샷을 만들 때나 드라이버를 만든 뒤 중 한 곳에서 한 번만 적용합니다.

브리지 명령의 타입은 `PatternFixtureCommand`입니다. 개발 중에 손으로 요청을 끝내 볼 수 있도록 테스트 제어 영역을 화면에 둘 수 있습니다. 이 영역은 서비스 화면 밖에 두고 눈에 띄게 레이블을 붙입니다. 같은 로컬 드라이버를 호출해야 하며 스토리에는 넣지 않습니다.

검색 예시는 URL에서 상태를 복원할 수 있습니다. 초기 URL과 popstate에서 다음처럼 합니다.

1. `createPatternState('search-results', caseId)`로 기본 상태를 만듭니다.
2. URL의 검색 조건을 정규화합니다. URL 파싱과 정규화는 호스트가 합니다.
3. `query`, `appliedQuery`, `category`와 `searchResources({query, category, page})` 결과를 덮어씁니다. URL에 page가 없으면 케이스의 기본 page를 씁니다. page가 범위를 벗어나면 `searchResources`가 범위 안으로 보정합니다.
4. 완성한 스냅샷을 `initialState`로 넘깁니다. 검색 요청을 흉내 내어 만들지 않습니다.

`initialState`는 조건을 만족해야 합니다. 패턴이 일치하고, 요청 카운터는 음이 아닌 안전 정수이고, 단계는 확정된 단계이고, 대기/실패 페이로드는 null이어야 합니다. 검색은 적용된 조건과 맞는 페이지당 3개의 결과도 필요합니다. 이 검사는 신뢰할 수 없는 입력을 걸러 주는 파서가 아닙니다.

일반 `reset`은 URL에서 복원한 상태가 아니라 모델의 원래 기본값으로 돌아갑니다.

## 정확한 라우트와 시나리오 {#exact-routes-and-scenarios}

| 패턴 / 라우트 접두사 | 케이스 ID |
| --- | --- |
| `/examples/form-errors` | `error-summary-focus`, `retry-success`, `reset-cancels-pending` |
| `/examples/search-results` | `filter-resets-page`, `empty-results`, `retry-success`, `query-during-loading` |
| `/examples/consent-confirmation` | `required-refusal`, `optional-refusal-success`, `modal-focus-return`, `retry-in-dialog` |
| `/examples/service-layout` | `skip-main`, `navigate-current`, `narrow-navigation`, `footer-policy` |

`patternScenarios`에 각 케이스의 초기 동작과 기대 결과가 들어 있습니다. 케이스 ID는 패턴 안에서만 고유합니다.

URL은 호스트가 다룹니다. 공통 모듈은 브라우저 location을 읽지 않습니다.

- 검색 링크는 `case`, `query`, `category`, `page`를 유지합니다.
- 레이아웃 링크는 `case`를 유지하고 `section`을 설정합니다.
- 초기 URL 정규화와 뒤로가기·앞으로가기는 호스트가 구현합니다.

초점은 다음처럼 움직여야 합니다.

- 폼 제출에 오류가 있으면 첫 번째 잘못된 필드로 갑니다.
- 오류 요약의 링크를 누르면 해당 필드로 갑니다.
- 즉시 적용되는 필터를 바꾸면 초점은 카테고리 select에 남고 페이지는 1로 돌아갑니다.
- 다이얼로그가 열리면 Modal 규칙대로 컨테이너나 첫 번째 허용 요소로 갑니다.
- 다이얼로그가 닫히면 여는 요소와 저장해 둔 페이지 위치로 돌아갑니다.
- 레이아웃에서 다른 대상으로 이동하면 새 main 제목으로 갑니다.
- 모바일 메뉴를 취소하면 여는 요소로 돌아갑니다.

여는 요소를 아직 쓸 수 있으면 초점은 그 요소로 복원합니다. 다른 초점 요청이 이를 덮어쓰지 않습니다.

레이아웃에서 현재 대상을 다시 누르는 경우는 둘로 나뉩니다.

- 모바일 레이어가 열려 있거나 현재 대상이 속한 분기가 접혀 있으면 동작으로 처리합니다. 레이어를 닫고, 분기를 펼치고, 기존 main 제목에 초점을 둡니다. 라우트는 바꾸지 않습니다.
- 분기가 이미 보이고 열린 레이어도 없으면 아무 일도 하지 않습니다. 초점도 옮기지 않습니다.

## 렌더러별 자연스러운 구성 {#natural-composition-in-each-renderer}

| 렌더러 | 구성 방법과 수명 주기 | 함께 확인할 것 |
| --- | --- | --- |
| Solid 1 | JSX 컴포넌트/children, 네이티브 폼 이벤트, 모델 스냅샷용 signal/store, ref, `onCleanup`. 콜백 하나는 동작 하나만 전달합니다. | 실제 폼 리셋과 초점, 포털 해제. Solid 2 컴파일러/런타임은 import하지 않습니다. |
| React | 컴포넌트/children, state/reducer 또는 외부 스토어 구독, 네이티브 폼 이벤트, 정리가 있는 ref와 effect. 라우트마다 드라이버를 하나 만들고, 개발 모드 재마운트를 포함해 마운트될 때마다 폐기합니다. | 실제 input 초점, FormData와 리셋. effect가 다시 실행되어도 요청이 중복되지 않아야 합니다. |
| Vue | SFC 템플릿/슬롯, ref와 computed. 제어 값과 `valueChange` 콜백, 또는 모델 바인딩 중 하나만 씁니다. 둘을 함께 처리하면 같은 동작이 두 번 dispatch됩니다. 렌더링 뒤 초점에는 `nextTick`을, 정리에는 언마운트 훅을 씁니다. | 필드와 오류 메시지의 연결. 동작 하나에 요청은 정확히 한 번입니다. |
| Svelte | `.svelte` 컴포넌트/snippet, `$state`와 파생 스냅샷, `onValueChange` 콜백. 초점에는 `tick`을, 정리에는 effect/onDestroy를 씁니다. | 실제 폼과 리셋. Svelte 패키지 export를 통해 컴파일되는지 확인합니다. |
| Lit | 커스텀 엘리먼트를 등록해 Lit 템플릿으로 구성합니다. 상태와 배열은 프로퍼티 바인딩으로 넘기고 `value-change` 같은 composed 커스텀 이벤트를 받습니다. 초점을 옮기기 전에 `updateComplete`를 기다립니다. | Shadow DOM 안의 접근 가능한 이름, 내부 컨트롤의 실제 초점, 폼 연관 FormData와 리셋, 제출 버튼 동작. 호스트의 `id`는 내부 input을 가리키지 않습니다. siheom 어댑터는 없습니다. |
| Qwik | `component$` 구성, 직렬화할 수 있는 상태/signal, `onValueChange$` 같은 QRL 콜백. 드라이버의 클로저와 구독자 집합은 직렬화할 수 없습니다. 순수 상태 reducer를 기준으로 삼고 클로저는 직렬화하지 않습니다. | 프로덕션 SSR 직렬화/resume, 첫 input/click/key 이벤트. 모든 컨트롤을 eager로 하이드레이션하지 않습니다. Vite 7을 유지합니다. |
| Angular | 독립형 컴포넌트/템플릿, inputs/outputs, signal. 폼 컨트롤은 reactive forms와 CVA로 연결하고 값의 원천을 하나로 둡니다. 초점에는 Angular의 렌더 스케줄링을, 정리에는 destroy를 씁니다. | CVA 폼의 값과 리셋, AOT/부분 APF 컴파일, 공식 CLI/ng-packagr를 통한 SSR. |

요약 영역이나 main 제목 같은 일반 HTML 영역은 호스트가 직접 작성해도 됩니다. 다른 렌더러의 컴포넌트를 감싸 쓰거나, 이름만 바꾼 대체 컴포넌트를 쓰지는 않습니다.

## 프레젠테이션 스토리와 완료 근거 {#presentation-stories-and-completion-evidence}

스토리는 화면 상태만 보여 줍니다. `getPresentation(patternId, variant)` 스냅샷을 복제해 args/inputs/slots로 화면 컴포넌트에 넘깁니다. 스냅샷은 16개입니다.

스토리에서는 다음을 하지 않습니다.

- 로컬 드라이버 만들기, `settle` 호출
- API 요청
- 외부 글꼴이나 이미지 불러오기
- 시나리오 전체를 `play`에 넣기

흐름 테스트는 스토리와 다른 파일에 씁니다. siheom을 지원하는 프레임워크는 siheom과 브라우저 테스트를 씁니다. Lit은 브라우저 테스트를 씁니다.

렌더러마다 다음을 확인합니다.

- 시나리오 15개 전부
- 실패, 재시도, 로딩
- 키보드, 초점, 스크롤
- 좁은 화면, 200% 확대, 강제 색상 모드
- 외부 요청 0건
- 라우트를 떠난 뒤의 정리
- 프레임워크별 항목: SSR/resume, CVA, Shadow DOM

접근성 검사 결과와 스크린샷은 직접 열어 봅니다. 공통 로직 테스트는 계산과 상태 전이만 확인하므로 브라우저 테스트를 대신하지 않습니다.


> 보존된 공식 원본 HTML은 이 사이트로 배포하지 않습니다. 위 공식 링크가 1차 출처입니다.
