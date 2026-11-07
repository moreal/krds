# Native Live Previews Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put an operable native component result before its exact source on every web component reference page: 378 stable defaults, six Solid 2 pilots, and 48 explicit Solid 2 unavailable states.

**Architecture:** Each existing framework fixture workspace owns a dedicated native docs host and disjoint static artifact. A deterministic docs assembler validates source/build manifests, copies only public artifacts, and emits page-scoped metadata consumed by the existing Solid 1 shell. One selected same-origin iframe runs the actual chosen framework; Qwik is optimizer-built and prerendered into real static documents.

**Tech Stack:** Existing Astro/Solid 1 shell, native React/Solid/Svelte/Vue/Lit/Qwik/Angular hosts, isolated Solid 2 RC, existing Playwright Chromium/WebKit, Nx and vendored Yarn.

**Spec:** `docs/superpowers/specs/2026-11-01-unofficial-krds-live-examples-design.md`; builder review: `test-results/unofficial-docs/examples-builder-check.md` (passed source review, not runtime proof).

**Status:** Approved for implementation by the user on 2026-11-01. No commits, push, tags, publication or deployment authorized.

**Visual basis:** `test-results/live-previews-visual/audit.md` and its actual desktop/mobile screenshots find zero operable component examples on Button/Modal/Tabs/Calendar. Desktop begins with availability at y440; mobile title is displaced to ~y458 by the document-menu/TOC stack, with availability at ~y641. Historical state-example sections begin thousands of pixels down and contain evidence links. These are observed defects, not hypothetical layout changes.

## Global Constraints

- Node **24.18.0** and vendored Yarn **4.14.1** via `node tools/yarn.mjs`; Vite **8.3.5** except Qwik **7.3.1**; Solid 2 **2.0.0-rc.19** / plugin **3.0.0-next.53**. Preserve `nodeLinker: pnpm`, exact direct dependencies, one lockfile, native Angular CLI/partial APF and renderer isolation.
- Exactly **54 × seven = 378** stable defaults plus **six** playable Solid 2 defaults; its remaining **48** rows explicitly unavailable. Splash screen is excluded. Additional variants never count toward defaults.
- Preserve **135** site routes and legacy heading anchors, **609** source paths, **385** declaration checkpoints and **62** compiler checkpoints. Preserve historical bytes and explicit current-input classifications. Do not promote catalog coverage or release readiness.
- Framework outputs stay in their own `dist/docs-preview/`; assembly alone writes generated docs public preview destinations. No test bridge, story harness, request server or foreign renderer enters a preview.
- Local deterministic state/assets only; no API/auth/CDN/telemetry/remote font/image. Keep independent MIT rights and official KRDS/font attribution distinct; retain unverified ownership metadata.
- Sandbox `allow-scripts allow-same-origin`; iframe heights **240–1200 CSS px**, overlay defaults minimum **640**, readiness timeout **15 seconds**. Light/forced-colors and reduced motion only; no unsupported dark-theme promise.
- No Git commits while the exact model-identity hook is unavailable. The usual skill commit steps are intentionally omitted because workspace instructions prohibit them.

## Review Focus

- Rapid package changes/reset during loading must reject stale messages and preserve selector focus (Task 3).
- Invalid query/session values and unavailable Solid 2 selections must never load arbitrary URLs or substitute another package (Tasks 1, 3).
- Long code, tall overlays, 320px width and 200% text must preserve working controls, reading order and frame exit (Tasks 3, 7).
- Qwik first-interaction handlers must execute from final static files without a server or synthetic state driver (Task 4).
- Native build/cache cleanup must not delete sibling fixture or preview output, and stale/missing source/assets must fail assembly (Tasks 1, 2, 6).

## Ownership and execution order

Controller delegates implementation/review to `gpt-6.1-sol`, owns integration, and dispatches only after design review. Foundation Task 1 precedes a React + shell vertical slice (Tasks 2–3). Inspect that assembled result visually before expansion. Hard build proofs in Task 4 follow the shared contract; Task 5 then scales all frameworks in parallel. Tasks 6–7 close assembly/CI/rights and acceptance. Each task gets a fresh review against its interfaces and evidence; a framework cannot self-certify the whole matrix.

| Delegate | Exclusive writable ownership | Dependency |
| --- | --- | --- |
| Contract/assembler | `tools/docs-previews/**`, docs registry definitions; shared acceptance contract | Task 1 first; integration owns root edits |
| Docs experience | `apps/docs/src/**`, `apps/docs/scripts/content.mjs`, route/generator integration and docs UI tests | Task 1, React artifact |
| React | `apps/fixture-react/src/docs-preview/**`, its build config/package/project | Task 1 |
| Solid 1 | `apps/fixture-solid/src/docs-preview/**`, its build config/package/project | Task 1 |
| Svelte | `apps/fixture-svelte/src/docs-preview/**`, its build config/package/project | Task 1 |
| Vue | `apps/fixture-vue/src/docs-preview/**`, its build config/package/project | Task 1 |
| Lit | `apps/fixture-lit/src/docs-preview/**`, its build config/package/project | Task 1 |
| Qwik | `apps/fixture-qwik/src/docs-preview/**`, dedicated optimizer/build config/package/project | Task 1 |
| Angular | `apps/fixture-angular/src/docs-preview/**`, `angular.json`, dedicated tsconfig/package/project | Task 1 |
| Solid 2 | `apps/fixture-solid-next/src/docs-preview/**`, isolated config/package/project | Task 1 |
| Integration/rights | `nx.json`, root scripts, docs build orchestration, `.github/workflows/docs-pages.yml`, compliance producers | Tasks 1–5 interfaces frozen |
| Acceptance/review | `apps/docs/tests/native-previews*`, `test-results/native-previews/**`; read-only product review | Progressive artifacts, final Task 7 |

Shared files and dependency changes go through the controller; framework delegates return requested root edits rather than race on them. Existing protected example files are read-only. Any discovered public-package defect is reported with a focused test and separately assigned to that package owner.

## File and interface map

All paths below marked new are proposed deliverables, not claims of existing APIs. Existing reuse candidates are confirmed in `test-results/unofficial-docs/examples-recon.md`.

- New `tools/docs-previews/contract.mjs` and `contract.d.ts`: artifact/registry validation and types; `protocol.ts`: browser-safe strict messaging with no framework dependency; `manifest.mjs`: deterministic hashing and compiled-input capture; `assemble.mjs`: allowlisted assembly.
- New `apps/docs/demo-definitions.json`: authoring identities, source binding/display ranges and acceptance IDs; new `apps/docs/demo-acceptance.json`: one explicit semantic outcome per web component, plus framework locator overrides where necessary.
- New generated `apps/docs/public/demo-registry.json`, `public/demo-sources/**`, `public/previews/<framework>/**`; never edit by hand.
- Each native workspace: new `src/docs-preview/examples.*` (native selection map), `main.*` (mount/dispose), `index.html`, `styles.css`, dedicated build configuration and `docs-preview:local` script. Qwik instead has `entry.client.tsx`, `entry.ssr.tsx`, `build.mjs`; Angular uses `main.ts`, `app.ts`, `tsconfig.docs-preview.json` and an official named application-builder target.
- Existing `apps/docs/src/content.ts`, `src/components/DocBlocks.tsx`, `scripts/content.mjs`, `scripts/generate.mjs`, `scripts/generate-routes.mjs`; new `src/demo-types.ts`, `src/components/NativeDemo.tsx`, `src/components/NativeDemoSource.tsx`, `src/native-demo-state.ts`; existing `src/styles/content.css` for layout.
- Existing `tools/refresh-docs-distribution.mjs`, docs `scripts/bundle-provenance.mjs`, `tools/generate-notices.mjs` and `tools/verify-licenses.mjs`: extend rather than bypass provenance.

### Task 1: Freeze the native artifact and acceptance contract

**Owner:** Contract/assembler; controller reviews before native delegates start.

**Files:** New `tools/docs-previews/{contract.mjs,contract.d.ts,protocol.ts,manifest.mjs,contract.test.mjs}`, `apps/docs/{demo-definitions.json,demo-acceptance.json}`. Modify no historical evidence.

**Interfaces:** Export `validateDefinitions(definitions, catalog)` and `validateArtifact(manifest, definitions)` (throw with pair/path on invalid input); `writeArtifactManifest({framework, outputDir, bindings, modules})` returns a sorted manifest. Freeze `FrameworkId = 'react'|'solid'|'svelte'|'vue'|'angular'|'lit'|'qwik'|'solid-next'`. Artifact records include schemaVersion, framework, actual package/version/renderer/compiler identity, deployable `{path,sha256,size}` files, real bundled module/package identities, and bindings `{componentId,exampleId,hostPath,sourcePath,symbolOrBranch,sha256, ranges?}`. Ranges use UTF-8 byte start/end, range hash and derived line span. No timestamps/machine paths.

**Registry:** Discriminated `PlayableDemo`/`UnavailableDemo`. Playable identity, label/channel/package, explicit `/krds/previews/...` URL, artifact hash, minHeight/layout, source files with roles/hash/download/ranges, acceptanceId/classification. Unavailable has reason/channel, no entry URL. Definitions may be incomplete during local slices; `--complete` is a separate mandatory final gate and must fail until all 384 defaults exist.

- [x] Write `contract.test.mjs` assertions for 378 stable + six preview + 48 unavailable defaults; reject duplicates, missing defaults, splash-screen, unknown keys, unavailable URLs, traversal/symlinks, missing bindings/host/data, invalid UTF-8 ranges and forged hashes. Test partial mode cannot claim completeness.
- [x] Run `node tools/yarn.mjs exec node --test tools/docs-previews/contract.test.mjs`; confirm failures identify unimplemented contract.
- [x] Implement the contract and acceptance inventory. Enumerate all 54 catalog IDs explicitly, with meaningful initial state/action/observable outcome/reset baseline or static semantics/assets; include TutorialPanel targets/start/stop, FileUpload File selection/removal, Favicon head links, TTS labeled local simulation. Map real existing consumers only after reading them; no guessed export names.
- [x] Define `PreviewMessage` version 1 discriminants `ready|size|error|return-focus` plus exact identity/token; parent init contains only supported presentation settings. Define `parsePreviewMessage(value: unknown): PreviewMessage | null`, rejecting extra fields, invalid identity/nonfinite size. Browser host helpers check origin/source separately; never import Node helpers into a browser.
- [x] Re-run the test command; pass only with nonempty tests and the exact acceptance map. Controller reviews protocol and manifests once before freezing them for parallel owners.

### Task 2: Ship a React vertical artifact and deterministic assembler

**Owner:** React and contract/assembler, with disjoint files.

**Files:** New `apps/fixture-react/{vite.docs-preview.config.ts,src/docs-preview/**}`; modify its `package.json`, `project.json` and existing fixture Vite output config as needed. New `tools/docs-previews/{assemble.mjs,assemble.test.mjs}`. Source reuse candidate: existing `packages/react/examples/catalog.tsx`; never alter its protected bytes.

**Interfaces:** `docs-preview:local` builds only `dist/docs-preview/` and its manifest. CSR entry is `/krds/previews/react/index.html?component=<id>&example=default`. `assemble({root,frameworks,complete})` validates Task 1 artifacts, cleans only generated preview/source destinations, copies allowlisted files, and emits registry/source downloads. Missing artifact fails clearly; no silent cached fallback.

- [x] Add failing assembler tests for tampered/missing source, escaping asset paths, undeclared modules, stale manifests and absent index/chunks. Add React smoke scenarios Button callback result + reset and Accordion actual expanded content; these tests initially fail because no docs artifact exists.
- [x] Run `node tools/yarn.mjs exec node --test tools/docs-previews/assemble.test.mjs` and confirm expected failures.
- [x] Implement React mount selection with real public imports and pure local state. Reuse only suitable native consumers; otherwise author small docs examples with exact bindings. Emit module/source manifests from actual builder inputs, not a hand-written runtime claim; assets resolve beneath the final base. Implement native frame readiness, measured root sizing and final return action.
- [x] Implement allowlist assembly and source extraction/downloads; full bytes remain downloadable, excerpts remain labeled. Prevent fixture build cleanup/cache outputs from overlapping preview output; neither target may own all `dist` when restoring independently.
- [x] Run `node tools/yarn.mjs nx run fixture-react:docs-preview`; run assembler tests and `node tools/yarn.mjs exec node tools/docs-previews/assemble.mjs --framework react`. Verify output under the final prefix in Task 3 before expanding.

### Task 3: Show the actual result first in the docs shell

**Owner:** Docs experience.

**Files:** Existing/new docs files listed above, existing `src/components/DocsShell.tsx` and `src/styles/layout.css` for the bounded mobile menu/TOC adjustment; new `apps/docs/tests/{native-previews.test.mjs,native-previews-browser.mjs}`. Modify docs `package.json` to expose `test:previews` and `test:previews:browser` using the existing browser-cache preload.

**Interfaces:** Add `{type:'demo';componentId:string}` to `DocBlock`; page-scoped validated demo metadata is serialized by route generation. `NativeDemo(props: {componentId:string; demos:NativeDemoRecord[]})`; `NativeDemoSource(props:{files:DemoSourceFile[]})`. `resolveDemoSelection({query,sessionFramework,records})` returns one allowlisted selection. `DocBlocks` receives page demo metadata through a typed prop; no global 384-source payload.

- [x] Add failing tests: exactly one demo after title/summary before reference sections; old heading IDs occur once; raw HTML stays rejected; default source/full-page link exist in SSR with JS disabled. Query wins over valid session preference; Solid 1 default; unknown values safe; changed framework invalidates unsupported example; unavailable Solid 2 loads no frame/Reset.
- [x] Implement typed insertion via explicit component-page metadata in generator/content pipeline, never heading text search. Render compact title/summary, visible package selector (public NativeSelect), current real package/version, selected preview, Reset/Open full page, then exact source (existing CodeBlock, file selector/copy/download), then Usage/Anatomy/Keyboard/API. Move availability/history below API with corresponding old anchors intact. Compact mobile document-menu/TOC controls using their existing accessible public components so they do not displace the result; preserve completed header/menu behavior and avoid a general shell redesign.
- [x] Add frame browser tests for one mounted runtime, lazy entry loading, fresh token on Reset, switched-source fidelity, copy bytes/download hash, 15-second timeout/retry, ready/error announcements, stale/wrong-origin/wrong-source/wrong-token messages, height bounds/grow/shrink. Assert package switch keeps selector focus, Skip example and return action exit, Modal Escape closes then restores in-frame focus. Do not globally hijack Escape.
- [x] Implement strict lifecycle cleanup, sandbox/title, 240–1200 bounds and 640 overlay minima using Task 1 protocol. Source stays readable without preview execution. Code scrolls inside its container; preview stays visibly above code at narrow widths.
- [x] Run `node tools/yarn.mjs workspace @unofficial-krds/docs test:previews`, `typecheck`, `test:content`, and `test:previews:browser -- --framework react` against assembled `/krds/`. Capture 1440×1000, 390×1000, 320px and 200% text screenshots of Button and Accordion; inspect actual pixels before Task 5 expansion. At 1440×1000 the initial viewport must contain package choice and meaningful rendered default; at 390×1000 title/selector/preview must appear without scrolling past TOC/availability. This first gate proves a visible working result and matching source, not matrix completion.

### Task 4: Prove the hard native builders end to end

**Owners:** Qwik, Angular and Solid 2 independently; no shared-file races.

**Files:** Their dedicated `src/docs-preview/**` plus workspace package/project/config files; Qwik new `vite.docs-preview.config.ts`, docs `build.mjs`; Angular existing `angular.json` plus new docs tsconfig; Solid 2 new `vite.docs-preview.config.ts`. Protected native examples remain unchanged.

**Interfaces:** Same artifact/protocol contract as Task 2. Qwik emits `<component>/<example>/index.html` and client assets under `/krds/previews/qwik/build/`; `render` in the new docs SSR entry consumes explicit identity and actual client manifest. Angular named builder target uses `@angular/build:application`, official CLI, dedicated output/base href; public package remains ng-packagr partial APF. Solid 2 imports `@solidjs/web` with exact RC plugin/runtime, never `solid-js/web`.

- [x] Add failing native slice assertions: Qwik text edit, selection, modal close/focus, date and File state on first interaction from static files; Angular Button/form state/Modal; Solid 2 Button/NativeSelect/Modal. Source binding must point to the actual selected native branch and host.
- [x] Build native entries using Task 1/2 contracts, pure state and lawful local assets. Qwik selects native `component$` before `renderToString`, emits all HTML at build time, deploys no server and uses no synthetic CSR driver. Angular uses its real standalone components/forms. Keep Solid 2 fully isolated.
- [x] Run `node tools/yarn.mjs nx run fixture-<framework>:docs-preview` for each owner, assemble those artifacts, then `node tools/yarn.mjs workspace @unofficial-krds/docs test:previews:browser -- --framework <framework> --slice`. Verify real final-prefix chunks/QRLs and no external/console/page errors; inspect screenshots of interactive outcomes.
- [x] Controller reviews bundle identities, static Qwik interaction, focus/reset and source binding before scaling. A failure is incomplete implementation, never an alternate-runtime fallback or final stable unavailable waiver.

### Task 5: Complete all native examples in parallel

**Owners:** Eight native owners from the ownership table; bounded per-framework deliverables.

**Files:** Each owner's dedicated native directory/build files. Confirmed reuse inputs: React `packages/react/examples/catalog.tsx`; Solid `src/catalog-examples.tsx` and `src/examples.tsx`; Svelte `src/public-examples/*Example.svelte`; Lit `src/examples/catalog.ts`; Qwik `src/catalog-examples.tsx`. Vue `PublicCatalogExamples.vue`/`ConsumerExample.vue` and Angular `public-catalog-examples.ts` are monolithic compiler evidence: author selectable docs SFCs/templates rather than mutate them.

**Interfaces:** Every owner's map resolves `(componentId, exampleId)` to its own actual native public component and binding. Each stable manifest contains 54 defaults; Solid 2 exactly Button, NativeSelect, Modal, Tabs, Calendar, DateInput. Unavailable Solid 2 records are authored in registry metadata, never faux native exports.

- [x] For each owner, add failing tests driven by every owned Task 1 acceptance ID; an empty/missing mapping fails. Divide review into pilot six and remaining 48 while keeping final completeness one gate.
- [x] Implement native defaults with meaningful initial state and outcomes. React `createRoot`, Solid 1 `solid-js/web`, Svelte 5 `mount`, Vue native SFCs, Angular standalone templates, Lit actual custom elements/factory listeners/disposal, Qwik optimizer-native components, Solid 2 RC only. State/data can be shared; renderer implementations cannot.
- [x] Replace hard-coded root navigation/media only in new docs code/inputs: local in-frame destinations or visible deterministic route content; import assets or construct explicit preview URLs. Include tutorial targets, overlay triggers/actions, upload removal/reset, TTS explanation, semantic static examples. Reuse exact consumers only when they meet these outcomes.
- [x] Run each dedicated native build and its full `test:previews:browser -- --framework <id>` on assembled static output. Report exact count, failing identities, source/artifact hashes and screenshots; do not mark the matrix complete from native compilation or `ready`.
- [x] Controller merges only nonoverlapping owner changes, assembles all eight outputs, runs `assemble.mjs --complete` and checks 378 + six + 48; all remaining stable failures must be fixed before Task 7 completion.

### Task 6: Close build graph, rights inventory and parallel CI

**Owner:** Integration/rights; native owners supply accurate manifests.

**Files:** Existing `nx.json`, fixture `project.json` output declarations, `apps/docs/{package.json,project.json}`, `scripts/serve.mjs`, `.github/workflows/docs-pages.yml`, provenance/notices/distribution producers and their existing tests; new `tools/docs-previews/{provenance.mjs,provenance.test.mjs}`.

**Interfaces:** Aggregate `krds-docs:docs-previews` depends on eight independent `docs-preview` targets; docs `build` requires these plus usual prerequisites. `build:local` assembles validated fresh artifacts before generation/Astro or fails; no recursive native build inside assembly. CI matrix artifacts named `docs-preview-<framework>` contain only manifest-allowlisted native output for the same revision.

- [x] Add failing tests for missing notice/module identity, unclassified source/media/font, modified recorded font bytes, stale artifact input hash, and sibling output deletion. Preserve exact 609-source/three legacy font assertions; add separate `nativePreviews` inventory with every additional destination.
- [x] Configure disjoint outputs/cache inputs for native demos, reused consumers, dependencies, lock/toolchain, catalog, host maps, source definitions and asset/provenance bytes. Add fixtures/shared CSS/fonts/assets to direct/implicit dependencies as consumed. Ordinary `build` still calls `build:local`; adapters retain boundary rules.
- [x] Extend real module inventories for Vite/Qwik optimizer/Angular application builds and bind them to existing dependency license evidence. Generate lawful notices and a reviewable distribution diff, preserving historical evidence bytes and project identity.
- [x] Change workflow into exact-toolchain immutable-install preview matrix jobs, independent prerequisite builds, named artifacts, and assembly/docs validation job. Download exact artifacts from same revision; no shared mutable output directory/Nx Cloud. Preserve existing shell/content/license/reproducibility/browser checks and upload full `apps/docs/dist`; do not trigger deployment.
- [x] Run `node tools/yarn.mjs verify:workspace`, `verify:licenses`, `test:notices`, native provenance tests, `nx run krds-docs:build`, docs tests and direct `build:local` missing-artifact failure test. Verify local server serves the final same-origin `/krds/` tree without fixture redirects.

### Task 7: Final behavior, visual and preservation gate

**Owner:** Acceptance delegate and fresh Sol reviewer; controller resolves failures.

**Files:** New/current `apps/docs/tests/native-previews-browser.mjs`, supporting semantic scenario modules under `apps/docs/tests/native-previews/`, and separate `test-results/native-previews/**`; extend existing `tests/reproducibility.mjs` for complete assembled bytes, not just shell rebuilds.

**Interfaces:** Browser result rows bind component/framework/example, acceptance ID, artifact/registry hashes, initial/action/reset observations and screenshot paths. No row is inferred from another framework; no empty suite passes. Browser runner flags `--framework`, `--slice`, `--browser` filter development work only; unfiltered final command enforces coverage.

- [x] Run full Chromium 384-playable render/action/reset or static semantic matrix. Check meaningful Badge/Table/VisuallyHidden/Favicon/Image semantics, media success, no unexpected network, console/page errors or duplicate IDs. Assert exact native package/module identity and selected source binding.
- [x] Run WebKit for all 54 component families with rotating stable frameworks plus all six Solid 2 pilots; both browsers exercise every framework's forms, overlay/focus/reset, all Qwik QRL categories, frame boundaries, 320px and 200% text. Preserve existing shell Chromium/WebKit tests.
- [x] Capture and visually inspect final screenshots for initial and changed state of Button, Accordion, Input, Select, Modal, Tabs, Calendar, FileUpload, navigation and static-media examples, across every framework at least once. Repeat audit's 1440×1000/390×1000 top and preview-area views; require actual Button click output, Modal open then close/focus, changed Tabs panel and visibly selected Calendar date. Check result prominence, balanced frame padding, source below result, readable selector/version, focus visibility, code overflow, no clipped controls or test harness UI. Fix defects and retain before/after evidence; automated DOM assertions alone do not satisfy visual review.
- [x] Compare all 135 routes/anchors, 609 source paths and immutable declaration/compiler proof hashes with pre-work snapshots. Run two clean complete native+docs builds and compare sorted hashes of every deployed byte; runtime tokens never enter artifacts. Run final workspace, licenses, docs type/content/pipeline/browser/reproducibility checks once changes settle.
- [x] Fresh reviewer checks spec coverage, source-to-mounted-example accuracy, native isolation, actual screenshot pixels and bounded evidence claims. Controller reports exact passing matrix and any unresolved defects; final completion requires no promised pair missing. Stop without commit/push/publication/deployment.

## Plan self-review

- Spec coverage: registry/source binding (1–2), native builders and every pair (2,4–5), result-first UI/frame lifecycle/accessibility/no-JS (3), independent CI/cache/rights (6), actual behavior/visual inspection/preservation/reproducibility (7).
- Type consistency: one Task 1 identity/message/manifest vocabulary is shared; page metadata and source props are explicitly added in Task 3; no assumed existing host API or guessed export name.
- Review-focus tests are pinned to Tasks 1–4, 6–7. Full static Qwik proof and all stable defaults remain mandatory, even when partial development mode exists.
- Proportion: parallel framework work shares one artifact contract and one task pattern rather than eight copied plans. All novel paths/signatures are labeled as new deliverables.
- Visual audit findings are incorporated above and in Tasks 3/7; screenshot paths and observed coordinates are backed by the audit, with no claim of a newly implemented preview.
