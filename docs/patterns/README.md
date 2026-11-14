# 로컬 서비스 패턴 예시 {#local-service-pattern-examples}

패턴 예시는 컴포넌트 여러 개를 실제 서비스 화면의 흐름으로 엮는 방법을 보여 줍니다. 예시는 네 가지입니다.

- [입력 폼/오류](../../examples/pattern-specs/form-errors.md)
- [검색/필터/목록/페이지네이션](../../examples/pattern-specs/search-results.md)
- [동의/확인](../../examples/pattern-specs/consent-confirmation.md)
- [서비스 레이아웃](../../examples/pattern-specs/service-layout.md)

예시의 내용은 모두 가상이며 정부 서비스가 아닙니다.

네 예시는 상태 모델과 예시 데이터를 함께 씁니다. 이 공통 코드는 [`test-contracts/patterns`](../../packages/test-contracts/src/patterns/index.ts)에 있습니다. 화면 상태 스냅샷 16개와 시나리오 15개를 제공하고 렌더링 코드는 담지 않습니다. 화면은 각 프레임워크가 자기 컴포넌트로 만듭니다.

더 읽을 문서는 두 가지입니다.

- [네이티브 인계](native-handoff.md): 프레임워크의 예제 앱에서 공통 모델을 연결하는 방법
- [출처 매핑](sources.md): 예시의 각 부분이 공식 KRDS 가이드를 따른 것인지, 이 프로젝트가 정한 것인지

스토리는 주입한 화면 상태만 보여 줍니다. 요청과 재시도는 예제 앱이 처리합니다. 순수 로직 테스트와 브라우저에서 확인하는 초점, 접근성, 레이아웃, SSR/resume, 폼 참여 테스트도 따로 둡니다.

모든 데이터는 로컬에서 메모리로만 다룹니다. 실제 인증, 개인 기록, 기관 업무, API 요청, 외부 자산, 텔레메트리는 없습니다. 실제 서비스에 필요한 서버 검증과 보안은 이 예시에서 다루지 않습니다.
