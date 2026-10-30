# 실행 진행 상태

현재 브랜치는 `implement/krds-native`이며 커밋은 없다. T00–T05 기반에 이어 T06의 실제 native Solid 1 파일럿 6개와 독립 통합 리뷰를 마쳤다. 다음 순서는 요청 scope의 T01 원자적 전환과 T07 이후의 다른 네이티브 파일럿·전체 카탈로그 구현이다. 전체 54개 웹 카탈로그 및 M0·M1·M2·M3 전체 인수 완료를 뜻하지 않는다.

| 작업 | 상태 | 실행 근거와 범위 |
| --- | --- | --- |
| T00 기준선·버전·신원 | done | [보고서](evidence/T00/task-T00-report.md), [리뷰](evidence/T00/task-T00-review.md). 55개 canonical/54개 웹, 원본·published pin·engine/peer 검증. |
| T01 Yarn·Nx | done | [보고서](evidence/T01/task-T01-report.md), [최종 리뷰](evidence/T01/task-T01-rereview1.md). immutable 설치, 32-project graph, 14개 패키지 build/typecheck, 116-task 검사. CSS URL 경계 누락 수정. |
| T02 계약·카탈로그 | done | [보고서](evidence/T02/task-T02-report.md), [최종 리뷰](evidence/T02/task-T02-rereview1.md). 날짜·카탈로그 테스트71개, clean build/typecheck, 55개 원문 해시. Modal 사양 두 원문 불일치 수정. T02 당시 coverage는 모두 planned였으며, 현재 T06 Solid 6개는 implemented이다. |
| T03 출처·자산·고지 | done | [보고서](evidence/T03/task-T03-report.md), [최종 리뷰](evidence/T03/task-T03-rereview1.md). 고지 테스트20개, 출처1599개, 실제 tarball13개, 배포 자산11개 검증. 미확정 권리는 배포 제외. |
| T04 토큰·스타일 | done | [보고서](evidence/T04/task-T04-report.md), [최종 리뷰](evidence/T04/task-T04-rereview1.md). 원본 토큰768개, token10/style8 테스트, build/typecheck/export·53개 가공 해시 검증. Calendar 초점 outline 충돌 수정. 렌더러 시각 검토는 후속. |
| T05 공통 runner·네이티브 테스트 기반 | done | [종합 근거](evidence/T05/task-T05-report.md). 독립 리뷰8개 native +core/affected 통과. 공통13/workspace12 테스트, 실제8fixture/7Storybook/6siheom 기반 검증. Canonical UI는0 coverage. |
| T06 Solid 파일럿 | done | [근거 색인](evidence/T06/INDEX.md), [최종 보고서](evidence/T06/task-T06-lead-report.md), [통합 리뷰](evidence/T06/task-T06-lead-review.md). 실제 6개 native 구현, siheom77/77·계약10/10·canonical6/6·전체 native story38/38, PNG41+초점2개 검토. 6개는 implemented이며 verified/release 완료는 아니다. |
| T07–T16 | pending / next | 다음 다른 native 파일럿(T07 React·Svelte·Vue 등), 전체54개 웹 카탈로그의7개 구현, 정확한 Solid2RC preview, 예제·문서·SSR·브라우저·접근성·독립 소비·최종 인수. |
| T17 공개 게시 | unauthorized / not executed | 게시 권한이 없다. 구체적 후보의 T16 결과 이후에만 별도 검토 대상이다. |

T02/T03에서 다시 실행한 넓은 root suite는 Angular 앱 빌드가 sandbox 안에서 시작 단계에 종료되어 실패했다. T01에서는 동일 bounded-worker 명령을 승인된 외부 실행으로 통과했다. 각 작업의 범위 검증 결과와 이 환경 실패를 구분해 보존했다.

사용자가 독립 코드 권리자 `Lee Dogeon <dev.moreal@gmail.com>`, 저장소 메타데이터 URL `https://github.com/moreal/krds`, 요청 scope `@unofficial-krds`를 확인했고 독립 MIT 허가문은 `LICENSES/MIT.txt`에 완성되었다. 현재 실제 로컬 scope는 아직 `@krds-native`이며 T01의 manifest·lock·출처 원자적 전환이 다음이다. 이 메타데이터 확인은 npm/repository 계정 소유권 인증이나 게시 권한이 아니다. 원래 KRDS·폰트·제삼자 권리는 별도로 유지하며 release 후보 검사와 T16 gate, 필요한 수동 접근성·전체 브라우저·SSR/독립 소비 검증은 남아 있다.

Firefox1555는 profile 시작 단계에서 실패한다. 두 임시 경로의 실제 실패를 보존했으며 T13의 전체 브라우저 행렬 검증에서 해결 또는 명확한 차단 판정이 필요하다.
