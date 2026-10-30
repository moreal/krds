# 릴리스 후보 준비

현재 상태는 **준비 중**이다. 이 문서와 workflow는 게시 승인을 뜻하지 않는다. T13 지원 행렬·SSR/resume, T14 실제 tarball·독립 소비, T16 최종 인수 명령이 모두 구현되고 같은 후보에서 통과하기 전에는 릴리스 준비 완료로 표시하지 않는다. npm scope·저장소 메타데이터 확인은 계정 소유권 인증과 별개이다.

Node `24.18.0`, workspace Corepack `0.36.0`, vendored Yarn `4.14.1`을 사용한다. `compatibility/toolchain.json`이 기준이며, 로컬에서는 `node tools/yarn.mjs exec node tools/ci/<script>.mjs`로 고정 Node를 실행한다. 설치는 `node tools/yarn.mjs install --immutable`이다. Yarn Berry와 `nodeLinker: pnpm`, 단일 `yarn.lock`을 유지한다.

## PR에서 실행하는 범위

`.github/workflows/ci.yml`은 PR의 정확한 head SHA를 depth 0으로 checkout하고, base SHA와 head SHA의 commit 존재·현재 checkout 일치를 확인한 뒤 `git merge-base`를 사용한다. 기준 SHA나 history가 없으면 `selection.json`에 이유를 적고 **전체 프로젝트**로 전환한다. 현재 checkout이 요청된 head와 다르면 다른 소스의 검증을 PR 성공으로 처리하지 않고 실패한다. 같은 SHA를 대상으로 계산한 Nx affected 프로젝트에 실제 존재하는 다음 target을 실행한다.

`lint`, `typecheck`, `test`, `build`, `contract`, `siheom`, `storybook-build`, `stories`

fixture에는 `contract`, 지원하는 6개 fixture에는 `siheom`, 각 Storybook에는 `storybook-build`와 `stories`가 필수다. 프로젝트·test·build의 0개 선택은 실패다. runner 자체도 빈 행동 suite를 실패시켜야 하며 probe는 카탈로그 증거를 대신하지 않는다. Lit와 Solid 2에는 지원되지 않는 upstream siheom target을 추가하지 않는다. 그 근거는 `compatibility/testing.json`과 CI 선택 보고서에 남고, native contract는 계속 실행한다.

`tools/ci/check-affected.mjs`는 실제 Nx 선택을 토큰, 공통 계약, React 소스, lockfile, 공유 순수 상태 fixture, fixture manifest, story manifest, story coverage의 8가지 변경으로 검사한다. 현재 catalog manifest 변경은 보수적으로 전체 프로젝트를 선택한다. lockfile 변경도 전체 범위다. 각 case의 예상 프로젝트와 실제 target 목록은 `test-results/ci/affected-regressions.json`에 기록한다.

캐시는 원격 서비스 없이 검사한다. `verify-cache.mjs`는 선택된 실제 `build`를 빈 임시 로컬 캐시로 실행하고 모든 dist 파일의 경로·SHA-256·권한을 기록한다. dist를 삭제한 뒤 같은 build의 명시적 local-cache hit와 동일 산출물 복원을 요구한다. 이 명령은 독점하는 CI checkout에서만 실행한다. 공동 로컬 workspace에서는 `cache-snapshot.mjs`를 사용한다. 소스 사본과 설치된 의존성 링크로 토큰의 실제 build/복원을 검사하며 독립 소비 검증으로 간주하지 않는다.

## 패키지별 버전 계획

Nx Release만 버전·내부 의존 버전·changelog를 작성한다. Changesets와 별도 Yarn version 흐름은 추가하지 않는다. 13개 공개 프로젝트는 `npm-public` 태그로 식별하고, `nx.json`은 12개 stable 패키지와 `krds-solid-next` 하나의 `solid2-preview` 그룹을 독립 버전으로 분리한다. 실제 현재 버전은 각 `package.json`에서 읽는다. 그룹과 공개 태그의 정확한 일치, 내부 preview 의존 금지, Solid 2 runtime/renderer/compiler의 고정 RC는 `check-release-config.mjs`로 검사한다.

`.nx/cache/`와 `.nx/workspace-data/`는 제외하고 `.nx/version-plans/`는 Git에 포함한다. 설치된 Nx는 이 디렉터리의 모든 파일을 계획으로 읽으므로, 실제 계획 생성 뒤에는 빈 `.gitkeep`을 두지 않는다. 구현 변경의 실제 package별 bump와 설명은 Nx로 생성한다.

현재 검토할 초기 후보 의도는 stable 12개 각각 `0.1.0`, 별도 `solid-next`는 `0.1.0-preview.0`이다. `.nx/version-plans/version-plan-1793350528196.md`의 stable `minor` 12행과 `version-plan-1793350528926.md`의 preview `preminor` 1행은 Nx가 실제로 생성한 별도 계획이다. `tools/ci/initial-candidate.json`은 목표와 명시적 preview preid를 기록하며 공개 manifest 버전을 쓰지 않는다. 적용 전 공개 manifest는 기존 bootstrap 버전을 유지한다.

Nx 24의 기본 `adjustSemverBumpsForZeroMajorVersion: true`는 `0.x`에서 `minor`를 `patch`, `preminor`를 `prepatch`로 줄인다. 이 초기 후보의 명시적인 `0.1.0` 의도를 유지하도록 `release.version.adjustSemverBumpsForZeroMajorVersion: false`를 사용한다. preview의 `preminor`에는 `--preid=preview`가 필수다. 같은 옵션을 stable `minor`에 전달해도 stable 버전은 `0.1.0`이며, preview를 stable로 만들지 않는다. 아래는 이후 개별 변경 계획 생성의 예시다.

```sh
node tools/yarn.mjs nx release plan patch --projects=krds-react --onlyTouched=false --message="Describe the reviewed React package change."
node tools/yarn.mjs nx release plan prerelease --projects=krds-solid-next --onlyTouched=false --message="Describe the reviewed exact Solid 2 preview change."
```

Stable 버전을 preview에 일괄 적용하거나 RC renderer/compiler를 새 버전으로 재선택하지 않는다. bootstrap `0.0.0-next.0`과 초기 후보 `0.1.0-preview.0`의 prerelease 식별자는 npm dist-tag와 별개다. 준비 workflow는 npm dist-tag를 변경하지 않는다. stable은 정식 semver, preview는 독립된 `preview` prerelease를 유지하며, 실제 packed manifest의 버전·내부 의존 범위·runtime/compiler는 T14에서 다시 검사한다. `check-release-config.mjs --expect-initial-candidate`는 적용 뒤 12개 stable `0.1.0`과 preview `0.1.0-preview.0`의 정확한 일치를 요구한다.

PR은 정확한 base/head로 `nx release plan:check`를 실행한다. 전체 fallback과 수동 준비에서는 공개 13개 package manifest를 모두 touched 입력으로 사용한다. 계획이 없거나 필요한 패키지를 덮지 못하면 실패한다. 첫 릴리스 후보 준비는 기존 tag를 전제하지 않도록 `--first-release`를 사용한다. 이후 실제 첫 릴리스가 확정되면 이 옵션의 제거도 별도 검토한다.

일반 `ci.yml`의 version plan 검사는 `pull_request` 이벤트에서만 실행한다. Nx가 계획을 정상적으로 소비한 reviewed versioned HEAD의 main push·수동 CI는 실제 validation target과 release configuration 검사를 계속 실행하며, 빈 계획 파일이나 버전 추측으로 결과를 조작하지 않는다. 별도 `prepare-versions` 단계는 이벤트와 관계없이 엄격한 계획 검사를 실행하고, `check-plans.mjs` 자체의 빈 계획 실패 정책은 유지한다.

## 게시와 분리된 후보 workflow

`.github/workflows/release-prepare.yml`은 수동 실행의 `phase`를 명시적으로 선택한다. 기본값 `prepare-versions`는 bootstrap 소스의 계획과 version/changelog **dry-run만** 검사하고 preview 로그를 업로드한다. 이 단계는 후보 archive나 T16 인수를 만들지 않는다. `verify-candidate`는 이미 버전과 changelog가 검토·커밋된 HEAD를 검사하며, 소비된 계획을 다시 검사하거나 Nx version을 재적용하지 않는다.

두 단계 모두 `contents: read`, checkout credential 비보존으로 동작한다. workflow 안에는 실제 Nx apply 또는 Git commit·stage·tag·push가 없다. 로컬 `prepare-release.mjs`만 별도 승인된 적용을 위해 `nx release --preid=preview --skip-publish --first-release`를 제공한다. 원격 changelog release 생성도 꺼져 있다. publish, push, tag, GitHub release 명령과 registry credential은 없으며 `prepublishOnly` 차단 장치도 유지한다.

실제 초기 version 적용은 root가 승인한 source checkpoint commit 뒤 T01 담당자가 직렬로 수행한다. helper는 시작 버전의 정확한 일치를 요구해 초기 계획의 재적용을 막고, 적용 앞에서 실제 source commit과 지정된 `KRDS_RELEASE_SOURCE_SHA`의 일치를 확인한다. 목표 13개 버전과 실제 lock/changelog를 검토한 뒤 root가 metadata 후속 commit을 만든다. 최종 검증은 이 **새 HEAD**에서 시작한다. workflow가 Git 이력을 만들거나 수정된 소스를 이전 HEAD의 후보로 간주하지 않는다.

`--first-release`도 실제 HEAD를 만들거나 이력을 대체하지 않는다. 현재 granular `nx release version`의 실제 dry-run은 제안한 두 채널의 정확한 버전을 도출하고 종료 0이었으나, version과 changelog를 함께 준비한 실제 helper dry-run은 changelog 단계의 `Unknown revision: HEAD`로 종료 1이었다. 공개 manifest와 lockfile을 적용한 결과가 아니다. 실제 Git source candidate가 준비되기 전에는 이 실패를 보존하고 commit 이력을 꾸미지 않는다.

단계별 순서는 다음과 같다.

1. `prepare-versions`에서 고정 도구·immutable 설치, 정확한 bootstrap 버전과 실제 계획을 확인한 뒤 Nx version/changelog dry-run을 실행한다. 실패 종료 코드는 pipefail을 통해 유지하고 로그를 보존한다. preview 성공은 릴리스 인수가 아니다.
2. 검토한 source checkpoint에서 T01이 로컬 Nx 적용을 수행하고 root가 version/lock/changelog 및 필요한 source metadata를 검토·커밋한다. 이 별도 단계는 source preview 또는 최종 CI의 성공으로 숨겨 수행하지 않는다.
3. `verify-candidate`에서 같은 새 HEAD와 명시된 `KRDS_RELEASE_SOURCE_SHA`의 일치, source 변경·미추적 파일 부재, 공개 13개 목표 버전을 확인한다. T16의 기존 generated evidence 예외만 허용하고 source·version·lock·changelog·LICENSE/NOTICE/provenance·docs/generated/public은 예외로 만들지 않는다. 이미 소비된 version plan과 source-only Nx 준비 명령은 실행하지 않는다. 커밋된 lockfile로 immutable 설치한다.
4. 전체 build·typecheck·test·lint, 필수 6개 siheom, 전체 coverage를 실행한다. 정식 7개 renderer 각각에 Chromium·Firefox·WebKit을 명시하고, contract 기본 pilot 10개와 `--catalog` 315개를 각각 실행한다. story도 기본 canonical 6개와 `--catalog` staged 344개를 각각 실행해 renderer·browser별 350개 상태를 요구한다. 작성된 catalog 수는 실제 행동 검증 성공을 뜻하지 않는다. 정확한 Solid 2 preview의 native contract·전용 Storybook test는 별도 행으로 집계하고, 공유 stable `--catalog`를 preview에 적용하지 않는다.
5. 전체 지원 runtime/compiler 행렬, SSR/hydration·Qwik resume, 고지 재생성·라이선스를 실행한다. 고지 생성은 검토된 HEAD의 source에 대해 멱등이어야 한다. LICENSE/NOTICE/provenance나 docs/generated/public이 달라지면 후보를 차단하고 별도 검토·metadata commit 후 다시 시작한다. `node tools/yarn.mjs pack:all --build`로 공개 13개 패키지를 내부 의존 순서대로 실제 빌드하여 source/output attestation을 생성한 뒤 tarball을 검사하고 독립 소비를 실행한다. build attestation이 없는 기존 dist를 패키징 증거로 인정하지 않는다.
6. 검토된 versioned HEAD, 실제 tarball manifest와 근거를 후보 archive로 보존한다. 마지막 별도 job은 같은 source SHA·archive·lockfile·artifact manifest 해시를 확인해 복원하고 `verify:release`를 필수 실행한다. `verify-candidate`를 선택했다면 앞선 job이 실패하거나 skip되어도 마지막 job은 실행 후 실패하며, 이를 성공하는 skip으로 대체하지 않는다. source preview 단계는 이 인수 job을 요청하지 않는다.

로컬 42-command 실행 recipe는 version 준비를 제외한 `verify-candidate` 단계의 진단 실행이다. T16의 실제 CI receipt는 진짜 GitHub Actions 환경에서만 `provider=github-actions`, 실제 `runId`, `attempt`, `workflow`, `sourceSha`를 기록하고 전체 receipt에 같은 값을 요구한다. 로컬 진단을 hosted 실행으로 표시하려고 GitHub 환경 변수를 꾸미지 않는다. source-before/outputs-after, source HEAD·lock·전체 입력·최종 산출물 해시와 실제 로그가 모두 필요하며, 로컬 capture만으로 hosted CI 인수를 주장하지 않는다.

| 필수 root 명령 | 구현 파일 | 소유 단계 |
| --- | --- | --- |
| `verify:compatibility` | `tests/compatibility/verify.mjs` | T13 지원 버전·브라우저 행렬 |
| `test:ssr` | `tools/run-ssr-tests.mjs --all-stable` | T13 native SSR·hydration·resume |
| `pack:all` | `tools/pack-all.mjs` | T14 |
| `inspect:tarballs` | `tools/inspect-tarballs.mjs` | T14 |
| `test:consumers` | `tools/test-consumers.mjs` | T14 |
| `verify:release` | `tools/verify-release.mjs` | T16 최종 필수 gate |

`tools/ci/required-gates.mjs`는 script나 파일이 없으면 준비 중으로 보고하고 nonzero로 종료한다. 자동 skip이나 성공하는 placeholder를 사용하지 않는다. 이 체크의 등록 성공도 실제 gate 통과를 뜻하지 않는다.

마지막 verifier의 입력은 version 적용 뒤 같은 candidate의 `artifacts/manifest.json`, `test-results/ci/` 및 T13/T14 보고서, `docs/releases/<version>/`이다. workflow는 `KRDS_RELEASE_SOURCE_SHA`, `KRDS_RELEASE_CANDIDATE_MANIFEST`, `KRDS_RELEASE_EVIDENCE_DIRECTORY`, `KRDS_RELEASE_CHANNELS=stable,solid2-preview`를 제공한다. T16은 M1/M2/M3의 실제 근거와 후보 해시를 대조하고 모든 배포 요건이 충족되지 않으면 nonzero여야 한다.

현재 브랜치에는 commit이 없고 exact active model identity hook도 없으므로 이 작업에서는 commit을 만들지 않는다. workflow의 dry-run과 필수 검사를 실제로 실행해 얻은 근거만 보고하고, 버전 계획 또는 T13/T14/T16의 미완성 부분을 전체 릴리스 성공으로 표시하지 않는다. 외부 게시·push·tag는 별도 권한과 후보 검토가 필요하다.

설정 기준은 [Nx 독립 릴리스](https://nx.dev/docs/guides/nx-release/release-projects-independently), [Nx version plans](https://nx.dev/docs/guides/nx-release/file-based-versioning-version-plans), 설치된 Nx `24.0.2`의 schema·CLI다. schema가 허용하더라도 실제 CLI가 거부하는 top-level `projects`와 `groups`의 중복, orchestrator와 granular changelog Git 설정의 중복은 사용하지 않는다.
