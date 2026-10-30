# Execution decisions

T00 baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Original PLAN.md and task briefs remain unchanged.

| Decision | Evidence and consequence |
| --- | --- |
| Freeze 55 detail identities, 54 web-applicable | Official summary says 37 but has 55 distinct detail links. `upstream/krds/manifest.json` records every page hash, name, classification and scope. Detail link destinations are canonical identifiers; common root `og:url` is not. |
| Separate live web guidance from HTML Kit1.1.0 | Official release1.1.0/tag and main point to `d6bb184c823e4757f05807ea4646a23e3133b6e6`. Resource bytes match Git blobs; live guide pages have their own snapshot hashes and are not asserted to match the tag. |
| Retain mobile web controls | RangeSlider through TabBar remain web targets despite the mobile category. SplashScreen alone is app/OS-owned per its detail: no separate web widget; loading feedback remains Spinner and no artificial launch delay. |
| Use exact installed Node24.18.0 | Official release index marks Krypton LTS; direct installed binary reports v24.18.0. Angular/Corepack require24.15+; ambient shell Node26.13.0 is not the pinned environment. Latest observed24.22.2 is recorded without changing this choice. |
| Yarn Berry4.14.1 + nodeLinker pnpm; Nx24.0.2 | Prior selected published Yarn version retained; latest lookup4.18.1 is informational. Only yarn.lock is official. No pnpm install or pnpm workspace files. |
| Isolate compiler/build generations | Qwik1.20.3 requires Vite<8 so uses7.3.1; Solid2 compiler plugin requires Vite8. Angular22 compiler/ng-packagr require TS>=6<6.1, selected6.0.2. Common Vite8.3.5 builds remain workspace-local. |
| Use published adapter versions | Ark React/Solid/Vue5.40.0, Svelte5.25.0. siheom core/React0.4.1; other native adapters0.3.2. Siheom requires Vitest^4.1.10, provider4.1.10 requires exactly that Vitest. Latest Vitest5/TS7 are rejected. |
| Stable targets and preview are declarations of intent | Seven native stable targets, separate Solid2rc.19 runtime/renderer/compiler preview. None is marked implemented or browser-verified by a metadata review. |
| Keep all seven Storybook and six siheom requirements | Every candidate has exact published manifest and peer/dependency data. Build/browser statuses remain pending. Lit has no published siheom adapter; Solid2 is excluded by Solid1 siheom peers. Alternatives are native fixtures + Playwright, never a framework wrapper. |
| Published Qwik manifest outweighs stale README setup version | Candidate0.6.1 uses Storybook builder^10.3.3 despite README mentioning7. Pin core10.6.5 and validate execution in T05. Storybook client render cannot verify resume. |
| Preserve rights uncertainty | English policy describes KOGL Type1; Korean metadata qualifies free use by ownership of all rights. npm/Git package metadata says ISC while README defers to KRDS terms. Fonts identified without independent rights clearance. No assumption that original code MIT covers assets. |
| Local identity only | @krds-native working scope, code copyright holder and release repository authority unconfirmed. Configured origin is observed evidence only. Local implementation proceeds; publishing remains blocked. |
| Leave changes uncommitted | No exact active model identity hook was provided. Commit-trailer rule prevents inferring the required Assisted-by model ID. |

See `compatibility/toolchain.json` for every selected published package and source path, `frameworks.json` for native build/consumer contracts, and `testing.json` for mandatory pending combinations. T01 owns installation and lock generation; T05 owns actual test integration; Qwik resume and Angular APF/forms need independent production checks.

## T01–T05 검증 후 결정

- Semantic kebab-case component ID와 공식 canonicalId/URL을 함께 보존한다(55개/웹54개).
- PostCSS8.5.32를 styles의 직접 build 의존으로 고정했다. 기존 resolution 집합을 유지하고 의도적 설치·immutable·inventory 지문 갱신을 구분했다.
- KRDS 원본을 localPaths 첫 항목에 두고 가공 결과의 실제 경로·해시·배포 대상·고지를 기록한다. 생성 dist가 있는 build 이후 global 라이선스 검증을 실행한다.
- T05 infrastructure probe와 canonical KRDS coverage는 분리한다. 8fixture/7Storybook/6siheom probe 성공은 UI 구현 완료가 아니다.
- Native renderer/toolchain을 유지한 exact optional peer 전달로 pnpm linker의 누락 연결을 수정했다. 원본 runtime/compiler 버전을 강제로 합치지 않았다.
- 실제 Nx affected 검사에서 target input override 누락을 발견했다. root sharedGlobals의 실제 spec glob으로 모든 필수 native 검증을 선택한다. 초기에는 spec 변경 시32개 project가 affected가 되는 비용을 허용한다.
- Firefox profile 시작 실패는 설치 성공과 구분해 T13 blocker로 기록한다. 실제 native/SSR/IME·수동 접근성 검증을 대체하지 않는다.
- 실행·독립 리뷰 근거는 docs/execution/evidence에 보존한다. 원장 scratch를 지워도 완료 근거가 사라지지 않게 한다.

## 2026-10-30 사용자 제공 메타데이터와 독자 코드 허가

이 결정은 위 T00 시점의 “Local identity only” 행에서 보류했던 이름·저작권자·허가문 정보를 갱신한다. 당시의 원본 실행·리뷰 기록은 그대로 보존한다.

- 사용자가 npm scope 이름 `unofficial-krds`와 저장소 URL `https://github.com/moreal/krds`를 제공했다. 요청 이름은 `@unofficial-krds`로 기록하고, 현재 실제 workspace scope `@krds-native`는 T01의 manifest·lock·출처 참조 원자적 변경 때 갱신한다. 이름과 URL 확인은 npm/GitHub 계정 소유권 인증을 의미하지 않는다.
- 독자적으로 작성한 프로젝트 코드의 저작권자는 `Lee Dogeon <dev.moreal@gmail.com>`로 확인했다. 이 구현 세션의 작성 연도 2026을 사용하여 완성된 MIT 허가문을 `LICENSES/MIT.txt`에 보존한다. 정부를 독자 코드의 공동 권리자로 새로 표시하지 않는다.
- [KRDS 공식 저작권 정책](https://www.krds.go.kr/html/eng/utility/utility_05.html)은 KRDS 자료에 공공누리 제1유형을 안내하고 행정안전부의 2024년 KRDS 자료를 출처표시 예시로 식별한다. [공공누리 제1유형 이용약관](https://www.kogl.or.kr/info/licenseType1.do)은 출처표시와 공공기관의 후원·특수 관계로 오인하게 하지 않을 조건을 설명한다. 실제 복제·가공한 KRDS 자료에는 이 원래 조건과 출처를 별도로 보존하며, 개별 원문에 없는 copyright 문구를 만들지 않는다. 폰트와 제3자 코드의 원래 조건도 유지한다.
- 사용자 메타데이터와 독자 MIT 허가의 로컬 준비 상태, 계정 소유권 검증, 게시 승인 여부를 분리한다. 이 요청으로 npm publication·push·tag가 승인되지는 않았으며 `publishAuthorized`는 false다. 일반적인 로컬 pack 및 T16 후보 준비가 실제 게시 승인과 같다는 새 규칙을 만들지 않는다. 기존 엄격한 `--release` ownership 관련 검사의 적용은 T16에서 기존 계획과 함께 평가한다.

현재 값과 공식 출처 해시는 `compliance/project-identity.json`, `compliance/metadata-evidence.json`에 있다. 작업·검증 근거는 `.superpowers/sdd/PLAN/task-metadata-compliance-report.md`에 기록한다. `docs/execution/progress.md`의 작업 상태 갱신은 controller/T06 lead 소유로 유지한다.
