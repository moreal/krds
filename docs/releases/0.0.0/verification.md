# Intermediate release verification: 0.0.0

M1: **blocked**. M2: **blocked**. M3: **blocked**. Exit code: **1**.

Candidate commit: unavailable (unborn HEAD). Diagnostic source fingerprint: `284b8e91ab059b569cbc0f5e7220a0fe1ffb17cd7bf57089fe9621ea721dd591`.

- selected-toolchain: **passed** — Validated actual evidence
- candidate-commit: **blocked** — ["HEAD is unborn: no real candidate commit. Content hashes are diagnostic only; no commit was created."]
- stable-catalog-native-stories-requests-behavior: **blocked** — ["Existing actual coverage gate lacks accepted evidence: 0/378 accepted; 378 gaps. masthead/solid: native coverage is planned, not independently verified; masthead/react: native coverage is planned, not independently verified; masthead/svelte: native coverage is planned, not independently verified; masthead/vue: native coverage is planned, not independently verified; masthead/lit: native coverage is planned, not independently verified; masthead/qwik: native coverage is planned, not independently verified; masthead/angular: native coverage is planned, not independently verified; identifier/solid: native coverage is planned, not independently verified; identifier/react: native coverage is planned, not independently verified; identifier/svelte: native coverage is planned, not independently verified; identifier/vue: native coverage is planned, not independently verified; identifier/lit: native coverage is planned, not independently verified"]
- stable-actual-candidate-tarballs: **blocked** — ["ENOENT: no such file or directory, lstat '/Users/moreal/github/moreal/krds/artifacts/manifest.json'"]
- preview-actual-candidate-tarballs: **blocked** — ["ENOENT: no such file or directory, lstat '/Users/moreal/github/moreal/krds/artifacts/manifest.json'"]
- all-actual-candidate-tarballs: **blocked** — ["ENOENT: no such file or directory, lstat '/Users/moreal/github/moreal/krds/artifacts/manifest.json'"]
- stable-outside-tarball-consumers: **blocked** — ["ENOENT: no such file or directory, lstat '/Users/moreal/github/moreal/krds/artifacts/consumer-results.json'"]
- preview-outside-tarball-consumer: **blocked** — ["ENOENT: no such file or directory, lstat '/Users/moreal/github/moreal/krds/artifacts/consumer-results.json'"]
- all-outside-tarball-consumers: **blocked** — ["ENOENT: no such file or directory, lstat '/Users/moreal/github/moreal/krds/artifacts/consumer-results.json'"]
- M1-compatibility-types-build: **blocked** — ["Selected compatibility target source changed during run: test-results/t13/compatibility-runs/2026-10-30T05-46-16.168Z/results.json"]
- M1-ssr-hydration-browser-timezones: **blocked** — ["Selected ssr target source changed during run: test-results/t13/ssr-runs/2026-10-30T05-48-48.112Z/results.json"]
- M2-compatibility-types-build: **blocked** — ["Selected compatibility target source changed during run: test-results/t13/compatibility-runs/2026-10-30T05-46-16.168Z/results.json"]
- M2-ssr-hydration-browser-timezones: **blocked** — ["Selected ssr target source changed during run: test-results/t13/ssr-runs/2026-10-30T05-32-21.917Z/results.json"]
- preview-exact-rc-six-native-pilots: **passed** — Validated actual evidence
- preview-six-native-behavior-types-build-ssr: **blocked** — ["Missing canonical v3 evidence index/ref"]
- native-service-compositions: **blocked** — ["Missing canonical v3 evidence index/ref"]
- manual-accessibility: **blocked** — ["Missing canonical v3 evidence index/ref"]
- independent-native-artifact-review: **blocked** — ["Missing canonical v3 evidence index/ref"]
- candidate-ci-required-executions: **blocked** — ["Missing canonical v3 evidence index/ref"]
- documentation-and-versioning: **blocked** — ["Missing canonical v3 evidence index/ref"]
- licenses-provenance-distribution: **passed** — Validated actual evidence
- ownership-and-independent-code-grant: **blocked** — ["npm scope and repository ownership remain unauthenticated; user-selected names/URL are not ownership evidence"]
- version-changelog-candidate: **blocked** — ["Actual release version is not prepared (0.0.0)"]
- ci-candidate-handoff: **blocked** — ["ENOENT: no such file or directory, lstat '/Users/moreal/github/moreal/krds/test-results/ci/candidate.json'"]
- source-drift-during-verification: **blocked** — ["Source changed while verifier inspected evidence; rerun after source freeze"]

Full machine evidence: [verification.json](./verification.json). This intermediate report does not declare T16 or release preparation complete.
