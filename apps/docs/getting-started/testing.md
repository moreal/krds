# 스토리와 동작 테스트 {#stories-and-behavior-tests}

세 가지 테스트 화면은 서로 다른 질문에 답합니다. 근거와 소스 파일을 분리해 둡니다.

| 테스트 화면 | 목적 | 소스와 명령 |
| --- | --- | --- |
| 네이티브 Storybook | 네이티브 상태, args, 입력, 콘텐츠, 시각·접근성 결과 검사 | `apps/storybook-<framework>/`; `node tools/yarn.mjs test:stories --framework react`는 네이티브 프로필 예시 |
| 네이티브 siheom | 지원되는 네이티브 어댑터로 관찰 가능한 컴포넌트 동작 검증 | 네이티브 픽스처의 `tests/siheom/` 파일; `node tools/yarn.mjs test:siheom --framework react` |
| Playwright 프로덕션 앱 | 빌드된 소비자, 초점, 폼 제출, 네트워크 정책, 프레임워크별 경계 검증 | 네이티브 픽스처와 `tools/run-contract-tests.mjs`; `node tools/yarn.mjs test:contract --framework react` |

프레임워크의 실제 manifest/러너가 해당 명령을 지원할 때만 프레임워크를 바꿔 씁니다. Lit과 Solid 2에는 **지원되는 upstream siheom 어댑터가 없습니다**. 두 프레임워크의 네이티브 테스트 경로는 따로 선택해 명시합니다. 피어를 넓히거나 다른 렌더러를 쓴다고 지원이 생기지 않습니다.

## 스토리는 결정적으로 {#keep-stories-deterministic}

스토리 상태는 로컬 args/inputs/slots/snippets와 순수 픽스처에서 만듭니다. API, 인증, CDN, 외부 글꼴, 이미지로 준비하지 않습니다. 공유 픽스처는 시맨틱 상태와 관찰값을 담을 수 있으나 다른 어댑터로 렌더링하지 않습니다. 전체 동작 여정은 Storybook `play`에 넣지 않고 스토리 소스와 분리합니다.

각 컴포넌트 페이지는 명세, 스토리 의무, 실제 네이티브 프로필을 연결합니다. 필수 manifest의 스토리 ID는 의무일 뿐 스토리가 실행되었다는 증거가 아닙니다. probe는 인프라 근거일 뿐이며 카탈로그 커버리지에는 0을 기여합니다. 비어 있는 동작 스위트는 실패해야 합니다.

## 원시 결과 읽기 {#read-raw-results}

실제 assertion 수, axe 원시 위반, 브라우저 오류, 요청 정책 결과를 확인합니다. 러너가 0으로 종료했다고 해서 axe 위반이 0이라는 뜻은 아닙니다. 컴파일 성공은 키보드 동작, 스크린 리더 출력, 터치 동작, 강제 색상 모드, 확대, 정리를 입증하지 않습니다.

Qwik의 Storybook 클라이언트 렌더링은 실제 프로덕션 SSR/resume 및 첫 lazy 이벤트와 별개입니다. Angular 스토리는 부분 APF 및 CVA 폼/리셋 소비와 별개입니다. Lit의 light DOM 외관은 실제 Shadow DOM 이름 및 폼 연관과 별개입니다. Solid 2는 계속 분리된 미리보기입니다.

이 문서 사이트에는 자체 생성 데이터/링크 테스트와 브라우저 검사가 있습니다. 이는 문서 UI와 근거 링크를 검증할 뿐 네이티브 컴포넌트 커버리지를 올리지 않습니다.

## 병렬 네이티브 CI {#parallel-native-ci}

`select-and-check`는 영향 범위를 한 번 결정하고 소스 SHA에 묶인 manifest를 게시합니다. 이후 안정 프레임워크 워커 7개, 공유 검사, 문서, Solid 2 미리보기가 새 체크아웃에서 독립적으로 실행됩니다. `native-ci-result`는 필수 집계입니다. 선택된 모든 대상과 필요한 캐시 복원이 미리보기를 포함해 통과해야 합니다. 비어 있는 레인은 `not-selected`로 기록합니다. 누락, 건너뜀, 취소된 근거는 집계를 실패시킵니다.

각 워커는 대상 원장, 스트리밍 로그, 캐시 보고서, 동작 결과가 담긴 14일 보관 `native-worker-<worker>-<run>-<attempt>` 아티팩트를 올립니다. 선택 및 최종 아티팩트에는 manifest와 안정/미리보기 요약이 따로 남습니다. 마지막으로 시작된 테스트는 담당 워커의 로그에서 확인합니다. Lit은 타임스탬프가 있는 파일/하위 테스트 진행 기록과 10분의 격리 테스트 제한을 사용합니다. 시간 초과가 나면 프로세스 진단과 정리 결과를 남기며 스위트를 성공으로 표시하지 않습니다.

CI는 고정된 정확한 Playwright 빌드를 `$RUNNER_TEMP/krds-playwright-1.64.1`에 설치하고 이 경로를 모든 자식 프로세스에 전달합니다. 로컬에서 실행할 때는 `PLAYWRIGHT_BROWSERS_PATH`를 설치된 고정 캐시로 명시하거나 먼저 이식 가능한 기본 위치에 설치합니다. 작업 간에는 Yarn 다운로드 캐시만 공유합니다. 선행 조건과 캐시 복원은 각 워커의 체크아웃 안에서 실행됩니다.
