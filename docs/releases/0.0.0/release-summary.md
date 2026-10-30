# Candidate handoff — 0.0.0

Status: **intermediate**. M1: **blocked**, M2: **blocked**, M3: **blocked**; process exit **1**. This report documents current evidence and does not make incomplete release preparation complete.

Candidate commit: unavailable (unborn HEAD). Public source/build fingerprint: 284b8e91ab059b569cbc0f5e7220a0fe1ffb17cd7bf57089fe9621ea721dd591. Lockfile: 4ca243c3a03ff4df3e29c921cdb6e4bb1d5d2c034e568ff59a63a5242a8aa694. Exact candidate artifact manifest: missing. KRDS baseline: krds-web-2026-10-30-kit-1.1.0-d6bb184c823e. Environment: Node 24.18.0, Yarn 4.14.1, darwin/arm64.

- @unofficial-krds/angular@0.0.0 (stable)
- @unofficial-krds/assets@0.0.0 (stable)
- @unofficial-krds/contracts@0.0.0 (stable)
- @unofficial-krds/fonts@0.0.0 (stable)
- @unofficial-krds/lit@0.0.0 (stable)
- @unofficial-krds/qwik@0.0.0 (stable)
- @unofficial-krds/react@0.0.0 (stable)
- @unofficial-krds/solid@0.0.0 (stable)
- @unofficial-krds/solid-next@0.0.0-next.0 (solid2-preview)
- @unofficial-krds/styles@0.0.0 (stable)
- @unofficial-krds/svelte@0.0.0 (stable)
- @unofficial-krds/tokens@0.0.0 (stable)
- @unofficial-krds/vue@0.0.0 (stable)

Install only inspected candidate tarballs after outside consumer acceptance. Example same-framework public import: import { Button } from '@unofficial-krds/react/button'; follow that package README for CSS and optional fonts. This document does not claim registry availability. License/source locations are described in [licenses.md](./licenses.md); declared targets and limits in [compatibility.md](./compatibility.md).

Reproduce the frozen candidate using .github/workflows/release-prepare.yml: immutable Yarn install, actual full workspace/type/build/behavior/story/siheom and native matrix runs, regenerated notices, serialized pack:all --build, inspect:tarballs, all 15 outside consumers, authentic manual review, and candidate archive handoff. Then run node tools/yarn.mjs verify:release. The verifier inspects existing executions without repeating broad native runs.

Outstanding requirements:

- candidate-commit: blocked — ["HEAD is unborn: no real candidate commit. Content hashes are diagnostic only; no commit was created."]
- stable-catalog-native-stories-requests-behavior: blocked — ["Existing actual coverage gate lacks accepted evidence: 0/378 accepted; 378 gaps. masthead/solid: native coverage is planned, not independently verified; masthead/react: native coverage is planned, not independently verified; masthead/svelte: native coverage is planned, not independently verified; masthead/vue: native coverage is planned, not independently verified; masthead/lit: native coverage is planned, not independently verified; masthead/qwik: native coverage is planned, not independently verified; masthead/angular: native coverage is planned, not independently verified; identifier/solid: native coverage is planned, not independently verified; identifier/react: native coverage is planned, not independently verified; identifier/svelte: native coverage is planned, not independently verified; identifier/vue: native coverage is planned, not independently verified; identifier/lit: native coverage is planned, not independently verified"]
- stable-actual-candidate-tarballs: blocked — ["ENOENT: no such file or directory, lstat '/Users/moreal/github/moreal/krds/artifacts/manifest.json'"]
- preview-actual-candidate-tarballs: blocked — ["ENOENT: no such file or directory, lstat '/Users/moreal/github/moreal/krds/artifacts/manifest.json'"]
- all-actual-candidate-tarballs: blocked — ["ENOENT: no such file or directory, lstat '/Users/moreal/github/moreal/krds/artifacts/manifest.json'"]
- stable-outside-tarball-consumers: blocked — ["ENOENT: no such file or directory, lstat '/Users/moreal/github/moreal/krds/artifacts/consumer-results.json'"]
- preview-outside-tarball-consumer: blocked — ["ENOENT: no such file or directory, lstat '/Users/moreal/github/moreal/krds/artifacts/consumer-results.json'"]
- all-outside-tarball-consumers: blocked — ["ENOENT: no such file or directory, lstat '/Users/moreal/github/moreal/krds/artifacts/consumer-results.json'"]
- M1-compatibility-types-build: blocked — ["Selected compatibility target source changed during run: test-results/t13/compatibility-runs/2026-10-30T05-46-16.168Z/results.json"]
- M1-ssr-hydration-browser-timezones: blocked — ["Selected ssr target source changed during run: test-results/t13/ssr-runs/2026-10-30T05-48-48.112Z/results.json"]
- M2-compatibility-types-build: blocked — ["Selected compatibility target source changed during run: test-results/t13/compatibility-runs/2026-10-30T05-46-16.168Z/results.json"]
- M2-ssr-hydration-browser-timezones: blocked — ["Selected ssr target source changed during run: test-results/t13/ssr-runs/2026-10-30T05-32-21.917Z/results.json"]
- preview-six-native-behavior-types-build-ssr: blocked — ["Missing canonical v3 evidence index/ref"]
- native-service-compositions: blocked — ["Missing canonical v3 evidence index/ref"]
- manual-accessibility: blocked — ["Missing canonical v3 evidence index/ref"]
- independent-native-artifact-review: blocked — ["Missing canonical v3 evidence index/ref"]
- candidate-ci-required-executions: blocked — ["Missing canonical v3 evidence index/ref"]
- documentation-and-versioning: blocked — ["Missing canonical v3 evidence index/ref"]
- ownership-and-independent-code-grant: blocked — ["npm scope and repository ownership remain unauthenticated; user-selected names/URL are not ownership evidence"]
- version-changelog-candidate: blocked — ["Actual release version is not prepared (0.0.0)"]
- ci-candidate-handoff: blocked — ["ENOENT: no such file or directory, lstat '/Users/moreal/github/moreal/krds/test-results/ci/candidate.json'"]
- source-drift-during-verification: blocked — ["Source changed while verifier inspected evidence; rerun after source freeze"]

Next-version work must preserve native renderer/compiler isolation and repeat the exact current-source evidence after catalog or support changes. No publication, pushing or tagging has been performed or authorized.
