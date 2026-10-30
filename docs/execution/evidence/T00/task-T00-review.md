# T00 review

Spec compliance: ✅

Quality: **Approved** (one minor documentation correction; no Critical or Important findings).

## Scope and method

Reviewed `task-T00-brief.md`, the implementation report, and the supplied line-numbered snapshot of all seven T00 deliverables. The unborn base and per-file SHA-256 snapshot are an adequate concrete review equivalent; no Git command or commit was used. Published-package evidence was reviewed through bounded views of the snapshot, retaining exact selected versions, compiler dependencies, direct peers/optional-peer flags, registry/manifests/integrity references, and verification status. Reported validators were inspected, not rerun: their metadata-only scope answers T00's checks, while installation, native rendering, builds, and browser execution belong to later tasks.

Named raw-source risk check: **SplashScreen sole web exclusion**. Inspected only matching passages in `upstream/krds/raw/components/component_12_08.html`: line 832 explicitly calls it mobile-application-only; lines 926–927 require the operating system's launch screen; lines 977–978 reject artificial display delays. This supports manifest lines 2063–2079. No other raw source inspection or broader execution review was performed.

## Spec assessment

- The workspace/unborn state and existing user inputs are recorded (`upstream/krds/manifest.json:9`). One baseline ID connects all five JSON records. The catalog retains all 55 official detail identities, explains displayed count 37, classifies 41 components, 9 compositions, 1 asset, 3 integrations and 1 not-applicable entry, and preserves 54 web-applicable targets (`manifest.json:41`). Mobile-category controls are retained; the single exclusion has explicit evidence and platform responsibility.
- Live website guidance and kit release 1.1.0 are distinct evidence layers (`manifest.json:21`). Six source resources have commit/blob/SHA-256 records (`manifest.json:2100`). Failed fetches and unverified Korean dynamic policy content remain visible; ISC metadata, KRDS terms, and font uncertainty are not collapsed into the independent-code MIT plan.
- Exact published selections and native compiler profiles are concrete: Node 24.18.0 LTS, Yarn 4.14.1/Corepack 0.36.0, Nx 24.0.2, TS 6.0.2, Vite 8.3.5 plus Qwik Vite 7.3.1 (`compatibility/toolchain.json:6`). Angular runtime/compiler 22.2.4 and CLI/build/ng-packagr 22.2.5 satisfy the recorded TS >=6.0 <6.1 and selected Node ranges; Qwik's Vite <8 requirement is respected. Solid 2 rc.19 has a dedicated renderer/compiler/plugin profile rather than widened stable peers (`toolchain.json:120`). Numeric published selections remain distinct from lookup tags and repository version strings.
- Seven stable native targets and a separate Solid 2 preview have explicit renderer, build and production-consumer contracts (`compatibility/frameworks.json:4`). Native rendering and KRDS/Ark/Zag controller ownership are preserved; no completed framework support is inferred.
- All seven required Storybook integrations and six web siheom adapters remain mandatory and pending (`compatibility/testing.json:4`). Exact adapter, Testing Library, Vitest and browser-provider selections are recorded. Lit's missing siheom adapter and Solid 2's excluded stable adapter are explicit. Qwik resume/serialization and Angular AOT/forms/APF remain independent production checks; local story state and separate behavior-test files are required (`testing.json:611`).
- Identity is candid and release-gated: working scope only, observed remote only, unknown independent-code holder, publication forbidden (`compliance/project-identity.json:6`, `:30`). Progress and decisions do not claim installation or runtime validation. Leaving changes uncommitted is consistent with the supplied constraint that the exact active model identity required by the commit trailer is unavailable.

## Strengths

- Reusable baseline identities and exact version/profile records let the next task proceed without repeating selection research.
- Evidence is traceable to frozen local material, commit/blob hashes, published registry responses and distribution integrity, with inaccessible sources retained.
- Pending validation, preview support, license uncertainty and project identity have precise boundaries and follow-up owners.
- The report supplies reproducible validators and accurately limits their success claims to metadata rather than runtime behavior.

## Findings

### Critical

None.

### Important

None.

### Minor

1. **The report overstates Solid Testing Library's router peer as required.** `.superpowers/sdd/PLAN/task-T00-report.md:57` calls the `@solidjs/router` peer required, but the frozen `@solidjs/testing-library@0.8.10` entry marks it optional (`compatibility/toolchain.json:1982`). Keeping exact router 1.0.0 selected is compatible and harmless; describe it as an explicitly selected optional peer rather than a required peer. This does not invalidate the selected profile or zero-missing-required-peers result.

## Review boundaries

The reported source/hash and semver results are supported by the reproduced validator logic and the supplied frozen metadata; they were not independently rerun. This approval covers T00 baseline/selection/identity work only. It does not clear source redistribution or publishing, nor prove installation, transitive lock resolution, framework integration, browser behavior, or production consumer execution.
