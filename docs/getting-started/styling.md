# CSS, tokens and optional fonts

Native adapters own markup, reactivity and events. Shared CSS targets the public `data-krds-component`, `data-krds-part` and space-separated `data-krds-state` attributes. Native HTML and ARIA remain authoritative for behavior.

## Choose your style scope

The tokens package exports `tokens.css`, `tokens.json` and `source-map.json`. The styles package exports `base.css`, one CSS file per web component, and `all.css`. Each component CSS output includes its required foundation. Use an individual entry for a narrow surface or `all.css` for a complete catalog surface; avoid repeatedly layering both.

```css
@import '@unofficial-krds/styles/button.css';
```

That CSS import is a stylesheet entry, not a framework example or behavioral acceptance claim. The [native examples](../compatibility/examples) show the real application bundler imports.

`reset.css` is a deliberate global opt-in, including the KRDS root rem scale. Review its effect on an existing application before importing it. Component imports do not add this reset. `fonts.css` in the **styles** package selects installed/local fonts and system fallbacks; it contains no font download.

## Customize tokens at the application boundary

Use the actual token keys and source lineage in `@unofficial-krds/tokens/tokens.json` and `source-map.json`. Override the relevant `--krds-*` custom properties in an application theme scope and verify text contrast, focus contrast, forced colors, zoom and disabled/invalid states. Preserve semantic meaning when changing colors; a status must still have a visible text cue.

Portal content may render outside the nearest DOM theme ancestor. Apply the same token theme to the configured portal container, or use the native provider/container facilities documented by your adapter. Never assume a CSS selector on the opener's ancestor reaches a detached portal. Check the open dialog itself after a live theme change.

## Load fonts only when wanted

The separate `@unofficial-krds/fonts` package contains the local font assets and its own font-face stylesheet. Install and load it only if its size and font license terms suit the application. Keep its OFL license, attribution and source records with redistributed font bytes. The styles package's local-font selection and the fonts package's font-face loading are different opt-ins.

This Astro site opts into the public reset and unmodified local fonts stylesheet. It serves the original Pretendard GOV 400/500/700 WOFF2 files beneath `/krds/` and makes no CDN font request. The root is 62.5%, the body is 1.6rem and a default medium Button is 48px. The supported presentation is light and forced-colors. See [sources and rights](../legal/) for Pretendard GOV and other third-party notices. Do not fetch external fonts or images to prepare a story state.

## Lit Shadow DOM

Document CSS cannot cross a shadow boundary. Lit's own package is responsible for its supported Shadow DOM style path; use the shared raw CSS-string exports only as documented by that adapter. A visually styled light-DOM sample is not proof that Shadow DOM labeling, focus, form association or styles work. Read the [native compatibility evidence](../compatibility/examples#lit).
