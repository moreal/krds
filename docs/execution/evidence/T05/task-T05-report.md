# T05 완료 근거

공통 runner와 8개 native fixture, 7개 native Storybook, 6개 published siheom 조합의 **테스트 기반**을 구현·검증하고 독립 리뷰를 마쳤다. 실제 KRDS 파일럿은 아직 없으며 canonical coverage는 0이다. 아래 probe 성공을 컴포넌트 구현 완료로 사용하지 않는다.

| 구현 | production fixture probe | native Storybook | siheom smoke·focus | 독립 검토 |
| --- | --- | --- | --- | --- |
| react | 1 PASS | 3 PASS | 2 PASS | [리뷰](task-T05-react-review.md) |
| solid | 1 PASS | 3 PASS | 2 PASS | [리뷰](task-T05-solid-review.md) |
| svelte | 1 PASS | 3 PASS | 2 PASS | [리뷰](task-T05-svelte-review.md) |
| vue | 1 PASS | 3 PASS | 2 PASS | [리뷰](task-T05-vue-review.md) |
| lit | 1 PASS | 3 PASS | upstream 미지원; native 대안 | [리뷰](task-T05-lit-review.md) |
| qwik | 1 PASS | 3 PASS | 2 PASS | [리뷰](task-T05-qwik-review.md) |
| angular | 1 PASS | 3 PASS | 3 PASS | [리뷰](task-T05-angular-review.md) |
| solid-next | 1 PASS | 미검증 preview 후보 | upstream 미지원; native 대안 | [리뷰](task-T05-solid-next-review.md) |

공통 테스트 `node tools/yarn.mjs test:harness`는 13/13, 실제 private workspace의 `test`는 12/12 통과했다. 실제 native disabled pointer 입력, 두 시간대의 날짜, 정확한 제거된 trigger 대체 초점, workspace cwd를 회귀 검증했다. [공통 보고서](task-T05-core-report.md)와 [최종 리뷰](task-T05-core-rereview1.md)에 현재 source hash와 contract/story/siheom 재실행 경로가 있다. 이전 native별 기록은 이전 runner bytes의 실제 실행 근거로 구분한다.

실제 Nx `--files` task graph에서 spec 입력 누락을 발견해 `sharedGlobals`에 실제 spec 경로를 추가했다. spec/common 변경은 8 contract·6 siheom·8 Storybook target(정식7개 포함)을 선택하며 Solid 변경은 해당 fixture·Storybook에 한정된다. [affected 검증](task-T05-affected-report.md), [독립 리뷰](task-T05-affected-review.md). 이 보수적 spec glob은 32개 전체 project를 affected로 만든다.

선택 Node24.18.0/Yarn4.14.1, Playwright1.64.1의 Chromium1248·Firefox1555·WebKit2370을 준비했다. Firefox는 두 임시 경로 모두 profile 시작 단계에서 실패하여 T13 검증 차단으로 보존했다. Chromium의 native 기반과 Solid2 WebKit probe는 실행됐으며 Firefox 통과를 주장하지 않는다.

[설치·peer integration](task-T05-integration-report.md)은 기존 runtime/compiler 버전을 유지한 exact optional peer 전달과 immutable 설치를 기록한다. 최종 lock SHA는 `136bebc1c213d0bc274b905ee291fa096beefa4dbbaece6ecf915689adadf4f4`; 1,915개 resolution 및 정규화 npm1,878개 집합은 불변이다. [출처 inventory 갱신](task-T05-license-integration-report.md) 이후 local 권리 검증1599개/notice13개가 통과했고, 신원·독립 허가문 release 차단은 그대로다.

9개 canonical fixture, 필요한 native siheom 및 5개 canonical Storybook 상태의 미구현 RED를 건강한 bridge 확인 후 보존했다. SSR/resume, Angular APF/forms, 실제 KRDS UI/전체 접근성·시각 검증은 후속 작업이다. 커밋·게시·push·tag는 실행하지 않았다.
