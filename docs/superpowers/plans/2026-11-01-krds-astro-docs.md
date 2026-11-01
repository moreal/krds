# KRDS Astro Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement task-by-task. The controller owns implementation/review delegation. User approved the design and plan, with native Solid 1 replacing Solid 1 for all document UI. No commits, push, tags, publication or deployment execution are authorized by this plan.

**Goal:** Replace VitePress with a reproducible Astro documentation site whose UI uses actual public native KRDS Solid 1 components throughout.

**Architecture:** Astro owns static route/head generation; one SSR and `client:load` Solid 1 shell per page owns KRDS UI and focus. A deterministic build-only Markdown AST feeds the article renderer, TOC and local search without executing fenced source examples. Ordinary page links preserve existing `.html` and directory-index URLs beneath `/krds/`.

**Tech Stack:** Astro 7.4.4, @astrojs/solid-js 7.1.2, @astrojs/check 0.9.12, marked 18.1.2; Solid 1.9.18, Vite 8.3.5, TypeScript 6.0.2; Node 24.18.0, vendored Yarn 4.14.1, Playwright 1.64.1. Exact new registry metadata and checker/parser compatibility are Task 1 obligations.

**Spec:** `docs/superpowers/specs/2026-11-01-krds-astro-docs-design.md` (user approved; Solid 1 adaptation authorized).

## Global Constraints

- Actual public Solid 1 component imports for controls/navigation/search/results/links/lists/tables; native semantic main/article/headings/paragraphs/pre/code are allowed where no catalog component exists. Layout CSS uses existing tokens and does not recreate widgets.
- Preserve `/krds/`, current HTML paths and heading anchors, 54 references and all609 download paths/availability. Freeze385 historical declarations and62 compiler checkpoints/proofs immutably. Refresh changed current-input snapshot bytes and distribution hashes through an explicit path allowlist with before/after hash/reason diff; never freeze stale lock/resolution/package metadata. This distinction is a controller decision from builder review.
- Use unmodified local `@unofficial-krds/fonts/fonts.css` (400/500/700), public reset `html:62.5%`, docs body1.6rem; default medium Button48px. Supported light/forced-colors only until shared dark support exists.
- Node24.18.0/Yarn4.14.1 through `node tools/yarn.mjs`; sole Yarn lock with pnpm linker; exact consuming workspace dependencies, internal `workspace:^`, Nx implicit dependencies; no root resolutions.
- No original KRDS JS, external runtime assets/fonts/API/telemetry, foreign renderer wrappers, fabricated institutional/privacy claims, or new release/coverage acceptance.
- Preserve independent MIT versus KRDS/font attribution; update distribution inventory for actual assets. Keep historical records immutable.

## Review Focus

- Rich Markdown tables/lists/raw anchors, escaped pipes, code fences and duplicate/Korean headings retain content and exact links/anchors instead of becoming raw HTML or executable Solid 1 examples.
- Search/mobile menus share focus ownership; Escape, keyboard shortcut, viewport changes and simultaneous open requests leave one usable modal with correct focus return.
- Narrow pages with JS disabled, long API signatures and doubled text keep reachable SSR links and readable scroll regions.
- Font loading is actual HTTP + document.fonts success for all three weights, with48px default Button, rather than only a CSS family assertion.
- Documentation evidence recipes still bind exact original test producer and current served bytes after replacing VitePress-specific checks.

## File Map and Interfaces

- `apps/docs/astro.config.mjs`, `src/pages/`, `src/layouts/Document.astro`: static Astro root, exact route wrappers and head metadata.
- `apps/docs/scripts/content.mjs`: `buildPages(root): Promise<DocPage[]>`; parse generated Markdown, resolve local links, preserve slug IDs and construct search records.
- `apps/docs/src/content.ts`: serializable `DocPage`, `DocBlock`, `DocInline`, `SearchRecord` types. No runtime parser imports in client UI.
- `apps/docs/src/components/DocsShell.tsx`: consumes `{page:DocPage,navigation:NavigationItem[],searchIndexUrl:string}`; owns host IDs, mobile/search state, header/footer/main composition.
- `DocArticle.tsx`, `DocBlocks.tsx`, `DocInline.tsx`: render typed AST using public `Link`, `TextList`, `Table`, native prose and `CodeBlock.tsx`.
- `packages/solid/src/components/{text-list,table,link}/index.tsx`: backwards-compatible optional rich item/cell/header render props, ordered-list start/presentation attribute and native JSX Link labels/title; targeted public-subpath SSR/TSX/browser tests retain default string behavior. `packages/solid/vite.config.ts` compiles the owning TSX.
- `SearchDialog.tsx`, `HomeIntro.tsx`: focused shell children; public KRDS components and local state only.
- `apps/docs/src/styles/layout.css`: grid/reflow/prose/code rules and token-based composition; no recreated component styling.
- `apps/docs/tests/`: existing seven source/build obligations plus focused parser/route/unit cases and browser/reproducibility producers; exact count is centralized if suite expands.
- `compatibility/toolchain.json`, `compatibility/evidence/`: exact selected new package records. `tools/check-workspace.mjs`: scan `.astro` imports and ignore generated `.astro` caches.
- Existing generator, provenance/notice tools, Pages workflow and release docs producer remain the owning integration points.

### Task 1: Freeze baseline and build a compatible Astro pipeline

**Files:** package/project/tsconfig/env for docs; Astro config/layout/routes; compatibility metadata; workspace scanner and its tests.

- [ ] Record the pre-migration page paths, heading IDs, local href targets and sorted609 source-download path/byte/hash records from the current build; mark historical versus current-input records, record385 immutable declaration hashes and62 checkpoint/proof identities. Store a reviewed baseline fixture without rewriting historical inputs. Define the explicit changed-current-input allowlist and diff report; start from required dependency provenance lock/resolution records and any docs-consumed package manifests actually changed, not a blanket exemption.
- [ ] Add failing route/build and `.astro` import-policy tests proving existing directory indexes and `.html` outputs, public Solid 1 SSR and undeclared-dependency rejection.
- [ ] Fetch exact published npm metadata for Astro7.4.4, @astrojs/solid-js7.1.2, the chosen parser and @astrojs/check; record source URL/retrieval/hash and engine/peer constraints. Confirm checker supports selected TS6.0.2; do not substitute a TS major or upgrade global tools. Treat inaccessible metadata as an explicit unresolved prerequisite rather than invented proof.
- [ ] Add exact docs dev dependencies and direct public workspace dependencies (including fonts/contracts if used); add krds-fonts to Nx prerequisites. Use selected Vite8.3.5 and Solid1/compiler1.9.16 without root overrides. Remove VitePress only after replacement scripts work.
- [ ] Install through the selected wrapper, then immutable install; inspect actual Astro/integration/Vite/Solid 1 resolutions. Disable Astro telemetry by local build/CI environment configuration. Run actual `.astro` diagnostics plus Solid 1 TSX typechecking, not only `tsc` on metadata.
- [ ] Implement static Astro config and original-path route wrappers using `build.format:'preserve'`. Keep `build:local` generation→Astro build, own `dist`, existing public directory and existing Nx build contract.
- [ ] Verify `node tools/yarn.mjs verify:workspace`, docs typecheck and route/build tests on selected tools. Review before proceeding to content/UI.

### Task 2: Render complete preserved Markdown through public KRDS components

**Files:** `scripts/content.mjs`, `src/content.ts`, `DocArticle.tsx`, `DocBlocks.tsx`, `DocInline.tsx`, `CodeBlock.tsx`; generator glue and content tests; `packages/solid/src/components/text-list/index.tsx`, `apps/fixture-solid/tests/siheom/text-list.test.ts`.

**Consumes:** existing generated Markdown, metadata and frozen migration baseline. **Produces:** sorted `DocPage[]`, route map, headings and `SearchRecord[]`; no executable source markup.

- [ ] Write failing AST tests for table cells with code/link/escaped pipes/br, nested ordered/unordered rich lists, relative/base/query/fragment/raw-anchor links, fenced Vue/Svelte/TSX examples for all existing native frameworks, duplicate and Korean/code headings. The UI renderer change never changes historical native example language/source. Include one representative real reference and compiler checkpoint page.
- [ ] Add targeted public Solid subpath SSR/TSX and browser regressions before changing owning components. Extend `TextListProps` with optional `renderItem?: (item: TextListItem) => JSX.Element`, preserving string fallback and existing 3-level children behavior; compose rich nested lists through renderItem. Add ordered/unordered `data-krds-ordering` and verify computed decimal plus dot/hollow/dash markers. Extend `TableProps` with optional typed `renderCell(row,column): JSX.Element`, preserving existing cell fallback. Owning sources are `packages/solid/src/components/{text-list,table}/index.tsx`, built by the stable Solid Vite plugin. No shared contract widening, other adapters or version bump.
- [ ] Implement build-only parser to serializable block/inline data, exact old slug behavior and a single URL helper. Permit known semantic inline HTML; reject unsupported executable/raw nodes with source location. Assert every document is parsed and unsupported nodes cannot disappear silently.
- [ ] Implement recursive public `Link`/`TextList`/`Table` composition with actual render props; code uses native pre/code and public Button. Add stable captions and overflow-safe long code/table behavior. Preserve all prose/download links and do not treat fenced examples as components.
- [ ] Generate route wrappers/search records in stable order from this same data. Keep index routes as index wrappers and existing non-index routes as `.html`; all local hrefs remain under `/krds/`.
- [ ] Run parser and full built-path/heading comparison tests, docs metadata/download hash tests, targeted Solid 1 TextList regression and public component SSR checks. Compare all609 download paths/availability with baseline; require all385 historical declarations and62 checkpoint/proofs byte-identical. For allowed current-input changes, require downloads match exact current source bytes and regenerated distribution hashes, and produce path/before-hash/after-hash/reason diff. Fail unlisted changes; do not require stale current-input bytes to match baseline. Review rendered rich cases before shell polish.

### Task 3: Build the complete KRDS shell, search and home

**Files:** DocsShell/SearchDialog/HomeIntro/layout CSS; Astro layout; fonts and distribution provenance wiring; browser producer.

**Consumes:** `DocPage`, navigation and local index URL from Tasks1–2. **Produces:** one Solid 1 app/page with deterministic initial state, shared navigation/search focus and SSR article.

- [ ] Add failing browser checks for the required public component identities, nonempty SSR document/links, no-JS narrow navigation, mobile and search keyboard/focus, current nav/TOC targets, real font faces and default48px medium Button.
- [ ] Add optional public `HeaderProps.searchTriggerId?: string` to the actual search button (Header currently has search callback, no actions render prop); test existing calls and focus return. Compose `SkipLink`, `Header`/MainMenu, `SideNavigation`, `Breadcrumb`, `InPageNavigation`, `Footer`, home public components and single focusable main. Give host IDs exactly as spec and keep home state deterministic after reload. Reuse mark.svg and truthful independent project labels.
- [ ] Build local search with public Modal/TextInput/Button/StructuredList/Link, lazy same-origin index loading, Korean/English matching, Ctrl/Cmd+K, result count/status and no-results behavior. Keep at most one menu/search modal open and rely on public Modal trap/inert/restore. Choose dialog initial focus or first interactive input as current API requires.
- [ ] Add public Button code-copy action with keyboard and success/failure status. Disable JS-only actions until mounted. Provide SSR navigation on narrow no-JS pages and verify normal link/download behavior without hydration.
- [ ] Import public reset/component CSS globally, unmodified fonts.css locally, set docs body1.6rem and token-based grid/prose styles. Remove the old `.krds-demo` scoping plugin and VitePress styles. Offer supported light and forced-colors with reduced motion; remove unsupported dark switch/test expectations.
- [ ] Update actual font destination hashes/notice inventory through existing provenance mechanism. Verify all three fonts are delivered beneath `/krds/`, parse as FontFace and are loaded via document.fonts; inspect body and root computed sizes and actual medium Button height48px.
- [ ] Run Chromium/WebKit at desktop/320px/200% text and JS-disabled modes; verify no lost focus/inert/scroll lock on Escape, modal switching and viewport changes. Run axe on home/reference/search/navigation, TOC activation, copy, direct `.html`/index/reload, exact download and legal text/plain checks; require zero errors/hydration warnings/external requests. Review screenshots and largest checkpoint transfer size.

### Task 4: Integrate reproducibility, CI and release evidence

**Files:** docs tests/browser/reproducibility; tools release docs producers/tests; distribution provenance; workspace scanner; relevant README/Pages workflow copy.

- [ ] Replace only obsolete VitePress/font-forbidding/scoped-CSS assertions. Retain 54-reference/current-input/hash/checkpoint/source/legal checks. Add component-only source/import and built-widget assertions so cloned controls or `data-krds-*` decoration cannot satisfy acceptance.
- [ ] Update seven-test count contract if tests expand; keep release browser required assertion names or revise their validator/tests together. Preserve `redirectDocsProducer` exact root/output literals or deliberately update its transform and tests; never edit historical evidence. Verify docs served-response capture binds current index.html and badge.html in both engines.
- [ ] Refresh changed dependency provenance/current-input snapshots through the explicit allowlist; regenerate matching metadata/distribution hashes and review the before/after diff while preserving all609 paths and immutable historical records. Keep optional adapter/Storybook dist hiding around generation. With those same latest inputs, perform two complete Astro builds and compare every deployed filename/hash, including609 downloads, search JSON and font assets. Verify cache/generated route files do not enter source closure or create fresh downloads.
- [ ] Run selected workspace/metadata/license checks, docs typecheck/test/browser/reproducibility and focused release producer/response tests. Inspect Pages/release commands continue consuming docs `dist` and native prerequisites; do not add deploy/publication actions.
- [ ] Obtain controller-owned independent implementation review, resolve material findings and rerun affected checks. Deliver exact changed files, local verification evidence and any unresolved published-version/CI limitations. A hosted push/deploy remains a separate controller-authorized action; no commit is created without the exact active model identity hook.
