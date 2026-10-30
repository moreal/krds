# Native Solid compatibility

Stable Solid uses `solid-js` 1.9.18 and its native compiler/renderer, isolated from the Solid 2 RC package. Public components import no foreign adapter. Dependencies, native compiler and test tools remain exact consuming-workspace declarations; selected Node 24.18.0 and vendored Yarn 4.14.1 are launched through `node tools/yarn.mjs`.

The native package now contains 54 typed public components, compositions, assets and integrations. Source availability does not establish completed full-catalog verification. Existing six-component pilot acceptance is preserved separately from T10's 315 outcomes and 344 story states; pending content/device/visual evidence is never counted as verified.

All public APIs have compiled examples in `apps/fixture-solid/src/examples.tsx` (existing six) and `apps/fixture-solid/src/catalog-examples.tsx` (additional 48). Every entry below is also an individual package subpath.

| Entry | Native implementation |
| --- | --- |
| `@unofficial-krds/solid/button` | [`button`](../../packages/solid/src/components/button/index.tsx) |
| `@unofficial-krds/solid/native-select` | [`native-select`](../../packages/solid/src/components/native-select/index.tsx) |
| `@unofficial-krds/solid/modal` | [`modal`](../../packages/solid/src/components/modal/index.tsx) |
| `@unofficial-krds/solid/tabs` | [`tabs`](../../packages/solid/src/components/tabs/index.tsx) |
| `@unofficial-krds/solid/date-input` | [`date-input`](../../packages/solid/src/components/date-input/index.tsx) |
| `@unofficial-krds/solid/calendar` | [`calendar`](../../packages/solid/src/components/calendar/index.tsx) |
| `@unofficial-krds/solid/disclosure` | [`disclosure`](../../packages/solid/src/components/disclosure/index.tsx) |
| `@unofficial-krds/solid/pagination` | [`pagination`](../../packages/solid/src/components/pagination/index.tsx) |
| `@unofficial-krds/solid/footer` | [`footer`](../../packages/solid/src/components/footer/index.tsx) |
| `@unofficial-krds/solid/skip-link` | [`skip-link`](../../packages/solid/src/components/skip-link/index.tsx) |
| `@unofficial-krds/solid/in-page-navigation` | [`in-page-navigation`](../../packages/solid/src/components/in-page-navigation/index.tsx) |
| `@unofficial-krds/solid/accordion` | [`accordion`](../../packages/solid/src/components/accordion/index.tsx) |
| `@unofficial-krds/solid/favicon` | [`favicon`](../../packages/solid/src/components/favicon/index.tsx) |
| `@unofficial-krds/solid/main-menu` | [`main-menu`](../../packages/solid/src/components/main-menu/index.tsx) |
| `@unofficial-krds/solid/image` | [`image`](../../packages/solid/src/components/image/index.tsx) |
| `@unofficial-krds/solid/identifier` | [`identifier`](../../packages/solid/src/components/identifier/index.tsx) |
| `@unofficial-krds/solid/link` | [`link`](../../packages/solid/src/components/link/index.tsx) |
| `@unofficial-krds/solid/table` | [`table`](../../packages/solid/src/components/table/index.tsx) |
| `@unofficial-krds/solid/structured-list` | [`structured-list`](../../packages/solid/src/components/structured-list/index.tsx) |
| `@unofficial-krds/solid/critical-alert` | [`critical-alert`](../../packages/solid/src/components/critical-alert/index.tsx) |
| `@unofficial-krds/solid/text-list` | [`text-list`](../../packages/solid/src/components/text-list/index.tsx) |
| `@unofficial-krds/solid/breadcrumb` | [`breadcrumb`](../../packages/solid/src/components/breadcrumb/index.tsx) |
| `@unofficial-krds/solid/side-navigation` | [`side-navigation`](../../packages/solid/src/components/side-navigation/index.tsx) |
| `@unofficial-krds/solid/header` | [`header`](../../packages/solid/src/components/header/index.tsx) |
| `@unofficial-krds/solid/masthead` | [`masthead`](../../packages/solid/src/components/masthead/index.tsx) |
| `@unofficial-krds/solid/badge` | [`badge`](../../packages/solid/src/components/badge/index.tsx) |
| `@unofficial-krds/solid/contextual-help` | [`contextual-help`](../../packages/solid/src/components/contextual-help/index.tsx) |
| `@unofficial-krds/solid/tooltip` | [`tooltip`](../../packages/solid/src/components/tooltip/index.tsx) |
| `@unofficial-krds/solid/language-switcher` | [`language-switcher`](../../packages/solid/src/components/language-switcher/index.tsx) |
| `@unofficial-krds/solid/help-panel` | [`help-panel`](../../packages/solid/src/components/help-panel/index.tsx) |
| `@unofficial-krds/solid/tab-bar` | [`tab-bar`](../../packages/solid/src/components/tab-bar/index.tsx) |
| `@unofficial-krds/solid/range-slider` | [`range-slider`](../../packages/solid/src/components/range-slider/index.tsx) |
| `@unofficial-krds/solid/snackbar` | [`snackbar`](../../packages/solid/src/components/snackbar/index.tsx) |
| `@unofficial-krds/solid/back-button` | [`back-button`](../../packages/solid/src/components/back-button/index.tsx) |
| `@unofficial-krds/solid/tutorial-panel` | [`tutorial-panel`](../../packages/solid/src/components/tutorial-panel/index.tsx) |
| `@unofficial-krds/solid/toast` | [`toast`](../../packages/solid/src/components/toast/index.tsx) |
| `@unofficial-krds/solid/quantity-toggle` | [`quantity-toggle`](../../packages/solid/src/components/quantity-toggle/index.tsx) |
| `@unofficial-krds/solid/fab` | [`fab`](../../packages/solid/src/components/fab/index.tsx) |
| `@unofficial-krds/solid/coach-mark` | [`coach-mark`](../../packages/solid/src/components/coach-mark/index.tsx) |
| `@unofficial-krds/solid/checkbox` | [`checkbox`](../../packages/solid/src/components/checkbox/index.tsx) |
| `@unofficial-krds/solid/spinner` | [`spinner`](../../packages/solid/src/components/spinner/index.tsx) |
| `@unofficial-krds/solid/carousel` | [`carousel`](../../packages/solid/src/components/carousel/index.tsx) |
| `@unofficial-krds/solid/textarea` | [`textarea`](../../packages/solid/src/components/textarea/index.tsx) |
| `@unofficial-krds/solid/visually-hidden` | [`visually-hidden`](../../packages/solid/src/components/visually-hidden/index.tsx) |
| `@unofficial-krds/solid/file-upload` | [`file-upload`](../../packages/solid/src/components/file-upload/index.tsx) |
| `@unofficial-krds/solid/tts` | [`tts`](../../packages/solid/src/components/tts/index.tsx) |
| `@unofficial-krds/solid/switch` | [`switch`](../../packages/solid/src/components/switch/index.tsx) |
| `@unofficial-krds/solid/bottom-sheet` | [`bottom-sheet`](../../packages/solid/src/components/bottom-sheet/index.tsx) |
| `@unofficial-krds/solid/radio-group` | [`radio-group`](../../packages/solid/src/components/radio-group/index.tsx) |
| `@unofficial-krds/solid/accessible-media` | [`accessible-media`](../../packages/solid/src/components/accessible-media/index.tsx) |
| `@unofficial-krds/solid/resize` | [`resize`](../../packages/solid/src/components/resize/index.tsx) |
| `@unofficial-krds/solid/tag` | [`tag`](../../packages/solid/src/components/tag/index.tsx) |
| `@unofficial-krds/solid/step-indicator` | [`step-indicator`](../../packages/solid/src/components/step-indicator/index.tsx) |
| `@unofficial-krds/solid/text-input` | [`text-input`](../../packages/solid/src/components/text-input/index.tsx) |

Controlled values/open/checked are authoritative. Defaults are read once and cannot be combined with controlled props; changing mode is a configuration error. Native forms retain label, validation, disabled submission, canceled reset and IME behavior. Hosts accept or reject plain semantic requests. Same-ID data reconciliation preserves native control identity and focus.

FileUpload retains actual browser File handles in host state. `appendCommittedFiles` removes the ephemeral chooser field and appends exactly the committed enabled records on explicit submission. Choosing/dropping files performs no transfer. The local fixture uses a native File map, plain bridge metadata, real FormData File bytes and a submit-gated local receipt.

Favicon owns actual head link nodes and cleans only its nodes. AccessibleMedia uses native audio/video and real local VTT tracks/alternatives. The bundled local test media is a synthetic mathematical 440 Hz signal plus simple geometric video, with matching synthetic-signal/visual descriptions; it is not authentic speech or signing. Authentic sign-language content and human equivalence review remain pending. macOS System Voice output was removed from public assets because its redistribution is not cleared.

Help/Tutorial compositions own focus restoration, with narrow modal isolation/trapping provided by the same internal native isolation layer as Modal. A usable actual topmost modal bounds Stop restoration. CoachMark only advances a required-action step after a host verifier confirms the corresponding real target interaction; stale or rejected completions cannot advance a new generation. Toast/Snackbar presence and queue remain host-owned; timeout is one request per semantic generation. Toast results also remain discoverable in persistent local result content.

Verification commands (no publishing, pushing or tagging):

```sh
node tools/yarn.mjs workspace @unofficial-krds/solid typecheck
node tools/yarn.mjs workspace @unofficial-krds/solid build:local
node tools/yarn.mjs workspace @unofficial-krds/solid test
node tools/yarn.mjs workspace @unofficial-krds/solid exec vitest run --config vitest.responsive.config.ts
node tools/yarn.mjs workspace @unofficial-krds/fixture-solid typecheck
node tools/yarn.mjs workspace @unofficial-krds/fixture-solid siheom:local
node tools/yarn.mjs test:contract --catalog --framework solid
node tools/yarn.mjs workspace @unofficial-krds/storybook-solid build:local
node tools/yarn.mjs test:stories --catalog --framework solid
```

The shared `test:stories --catalog` gate and the owned `apps/storybook-solid/verify-full-catalog.mjs` inspection runner check the frozen full-story IDs, native state expectations, raw axe zero, forbidden-request zero and per-state screenshots independently of the stable pilot selection. Logs and exact source snapshots are in `.superpowers/sdd/PLAN/t10-solid-logs/`; the current execution status is recorded in `task-T10-solid-report.md`. Manual screen-reader, authentic media-equivalence, touch arbitration and real browser-zoom obligations remain explicit until actually performed.

Public root and component subpaths provide native Node server entries and hydratable browser entries. Server rendering and first-interaction evidence must consume those public exports; a client-only build is not SSR evidence. Favicon server-owned head integration is outside the constructor smoke test and remains separately bounded.
