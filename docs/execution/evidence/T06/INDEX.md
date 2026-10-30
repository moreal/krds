# T06 evidence index — native Solid 1 pilots

T06 implementation and all scoped/integration independent reviews are complete. Six Solid records are **implemented**. This archive does not claim unqualified verified, whole-catalog, physical assistive-technology, SSR/independent-consumer, or release completion.

## Final results and exact commands

Historical candidate scope: `@krds-native`. Requested `@unofficial-krds` atomic integration follows this archive and requires its own fresh candidate checks. All commands used selected Node24.18.0/Yarn4.14.1 through `node tools/yarn.mjs`; direct native tests set `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1`. Default browser: Playwright1.64.1 Chromium, ko-KR, Asia/Seoul, light, reduced motion, 1280×800; narrow 320×640 and 200% text are explicitly recorded.

| Exact command | Result | Archived output |
| --- | --- | --- |
| `node tools/yarn.mjs workspace @krds-native/solid build:local` | pass | `t06-lead-logs/final-public-build.log` |
| `node tools/yarn.mjs workspace @krds-native/solid typecheck` | pass | `t06-lead-logs/final-solid-typecheck.log` |
| `node tools/yarn.mjs workspace @krds-native/fixture-solid typecheck` | pass, public examples compile | `t06-lead-logs/final-fixture-typecheck.log` |
| `node tools/yarn.mjs workspace @krds-native/storybook-solid typecheck` | pass | `t06-lead-logs/final-story-typecheck.log` |
| `node tools/yarn.mjs workspace @krds-native/fixture-solid build:local` | pass | `t06-lead-logs/final-fixture-build.log` |
| `node tools/yarn.mjs workspace @krds-native/storybook-solid storybook-build:local` | pass | `t06-lead-logs/final-storybook-build.log` |
| `node tools/yarn.mjs test:siheom --framework solid` | 77/77 pass | `t06-lead-logs/final-siheom-77.log`, final siheom runner directory below |
| `node tools/yarn.mjs test:contract --framework solid` | 10/10 pass | `t06-lead-logs/final-contract-reviewed.log`, final contract runner directory below |
| `node tools/yarn.mjs test:stories --framework solid` | 6 canonical stories pass, raw axe/forbidden requests0 | `t06-lead-logs/final-stories-reviewed.log`, final stories runner directory below |
| `node tools/yarn.mjs exec node .superpowers/sdd/PLAN/t06-lead-logs/storybook-all-states.mjs` | 38/38 total native stories, raw axe/runtime/forbidden requests0; includes the6 canonical | `t06-lead-logs/story-all-states-command.log`, `story-all-states/report.json` |
| `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 node tools/yarn.mjs workspace @krds-native/solid test` | 2/2 provider tests pass | `t06-lead-logs/final-provider-source-test.log` |
| `node tools/yarn.mjs exec node .superpowers/sdd/PLAN/t06-lead-logs/visual-review.mjs` | 41 actual PNGs,3 trusted regressions,7 clean axe scans, errors/external requests0 | `t06-lead-logs/visual-final-command.log`, `visual-final/report.json` |
| `node tools/yarn.mjs exec node .superpowers/sdd/PLAN/t06-lead-logs/visual-focus-supplement.mjs` | 2 actual Tab-focus images; solid2px visible outlines | `t06-lead-logs/visual-focus-command.log`, `visual-focus-supplement/report.json` |

Final raw runner directories are copied in full without rewriting their bytes:
- `siheom`: `runners/siheom-1793327466349-27865-88667273/` (original `test-results/t05/siheom-1793327466349-27865-88667273/`).
- `contract`: `runners/contract-1793327519951-28110-4fd4a456/` (original `test-results/t05/contract-1793327519951-28110-4fd4a456/`).
- `stories`: `runners/stories-1793327750302-29652-af5b2831/` (original `test-results/t05/stories-1793327750302-29652-af5b2831/`).

## Reviews, candidate hashes and historical failures

- Main report: [task-T06-lead-report.md](task-T06-lead-report.md); approved integration: [task-T06-lead-review.md](task-T06-lead-review.md).
- Component reports/reviews: `task-T06-controls-*`, `task-T06-overlays-tabs-*`, `task-T06-dates-*`. Shared helpers/common observers/styles have their own approved reports/reviews. Metadata reports/review are preserved separately.
- Exact review packages, JSON snapshots, source diffs and original baseline directories are retained. `task-T06-lead-final-source-hashes.json` freezes the26 reviewed lead paths; family snapshots freeze their own slices. Later authorized status bookkeeping is described in `status-update.json`, not retroactively represented as the reviewed candidate.
- Healthy missing-widget RED, source regression failures, original forced-color/empty-error/narrow/popup defects and raw Calendar axe1/42 finding remain in the `t06-*-logs` histories, prior runner directories and `prior-native-failure-images/`. They are historical diagnosis, never passing coverage.
- `t06-calendar-axe-logs` and `task-T06-calendar-axe-research.md` preserve primary-source research. Real visible Korean day units preserve the exact full date name; no hidden workaround or axe suppression was used. Final raw scans are actually zero.
- `SHA256SUMS.json` inventories archived bytes. `bookkeeping-hashes.json` records the authorized final PLAN/progress/coverage files. Source snapshots remain immutable historical facts.

## Archive portability and remaining gates

Scratch scripts, logs and exact review packages are archived as historical evidence. Absolute paths, original `.superpowers/sdd/PLAN` references and scratch-relative root calculations are preserved; they have **not** been relocated into a portable executable harness. The mapping is original scratch prefix → this archive prefix, and original final runner directory → `runners/<same basename>`. Reusable durable harness work remains T13; do not claim an archived script runs unchanged from its new path.

Physical OS IME, screen-reader/manual voice-control, real touch devices, broader browser/device coverage, SSR/hydration and independent consumers, all54 web catalog entries/future variants, release policy gates and explicit publication authority remain later work. At extreme narrow/text zoom, the real month table scrolls locally while heading/actions remain visible; text is not shrunk to simulate reflow. Other frameworks and all other coverage records are unchanged.

User-confirmed independent-code holder/grant and requested scope/repository metadata do not authenticate account ownership or authorize publication. KRDS/font/third-party rights remain separate. No commits, pushes, tags or publication occurred. Git commit checkbox stays open because exact active model identity was unavailable.
