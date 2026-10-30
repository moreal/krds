# Solid 2 exact-RC native preview

The exact RC.19 dependency chain was audited after integrator-owned transitive pinning. Native build/type, ten canonical contracts, 28 Chromium/WebKit behavior/SSR cases, and 32 visual/axe renders passed on that coherent set. Earlier mixed-version evidence is archived separately; see `.superpowers/sdd/PLAN/task-T09-solid-next-report.md`.

The six pilot implementations use Solid 2 natively: Button, NativeSelect, Modal, Tabs, Calendar and DateInput. This is a preview, not full-catalog or release certification.

| Layer | Frozen version / policy |
| --- | --- |
| solid-js / @solidjs/web | 2.0.0-rc.19, exact public peers |
| @solidjs/compiler / @solidjs/babel-plugin | 2.0.0-rc.19 |
| @solidjs/vite-plugin | 3.0.0-next.53 |
| Vite / TypeScript | 8.3.5 / 6.0.2 |
| Node / Yarn | selected toolchain 24.18.0 / 4.14.1 |
| Rendering | RC DOM templates, native elements, native dialog Portal |
| SSR | separate server-compiled public exports; built-package consumer |
| Hydration | actual retained DOM node and first click/tab/popup checks |
| Native behavior harness | Playwright Chromium and WebKit |
| Storybook | unsupported in this preview; no verified native RC integration |
| siheom | unsupported for this RC; no Solid 1 peer override |
| Firefox | inherited local Firefox 1555 profile-launch blocker |

Solid's [official migration guide](https://github.com/solidjs/solid/blob/next/documentation/solid-2.0/MIGRATION.md) was checked on 2026-10-30 together with the installed RC.19 CHEATSHEET and runtime/compiler declarations. The adapter uses queued signal writes with explicit imperative reconciliation, split compute/apply effects, renderer-owned JSX types, lowercase HTML attributes, string-valued ARIA booleans, stable event handlers, and component-owned cleanup. Ref callbacks are unowned in Solid 2; Portal setup waits for the actual ref, while disposal remains owned by the component.

The inspected [Ark Solid manifest](https://github.com/chakra-ui/ark/blob/main/packages/solid/package.json) declares development Solid 1.9.17 and the Solid 1 Vite compiler. The [Zag Solid manifest](https://github.com/chakra-ui/zag/blob/main/packages/frameworks/solid/package.json) also targets the Solid 1 generation. Ark's next release label alone does not prove compatibility with this exact RC. Neither wrapper is imported. The implemented direct native binding owns authoritative controlled values, refs, prop watches, normalized native attributes, lifecycle and cleanup. The pinned Zag packages remain isolated available dependencies; this preview does not claim a verified Solid-2-specific upstream Zag connector.

Canonical contract observations are supplemented by native forms, reset cancellation, IME, rejected controlled changes, sequential keyboard navigation, Korean date/state names, range payload/form names, popup confirmation/cancellation, panel preservation, repeated modal unmount cleanup, actual SSR import and hydration tests. Raw native, contract and visual evidence is indexed in `.superpowers/sdd/PLAN/task-T09-solid-next-report.md`.

Native `<dialog>.showModal()` supplies browser top-layer background isolation; `::backdrop` is the native backdrop surface rather than an extra background DOM node. Closed dialogs are absent from the accessibility tree. Server Portal content mounts on the client, following the RC Portal policy; an initially open Modal is not inline SSR page content. The SSR consumer deliberately starts Modal closed and verifies DateInput's first hydrated popup interaction. Do not describe this as initially-open modal SSR coverage.

Button and native select retain browser form algorithms. DateInput has no successful name on its editable drafts; hidden canonical inputs use `name` or `name.start`/`name.end`. Dates remain strict ASCII YYYY-MM-DD, with deterministic Gregorian helpers and no host timezone conversion. Calendar retains a native table and all enabled dates as sequential stops. Local state and explicit props supply every fixture; no API/auth/CDN/external font/image request is needed.

Current evidence covers the six pilots only. Independent tarball installation, full catalog T10, cross-framework release checks, authenticated namespace/repository ownership, and publication authorization are not established by these results. No verified coverage or M2 promotion is made here. Shared compatibility/catalog status is owned by the integrator.
