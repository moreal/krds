# Unofficial KRDS live component examples

Status: **Approved for implementation by the user on 2026-11-01**

Date: 2026-11-01

Scope: documentation examples; implementation has not started under this design.

## Intent and scope

Visitors should be able to choose a public Unofficial KRDS framework package on a component reference page, operate that package's actual component, and read the source that produced the example. A package selector that changes only text, a compiler-checked source listing without a mounted component, or a lookalike rendered by another framework does not satisfy the request.

The user requested the Unofficial KRDS name, a correction to the pictured menu behavior, and working component examples for each package, referring to Zag and Base UI documentation. Naming and the menu correction are separate workstreams; this document designs the live examples. The controller proposes the architecture below; it has not been selected or approved by the user yet.

The first complete delivery covers all **54 web-applicable components × seven stable framework targets = 378 default examples**, plus the six genuinely exported Solid 2 pilots. The Solid 2 selector remains available on the other 48 component pages with a precise unavailable state. Splash screen is excluded from the web catalog. Shared styles, tokens, assets, fonts, and contracts have their existing package documentation; they are not additional renderer choices.

At least one useful default example is required for every stable pair. Additional variants are allowed, but do not replace defaults or inflate completeness counts. Behavioral fixtures and stories remain separate from consumer examples. Examples use deterministic local state, inputs, slots and lawful local assets. They require no account, server, API, telemetry, CDN, remote image or external font.

## Existing architecture and evidence boundaries

`apps/docs` is Astro static output under `/krds/`, with one hydrated Solid 1 `DocsShell.tsx`. `scripts/generate.mjs` generates reference Markdown and validates source evidence; `scripts/content.mjs` parses it into the typed `DocPage`/`DocBlock` model; `scripts/generate-routes.mjs` emits static routes and search data. `DocArticle.tsx` and `DocBlocks.tsx` render the model using public KRDS Solid components. Raw executable HTML is intentionally not a Markdown extension point.

Native implementations and consumers already exist, as recorded in `test-results/unofficial-docs/examples-recon.md`. React, Svelte and Qwik have named or individual native consumers across all 54 entries. Solid has 48 catalog consumers and separate six-pilot consumers. Lit has a 54-entry native factory map. Vue and Angular have substantial native fixture behavior, but their public compiler examples are largely monolithic and need selectable consumer hosts. None of that establishes that a deployed preview works.

The current Pages workflow builds Solid prerequisites and docs, then uploads only `apps/docs/dist`. Local `scripts/serve.mjs` fixture redirections use other origins, omit Qwik, and are not deployed previews. Fixture route readers and asset roots assume paths such as `/fixtures/...`, `/local-assets/...` or `/build/`; copying complete fixture dist directories would publish harnesses and produce broken Pages URLs.

Preserve these independent evidence sets:

| Record | Meaning after this work |
| --- | --- |
| `catalog/coverage.json` | Existing planned/implemented catalog statuses; previews never promote these automatically |
| `apps/docs/example-evidence.json` and 62 compiler checkpoints | Historical compiler evidence, with original source/proof bytes and hashes |
| 385 declaration checkpoints | Historical declarations, not the current example API promise |
| Existing 609 source/proof download paths | All remain accessible, with historical bytes immutable and current-input updates subject to the existing explicit classification/diff policy |
| New demo registry and browser results | Current compiled documentation examples and their narrow preview acceptance only |

All 135 existing site routes, their heading anchors, legal text and source paths remain. New preview routes and source downloads are additive. Rearranging reference sections retains old heading IDs exactly once. Passing preview checks does not establish package release readiness, full catalog acceptance, production SSR/resume acceptance, or authenticated ownership of the npm scope/repository.

## Approaches considered

| Approach | Practical tradeoff and decision |
| --- | --- |
| Add framework islands directly to the Astro shell | Can be attractive for a subset of supported renderers, but the current single Solid 1 pipeline is not a validated integration for all seven targets, Angular's official application builder, Qwik's optimizer/Vite 7, and the exact isolated Solid 2 compiler. Adding islands does not solve every target's lifecycle/source/build requirements. Rejected for this complete scope. |
| Link to existing fixture/Storybook outputs | Reuses artifacts, but existing fixtures expose test controls, incorrect base paths, closed or combined specimens and request-time Qwik routes. Storybook/siheom do not supply supported adapters for every selected target. Links alone also omit the requested working reference-page preview. Rejected as the primary experience. |
| Build native public preview entries in each framework-owned workspace; embed one selected same-origin frame | Preserves each runtime/compiler, keeps foreign renderers out of the shell, supports static Pages output and permits direct full-page examples. Costs are explicit frame focus/height handling and multi-artifact assembly. **Builder proposal.** |

The proposed frame is a rendering boundary, not a substitute renderer. React uses React, Angular uses Angular, Lit uses Lit/custom elements, and the two Solid versions remain separate. The shell continues to use only Solid 1. A visitor selecting Vue receives the Vue preview artifact and source, never a Solid demo with a Vue label.

## Reference-page experience

The page starts with a compact component title and useful summary, followed immediately by:

1. A labeled package selector and, when multiple examples exist, a labeled example selector.
2. A working preview with Reset and Open full page actions, visible loading/error state, and a short local-simulation explanation only where relevant.
3. Source code for that exact selection, a source-file selector for multi-file examples, Copy code, and full-source downloads.
4. Usage, anatomy, keyboard behavior and API reference; existing availability and historical-evidence links remain accessible lower in the page.

This borrows the useful information order from [Zag accordion](https://www.zagjs.com/components/react/accordion), [Zag dialog](https://www.zagjs.com/components/react/dialog), [Base UI accordion](https://base-ui.com/react/components/accordion), and [Base UI dialog](https://base-ui.com/react/components/dialog): a working example tied to real code before deeper reference material. These are UX references only. Do not copy their source, styling, text or branded UI, and do not add Base UI as a dependency.

Selectors and actions use existing public KRDS Solid 1 controls, including NativeSelect, Button and Link; code uses the existing semantic `pre/code` and `CodeBlock` behavior. Shell CSS handles layout and overflow. No homemade replacement controls or foreign design system are introduced. Show package names, actual workspace versions and “Solid 2 preview”; keep compiler/build audit details in downloadable evidence, not the normal selection flow. Label preview availability separately from recorded catalog support.

Use query parameters on the existing reference URL, `?framework=vue&example=default`, so selections are shareable without changing heading anchors. A valid URL selection wins; otherwise reuse a validated session-local package preference, defaulting to Solid 1. Invalid values fall back safely with no arbitrary module/URL loading. The current reference URL and anchor stay usable. A package selection remains selectable even when unavailable, allowing Solid 2's actual limit to be explained. Example choices are recalculated for the selected package; unsupported variant IDs fall back to that package's default.

Only the selected preview is mounted. Load its iframe when it approaches the viewport; package/example changes remove the previous frame and its effects. No seven-runtime preload. Source is available as static readable content/downloads without requiring the preview to execute; with JavaScript disabled, the default source and ordinary full-page example link remain usable. Full-page examples use the same entry/artifact and component, not a second simplified implementation.

## Native preview ownership and output

Each existing `apps/fixture-<framework>` workspace gains a dedicated `docs-preview:local` script and Nx `docs-preview` target. New docs hosts live in `src/docs-preview/`, separately from siheom, story and bridge entries. A target writes only its own `dist/docs-preview/`. It consumes its own public `@unofficial-krds/<framework>` package, shared data/types where appropriate, tokens, public styles and recorded fonts/assets. Every consumed dependency must be directly declared by that workspace. Adapters retain their existing dependency boundaries.

Existing historical example files must not be edited to make them convenient for hosting. Reuse a named consumer only when it already demonstrates real behavior and accepts correct local assets/targets. If it hard-codes broken root URLs, lacks useful state wiring, or is coupled to the harness, write a new native docs example. Wrapping a static Button in a host that updates an output after its actual callback is legitimate; painting a simulated Button around an inert export is not.

| Target | Native host/build strategy |
| --- | --- |
| React | Native `createRoot`; reuse suitable named consumers from `packages/react/examples/catalog.tsx`, with new component-specific docs modules where needed; selected React plugin/Vite 8 |
| Solid 1 | Native `solid-js/web`; suitable catalog/pilot consumers or new docs modules; stable compiler/Vite 8 |
| Svelte | Native Svelte 5 `mount`; suitable individual `public-examples/*Example.svelte` or new docs SFCs; official selected plugin/Vite 8 |
| Vue | New selectable native SFC demos using actual public components; reuse fixture behavior/data deliberately without exposing the state bridge; selected official Vue plugin/Vite 8 |
| Angular | New standalone native docs hosts/templates and local forms/signals; dedicated official `@angular/build:application` configuration, official CLI; public library stays partial APF/ng-packagr |
| Lit | Native registered custom elements/factories plus explicit local event listeners/state and disposal; selected Vite 8; do not publish hydrate/negative-test/harness entries |
| Qwik | Dedicated optimizer-owned client and docs SSR entries, then build-time native HTML per component/example; selected Vite 7; detailed contract below |
| Solid 2 | Separate six-pilot native host with `@solidjs/web`, exact RC compiler/runtime, selected next plugin and Vite 8; no stable Solid or invented support |

Use Node **24.18.0** and vendored Yarn **4.14.1** via `node tools/yarn.mjs`. Preserve `.yarnrc.yml` `nodeLinker: pnpm`, the single lockfile, Vite **8.3.5** except Qwik **7.3.1**, selected direct dependencies, and the exact Solid 2 **2.0.0-rc.19** / plugin **3.0.0-next.53** isolation. No global tool changes, root resolutions, alternate installer or runtime wrapper are part of the design.

CSR hosts have real `index.html` files selected with `?component=accordion&example=default`. Their final base is `/krds/previews/<framework>/`; assets and dynamic chunks must remain beneath it. Qwik emits real `<component>/<example>/index.html` files. Use the explicit manifest URL in both shell and full-page links; never derive paths from fixture route parsers or assume a Pages SPA fallback.

Local navigation examples use existing in-frame sections or a small deterministic local route state with visible content changes. Do not send a visitor to a nonexistent `/local/...` URL. Media and illustrations use explicit preview asset URLs computed in new hosts/data; no regex rewriting of historical source or emitted JavaScript. Prefer relative asset imports resolved by the framework builder. Do not intercept component events to claim state that the real component did not produce.

## Registry, source binding and docs integration

Add a checked-in authoring registry, proposed `apps/docs/demo-definitions.json`, and a generated current artifact, proposed `apps/docs/public/demo-registry.json`. Framework owners supply their native entry/example map; the authoring registry ties the catalog pair to these entries, source display choices and acceptance ID. The generator joins package manifests and build manifests rather than manually repeating versions. Example IDs and component/framework keys are allowlisted identifiers.

Each playable record contains:

| Field | Contract |
| --- | --- |
| Identity | `componentId`, `framework`, `exampleId`, label and stable/preview channel; exactly one default per promised pair |
| Package | Actual public package name/version, renderer identity, and framework-owned host entry |
| Entry | Same-origin deployment URL under `/krds/previews/`, artifact manifest hash, and explicit min-height/layout mode |
| Source files | Repository path, language, role (`example`, `host`, `data`, `style`), SHA-256 of original full bytes, download URL; optional exact display ranges |
| Acceptance | Component-specific scenario ID and interactive/static classification; build/browser results are separate artifacts |
| Unavailable | Reason and supported channel, with no entry URL, fake preview or operative Reset button |

Source is read from the bytes actually passed to that framework build. Prefer displaying a full small native example file. When a protected monolithic consumer is reused, show its exact consumer function/template range plus the actual imports and dependent constants/host wiring as separately labeled ranges or files. Source ranges are explicit UTF-8 byte intervals on the full file, with a full-file hash, range hash and derived one-based line span. Never concatenate disjoint ranges into a supposedly complete runnable file; show their boundaries and retain full-source downloads. A source binding identifies the actual exported symbol/factory or native template branch and the host module importing it. A displayed excerpt is labeled as an excerpt.

The framework build records the source hashes it compiled and source-module/import bindings before compilation; assembly recomputes them and rejects mismatches. Range bounds, hashes, selected symbol/branch and required host/data files are checked. For SFCs the `.vue`/`.svelte` original is authoritative; for Angular include its actual inline/external template plus class; for Lit include factory setup, event wiring and lifecycle; for Qwik include native `component$` and docs SSR selection. Compiler-generated chunks are not presented as authoring examples. A hand-authored illustrative snippet may remain in usage prose, but is never labeled “source of this preview.”

Add a typed `demo` DocBlock with a `componentId` to `apps/docs/src/content.ts`. The build content transform inserts exactly one block after the component heading/summary and before detailed reference sections, using explicit component-page metadata, not a fragile text search. `DocBlocks` delegates to a new Solid 1 `NativeDemo` shell component. Markdown continues rejecting raw script/iframe HTML. The registry is validated at build time; only page-relevant source and metadata enter SSR/hydration, not all 378 examples on every page. Large alternate sources can be fetched on selection from same-origin `.txt` artifacts, with the same hash-bound manifest.

The generator preserves old headings and existing reference routes. New primary sections are Usage, Anatomy, Keyboard and API when the reviewed component specification supplies that information. Keep existing heading IDs on their corresponding sections and retain explicit legacy anchor links when headings are renamed. Do not invent anatomy or callback support; derive current package examples and shared semantic reference from their actual source/contracts, retaining historical declaration labeling.

## Frame lifecycle, focus and sizing

The preview is trusted same-origin project code. Give the frame an informative title containing component/package/example. Permit only required sandbox features (`allow-scripts allow-same-origin`); do not enable top navigation, forms that leave the example, popups, or downloads by default. This same-origin sandbox is not a security boundary against trusted preview code. Example form submissions are local and prevented; files stay in local state. Host code must not use shell DOM or global test bridges.

The parent generates a runtime-only frame instance token and passes the known identity/token in the entry URL. A versioned, strict message union allows `ready`, `size`, `error` and `return-focus`; parent initialization may pass only supported presentation settings. Both sides check exact origin, `event.source`, protocol version, current token and identity. Parent accepts size only from the selected frame's `contentWindow`; child accepts initialization only from its own parent. Reject unknown fields/types, stale messages, non-finite dimensions and arbitrary URLs/HTML. Messages do not execute code or mutate example inputs.

The child measures its docs root with ResizeObserver, coalescing changes to animation frames. The parent bounds height to **240–1200 CSS px**, with a registry-defined minimum (640 for overlay-focused defaults). Content taller than the maximum scrolls inside the frame. Avoid `100vh`/minimum-body rules that produce a resize feedback loop. Width follows the container. Overlay examples must demonstrate their actual focus/scroll behavior within the preview viewport; Open full page provides an unconstrained viewport. Tests cover grow/shrink, tall menus, zoom and narrow layouts.

Reset reloads/remounts the selected entry with a fresh runtime token and the same initial deterministic inputs, disposing the old frame and all its local state. Removing or switching a frame clears readiness timers/listeners and ignores stale replies. A 15-second missing-ready timeout offers Retry and Open full page without declaring success. A ready message means the native host mounted, not that behavioral acceptance passed. Network/host errors produce a visible error; console errors also fail browser verification. Build failures remain failures, never registry “playable” records.

Keyboard users have a “Skip example” link before the frame and a clearly labeled return-to-documentation action at the end of each native host. That action sends the validated return-focus message; parent focuses the preview heading/control. Normal Tab/Shift+Tab can cross the frame boundary once no component modal is open. Escape belongs to the demonstrated component and is not globally hijacked to leave the iframe; verify closing a Modal returns focus to its in-frame trigger, then normal Tab/return navigation exits. Package changes keep focus on the selector and announce the new preview state rather than moving focus into a frame automatically.

Respect reduced motion and forced colors through the existing foundations and browser environment. The current foundation supports light/forced-colors, not a complete dark token theme: do not add a dark selector that promises unsupported rendering. Only pass a presentation setting if it has an actual visible supported implementation.

## Qwik static Pages contract

Use the real selected Qwik optimizer and native `renderToString` at build time. A dedicated docs SSR map chooses the native `component$` example before rendering, includes the actual client manifest, and writes one HTML document per component/example. Its Qwik client asset base resolves beneath `/krds/previews/qwik/build/`; copy every referenced optimizer chunk and local asset. Only public HTML/client assets and audit manifests are deployed, never the server module.

Pages serves that generated HTML directly. Do not rely on the fixture's request-time `server.mjs`, load a server endpoint after navigation, replace Qwik with React, or install a post-load fake state driver. Qwik's real serialized handlers/QRLs must execute on first interaction. Build/browser checks exercise input, selection, open/close and focus, date interaction, local file state and reset on final static output. Source shown is the native example and actual SSR host binding used in this build.

If an example cannot produce correct optimized static HTML/QRL behavior, the implementation is incomplete. During development the registry may describe its truthful unavailable reason, but the final 378 stable-default acceptance gate does not pass while any stable default is unavailable. This is different from the intentional 48 unavailable Solid 2 entries. Successful static examples establish documentation preview behavior only; existing request-time Qwik SSR/resume suites remain separate production evidence.

## Build graph, assembly and deployment artifact

Framework targets depend on their own public package/shared prerequisites. Add direct fonts/assets dependencies when their previews consume them, both in manifests and `implicitDependencies`. Docs gains the eight fixture preview owners as explicit Nx implicit/build dependencies. Ordinary workspace `build` continues invoking `build:local`; dedicated preview scripts/targets complement that convention rather than changing all fixture builds into docs builds.

Provide a deterministic `docs-previews` aggregate and assembly script. The docs `build` target requires the native `docs-preview` targets plus its normal prerequisites, then runs generation/assembly/Astro in a defined order. The docs workspace's direct build path must also fail clearly if fresh required artifacts are absent; it must never silently reuse a partial output. Framework builders write no files into another workspace. To prevent competing Nx cache restores, preview output ownership is explicitly `dist/docs-preview`, and existing fixture target output declarations must exclude that subtree or use a separate disjoint fixture output subtree. Running fixture and preview targets in parallel must not clean each other's output.

Each native output includes a sorted manifest of deployable relative paths, bytes/hashes, compiled source bindings, package/runtime identity and actual bundled dependency inventory. Assembly cleans only generated preview destinations, validates complete manifests and path containment, rejects unexpected symlinks/path traversal, and copies an explicit allowlist into `apps/docs/public/previews/<framework>/`. It then generates the current demo/source registry before Astro copies public content into `dist`. No blanket fixture-dist copy, request server, harness/negative-test entry or optional local redirect is deployed. The local docs server serves this same assembled tree so local checks match Pages.

Cache inputs include exact lock/toolchain/framework settings, native docs modules/hosts, reused source consumers, shared semantic data, catalog IDs, asset/font bytes and provenance, source-binding definitions, all builder configurations, assembly/provenance scripts, and dependent public package sources/builds. Cache outputs include the full native output and manifests, not just HTML. Build-time code adds no timestamps, random IDs, machine paths or unstable ordering to deployable bytes; runtime frame tokens are excluded from reproducibility.

Update `.github/workflows/docs-pages.yml` so independently provisioned exact-toolchain matrix workers build native preview artifacts in parallel, each after immutable installation and its own prerequisites. The assembly/docs job checks out the same revision, installs immutably, downloads exact named artifacts, validates their manifests/source bindings and builds the shell. No shared mutable build directory between workers and no Nx Cloud. Run checks on the final `/krds/` static tree and upload `apps/docs/dist`, including previews. Preserve existing shell/content/rights/browser checks. The workflow edits do not authorize triggering deployment, pushing, tagging or publishing.

## Asset, runtime and source provenance

Retain `compliance/project-identity.json`: independent MIT code is Lee Dogeon's completed 2026 grant, separate from KRDS and font rights, with scope/account/repository ownership unverified. Keep official source URLs, baselines, retrieval dates and hashes before any newly incorporated upstream material. Do not copy original KRDS JavaScript into examples controlling the same DOM as Ark/Zag.

Current `tools/refresh-docs-distribution.mjs` intentionally checks the existing 609-source set and three font destinations under `_astro`. Do not weaken it to ignore previews or replace exact checks with broad globs. Extend the existing distribution/provenance model with a separate current `nativePreviews` inventory that records every additional deployed source, image/media/font destination and bundled runtime/notice. Preserve legacy source inventory assertions and historical bytes. A font may now have several preview destinations; each must hash-match the same unmodified recorded source, carry the correct rights evidence, and be accounted for explicitly.

Collect real bundle module/package identities from each framework builder, including Qwik optimizer output and Angular application output, and bind them to existing dependency provenance/license documents. Adapt or extend the current bundle provenance machinery rather than pretending the Astro Solid-only inventory covers these artifacts. Missing runtime notice or asset classification fails assembly/license verification. Update lawful notice generation and current distribution hashes with a reviewable diff. New independent demo source is separately classified; no published placeholder holder or imported-reference-source license assumption.

## Execution slices after approval

1. Establish the registry, per-workspace artifact/source contract, disjoint output ownership, current-preview provenance model and strict completeness validator. Inventory every default's intended interaction/semantic proof before labeling any as playable.
2. Build a vertical slice spanning a real React example and the hard architectural cases: Qwik optimized static interaction, official Angular preview build and isolated Solid 2. Prove prefixed assets, exact source binding, reset, sizing, focus exit and bundle identity against assembled static output. These are production-path slices after approval, not permission to scaffold before it.
3. Complete native hosts for all stable components in bounded framework-owned batches, reusing suitable native consumers and writing new pure examples where required. Complete all six Solid 2 pilots and its 48 explicit unavailable rows. Maintain independent per-framework build artifacts.
4. Integrate the typed docs block and native KRDS preview/source controls, reference section ordering and legacy anchors. Complete deterministic assembly, local serving, dependency inputs, notices and Pages workflow artifacts.
5. Run the acceptance matrix below on final output, fix failures, verify two clean builds, and produce a reviewable implementation/evidence diff. Rename/menu changes remain separately reviewable. No commits are created while the exact active model identity hook is unavailable; no publication/push/tag/deployment is authorized.

## Acceptance matrix

All checks run with the selected toolchain. Browser checks serve the **final assembled static tree under `/krds/`**, never a native dev server or Qwik request server. Store current preview results under a separate test-results directory with registry/artifact hashes; do not overwrite historical evidence producers.

| Area | Required evidence |
| --- | --- |
| Matrix and native ownership | Exactly 378 stable defaults plus six Solid 2 pilots are playable; all 48 other Solid 2 rows explicitly unavailable. Each playable route renders a real public component and is tied to its selected package/compiler output. Bundle inventories show no foreign renderer in a preview or Solid 2 runtime in the shell. No empty suite or missing row passes. |
| Every interactive default | A component-specific action produces the expected real outcome, followed by reset to baseline. Opening a control without proving its effect is insufficient. Use shared semantic acceptance IDs with native locators as needed, without sharing renderer implementations. |
| Every static default | Assert meaningful semantics/assets: Badge's accessible label, Table caption/header relationships, VisuallyHidden accessible content, Image resolved local media/alt, Favicon's actual head links and a visible explanation. Do not require artificial click handlers. |
| Forms and local state | Representative edited input/textarea, select/radio/checkbox/switch, range/quantity, date/calendar, tag removal, upload file selection/removal/reset. Assert actual value/form/local output; uploads perform no network request. |
| Disclosure and overlays | Accordion/disclosure expanded content; tabs active panel; Modal/BottomSheet/help/tooltip/tutorial actual opening, action/close and keyboard focus restoration; notification persistent result/action where applicable. |
| Navigation/media examples | Local destination/content/focus actually changes for menus, pagination, back/in-page navigation and language controls; image/audio/video assets load locally. Explicit TTS simulation changes its real controlled state and says it does not play speech. |
| Frame and source UI | All package switches select the matching route/source; stale messages rejected, bounded resizing, loading/timeout/retry, Reset, source-file selector, copy fidelity, full-source downloads and full-page link work. No unavailable entry loads another runtime. |
| Browser breadth | Full playable render/action/semantic matrix in Chromium. All 54 stable component families represented in WebKit, rotating stable framework coverage plus every six-pilot target; both browsers cover each framework's forms, overlay/focus and reset, all Qwik first-interaction/QRL categories, frame boundary behavior, 320px width and 200% text. Existing shell Chromium/WebKit checks remain. Broader framework-contract suites are separate. |
| Source/artifact accuracy | Full/range hashes match actual compiled inputs; the selected function/template/factory is the one mounted. Missing source, manifest, dependency notice, asset, chunk or promised HTML fails the build. No unexpected external requests, console/page errors or duplicate host IDs. |
| Documentation preservation | Existing 135 routes/anchors and 609 source paths remain; 385 declarations/62 checkpoint proof sets keep immutable bytes. Current input changes retain explicit classifications/diffs. API/availability wording does not claim catalog completion or release readiness. |
| Reproducibility and rights | Two clean builds of the same inputs produce identical complete site bytes, including native chunks and registries. All new font/asset/runtime/source destinations appear in the lawful current distribution inventory; workspace/toolchain/license checks pass. |

Minimum useful default behavior is selected per component, not inferred from its name. The initial acceptance map must explicitly cover compound defaults (for example TutorialPanel needs usable targets/start/stop, and FileUpload needs a real local File/form state). Framework compiler success, nonempty HTML and a `ready` handshake are prerequisite evidence, not substitutes for these outcomes.

## Decisions left for approval and implementation

The user-facing decision is whether to approve the proposed native per-workspace/frame architecture and the full 378-default plus six-preview scope. No smaller sample-only interpretation is assumed. The builder may settle exact script filenames, source-display ranges, action labels, chunk splitting and per-component layout minima within this contract, documenting meaningful deviations. If a native package defect prevents a promised example, report and fix it in its owning package with focused validation; do not hide it behind a foreign renderer or a successful docs-only label. New package behavior or expanded support beyond this design requires a separate reviewable scope decision.

Local design evidence: `test-results/unofficial-docs/examples-recon.md`, `apps/docs/src/content.ts`, `apps/docs/src/components/DocArticle.tsx`, `apps/docs/src/components/DocBlocks.tsx`, `apps/docs/scripts/generate.mjs`, `apps/docs/scripts/generate-routes.mjs`, `apps/docs/scripts/bundle-provenance.mjs`, `apps/fixture-qwik/build.mjs`, `apps/fixture-angular/angular.json`, `packages/solid-next/src/index.ts`, `tools/refresh-docs-distribution.mjs`, `nx.json`, `.github/workflows/docs-pages.yml`.
