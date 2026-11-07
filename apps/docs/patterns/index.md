# 로컬 서비스 패턴 예시 {#local-service-pattern-examples}

네 가지 예시는 네이티브 컴포넌트를 실제 호스트 흐름 상태와 결합합니다. [입력 폼/오류](/sources/examples/pattern-specs/form-errors.md.txt), [검색/필터/목록/페이지네이션](/sources/examples/pattern-specs/search-results.md.txt), [동의/확인](/sources/examples/pattern-specs/consent-confirmation.md.txt), [서비스 레이아웃](/sources/examples/pattern-specs/service-layout.md.txt)입니다. 예시 콘텐츠는 이 저장소를 독립 프로젝트로 밝히며 정부 서비스라고 주장하지 않습니다.

공유 데이터/모델, 프레젠테이션 스냅샷 16개, 구체 시나리오 설명자 15개는 비공개 [`test-contracts/patterns`](/sources/packages/test-contracts/src/patterns/index.ts.txt) 소스에 구현되어 있습니다. 렌더러는 제공하지 않습니다. 이 기반 인계 시점에는 안정 네이티브 구성 7개와 그 브라우저/프레임워크 테스트가 아직 필요합니다. 이 문서에는 실행된 프레임워크 커버리지나 T11 완료 주장이 없습니다.

프레임워크의 픽스처와 프레젠테이션 컴포넌트는 [네이티브 인계](/patterns/native-handoff)를 따라 구현하고, 공식 가이드와 독립 샘플 선택은 [출처 매핑](/patterns/sources)으로 구분합니다. 순수 로직은 네이티브 초점, 접근성, 레이아웃, SSR/resume, 폼 참여, 시각 검사와 따로 테스트합니다. 스토리는 주입된 프레젠테이션 상태만 사용하며 요청과 재시도는 픽스처 동작이 소유합니다.

모든 데이터와 완료 기록은 로컬, 가상, 메모리 전용입니다. 실제 인증 흐름, 개인 기록, 기관 업무, API 요청, 외부 자산, 텔레메트리 요구사항은 없습니다. 프로덕션 서버의 검증과 보안은 이 샘플 흐름의 범위 밖입니다.


> 저장소 참고: 보존된 공식 원본 HTML은 체크아웃의 근거 트리에만 둡니다. 사이트 콘텐츠로 배포하지 않습니다. 위 공식 링크가 1차 출처입니다. 고정된 출처 기록에 수집 시각과 해시가 남아 있습니다.
