# Native contract conventions

These contracts bind every native adapter. Read this file with each component spec. Shared types are exported by `@unofficial-krds/contracts`; adapters add their own native children, refs, listeners and callback transport. No renderer type enters the shared package. These documents specify behavior; they are not evidence that any adapter implements it.

## Source and policy boundary

Official requirements below are paraphrases of the frozen KRDS detail pages linked in each spec. The source identity, retrieval time, bytes and SHA-256 are recorded in `upstream/krds/manifest.json` and repeated in `catalog/components.json`. Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`; retrieval: 2026-10-29 UTC (2026-10-30 Korea). The frozen live website is separate from kit tag 1.1.0. Project defaults resolve details KRDS does not prescribe; they are not claims about KRDS or Ark/Zag defaults. No original KRDS JavaScript controls adapter DOM.

## State and notifications

A defined `value` or `open` chooses controlled mode, including empty string, null, false and an empty range. Absence (`undefined`) chooses uncontrolled mode. A controlled prop and its `default*` counterpart together are a configuration error (`TypeError`); changing modes after mount is also a configuration error. `default*` is read once; later changes do not alter state or the reset baseline. Controlled props are authoritative: an action requests a change, and the displayed committed state changes only when the parent changes the prop. Prop updates, mount, hydration, default initialization, focus movement and form reset emit zero user change notifications.

Uncontrolled state changes synchronously once per accepted user action and emits once after that update. A controlled action emits one request even if the parent declines it. An action requesting the current committed value, a disabled action, or an invalid action emits zero. Do not emit twice from paired keydown/click or input/change listeners. The semantic callbacks are `onValueChange(ValueChangeDetails<T>)` and `onOpenChange(OpenChangeDetails)`; native framework event naming and binding are adapter APIs. Events carry plain values, never framework event objects. A canceled native form reset does nothing. A non-canceled reset restores uncontrolled initial state and clears drafts/errors without a change callback; controlled state remains its current prop. Components without form state are unaffected by form reset.

Each spec lists semantic options. Adapters may accept native attributes, native content and accessible naming attributes; they must not add alternate behavior silently. Malformed enumerations, duplicate item values/IDs, invalid initial/controlled values or missing structural relationships are configuration errors (`TypeError`, or `RangeError` for invalid dates/ranges). Surface them in development and tests; never silently select a different item. A dynamic option removal that invalidates the selected value requires the parent to update options and value together. Disabled controls suppress pointer and keyboard activation; external prop changes still render. User validation errors use visible text, `aria-invalid` and `aria-describedby`, rather than configuration exceptions.

## Public structure and styling

Library-owned attributes are stable across renderers: `data-krds-component` is the semantic kebab-case ID; `data-krds-part` is one documented part token; `data-krds-state` is a space-separated set of applicable states listed below. Empty state is the empty string. Use CSS `[data-krds-state~="disabled"]` rather than whole-string matching. Set component identity on the root and on each owned part, including portaled content. Consumers may style these attributes but must not overwrite them. Framework/Ark `data-scope` or `data-part` are implementation details. Native/ARIA states remain authoritative for assistive technology. Do not expose arbitrary wrapper order as a public API; preserve each spec's semantic order.

All components support visible keyboard focus, forced colors, 200% text zoom, narrow viewports, and reduced motion. Selection, errors and disabled states require a non-color cue. Decorative icons are hidden from assistive technology. User content provides the meaningful accessible name unless the spec defines translated UI chrome. Styles must use the shared KRDS token mapping; style completion and token use alone are not accessibility verification. Global reset, all-component CSS and fonts remain opt-in. No remote assets, APIs, telemetry or network state are needed.

## Coverage and acceptance

55 frozen entries remain in the catalog; only SplashScreen is officially outside web scope, leaving 54 web-applicable. All seven stable native frameworks and Solid 2 preview have separate planned entries. A spec, a passing build, a probe, or this contracts suite never changes adapter coverage to implemented/verified. The 48 T10 contracts are scoped-approved specifications; their native coverage remains pending. Supported case axes are not automatically official named variants. The accepted source/project completion-kind corrections retain the frozen source kind separately; compositions/integrations/assets require full actual native and host outcomes. Full staged stories and outcomes are separate from the ten active pilot scenarios and six active pilot stories. T10 owns the comprehensive release evidence gate; `verify:catalog` checks integrity and evidence paths only.

## Full catalog interfaces and source rights

[full-catalog.ts](../../packages/contracts/src/full-catalog.ts) freezes concrete semantic interfaces, `fullCatalogDefinitions` parts/state tokens and `fullCatalogPresentation` orthogonal data attributes. Native adapters own native content and refs; plain text item content is extendable with adapter-owned native slots keyed by item ID. No shared generic renderer is provided. `catalog/full-catalog-contracts.json` indexes all 48 source identities, line ranges, obligations and evidence limitations. `catalog/full-catalog-stories.json` contains staged local state and expectations; it does not activate missing cases in the pilot runner.

Official quoted/derived KRDS text, fonts and assets retain their original rights and notices. Independent project MIT code does not relicense them. Guide pixels, separately linked code and production asset clearance remain explicitly unreviewed; official textual conditions remain binding. SplashScreen alone is excluded for platform scope.

## Native composition identity additions

RadioGroupOption alone may supply an explicit native input id; NativeSelect SelectOption is unchanged. Header and its single real MainMenu share optional current/mobile disclosure, actual primary-trigger identity/name and landmark naming inputs. Defaults and existing event semantics are preserved; these plain semantic inputs never carry renderer or machine objects. T11’s explicit 주요 메뉴 / 예제 메뉴 names are host composition requirements, not invented official KRDS defaults.

## Optional FAB label presentation

FAB's `showLabel?: boolean` defaults to `true` and controls only visible primary-label presentation. `false` requests icon-only presentation while the required `label` continues to name the actual native button. Actions retain expansion ownership, and presentation updates do not invoke action/expansion callbacks. See the [FAB contract](./fab.md); this does not introduce a behavior variant or relax accessible naming.
