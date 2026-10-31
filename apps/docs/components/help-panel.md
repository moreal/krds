---
title: 'Help panel · 도움 패널'
---

# Help panel

도움 패널 · `HelpPanel` · composition

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_08_01.html) · [Full reviewed specification](/sources/specs/components/help-panel.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [current subpath manifest](/sources/packages/react/package.json.txt); [historical declaration checkpoint](/sources/packages/react/dist/components/help-panel/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.1.0` | planned | [current subpath manifest](/sources/packages/solid/package.json.txt); [historical declaration checkpoint](/sources/packages/solid/dist/components/help-panel/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [current subpath manifest](/sources/packages/svelte/package.json.txt); [historical declaration checkpoint](/sources/packages/svelte/dist/components/HelpPanel.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [current subpath manifest](/sources/packages/vue/package.json.txt); [historical declaration checkpoint](/sources/packages/vue/dist/components/help-panel/HelpPanel.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [current subpath manifest](/sources/packages/lit/package.json.txt); [historical declaration checkpoint](/sources/packages/lit/dist/components/help-panel/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [current subpath manifest](/sources/packages/qwik/package.json.txt); [historical declaration checkpoint](/sources/packages/qwik/dist/components/help-panel/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [current subpath manifest](/sources/packages/angular/package.json.txt); [historical declaration checkpoint](/sources/packages/angular/dist/types/unofficial-krds-angular-help-panel.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [current root manifest](/sources/packages/solid-next/package.json.txt); [historical declaration checkpoint](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface HelpPanelContract extends ControlledOpen {
    topics: readonly HelpTopic[];
    selectedTopicId?: string | null;
    defaultSelectedTopicId?: string | null;
    onTopicChange?: (detail: {
        id: string | null;
    }) => void;
    mode?: 'help' | 'tutorial';
    fallbackFocusId?: string;
}

export interface ControlledOpen {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (detail: OpenChangeDetails) => void;
}

export interface OpenChangeDetails {
    open: boolean;
}

export interface HelpTopic {
    id: string;
    title: string;
    content: string;
    relatedLinks: readonly LinkData[];
}

export interface LinkData {
    id?: string;
    label: string;
    href: string;
    target?: string;
    rel?: string;
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `open` | no | `boolean` | data / state |
| `defaultOpen` | no | `boolean` | data / state |
| `onOpenChange` | no | `(detail: OpenChangeDetails) => void` | semantic event request |
| `topics` | yes | `readonly HelpTopic[]` | data / state |
| `selectedTopicId` | no | `string \| null` | data / state |
| `defaultSelectedTopicId` | no | `string \| null` | data / state |
| `onTopicChange` | no | `(detail: {id: string \| null}) => void` | semantic event request |
| `mode` | no | `'help' \| 'tutorial'` | data / state |
| `fallbackFocusId` | no | `string` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Body followed by opener and help panel. Panel header offers optional Help/Tutorial tabs and close, content initial guidance or context-specific title/body, divider and related/help-channel footer. Context icon triggers beside related field/section have unique names; section title matches associated label.

### Plain semantic API

Independent API: open/defaultOpen=true on wide layout, selectedTopicId/defaultSelectedTopicId=null, onOpenChange({open}), onTopicChange({id}), topics {id,title,content,relatedLinks}[], mode=help|tutorial when composed, `fallbackFocusId?`. Closing/reopening preserves last topic; content changes only from an explicit contextual trigger. The panel opener is the separate persistent “open panel” button, not whichever contextual topic icon initiated this opening.

The [pilot controlled/reset conventions](/sources/specs/components/README.md.txt) apply to each declared controlled field: props are authoritative, defaults read once, controlled/default together or mode switching invalid, one changed user request, no mount/prop/reset callbacks. A rejected controlled close retains the visible panel and its narrow-modal isolation/trap; no early return focus occurs.

### Keyboard, focus and state transitions

Opening focuses the panel container itself. Desktop panel permits Tab out without a trap; narrow presentation uses Modal-equivalent initial-container focus, isolation, scroll locking, topmost Escape and Tab wrapping while actually open. Links open a new window with communicated purpose.

**HelpPanel is the sole restoration owner in both modes.** The official close action returns to the distinct panel-opening button ([L1265–1278](https://www.krds.go.kr/html/site/component/component_08_01.html)), even if a surviving topic icon opened the narrow panel. Reuse lower-level native isolation/trapping/entry primitives with their automatic return disabled/delegated to this composition; do not instantiate the public Modal contract and then override its saved usable opener using returnFocusId or a second focus call. The public [Modal actual-opener rule](/sources/specs/components/modal.md.txt) remains unchanged. This explicit composition adaptation preserves HelpPanel's more specific official destination alongside narrow-modal presentation ([L1004–1005](https://www.krds.go.kr/html/site/component/component_08_01.html)).

On an accepted actual true→false transition, first remove this panel's isolation/scroll lock, then focus exactly once: usable panel opener; else usable fallbackFocusId; else saved initiating topic icon if usable; else nearest remaining usable focusable ancestor of that icon; else document body with temporary tabindex=-1 (restore prior tabindex). Usable means mounted, visible, enabled, focusable, same live document, and not inert. Return policy also runs on unmount of an open panel after cleanup, without synthetic change events. A rejected controlled close does none of this; focus stays inside the active narrow modal. If a Tutorial/Coach Stop transaction owns this transition, explicitly hand off restoration to that one coordinator rather than running both owners.

### Responsive/mobile requirements

Wide initial panel open with initial guidance; narrow initially opener-only, opens modal. Keep icons >=44px target where applicable and no essential information exclusively hidden in help.

### Forms, reset and composition

No aggregate form/reset; panel must not clear in-progress body inputs or steal composing keys.

### Asset, integration and composition completion

Recommend component→composition: includes topic triggers, stateful panel, optional Tabs/TutorialPanel, Modal on narrow and related links. Completion requires a working field/topic demo and responsive shell; host owns help content/URLs and external help channels.

### Stable parts and states

root, opener, topic-trigger, header, tabs, close, title, body, related; open,closed,active-topic,modal.

All rendered owned parts use `data-krds-component="help-panel"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `desktop-open`, `narrow-modal`, `initial`, `context-detail`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-help-panel--desktop-open`, `krds-help-panel--initial`, `krds-help-panel--context-detail`, `krds-help-panel--narrow-modal`, `krds-help-panel--topic-trigger-removed`, `krds-help-panel--help-tutorial-tabs`, `krds-help-panel--narrow-topic-icon-return`, `krds-help-panel--controlled-close-rejected`, `krds-help-panel--panel-opener-removed`.

### Local native stories

Fixture and Storybook outputs are local-only and are not hosted on this public documentation site. Build the selected native workspace, then run `node tools/yarn.mjs exec node apps/docs/scripts/serve.mjs`. Open `/krds/native/storybook-<framework>/` on that local server. Solid 2 has no supported native Storybook integration. Qwik production SSR/resume requires its real server and cannot be replaced by a static preview. Story availability does not establish behavioral acceptance.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-37); [download exact source](/sources/apps/fixture-svelte/src/public-examples/HelpPanelExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:04.876Z`. SHA-256: `c52ffcdd1637839597336232526fc7a56aa80a77de5d81a219ab4e13d3c5b346`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_08_01.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
