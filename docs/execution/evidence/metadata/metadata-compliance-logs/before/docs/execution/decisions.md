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
