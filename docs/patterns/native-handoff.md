# 네이티브 구성 인계 {#native-composition-handoff}

공통 인터페이스는 네이티브 통합 준비가 끝났습니다. 컨트롤러가 어댑터/픽스처/Storybook 소유자를 각각 지정합니다. 이 인계는 다른 소유자의 디렉터리, 공유 스타일, 카탈로그 커버리지, 의존성, lockfile, 루트 러너, 패키지 export를 바꿀 권한을 주지 않습니다. 안정 렌더러 7개가 필요합니다. Solid 1, React, Svelte, Vue, Lit, Qwik, Angular입니다. Solid 2는 분리된 미리보기이며 Solid 1을 대체하지 않고 7개에 포함되지도 않습니다.

## import와 호스트 경계 {#import-and-host-boundary}

`createPatternState`, `transition`, `createLocalDriver`, `getPresentation`, `patternScenarios`, 콘텐츠를 `@unofficial-krds/test-contracts/patterns`에서 import합니다. 이 패키지 export는 컨트롤러/공통 패키지 소유자가 추가하며 공통 구현은 `packages/test-contracts/src/patterns/**`에만 있습니다. 루트 `examples/data`로 앱 상대 import를 추가하지 않습니다. 손으로 쓴 선언을 복사하거나 새 워크스페이스를 만들지 않습니다. 런타임 선언은 기존에 선택한 TypeScript 컴파일러가 생성합니다. 이 모듈은 비공개 테스트/예시 인프라로 유지되며 공개 어댑터 패키지가 의존하면 안 됩니다.

순수 네이티브 프레젠테이션 컴포넌트는 판별 유니온 `PatternState`와 네이티브 동작 콜백/슬롯을 받습니다. 공통 모델은 JSON 상태와 효과만 반환합니다. DOM, ref, 이벤트, 라우팅, 초점, 포털, 폼, 렌더러는 소유하지 않습니다. `fieldIds`는 시맨틱 대상 ID이며 렌더링 뒤 실제 네이티브 컨트롤에 대해 효과를 해석합니다. 기록된 `focus` 효과만으로는 실제 브라우저 초점을 입증할 수 없습니다.

통합 픽스처는 다음과 같이 구성합니다.

1. 정확한 `/examples/<patternId>?case=<caseId>` 라우트를 `patternScenarios` 항목과 맞춥니다. 라우트 범위의 `createLocalDriver(patternId, {caseId, seed, initialState?})`를 만들고 첫 렌더링 전에 `initialActions`를 적용합니다. `filter-resets-page` 케이스는 초기 페이지 3을 쓰고 다른 시나리오는 명시된 초기 동작을 씁니다. 선택적 `initialState`는 복제된 타입 지정 ready/nonpending 스냅샷을 채택합니다. dispatch, settle, 요청 발생, 시나리오 동작 재생은 하지 않습니다. 호스트는 이 동작을 채택 전이나 드라이버를 만든 뒤 중 한 곳에서 정확히 한 번만 적용하며 둘 다 하면 안 됩니다.
2. `getState()`로 네이티브 상태를 초기화한 뒤 구독합니다. 사용자 시맨틱 콜백마다 `PatternAction` 하나를 dispatch합니다. 반환된 초점 효과는 네이티브 DOM 커밋 뒤에 수행합니다. 실제 요청 효과는 기존 픽스처 이벤트 `pattern:request`로 `{operation, requestId, payload}`와 함께 한 번씩 기록합니다. no-op 동작의 효과는 기록하지 않습니다.
3. 요청 완료는 픽스처 호스트가 담당합니다. 요청은 명시적 `settle()`이 있을 때까지 로딩 상태로 보입니다. 드라이버에는 타이머, fetch, 저장소, 자동 재시도가 없습니다. 시드 `success`는 성공하고, `error-once`는 첫 완료에서 실패한 뒤 성공하고, `error`는 항상 실패하고, `loading`은 `settle({ok:true/false})`까지 유지합니다. 시드는 완료 방식을 정할 뿐 초기 제출을 자동으로 일으키지 않습니다.
4. 기존 `window.__KRDS_FIXTURE__` protocol-1 브리지를 재사용합니다. 테스트 코드는 단조 증가하는 sequence로 `setState({__patternCommand:{sequence:1,command:'settle'}})`를 호출합니다. 네이티브 픽스처 호스트는 각 sequence를 한 번만 소비하고 로컬 `settle({ok})`를 호출합니다. 브리지 스냅샷을 다시 재생해도 settle이 두 번 일어나면 안 됩니다. 이는 기존 JSON 패치 프로토콜에 대한 호스트의 추가 해석이며 파일럿 드라이버 메서드를 바꾸지 않습니다. 테스트는 예시 URL을 직접 열고 기존 파일럿 드라이버의 `/fixtures/...` 라우트 빌더는 그대로 둡니다.
5. 브리지의 initial/getState 데이터는 픽스처 제어 데이터로 남아도 됩니다. 표시된 상태와 실제 초점은 실제 DOM에서 확인하고 실제 요청 횟수는 `pattern:request` 이벤트로 확인합니다. 브리지 패치로 DOM 성공을 위조하지 않습니다. 테스트가 요청을 해제하기 전에 UI 클릭/키보드 이벤트가 해당 요청을 먼저 시작해야 합니다.
6. 라우트를 해제할 때 구독을 해지하고, 로컬 드라이버와 기존 브리지를 폐기하고, 네이티브 리스너와 포털을 제거합니다. 대기 중 작업은 로컬이며 폐기 뒤에 완료될 수 없습니다. 리셋/취소도 대기 ID를 무효화합니다. 무시된 늦은 응답은 뷰를 바꿀 수 없습니다.

명령 봉투 타입은 `PatternFixtureCommand`입니다. 호스트는 대화형 개발을 위해 서비스 구성 밖에 눈에 띄게 레이블을 붙인 로컬 테스트 제어 영역을 렌더링할 수 있습니다. 이 영역은 같은 로컬 드라이버를 호출해야 하며 서비스 흐름이 되거나 프레젠테이션 스토리에 나타나면 안 됩니다. 샘플 모델은 결정적이며 동일 출처 엔드포인트를 포함해 실제 API나 인증 서비스가 필요하지 않습니다.

초기 URL과 popstate에서 호스트는 `createPatternState('search-results', caseId)` 위에서 검색 조건을 정규화한 뒤 `query`, `appliedQuery`, `category`, 순수 `searchResources({query, category, page})` 결과를 덮어쓸 수 있습니다. URL에 page가 없으면 케이스의 기본 page를 유지합니다. 명시적으로 지정한 page는 순수 매처가 범위로 보정합니다. 검색 요청/완료를 합성하지 말고 준비된 스냅샷을 `initialState`로 넘깁니다. 초기화에는 일치하는 패턴, 음이 아닌 안전 정수 요청 카운터, 허용된 확정 단계, null인 대기/실패 페이로드가 필요합니다. 검색 초기화는 추가로 적용된 조건에 대한 성공적이고 일관된 페이지당 3개 결과 조각이 필요합니다. 제공한 카운터/이력 데이터는 유지하되 새 이력은 만들지 않습니다. 시드는 앞으로의 완료만 계속 제어하며 일반 `reset`은 채택한 URL이 아니라 원래 모델 기본값으로 복원합니다. 이 타입 지정 초기화 가드는 신뢰할 수 없는 상태용 범용 파서가 아닙니다. URL 파싱/정규화는 네이티브 호스트의 몫입니다.

## 정확한 라우트와 시나리오 {#exact-routes-and-scenarios}

| 패턴 / 라우트 접두사 | 케이스 ID |
| --- | --- |
| `/examples/form-errors` | `error-summary-focus`, `retry-success`, `reset-cancels-pending` |
| `/examples/search-results` | `filter-resets-page`, `empty-results`, `retry-success`, `query-during-loading` |
| `/examples/consent-confirmation` | `required-refusal`, `optional-refusal-success`, `modal-focus-return`, `retry-in-dialog` |
| `/examples/service-layout` | `skip-main`, `navigate-current`, `narrow-navigation`, `footer-policy` |

`patternScenarios`는 모든 초기 동작 리터럴과 기대하는 네이티브 결과를 제공합니다. 케이스 ID의 범위는 패턴입니다. 검색 링크는 `case/query/category/page`를 유지하고 레이아웃 링크는 `case`를 유지하면서 `section`을 설정합니다. 소유자는 실제 동일 출처 URL, 초기 URL 정규화, 이력/뒤로가기·앞으로가기 동작을 구현합니다. 순수 모듈은 의도적으로 브라우저 location을 읽지 않습니다.

필수 초점 결과는 다음과 같습니다. 폼 제출이 잘못되면 첫 번째 잘못된 실제 필드로 이동합니다. 오류 요약 링크는 이름 붙은 실제 필드로 이동합니다. 즉시 필터는 카테고리 select의 초점을 유지하고 페이지를 1로 되돌립니다. 다이얼로그가 열리면 Modal 계약에 따라 컨테이너/첫 허용 요소로 이동합니다. 실제로 닫으면 사용 가능한 여는 요소와 저장된 페이지 위치로 돌아갑니다. 레이아웃 대상이 바뀌면 새 main 제목으로 이동합니다. 모바일 메뉴를 취소하면 여는 요소로 돌아갑니다. 실제 Modal 정리와 제어 거부 시맨틱을 유지합니다. 아직 사용할 수 있는 저장된 여는 요소를 초점 복원 요청이 덮어쓰면 안 됩니다.

모바일 레이어가 열려 있거나 포함하는 분기가 접혀 있을 때 현재 레이아웃 대상도 활성화로 취급합니다. 이때 레이어를 닫고 분기를 펼치고 기존 main 제목에 초점을 두되 라우트 변경은 내보내지 않습니다. 라우트 ID가 같다는 이유로 이 동작을 버리면 안 됩니다. 현재 분기가 이미 보이고 열린 레이어도 없으면 진짜 no-op을 유지하고 초점 효과를 내보내지 않습니다.

## 렌더러별 자연스러운 구성 {#natural-composition-in-each-renderer}

| 소유자 | 네이티브 구성과 수명 주기 | 추가 실제 근거 |
| --- | --- | --- |
| Solid 1 | JSX 컴포넌트/children, 네이티브 폼 이벤트, 모델 스냅샷용 signal/store, ref, `onCleanup`. 콜백은 시맨틱 세부 정보를 한 번만 소비합니다. 안정 Solid 어댑터/런타임만 사용합니다. | 네이티브 흐름 테스트, 실제 폼 리셋/초점, 포털 해제를 실행합니다. Solid 2 컴파일러/런타임은 import하지 않습니다. |
| React | React 컴포넌트/children, state/reducer 또는 외부 스토어 구독, 네이티브 폼 이벤트, 정리가 있는 ref와 effect. 라우트 수명당 드라이버를 하나 만들고 개발 모드 재마운트를 포함해 마운트된 인스턴스마다 폐기합니다. | 실제 input 초점과 FormData/리셋. effect 재마운트로 요청이 중복되지 않아야 합니다. |
| Vue | ref와 computed를 쓰는 SFC 템플릿/슬롯. 제어 값과 `valueChange` 콜백, 또는 어댑터가 지원하는 모델 바인딩 중 하나를 씁니다. 같은 동작에 모델 갱신과 시맨틱 value-change를 모두 처리해 두 번 dispatch하지 않습니다. 렌더링 후 초점에는 `nextTick`을, 언마운트 정리에는 정리 훅을 씁니다. | 네이티브 필드/오류 연결, 수락된 시맨틱 동작당 요청 정확히 1회. |
| Svelte | 네이티브 `.svelte` 컴포넌트/snippet, `$state`/파생 스냅샷, 시맨틱 `onValueChange` 콜백. 초점에는 `tick`을, 정리에는 effect/onDestroy를 씁니다. 실제 Svelte 패키지 export를 통해 컴파일합니다. | 실제 네이티브 폼/리셋, 독립 패키지 소비자 컴파일. |
| Lit | 실제 커스텀 엘리먼트를 네이티브 Lit 템플릿에 등록해 구성하고, 상태/배열에는 프로퍼티 바인딩을, `value-change` 같은 실제 composed 시맨틱 커스텀 이벤트를 씁니다. 초점 전에 `updateComplete`를 기다립니다. 수명 주기 정리를 사용합니다. | Shadow DOM 접근 가능한 이름, 실제 내부 컨트롤 초점, FACE FormData/리셋, 실제 제출자 동작. 호스트 `id`는 내부 input 대상의 증거가 아닙니다. siheom 어댑터를 만들어 내지 않습니다. |
| Qwik | 네이티브 `component$` 구성, 직렬화 가능한 상태/signal, Qwik 어댑터의 QRL 콜백(`onValueChange$` 등)을 쓰는 `$` 이벤트 핸들러. 변경 가능한 드라이버 클로저/구독자 집합은 직렬화 가능한 상태가 아닙니다. 순수 상태 reducer를 영속되는 진실로 유지하고, 그 클로저를 직렬화하지 않은 채 픽스처 전용 로컬 완료를 맞춥니다. | 프로덕션 SSR 직렬화/resume과 첫 lazy input/click/key를 이 구성으로 실행해야 합니다. 모든 컨트롤을 eager 하이드레이션하거나 Qwik을 다른 렌더러로 대체하면 안 됩니다. 선택한 Vite 7을 유지합니다. |
| Angular | 독립형 네이티브 컴포넌트/템플릿, inputs/outputs, signal. 실제 폼/CVA 컨트롤은 단일 진실 원천을 갖는 reactive forms로 통합합니다. ref/초점에는 일반 Angular 수명 주기/렌더 스케줄링을, 정리에는 destroy를 씁니다. | 실제 CVA 폼 리셋/값 동작, AOT/부분 APF 외부 소비자 컴파일, 공식 CLI/ng-packagr를 통한 SSR. 일반 Vite 렌더링만으로는 부족합니다. |

이는 렌더러 통합에 대한 기대일 뿐 전체 카탈로그 export가 이미 인수되었다는 주장이 아닙니다. 흐름에 필요한 컴포넌트가 아직 구현 중이면 네이티브 소유자는 그 의존성을 보고하고, 자신의 어댑터가 준비되면 진행합니다. 요약/main 제목 같은 일반 시맨틱 호스트 섹션은 허용됩니다. 다른 렌더러의 래퍼와 레이블만 바꾼 대체 컴포넌트는 허용되지 않습니다.

## 프레젠테이션 스토리와 완료 근거 {#presentation-stories-and-completion-evidence}

스토리는 복제된 `getPresentation(patternId, variant)` 스냅샷을 import해 로컬 args/inputs/slots로 같은 네이티브 프레젠테이션 컴포넌트에 전달합니다. 로컬 드라이버를 만들거나, settle을 호출하거나, API를 fetch하거나, 외부 글꼴/이미지를 불러오거나, 통합 시나리오를 `play`에 넣지 않습니다. 스냅샷 16개를 export하지만 스냅샷이 있다고 Storybook 지원이 실행된 것은 아닙니다. Solid 2는 upstream Storybook/siheom 지원을 주장하지 않습니다.

네이티브 통합 테스트는 별도의 동작 파일입니다. 지원되는 프레임워크에서는 해당하는 경우 선택한 upstream siheom 경로와 실제 브라우저 계약 테스트를 씁니다. Lit은 실제 네이티브 브라우저 테스트 경로를 씁니다. 안정 소유자는 각각 시나리오 15개 전부, 실패/재시도/로딩, 네이티브 키보드/초점/스크롤, 좁은 화면/200%/강제 색상 모드 표시, 외부 요청 0건, 정리를 실행해야 합니다. 또한 자체 빌드/타입 검사/스토리 검사와 필요한 SSR/resume/CVA/Shadow DOM 게이트를 실행합니다. 접근성 원시 결과와 실제 스크린샷을 검사합니다. 러너 종료 코드나 설명자 수는 커버리지 인수가 아닙니다. 공유 로직 테스트 스위트는 호스트 계산과 상태 전이만 입증합니다.

이 인계만으로 프레임워크 완료, 카탈로그 커버리지 승격, 소스/라이선스 확인, T11 완료가 자동으로 따르지 않습니다. 컨트롤러 소유의 독립 검토와 실제 7개 프레임워크 구성이 남아 있습니다.
