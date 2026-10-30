# @unofficial-krds/styles

Shared CSS covers all 54 web-applicable catalog entries. Each component entry is independently importable as `@unofficial-krds/styles/<id>.css`. Favicon is an asset/head integration: its entry deliberately adds no runtime DOM selector. `all.css` includes every component, the 768 unchanged frozen tokens and scoped base exactly once. `base.css`, `reset.css` and `fonts.css` remain separate entries. The root JavaScript import has no stylesheet side effect; CSS imports are marked as bundler side effects.

The stable interface is `data-krds-component`, `data-krds-part`, space-separated `data-krds-state`, and the presentation axes in `parts.json`. Every owned part, including portaled content, carries component identity. Native attributes and ARIA remain authoritative. CSS never implements rendering, form lifecycle, keyboard interaction, focus containment/return, inertness, scroll locking, target measurement, speech, upload, notification timers or queue ownership.

The six pilot CSS sources and existing part interfaces are preserved. The other 48 entries bind the reviewed component specifications and shared full-catalog definitions; passing CSS generation does not mark native implementations or stories verified.

## Ordinary CSS and inherited shadow themes

Import a component CSS entry for tokens, scoped base and that component. `styles` from `@unofficial-krds/styles/lit` contains byte-identical plain strings for every corresponding ordinary CSS file, including `styles.all`. It has no Lit runtime dependency; a Lit consumer can wrap a selected string with its own `unsafeCSS`.

For Shadow DOM with an inherited application theme, install `@unofficial-krds/tokens/tokens.css` once on a document ancestor and use the additive `shadowStyles` map. `shadowStyles.base` is raw scoped base; each component key is its raw CSS, without repeated base or token defaults. Compose base plus selected component strings, or use `shadowStyles.all` once. The map omits reset/fonts. It does not redeclare token defaults on `:host`, so inherited consumer token values reach native shadow controls. A popover portaled to a different root needs the theme on that root too.

```ts
import { shadowStyles } from '@unofficial-krds/styles/lit';
// In the native Lit adapter, using Lit's own unsafeCSS:
// static styles = [unsafeCSS(shadowStyles.base), unsafeCSS(shadowStyles.button)];
```

`reset.css` explicitly opts into the original 62.5% root font size assumed by KRDS rem tokens. Without reset, dimensions follow the application's root rem scale. `fonts.css` selects installed/local Pretendard GOV and system fallbacks only; it contains no font files, `@font-face`, CDN or remote URLs. Component imports never select/download fonts. Optional font materials need their own notices.

## Parts and presentation

Set applicable axes on the component root. Relevant owned parts may repeat them; portaled ContextualHelp/Tooltip popups repeat `data-krds-placement` because their position can differ after collision resolution. Root state is a summary; item/control/panel states are only those explicitly allowed per part. An ancestor's `mixed` state does not turn its label into a mixed control.

Pilot presentation remains unchanged: Button root has variant/size, NativeSelect control has size, Tabs list has orientation. New TextInput, Checkbox, RadioGroup and Switch sizes belong on their roots. Badge uses separate appearance/tone/size axes, not a combined invented variant; primary tone is intentionally unavailable. CriticalAlert urgency does not invent an equivalence between high/medium/low and the official danger/ok/info example colors.

Layout and interaction responsibilities remain type-specific:

- Navigation uses real links/current-location semantics. MainMenu owns desktop/mobile presentation; its adapter exposes the usable mobile trigger/content. Header utilities are never silently hidden by CSS. Side/InPage navigation retains independent branch/scroll state. Breadcrumb collapse/ellipsis and Carousel dots/fraction are explicit renderer policies, including Carousel's official 1023px boundary.
- Table remains a native table with caption and header associations. Its scroll region contains overflow with discoverable scroll controls. Sort arrows appear only on supplied sort-trigger parts; an ordinary table gains no sorting behavior. The adapter right-aligns quantitative cells from column kind. Optional narrow stacked pairs must preserve actual native associations; CSS does not fabricate data labels or hide headers.
- Checkbox and RadioGroup keep their full-size native controls and native checked/mixed glyphs. Chip appearance decorates their containers. Switch uses the native checkbox, with the handle position and boundary cue independent of focus. RangeSlider keeps the real native range track/thumb and an output above/end of the control; decorative track/range/thumb parts cannot receive pointer events. QuantityToggle centers an actual output and wraps its controls at a narrow viewport.
- FileUpload keeps a usable native file input/picker. Drop, progress, status/error and disabled presentation follow host-confirmed records. CSS does not simulate upload progress or completion. Text fields preserve readonly, invalid, disabled, help/error and actual native editing geometry.
- Carousel hides native-marked inactive slides, but its adapter must also remove their focusable content from interaction. CSS does not start playback or implement the reduced-motion/user-stop policy. The native multi-slide Carousel may expose the conditional `stop-intent` button while intent is true and actual advancement is inhibited; it uses paused/disabled states and the same native control presentation, while primary Play/Stop labels continue to describe actual playback. Toast/Snackbar never use CSS expiration, fake countdowns or delayed hiding; generation-safe exposure/queue behavior belongs to the adapter and host. Toast remains noninteractive.
- Help/Tutorial panels, CoachMark, ContextualHelp, Tooltip and BottomSheet have distinct geometry and part inventories. The native adapter handles relationships, target registration, collision positioning, modal policy and focus cleanup. A persistent panel opener must live outside a closed panel. BottomSheet scrolls within the dynamic viewport and respects the bottom safe area; no slide animation is required.
- Spinner alone introduces a 900ms transform loop for actual indeterminate progress, matching the frozen source. Reduced motion replaces it with a stable dashed indicator plus the real loading/status label. A determinate native SVG/path or progress element receives actual numeric geometry from the renderer; CSS never fabricates progress. Native SVG circles can use `pathLength=100`, actual `stroke-dasharray`/`stroke-dashoffset`, and the indicator part. A real native `<progress>` indicator retains its own fill and is never rotated by the decorative-ring rules.
- Image keeps intrinsic aspect ratio and host alternative text. AccessibleMedia retains native media controls/tracks and real alternatives. TTS requests a host driver through actual native buttons. Identifier/Masthead/Favicon do not synthesize institution, government, logo or asset rights. VisuallyHidden uses nonzero clipping for text; its interactive overlay uses the actual native control at the visible surrogate's geometry, with a separate visible focus cue.

FAB/Toast/Snackbar baseline safe-area offsets are composition gutters. The host must measure actual bottom navigation, keyboard and other overlays, reserve content space, and override placement where necessary. CSS is not collision detection. No component scales text down to pass narrow/200% inspection. Breadcrumb first reduces its path in the renderer; its final label and FileUpload filename may use their expressly permitted one-line visual ellipsis while retaining complete underlying accessible text. TabBar labels remain complete and wrap within equal columns. Selection/error borders and glyphs leave the outer focus-visible outline available; forced colors retain native system colors.

## Entries

| Area | Component CSS entry IDs |
| --- | --- |
| Identity and layout | masthead, identifier, header, footer, skip-link, image, accessible-media, visually-hidden, favicon |
| Navigation | main-menu, breadcrumb, side-navigation, in-page-navigation, pagination, tab-bar, back-button |
| Content and status | structured-list, critical-alert, disclosure, badge, accordion, carousel, table, text-list, step-indicator, spinner, toast, snackbar |
| Actions and forms | button, link, fab, radio-group, checkbox, tag, switch, text-input, textarea, file-upload, native-select, date-input, calendar, range-slider, quantity-toggle |
| Overlays and help | modal, tabs, help-panel, tutorial-panel, contextual-help, coach-mark, tooltip, bottom-sheet, tts, language-switcher, resize |

## Evidence and verification limits

The frozen kit contains compiled `component.css` and `common.css`; no SCSS or source map was preserved. Source selectors/declarations and exact detailed HTML guidance are mapped in `.superpowers/sdd/PLAN/t10-style-logs/source-evidence.json`, with original hashes, line ranges, component source/output hashes and independent adaptation decisions. Components absent from the kit's CSS use their frozen HTML contract and shared token foundation; their geometry is an independent implementation choice rather than an invented official SCSS variant. Original JavaScript, icons, images and font binaries are not copied or executed.

Build uses directly declared PostCSS, checks public parts and per-part states, rejects unknown tokens/presentation axes/values, remote assets and unexpanded imports, and writes only to `dist/`. Tests check all 54 exports, all 768 original token declarations, actual parser failure cases, shared-contract synchronization and ordinary/shadow string output equality. These checks do not prove browser appearance, accessibility, correct responsive composition or native behavior. Every new item's actual native visual/interaction acceptance remains pending, including forced colors, focus versus selection, reduced motion, narrow layouts and 200% text.

Derived KRDS material retains separate source terms and package provenance. Independent project code is copyright (c) 2026 Lee Dogeon <dev.moreal@gmail.com> under `LICENSES/MIT.txt`; this does not relicense KRDS/font material. Publication remains unauthorized.
