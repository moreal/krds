# @krds-native/styles

Six pilot component styles use the stable `data-krds-component`, `data-krds-part` and space-separated `data-krds-state` contracts in `parts.json`. Every owned part, including portal content, carries component identity. Native/ARIA state remains authoritative. These styles do not implement rendering, focus traps, inert, scroll locking, form behavior or keyboard handling.

Opt into `@krds-native/styles/button.css` (or `native-select.css`, `modal.css`, `tabs.css`, `date-input.css`, `calendar.css`) for one component with token declarations and scoped base styles. `all.css` contains all six components, tokens and base exactly once. `base.css`, `reset.css` and `fonts.css` are separate entries. The root JS import has no stylesheet side effect. CSS imports are marked as side effects for bundlers.

`reset.css` is an explicit global choice: KRDS rem tokens assume the original 62.5% root font size. Without this opt-in, dimensions follow the application's root rem scale. `fonts.css` only selects the installed/local Pretendard GOV with system fallbacks; it contains no font files or remote URLs. Install optional font material separately under its own notices. Component imports never select or download fonts.

Button root exposes `data-krds-variant` (`primary`, `secondary`, `tertiary`, `text`, `icon`) and `data-krds-size` (five documented sizes). NativeSelect control exposes `data-krds-size` (`small`, `medium`, `large`); adapters should reflect root size onto control. Tabs list exposes `data-krds-orientation` (`horizontal`, `vertical`). Defaults are medium, primary and horizontal. These attributes select presentation only. Full parts/states and semantic options remain in `specs/components`.

Import `{ styles }` from `@krds-native/styles/lit` for plain strings (`styles.button`, `styles.all`, etc.). A Lit adapter may pass its selected string to Lit's `unsafeCSS`; this package depends on no Lit runtime. Strings are byte-identical to the corresponding CSS files, generated from the same sources with imports already expanded. Non-Lit native adapters may use the same strings or CSS entries.

Build parses all sources with PostCSS, rejects unknown token references, public parts/states and remote assets, and writes outputs only to `dist/`. Focus-visible, forced colors, reduced motion, wrapping and viewport rules are included. No animation is introduced. Renderer-level visual and accessibility acceptance, including 200% zoom and narrow viewport inspection, belongs to T06+; generated styles are not that evidence.

Derived KRDS material keeps its source terms and per-package provenance. Independent project code is copyright (c) 2026 Lee Dogeon <dev.moreal@gmail.com> under LICENSES/MIT.txt; publication remains unauthorized.
